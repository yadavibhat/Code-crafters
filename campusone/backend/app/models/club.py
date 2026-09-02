from pydantic import BaseModel, Field
from typing import List, Optional

class ClubPostItem(BaseModel):
    post_id: str
    club_id: str
    author_name: str
    caption: str
    image_url: Optional[str] = ""
    posted_at: str

class ClubItem(BaseModel):
    club_id: str
    name: str
    category: str # technical | cultural | social_impact | sports | competitive
    culture_tags: List[str] = []
    description: str
    instagram_url: Optional[str] = ""
    website_url: Optional[str] = ""
    recruitment_status: str # open | closed | upcoming
    is_synthetic: bool
    trust_level: str
    member_count: int
    good_for_you_if: str
    recent_posts: List[ClubPostItem] = []

class ClubListResponse(BaseModel):
    success: bool
    total: int
    clubs: List[ClubItem] = []

class ClubPostCreateRequest(BaseModel):
    caption: str
    image_url: Optional[str] = ""

class AskClubRequest(BaseModel):
    question: str

class AskClubResponse(BaseModel):
    success: bool
    club_id: str
    club_name: str
    question: str
    answer: str
    source_url: Optional[str] = ""
