from fastapi import APIRouter, HTTPException, Header, Body
from typing import Optional
from app.models.profile import ProfileUpdateRequest, PrivacySettingsUpdateRequest, PublicProfileResponse
from app.services.auth_service import get_student_id_from_token, filter_profile_for_viewer
from app.core.db import db

router = APIRouter(prefix="/api/profile", tags=["Profile"])

def get_current_user_id(authorization: Optional[str]) -> str:
    token = authorization.replace("Bearer ", "") if authorization else ""
    student_id = get_student_id_from_token(token)
    if not student_id:
        raise HTTPException(status_code=401, detail="Unauthorized. Session token required.")
    return student_id

@router.get("/me")
def get_own_profile(authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)
    return filter_profile_for_viewer(owner_id=user_id, viewer_id=user_id)

@router.put("/me")
def update_own_profile(payload: ProfileUpdateRequest, authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)

    # 1. Update Students table
    db.execute_query(
        """UPDATE students 
           SET name=?, photo_url=?, program=?, department=?, year=?, section=?, grad_year=?, usn_encrypted=?, cgpa=?, profile_mode=?
           WHERE student_id=?""",
        (
            payload.name,
            payload.photo_url or "",
            payload.program,
            payload.department,
            payload.year,
            payload.section or "A",
            payload.grad_year,
            payload.usn or f"1NT26CS_{user_id[-4:]}",
            payload.cgpa,
            payload.profile_mode,
            user_id
        )
    )

    # 2. Update Skills
    db.execute_query("DELETE FROM student_skills WHERE student_id=?", (user_id,))
    for item in payload.skills:
        db.execute_query(
            "INSERT INTO student_skills (student_id, skill, proficiency, source) VALUES (?, ?, ?, 'self_reported')",
            (user_id, item.skill, item.proficiency)
        )

    # 3. Update Interests
    db.execute_query("DELETE FROM student_interests WHERE student_id=?", (user_id,))
    for item in payload.interests:
        db.execute_query(
            "INSERT INTO student_interests (student_id, interest, category) VALUES (?, ?, ?)",
            (user_id, item.interest, item.category)
        )

    # 4. Update Goals
    db.execute_query("DELETE FROM student_goals WHERE student_id=?", (user_id,))
    for goal in payload.goals:
        db.execute_query(
            "INSERT INTO student_goals (student_id, goal_text, horizon) VALUES (?, ?, 'this_academic_year')",
            (user_id, goal)
        )

    # 5. Update Projects
    db.execute_query("DELETE FROM projects WHERE student_id=?", (user_id,))
    for p_idx, p in enumerate(payload.projects):
        p_id = p.project_id or f"proj_{user_id}_{p_idx}"
        db.execute_query(
            "INSERT INTO projects (project_id, student_id, title, domain, skills_used, description, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (p_id, user_id, p.title, p.domain, p.skills_used, p.description, p.year)
        )

    return {"success": True, "message": "Profile updated successfully.", "profile": filter_profile_for_viewer(owner_id=user_id, viewer_id=user_id)}

@router.put("/privacy")
def update_privacy_settings(payload: PrivacySettingsUpdateRequest, authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)
    for item in payload.settings:
        db.execute_query(
            "INSERT INTO privacy_settings (student_id, field_name, visibility) VALUES (?, ?, ?) ON CONFLICT(student_id, field_name) DO UPDATE SET visibility=excluded.visibility",
            (user_id, item.field_name, item.visibility)
        )
    return {"success": True, "message": "Privacy settings updated successfully."}

@router.post("/avatar")
def update_avatar(photo_url: str = Body(..., embed=True), authorization: Optional[str] = Header(None)):
    user_id = get_current_user_id(authorization)
    db.execute_query("UPDATE students SET photo_url=? WHERE student_id=?", (photo_url, user_id))
    return {"success": True, "photo_url": photo_url}

@router.get("/{student_id}", response_model=PublicProfileResponse)
def get_student_profile(student_id: str, authorization: Optional[str] = Header(None)):
    viewer_id = None
    if authorization:
        token = authorization.replace("Bearer ", "")
        viewer_id = get_student_id_from_token(token)

    profile = filter_profile_for_viewer(owner_id=student_id, viewer_id=viewer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return profile
