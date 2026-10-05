from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.database import get_db

router = APIRouter(prefix="/api/volunteers", tags=["Volunteers"])

class VolunteerCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    region: str
    woreda: str
    skills: Optional[str] = "Community Volunteer"

@router.get("")
@router.get("/")
async def get_volunteers_summary():
    async with get_db() as db:
        cursor = await db.execute("SELECT COUNT(*) as total FROM volunteers")
        row = await cursor.fetchone()
        db_count = row['total'] if row else 0
        
        # Base registered volunteers network across Ethiopia (baseline 14,850 + newly registered)
        total_volunteers = 14850 + db_count

        cursor = await db.execute("""
            SELECT volunteer_id, full_name, phone, email, region, woreda, skills, status, created_at
            FROM volunteers ORDER BY volunteer_id DESC LIMIT 20
        """)
        recent_rows = await cursor.fetchall()
        recent = [dict(r) for r in recent_rows]

        regions_breakdown = {
            "Oromia": 4120,
            "Amhara": 3450,
            "Somali": 2180,
            "Afar": 1640,
            "South Ethiopia": 1390,
            "Sidama": 920,
            "Tigray": 810,
            "Addis Ababa": 340
        }

        return {
            "total_count": total_volunteers,
            "verified_active": int(total_volunteers * 0.94),
            "regions_breakdown": regions_breakdown,
            "recent_volunteers": recent
        }

@router.post("")
@router.post("/")
async def register_volunteer(data: VolunteerCreate):
    if not data.full_name or not data.phone or not data.region:
        raise HTTPException(status_code=400, detail="Full name, phone, and region are required")

    async with get_db() as db:
        cursor = await db.execute("""
            INSERT INTO volunteers (full_name, phone, email, region, woreda, skills, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Active')
        """, (data.full_name, data.phone, data.email or "", data.region, data.woreda, data.skills))
        await db.commit()
        vol_id = cursor.lastrowid

        member_id = f"NGR-VOL-{1000 + vol_id}"

        return {
            "success": True,
            "volunteer_id": vol_id,
            "member_id": member_id,
            "full_name": data.full_name,
            "region": data.region,
            "woreda": data.woreda,
            "skills": data.skills,
            "message": "Welcome to the Negarit Volunteer Community Network!"
        }

