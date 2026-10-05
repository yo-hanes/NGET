import os
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from app.auth import get_current_user
from app.database import get_db
from app.permissions import get_user_permissions, ROLE_DISPLAY_NAMES, ROLE_COLORS

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/favicon.ico", include_in_schema=False)
async def favicon():
    icon_path = "static/icons/favicon.ico"
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    return HTMLResponse(status_code=404)

@router.get("/apple-touch-icon.png", include_in_schema=False)
async def apple_touch_icon():
    icon_path = "static/icons/apple-touch-icon.png"
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    return HTMLResponse(status_code=404)

@router.get("/site.webmanifest", include_in_schema=False)
async def site_manifest():
    manifest_path = "static/icons/site.webmanifest"
    if os.path.exists(manifest_path):
        return FileResponse(manifest_path, media_type="application/manifest+json")
    return HTMLResponse(status_code=404)

@router.get("/showcase", response_class=HTMLResponse)
async def showcase_page(request: Request):
    user_session = get_current_user(request)
    context = {"request": request, "user": user_session}
    return templates.TemplateResponse(request=request, name="landing.html", context=context)

@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    user = get_current_user(request)
    if user:
        return RedirectResponse(url="/", status_code=303)
    return templates.TemplateResponse(request=request, name="login.html")

@router.get("/", response_class=HTMLResponse)
async def index_page(request: Request):
    user_session = get_current_user(request)
    view_param = request.query_params.get("view")

    # If unauthenticated or explicitly asking for showcase, render public landing showcase
    if not user_session or view_param == "showcase":
        context = {"request": request, "user": user_session}
        return templates.TemplateResponse(request=request, name="landing.html", context=context)
        
    async with get_db() as db:
        cursor = await db.execute("SELECT user_id, first_name, last_name, user_name, role FROM users WHERE user_id = ?", (user_session['user_id'],))
        db_user = await cursor.fetchone()
        
        if not db_user:
            context = {"request": request, "user": None}
            return templates.TemplateResponse(request=request, name="landing.html", context=context)
            
        user = dict(db_user)
        permissions = await get_user_permissions(db, user['role'])
        
        context = {
            "user": user,
            "permissions": permissions,
            "role_display_name": ROLE_DISPLAY_NAMES.get(user['role'], user['role']),
            "role_colors": ROLE_COLORS.get(user['role'], {'bg': '#ccc', 'text': '#000'})
        }
        
    return templates.TemplateResponse(request=request, name="dashboard.html", context=context)
