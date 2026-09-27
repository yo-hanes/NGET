from fastapi import APIRouter, Request, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from typing import Optional
from io import BytesIO
import openpyxl
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/activity-logs", tags=["activity-logs"])

def require_super_admin(request: Request) -> dict:
    user = get_current_user(request)
    if not user or user.get('role') != 'super_admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return user

async def purge_old_logs(db):
    await db.execute("DELETE FROM activity_logs WHERE created_at < datetime('now', '-3 days')")
    await db.commit()

@router.get("")
@router.get("/")
async def get_logs(
    request: Request,
    action_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 200
):
    require_super_admin(request)
    
    async with get_db() as db:
        await purge_old_logs(db)
        
        query = "SELECT * FROM activity_logs WHERE 1=1"
        params = []
        
        if action_type:
            query += " AND action_type = ?"
            params.append(action_type)
            
        if search:
            query += " AND (actor_name LIKE ? OR target_name LIKE ? OR details LIKE ?)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])
            
        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        
        cursor = await db.execute(query, params)
        logs = [dict(row) for row in await cursor.fetchall()]
        
    return logs

@router.get("/export")
async def export_logs(request: Request):
    require_super_admin(request)
    
    async with get_db() as db:
        cursor = await db.execute("SELECT * FROM activity_logs ORDER BY created_at DESC")
        logs = await cursor.fetchall()
        
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Activity Logs"
    
    headers = ["#", "Timestamp", "Actor", "Action", "Target", "Details", "IP Address"]
    ws.append(headers)
    
    for log in logs:
        ws.append([
            log['log_id'],
            log['created_at'],
            log['actor_name'] or str(log['actor_id']),
            log['action_type'],
            log['target_name'] or str(log['target_id'] or ''),
            log['details'],
            log['ip_address']
        ])
        
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="activity_logs.xlsx"'
    }
    return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
