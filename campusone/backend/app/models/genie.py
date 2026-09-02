from pydantic import BaseModel, Field
from typing import List, Optional

class PeopleSearchRequest(BaseModel):
    query: str = Field(..., example="Find a 3rd-year CSE student who knows React and is into drones")

class StudentSearchResult(BaseModel):
    student_id: str
    name: str
    photo_url: Optional[str] = ""
    program: str
    department: str
    year: int
    section: Optional[str] = ""
    grad_year: int
    skills: List[str] = []
    interests: List[str] = []
    why_match: List[str] = []
    connection_status: str = "connect" # connect | pending | connected

class PeopleSearchResponse(BaseModel):
    success: bool
    query: str
    total_matches: int
    results: List[StudentSearchResult] = []
    error_message: Optional[str] = None

class TeamMemberSelection(BaseModel):
    student_id: str
    name: str
    department: str
    year: int
    covered_skills: List[str] = []
    why: str

class SkillCoverageItem(BaseModel):
    skill: str
    covered_by: Optional[str] = None
    is_covered: bool

class BuildTeamResponse(BaseModel):
    success: bool
    opportunity_id: str
    opportunity_title: str
    team: List[TeamMemberSelection] = []
    skill_coverage: List[SkillCoverageItem] = []
    missing_gaps: List[str] = []
    error_message: Optional[str] = None
