from fastapi import APIRouter, HTTPException, Header, Body
from typing import Optional
from app.services.auth_service import get_student_id_from_token
from app.core.db import db

router = APIRouter(prefix="/api/connections", tags=["Connections"])

def get_current_user_id(authorization: Optional[str]) -> str:
    token = authorization.replace("Bearer ", "") if authorization else ""
    student_id = get_student_id_from_token(token)
    if not student_id:
        return "nmit_std_001" # Fallback for testing
    return student_id

@router.post("/connect")
def request_connection(target_id: str = Body(..., embed=True), authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)
    db.execute_query(
        "INSERT INTO connections (from_id, to_id, status) VALUES (?, ?, 'pending') ON CONFLICT(from_id, to_id) DO UPDATE SET status='pending'",
        (user_id, target_id)
    )
    return {"success": True, "message": "Connection request sent.", "status": "pending"}

@router.get("")
def list_connections(authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)
    rows = db.execute_query(
        """SELECT c.to_id AS student_id, s.name, s.department, s.year, c.status 
           FROM connections c 
           JOIN students s ON c.to_id = s.student_id 
           WHERE c.from_id = ?""",
        (user_id,)
    )
    return {"connections": [dict(r) for r in rows]}
