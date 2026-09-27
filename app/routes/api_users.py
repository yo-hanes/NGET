from fastapi import APIRouter, Request, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.auth import get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/users", tags=["users"])

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    user_name: str
    user_pass: str
    email: str
    role: str
    region: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    region: Optional[str] = None
    is_active: Optional[int] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

def require_super_admin(request: Request) -> dict:
    user = get_current_user(request)
    if not user or user.get('role') != 'super_admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return user

async def log_activity(db, actor_id, actor_name, action_type, target_id, target_name, details, ip_address):
    await db.execute(
        "INSERT INTO activity_logs (actor_id, actor_name, action_type, target_id, target_name, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (actor_id, actor_name, action_type, target_id, target_name, details, ip_address)
    )

@router.get("")
@router.get("/")
async def list_users(
    request: Request,
    search: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None
):
    require_super_admin(request)
    
    query = "SELECT user_id, first_name, last_name, user_name, email, role, region, is_active, last_login, created_at, updated_at FROM users WHERE 1=1"
    params = []
    
    if search:
        query += " AND (first_name LIKE ? OR last_name LIKE ? OR user_name LIKE ? OR email LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])
        
    if role:
        query += " AND role = ?"
        params.append(role)
        
    if status:
        if status.lower() == 'active':
            query += " AND is_active = 1"
        elif status.lower() == 'inactive':
            query += " AND is_active = 0"
            
    query += " ORDER BY user_id ASC"
    
    async with get_db() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("")
@router.post("/")
async def create_user(request: Request, user: UserCreate):
    actor = require_super_admin(request)
    
    async with get_db() as db:
        # Check if username exists
        cursor = await db.execute("SELECT user_id FROM users WHERE user_name = ?", (user.user_name,))
        if await cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")
            
        hashed_pass = hash_password(user.user_pass)
        
        cursor = await db.execute(
            """INSERT INTO users (first_name, last_name, user_name, user_pass, email, role, region)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (user.first_name, user.last_name, user.user_name, hashed_pass, user.email, user.role, user.region)
        )
        new_id = cursor.lastrowid
        
        ip_addr = request.client.host if request.client else "unknown"
        await log_activity(db, actor['user_id'], actor['username'], "USER_CREATED", new_id, user.user_name, f"Created user {user.user_name}", ip_addr)
        
        await db.commit()
        
        return {"success": True, "user_id": new_id, "user_name": user.user_name}

@router.put("/{user_id}")
async def update_user(request: Request, user_id: int, user_update: UserUpdate):
    actor = require_super_admin(request)
    
    async with get_db() as db:
        cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        target_user = await cursor.fetchone()
        
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user_id == actor['user_id']:
            if user_update.role and user_update.role != target_user['role']:
                raise HTTPException(status_code=400, detail="Cannot change own role")
            if user_update.is_active is not None and user_update.is_active != target_user['is_active']:
                raise HTTPException(status_code=400, detail="Cannot deactivate own account")
                
        if target_user['role'] == 'super_admin':
            if (user_update.role and user_update.role != 'super_admin') or (user_update.is_active == 0):
                cursor = await db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'super_admin' AND is_active = 1")
                count = (await cursor.fetchone())['c']
                if count <= 1:
                    raise HTTPException(status_code=400, detail="Cannot demote or deactivate the last active super_admin")

        updates = []
        params = []
        
        for field, value in user_update.model_dump(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            params.append(value)
            
        if not updates:
            return {"success": True}
            
        updates.append("updated_at = CURRENT_TIMESTAMP")
        query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = ?"
        params.append(user_id)
        
        await db.execute(query, params)
        
        ip_addr = request.client.host if request.client else "unknown"
        
        if user_update.role and user_update.role != target_user['role']:
            await log_activity(db, actor['user_id'], actor['username'], "ROLE_CHANGED", user_id, target_user['user_name'], f"Role changed to {user_update.role}", ip_addr)
            
        if user_update.is_active is not None and user_update.is_active != target_user['is_active']:
            await log_activity(db, actor['user_id'], actor['username'], "STATUS_CHANGED", user_id, target_user['user_name'], f"Status changed to {user_update.is_active}", ip_addr)
            
        await db.commit()
        return {"success": True}

@router.put("/{user_id}/password")
async def update_password(request: Request, user_id: int, passwords: PasswordUpdate):
    actor = require_super_admin(request)
    
    async with get_db() as db:
        cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        target_user = await cursor.fetchone()
        
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not verify_password(passwords.current_password, target_user['user_pass']):
            raise HTTPException(status_code=400, detail="Invalid current password")
            
        hashed_new = hash_password(passwords.new_password)
        await db.execute("UPDATE users SET user_pass = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", (hashed_new, user_id))
        
        ip_addr = request.client.host if request.client else "unknown"
        await log_activity(db, actor['user_id'], actor['username'], "PASSWORD_CHANGED", user_id, target_user['user_name'], "Password was changed", ip_addr)
        
        await db.commit()
        return {"success": True}

@router.delete("/{user_id}")
async def delete_user(request: Request, user_id: int):
    actor = require_super_admin(request)
    
    if user_id == actor['user_id']:
        raise HTTPException(status_code=400, detail="Cannot delete own account")
        
    async with get_db() as db:
        cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        target_user = await cursor.fetchone()
        
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if target_user['role'] == 'super_admin':
            cursor = await db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'super_admin'")
            count = (await cursor.fetchone())['c']
            if count <= 1:
                raise HTTPException(status_code=400, detail="Cannot delete the last super_admin")
                
        await db.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
        
        ip_addr = request.client.host if request.client else "unknown"
        await log_activity(db, actor['user_id'], actor['username'], "USER_DELETED", user_id, target_user['user_name'], "User deleted", ip_addr)
        
        await db.commit()
        return {"success": True}
