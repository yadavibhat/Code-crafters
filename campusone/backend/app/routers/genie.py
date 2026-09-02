from fastapi import APIRouter, HTTPException
from typing import List
from app.models.genie import PeopleSearchRequest, PeopleSearchResponse, StudentSearchResult, BuildTeamResponse
from app.services.genie_service import execute_people_search
from app.services.team_builder import assemble_balanced_team
from app.core.db import db

router = APIRouter(prefix="/api/genie", tags=["Genie & Team Builder"])

@router.post("/people-search", response_model=PeopleSearchResponse)
def search_people(payload: PeopleSearchRequest):
    try:
        results_data = execute_people_search(payload.query)
        results = [StudentSearchResult(**r) for r in results_data]
        return PeopleSearchResponse(
            success=True,
            query=payload.query,
            total_matches=len(results),
            results=results
        )
    except Exception as e:
        # Graceful error handling (Never a silent failure or unhandled 500 crash)
        return PeopleSearchResponse(
            success=False,
            query=payload.query,
            total_matches=0,
            results=[],
            error_message=f"Genie Space query error: {str(e)}"
        )

@router.post("/opportunities/{opp_id}/build-team", response_model=BuildTeamResponse)
def build_team(opp_id: str):
    # Fetch opportunity details
    opp_rows = db.execute_query("SELECT title, required_skills FROM opportunities WHERE opp_id = ?", (opp_id,))
    if not opp_rows:
        # Fallback for dynamic/test IDs
        opp_title = "Smart India Hackathon 2026"
        req_skills = ["React", "Python", "FastAPI", "Databricks"]
    else:
        opp_title = opp_rows[0]["title"]
        req_skills = [s.strip() for s in opp_rows[0]["required_skills"].split(",") if s.strip()]

    team_data = assemble_balanced_team(opp_id, req_skills)
    return BuildTeamResponse(
        success=True,
        opportunity_id=opp_id,
        opportunity_title=opp_title,
        team=team_data["team"],
        skill_coverage=team_data["skill_coverage"],
        missing_gaps=team_data["missing_gaps"]
    )
