from fastapi import APIRouter, Request, Response, HTTPException, status, Form
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.auth import verify_password, create_session_token, get_current_user
from app.permissions import get_user_permissions

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginResponse(BaseModel):
    success: bool
    user: Optional[dict] = None

@router.post("/login", response_model=LoginResponse)
async def login(
    response: Response,
    request: Request,
    username: str = Form(...),
    password: str = Form(...)
):
    u_clean = username.strip()
    p_clean = password.strip()

    async with get_db() as db:
        # Match case-insensitively by username or email, trimming spaces
        cursor = await db.execute(
            "SELECT * FROM users WHERE LOWER(TRIM(user_name)) = LOWER(?) OR LOWER(TRIM(email)) = LOWER(?)",
            (u_clean, u_clean)
        )
        user = await cursor.fetchone()
        
        # Verify password (try exact first, then trimmed)
        password_valid = False
        if user:
            password_valid = verify_password(password, user['user_pass']) or verify_password(p_clean, user['user_pass'])

        if not user or not password_valid:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            
        if not user['is_active']:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive")
            
        # Update last login & log activity (non-fatal if write fails)
        try:
            await db.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?", (user['user_id'],))
            ip_address = request.client.host if request.client else "unknown"
            await db.execute(
                "INSERT INTO activity_logs (actor_id, actor_name, action_type, details, ip_address) VALUES (?, ?, ?, ?, ?)",
                (user['user_id'], user['user_name'], "USER_LOGIN", "User logged in", ip_address)
            )
            await db.commit()
        except Exception:
            pass
        
        permissions = await get_user_permissions(db, user['role'])
        token = create_session_token(user['user_id'], user['user_name'], user['role'])
        
        response.set_cookie(
            key="negarit_session",
            value=token,
            httponly=True,
            path="/",
            samesite="lax",
            max_age=86400
        )
        
        return LoginResponse(
            success=True,
            user={
                "user_id": user['user_id'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "user_name": user['user_name'],
                "role": user['role'],
                "permissions": permissions
            }
        )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("negarit_session", path="/")
    return {"success": True}

@router.get("/session")
async def check_session(request: Request):
    user_payload = get_current_user(request)
    if not user_payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        
    async with get_db() as db:
        cursor = await db.execute("SELECT user_id, first_name, last_name, user_name, role FROM users WHERE user_id = ?", (user_payload['user_id'],))
        user = await cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            
        permissions = await get_user_permissions(db, user['role'])
        
    return {
        "success": True,
        "user": dict(user),
        "permissions": permissions
    }
