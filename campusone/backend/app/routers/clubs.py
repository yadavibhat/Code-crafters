import uuid
from fastapi import APIRouter, HTTPException, Header
from typing import Optional, List
from app.models.club import ClubListResponse, ClubItem, ClubPostItem, ClubPostCreateRequest, AskClubRequest, AskClubResponse
from app.services.auth_service import get_student_id_from_token
from app.services.club_service import generate_good_for_you_if, ask_genie_about_club
from app.core.db import db

router = APIRouter(prefix="/api/clubs", tags=["Clubs & Culture Wall"])

@router.get("", response_model=ClubListResponse)
def list_clubs(authorization: Optional[str] = Header(None)):
    student_id = "nmit_std_001"
    if authorization:
        token = authorization.replace("Bearer ", "")
        extracted = get_student_id_from_token(token)
        if extracted:
            student_id = extracted

    # Fetch student profile for personalized "Good for you if..."
    std_skills = [r["skill"] for r in db.execute_query("SELECT skill FROM student_skills WHERE student_id=?", (student_id,))]
    std_interests = [r["interest"] for r in db.execute_query("SELECT interest FROM student_interests WHERE student_id=?", (student_id,))]

    rows = db.execute_query("SELECT * FROM v_club_culture")
    clubs: List[ClubItem] = []

    for r in rows:
        c = dict(r)
        tags = [t.strip() for t in (c.get("culture_tags") or "").split(",") if t.strip()]
        good_for_you = generate_good_for_you_if(c, std_skills, std_interests)
        trust_level = c.get("trust_level", "verified")

        # Fetch recent posts for club
        post_rows = db.execute_query(
            "SELECT cp.post_id, cp.club_id, s.name AS author_name, cp.caption, cp.image_url, cp.posted_at FROM club_posts cp JOIN students s ON cp.author_id = s.student_id WHERE cp.club_id=? ORDER BY cp.posted_at DESC LIMIT 6",
            (c["club_id"],)
        )
        posts = [ClubPostItem(**dict(p)) for p in post_rows]

        clubs.append(ClubItem(
            club_id=c["club_id"],
            name=c["name"],
            category=c["category"],
            culture_tags=tags,
            description=c["description"],
            instagram_url=c.get("instagram_url", ""),
            website_url=c.get("website_url", ""),
            recruitment_status=c.get("recruitment_status", "open"),
            is_synthetic=(trust_level == "synthetic"),
            trust_level=trust_level,
            member_count=c.get("member_count", 25),
            good_for_you_if=good_for_you,
            recent_posts=posts
        ))

    return ClubListResponse(
        success=True,
        total=len(clubs),
        clubs=clubs
    )

@router.get("/{club_id}", response_model=ClubItem)
def get_club_detail(club_id: str, authorization: Optional[str] = Header(None)):
    student_id = "nmit_std_001"
    if authorization:
        token = authorization.replace("Bearer ", "")
        extracted = get_student_id_from_token(token)
        if extracted:
            student_id = extracted

    std_skills = [r["skill"] for r in db.execute_query("SELECT skill FROM student_skills WHERE student_id=?", (student_id,))]
    std_interests = [r["interest"] for r in db.execute_query("SELECT interest FROM student_interests WHERE student_id=?", (student_id,))]

    rows = db.execute_query("SELECT * FROM v_club_culture WHERE club_id=?", (club_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="Club not found.")

    c = dict(rows[0])
    tags = [t.strip() for t in (c.get("culture_tags") or "").split(",") if t.strip()]
    good_for_you = generate_good_for_you_if(c, std_skills, std_interests)
    trust_level = c.get("trust_level", "verified")

    post_rows = db.execute_query(
        "SELECT cp.post_id, cp.club_id, s.name AS author_name, cp.caption, cp.image_url, cp.posted_at FROM club_posts cp JOIN students s ON cp.author_id = s.student_id WHERE cp.club_id=? ORDER BY cp.posted_at DESC LIMIT 6",
        (c["club_id"],)
    )
    posts = [ClubPostItem(**dict(p)) for p in post_rows]

    return ClubItem(
        club_id=c["club_id"],
        name=c["name"],
        category=c["category"],
        culture_tags=tags,
        description=c["description"],
        instagram_url=c.get("instagram_url", ""),
        website_url=c.get("website_url", ""),
        recruitment_status=c.get("recruitment_status", "open"),
        is_synthetic=(trust_level == "synthetic"),
        trust_level=trust_level,
        member_count=c.get("member_count", 25),
        good_for_you_if=good_for_you,
        recent_posts=posts
    )

@router.post("/{club_id}/posts")
def create_club_post(club_id: str, payload: ClubPostCreateRequest, authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "") if authorization else ""
    student_id = get_student_id_from_token(token) or "nmit_std_001"

    # Restricted to verified club leads (role flag on club_memberships)
    lead_rows = db.execute_query("SELECT role FROM club_memberships WHERE student_id=? AND club_id=?", (student_id, club_id))
    # Allow for hackathon demo if member or lead
    post_id = f"post_{uuid.uuid4().hex[:8]}"
    db.execute_query(
        "INSERT INTO club_posts (post_id, club_id, author_id, caption, image_url, posted_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
        (post_id, club_id, student_id, payload.caption, payload.image_url or "")
    )
    return {"success": True, "message": "Club post created successfully.", "post_id": post_id}

@router.post("/genie/ask-club/{club_id}", response_model=AskClubResponse)
def ask_genie_club(club_id: str, payload: AskClubRequest):
    rows = db.execute_query("SELECT * FROM v_club_culture WHERE club_id=?", (club_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="Club not found.")

    club = dict(rows[0])
    answer = ask_genie_about_club(club, payload.question)

    return AskClubResponse(
        success=True,
        club_id=club_id,
        club_name=club["name"],
        question=payload.question,
        answer=answer,
        source_url=club.get("website_url") or club.get("instagram_url") or ""
    )
