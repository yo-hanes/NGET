import aiosqlite
import os
import shutil
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from passlib.hash import pbkdf2_sha256
from app.permissions import DEFAULT_PERMISSIONS_MATRIX

def get_database_path() -> str:
    db_env = os.getenv("DATABASE_URL")
    if db_env:
        return db_env.replace("sqlite+aiosqlite:///", "")

    base_db = os.path.abspath("negarit.db")
    
    # In serverless environments (e.g. Vercel, AWS Lambda) the app directory is read-only.
    # SQLite requires write access to the db file and its directory for journals/locks.
    is_serverless = bool(
        os.getenv("VERCEL") or 
        os.getenv("VERCEL_ENV") or 
        os.getenv("AWS_LAMBDA_FUNCTION_NAME") or 
        os.getenv("LAMBDA_TASK_ROOT")
    )
    is_writable = os.access(os.path.dirname(base_db) or ".", os.W_OK) and (
        not os.path.exists(base_db) or os.access(base_db, os.W_OK)
    )

    if is_serverless or not is_writable:
        tmp_db = "/tmp/negarit.db"
        if not os.path.exists(tmp_db):
            if os.path.exists(base_db):
                try:
                    shutil.copyfile(base_db, tmp_db)
                    os.chmod(tmp_db, 0o666)
                except Exception as e:
                    print(f"Warning copying database to /tmp: {e}")
        return tmp_db

    return base_db

@asynccontextmanager
async def get_db() -> AsyncGenerator[aiosqlite.Connection, None]:
    db_path = get_database_path()
    db = await aiosqlite.connect(db_path)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()

async def init_db():
    try:
        async with get_db() as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name TEXT,
                    last_name TEXT,
                    user_name TEXT UNIQUE,
                    user_pass TEXT,
                    email TEXT,
                    role TEXT DEFAULT 'community_reporter',
                    region TEXT,
                    is_active INTEGER DEFAULT 1,
                    last_login TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS role_permissions (
                    role TEXT,
                    page_key TEXT,
                    has_access INTEGER DEFAULT 1,
                    PRIMARY KEY (role, page_key)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS activity_logs (
                    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    actor_id INTEGER,
                    actor_name TEXT,
                    action_type TEXT,
                    target_id INTEGER,
                    target_name TEXT,
                    details TEXT,
                    ip_address TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS broadcasts (
                    broadcast_id TEXT PRIMARY KEY,
                    alert_id TEXT,
                    message TEXT,
                    channels TEXT DEFAULT 'SMS,USSD',
                    approved_by TEXT,
                    population_at_risk INTEGER,
                    confidence REAL,
                    status TEXT DEFAULT 'QUEUED',
                    queued_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)

            await db.execute("""
                CREATE TABLE IF NOT EXISTS volunteers (
                    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    email TEXT,
                    region TEXT NOT NULL,
                    woreda TEXT NOT NULL,
                    skills TEXT NOT NULL,
                    status TEXT DEFAULT 'Active',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await db.commit()
    except Exception as e:
        print(f"Warning during init_db: {e}")

async def seed_defaults():
    try:
        async with get_db() as db:
            # Check if users exist
            cursor = await db.execute("SELECT COUNT(*) as count FROM users")
            row = await cursor.fetchone()
            
            if row and row['count'] == 0:
                # Seed users
                seed_users = [
                    ('Selam', 'Alemu', 'selam.alemu', pbkdf2_sha256.hash('negarit2026'), 'selam@negarit.et', 'super_admin', 'Addis Ababa'),
                    ('Meron', 'Tesfaye', 'meron.tesfaye', pbkdf2_sha256.hash('negarit2026'), 'meron@negarit.et', 'government_official', 'Federal'),
                    ('Dawit', 'Bekele', 'dawit.bekele', pbkdf2_sha256.hash('negarit2026'), 'dawit@negarit.et', 'agency_operator', 'Oromia'),
                    ('Abebe', 'Kebede', 'abebe.kebede', pbkdf2_sha256.hash('negarit2026'), 'abebe@negarit.et', 'community_reporter', 'Amhara')
                ]
                
                await db.executemany("""
                    INSERT INTO users (first_name, last_name, user_name, user_pass, email, role, region)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, seed_users)
                
                # Seed role_permissions
                permissions_data = []
                for role, pages in DEFAULT_PERMISSIONS_MATRIX.items():
                    for page_key, has_access in pages.items():
                        permissions_data.append((role, page_key, int(has_access)))
                
                await db.executemany("""
                    INSERT INTO role_permissions (role, page_key, has_access)
                    VALUES (?, ?, ?)
                """, permissions_data)
                
                await db.commit()

            # Seed volunteers if empty
            vol_cursor = await db.execute("SELECT COUNT(*) as count FROM volunteers")
            vol_row = await vol_cursor.fetchone()
            if vol_row and vol_row['count'] == 0:
                seed_volunteers = [
                    ('Kedir Mohammed', '+251911452389', 'kedir.m@negarit.et', 'Afar', 'Asayita', 'Water Logistics & Distribution', 'Active'),
                    ('Bethlehem Tadesse', '+251922789123', 'beth.t@negarit.et', 'South Ethiopia', 'Sawla / Gofa', 'Mountain Search & Evacuation', 'Active'),
                    ('Robel Desta', '+251933451290', 'robel.d@negarit.et', 'Oromia', 'Adama / Awash', 'River Basin Monitoring & Hospitality', 'Active'),
                    ('Filsan Omar', '+251944890123', 'filsan.o@negarit.et', 'Somali', 'Jijiga / Degehabur', 'Pastoral Aid & Shelter Lead', 'Active'),
                    ('Yared Hailu', '+251955678901', 'yared.h@negarit.et', 'Sidama', 'Hawassa Rift', 'Community Emergency Hospitality', 'Active'),
                    ('Genet Wolde', '+251966123456', 'genet.w@negarit.et', 'Amhara', 'Dessie', 'First Aid & Field Telemetry', 'Active')
                ]
                await db.executemany("""
                    INSERT INTO volunteers (full_name, phone, email, region, woreda, skills, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, seed_volunteers)
                await db.commit()
    except Exception as e:
        print(f"Warning during seed_defaults: {e}")

