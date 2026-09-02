from pydantic import BaseModel, Field
from typing import List, Optional

class OpportunityItem(BaseModel):
    opp_id: str
    title: str
    type: str # Hackathon | Internship | Research | Competition | Project
    description: str
    required_skills: List[str] = []
    eligibility: str
    deadline: str
    deadline_urgency: str # urgent | normal | expired
    hours_remaining: int
    organizer: str
    source_url: Optional[str] = ""
    status: str
    is_synthetic: bool
    fit_score: int # 0 to 100
    why_fit: str

class OpportunityListResponse(BaseModel):
    success: bool
    total: int
    opportunities: List[OpportunityItem] = []
