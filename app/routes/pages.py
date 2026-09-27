from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from app.auth import get_current_user
from app.database import get_db
from app.permissions import get_user_permissions, ROLE_DISPLAY_NAMES, ROLE_COLORS

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

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
