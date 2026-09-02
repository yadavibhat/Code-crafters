from fastapi import APIRouter, Header, HTTPException
from typing import Optional, List
from app.models.home_digest import HomeResponse, FeedbackRequest, DigestResponse, CampusStoryItem
from app.services.auth_service import get_student_id_from_token
from app.services.home_service import get_home_aggregation, register_feedback
from app.core.db import db

router = APIRouter(prefix="/api", tags=["Home & Campus Digest"])

@router.get("/home", response_model=HomeResponse)
def get_home_dashboard(authorization: Optional[str] = Header(None)):
    student_id = "nmit_std_001"
    if authorization:
        token = authorization.replace("Bearer ", "")
        extracted = get_student_id_from_token(token)
        if extracted:
            student_id = extracted

    data = get_home_aggregation(student_id)

    return HomeResponse(
        success=True,
        greeting=data["greeting"],
        urgent_item=data["urgent_item"],
        top_people=data["top_people"],
        top_opportunities=data["top_opportunities"],
        pulse_item=data["pulse_item"],
        campus_story=data["campus_story"]
    )

@router.post("/feedback")
def submit_recommendation_feedback(payload: FeedbackRequest, authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "") if authorization else ""
    student_id = get_student_id_from_token(token) or "nmit_std_001"

    register_feedback(student_id, payload.item_type, payload.item_id, payload.signal)
    return {"success": True, "message": f"Feedback signal '{payload.signal}' recorded for {payload.item_type}:{payload.item_id}."}

@router.get("/digest", response_model=DigestResponse)
def get_campus_digest():
    rows = db.execute_query("SELECT item_id AS story_id, title, source_title AS author_or_source, event_date AS published_date, content AS excerpt, source_url, category, trust_level FROM v_campus_digest ORDER BY event_date DESC")
    stories: List[CampusStoryItem] = []

    for r in rows:
        s = dict(r)
        stories.append(CampusStoryItem(
            story_id=s["story_id"],
            title=s["title"],
            author_or_source=s["author_or_source"] or "NMIT Institutional News",
            published_date=s["published_date"] or "2026-09-01",
            excerpt=s["excerpt"] or "",
            source_url=s["source_url"] or "https://nitte.edu.in/nmit/",
            category=s["category"] or "announcement",
            is_synthetic=(s["trust_level"] == "synthetic")
        ))

    return DigestResponse(
        success=True,
        total=len(stories),
        stories=stories
    )
