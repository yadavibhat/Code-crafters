from pydantic import BaseModel, Field
from typing import List, Optional

class PrivacySettingItem(BaseModel):
    field_name: str
    visibility: str # public | nmit_only | connections | private

class StudentSkillItem(BaseModel):
    skill: str
    proficiency: str = "Intermediate"

class StudentInterestItem(BaseModel):
    interest: str
    category: str = "technical" # technical | extracurricular

class ProjectItem(BaseModel):
    project_id: Optional[str] = None
    title: str
    domain: str
    skills_used: str
    description: str
    year: int = 2026

class ProfileUpdateRequest(BaseModel):
    name: str
    photo_url: Optional[str] = ""
    program: str = "B.Tech"
    department: str
    year: int
    section: Optional[str] = "A"
    grad_year: int = 2027
    usn: Optional[str] = None
    cgpa: Optional[float] = None
    profile_mode: str = "searchable"
    skills: List[StudentSkillItem] = []
    interests: List[StudentInterestItem] = []
    goals: List[str] = []
    projects: List[ProjectItem] = []
    clubs: List[str] = []

class PrivacySettingsUpdateRequest(BaseModel):
    settings: List[PrivacySettingItem]

class PublicProfileResponse(BaseModel):
    student_id: str
    name: str
    photo_url: Optional[str] = ""
    program: str
    department: str
    year: int
    section: Optional[str] = ""
    grad_year: int
    cgpa: Optional[float] = None # Masked if private
    profile_mode: str
    skills: List[str] = []
    interests: List[str] = []
    goals: List[str] = []
    projects: List[dict] = []
    clubs: List[str] = []
    privacy_notices: List[str] = [] # E.g. "USN and Email are private"
