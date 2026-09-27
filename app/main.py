from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import init_db, seed_defaults
from app.routes.pages import router as pages_router
from app.routes.api_auth import router as auth_router
from app.routes.api_users import router as users_router
from app.routes.api_permissions import router as permissions_router
from app.routes.api_activity_logs import router as logs_router
from app.routes.api_volunteers import router as volunteers_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_defaults()
    yield

app = FastAPI(
    title="Negarit ET",
    description="Unified National Disaster Intelligence & Early Warning System",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    os.makedirs("static", exist_ok=True)
    os.makedirs("app/templates", exist_ok=True)
except OSError:
    pass

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(pages_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(permissions_router)
app.include_router(logs_router)
app.include_router(volunteers_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
