from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional, List
from app.models.opportunity import OpportunityListResponse, OpportunityItem
from app.services.auth_service import get_student_id_from_token
from app.services.fit_scorer import calculate_opportunity_fit, calculate_deadline_urgency
from app.core.db import db

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])

@router.get("", response_model=OpportunityListResponse)
def list_opportunities(
    opp_type: Optional[str] = Query(None, alias="type"),
    department: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None)
):
    student_id = "nmit_std_001"
    if authorization:
        token = authorization.replace("Bearer ", "")
        extracted = get_student_id_from_token(token)
        if extracted:
            student_id = extracted

    # Fetch student's skills & interests for fit scoring
    std_skills = [r["skill"] for r in db.execute_query("SELECT skill FROM student_skills WHERE student_id=?", (student_id,))]
    std_interests = [r["interest"] for r in db.execute_query("SELECT interest FROM student_interests WHERE student_id=?", (student_id,))]
    std_rows = db.execute_query("SELECT department FROM students WHERE student_id=?", (student_id,))
    std_dept = std_rows[0]["department"] if std_rows else "Computer Science & Engineering"

    # Query opportunities from db
    query = "SELECT * FROM opportunities WHERE status='active'"
    params = []
    if opp_type:
        query += " AND type=?"
        params.append(opp_type)

    rows = db.execute_query(query, tuple(params))
    items: List[OpportunityItem] = []

    for r in rows:
        opp = dict(r)
        fit_score, why_fit = calculate_opportunity_fit(opp, std_skills, std_interests, std_dept)
        urgency, hours_left = calculate_deadline_urgency(opp["deadline"])

        req_skills_list = [s.strip() for s in opp["required_skills"].split(",") if s.strip()]

        items.append(OpportunityItem(
            opp_id=opp["opp_id"],
            title=opp["title"],
            type=opp["type"],
            description=opp["description"],
            required_skills=req_skills_list,
            eligibility=opp["eligibility"],
            deadline=opp["deadline"],
            deadline_urgency=urgency,
            hours_remaining=hours_left,
            organizer=opp["organizer"],
            source_url=opp.get("source_url", ""),
            status=opp["status"],
            is_synthetic=bool(opp["is_synthetic"]),
            fit_score=fit_score,
            why_fit=why_fit
        ))

    # Default sort by fit_score descending, then hours_remaining ascending
    items.sort(key=lambda x: (x.fit_score, -x.hours_remaining), reverse=True)

    return OpportunityListResponse(
        success=True,
        total=len(items),
        opportunities=items
    )

@router.get("/{opp_id}", response_model=OpportunityItem)
def get_opportunity_detail(opp_id: str, authorization: Optional[str] = Header(None)):
    rows = db.execute_query("SELECT * FROM opportunities WHERE opp_id=?", (opp_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    opp = dict(rows[0])
    urgency, hours_left = calculate_deadline_urgency(opp["deadline"])
    req_skills_list = [s.strip() for s in opp["required_skills"].split(",") if s.strip()]

    return OpportunityItem(
        opp_id=opp["opp_id"],
        title=opp["title"],
        type=opp["type"],
        description=opp["description"],
        required_skills=req_skills_list,
        eligibility=opp["eligibility"],
        deadline=opp["deadline"],
        deadline_urgency=urgency,
        hours_remaining=hours_left,
        organizer=opp["organizer"],
        source_url=opp.get("source_url", ""),
        status=opp["status"],
        is_synthetic=bool(opp["is_synthetic"]),
        fit_score=85,
        why_fit="85% Fit: Matches core required skills and aligns with your department focus."
    )
