from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.permissions import ALL_ROLES, ALL_PAGE_KEYS, LOCKED_PERMISSIONS

router = APIRouter(prefix="/api/permissions", tags=["permissions"])

class PermissionUpdate(BaseModel):
    role: str
    page_key: str
    has_access: bool

def require_super_admin(request: Request) -> dict:
    user = get_current_user(request)
    if not user or user.get('role') != 'super_admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return user

@router.get("")
@router.get("/")
async def get_permissions_matrix(request: Request):
    require_super_admin(request)
    
    matrix = {role: {page: False for page in ALL_PAGE_KEYS} for role in ALL_ROLES}
    
    async with get_db() as db:
        cursor = await db.execute("SELECT role, page_key, has_access FROM role_permissions")
        rows = await cursor.fetchall()
        
        for row in rows:
            if row['role'] in matrix and row['page_key'] in matrix[row['role']]:
                matrix[row['role']][row['page_key']] = bool(row['has_access'])
                
    return matrix

@router.put("")
@router.put("/")
async def update_permission(request: Request, update: PermissionUpdate):
    actor = require_super_admin(request)
    
    if update.role not in ALL_ROLES or update.page_key not in ALL_PAGE_KEYS:
        raise HTTPException(status_code=400, detail="Invalid role or page_key")
        
    if update.role in LOCKED_PERMISSIONS and update.page_key in LOCKED_PERMISSIONS[update.role]:
        if not update.has_access:
            raise HTTPException(status_code=400, detail="Cannot disable locked permission")
            
    async with get_db() as db:
        await db.execute(
            """INSERT INTO role_permissions (role, page_key, has_access) 
               VALUES (?, ?, ?) 
               ON CONFLICT(role, page_key) DO UPDATE SET has_access = ?""",
            (update.role, update.page_key, int(update.has_access), int(update.has_access))
        )
        
        ip_addr = request.client.host if request.client else "unknown"
        details = f"Set {update.page_key} access for {update.role} to {update.has_access}"
        
        await db.execute(
            "INSERT INTO activity_logs (actor_id, actor_name, action_type, details, ip_address) VALUES (?, ?, ?, ?, ?)",
            (actor['user_id'], actor['username'], "PERMISSIONS_UPDATED", details, ip_addr)
        )
        
        await db.commit()
        
    # Return updated matrix
    return await get_permissions_matrix(request)
