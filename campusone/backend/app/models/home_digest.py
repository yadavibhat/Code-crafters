from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class UrgentItem(BaseModel):
    title: str
    category: str # hackathon | deadline | recruitment
    deadline: str
    hours_remaining: int
    action_label: str
    action_path: str
    why_urgent: str

class HomePersonCard(BaseModel):
    student_id: str
    name: str
    department: str
    year: int = 3
    skills: List[str] = []
    why_reason: str

class HomeOpportunityCard(BaseModel):
    opp_id: str
    title: str
    type: str
    organizer: str
    deadline: str
    hours_remaining: int
    fit_score: int
    why_fit: str
    is_synthetic: bool

class PulseItem(BaseModel):
    club_id: str
    club_name: str
    headline: str
    description: str
    recruitment_status: str

class CampusStoryItem(BaseModel):
    story_id: str
    title: str
    author_or_source: str
    published_date: str
    excerpt: str
    source_url: str
    category: str # alumni | announcement | achievement
    is_synthetic: bool

class HomeResponse(BaseModel):
    success: bool
    greeting: str
    urgent_item: Optional[UrgentItem] = None
    top_people: List[HomePersonCard] = [] # Capped at 3
    top_opportunities: List[HomeOpportunityCard] = [] # Capped at 3
    pulse_item: Optional[PulseItem] = None # Capped at 1
    campus_story: Optional[CampusStoryItem] = None # Capped at 1

class FeedbackRequest(BaseModel):
    item_type: str # person | opportunity | club
    item_id: str
    signal: str # more | less

class DigestResponse(BaseModel):
    success: bool
    total: int
    stories: List[CampusStoryItem] = []
