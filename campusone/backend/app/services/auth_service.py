import hashlib
import uuid
from typing import Dict, Optional, Any, List
from app.core.config import settings
from app.core.db import db

# In-memory session store for tokens and OTPs
SESSIONS: Dict[str, str] = {}  # token -> student_id
OTP_STORE: Dict[str, str] = {}  # email -> otp

def is_valid_institutional_email(email: str) -> bool:
    """Verifies email ends with allowed domain or institutional pattern."""
    email_clean = email.strip().lower()
    allowed_domain = settings.ALLOWED_EMAIL_DOMAIN.strip().lower()
    return email_clean.endswith(f"@{allowed_domain}") or email_clean.endswith("@nitte.edu.in") or email_clean.endswith("@nmit.ac.in") or email_clean.endswith(".nmit.ac.in") or "nitte" in email_clean or "nmit" in email_clean

def generate_otp(email: str) -> str:
    """Generates a 6-digit OTP for testing."""
    otp = "123456"  # Fixed OTP for hackathon simplicity
    OTP_STORE[email.strip().lower()] = otp
    return otp

def verify_otp_and_login(email: str, otp: str) -> Optional[Dict[str, Any]]:
    email_clean = email.strip().lower()
    valid_otp = OTP_STORE.get(email_clean, "123456")
    if otp != valid_otp:
        return None

    # Check if student exists by email_hash
    email_hash = hashlib.sha256(email_clean.encode()).hexdigest()
    query = "SELECT * FROM students WHERE email_hash = ?"
    rows = db.execute_query(query, (email_hash,))

    if rows:
        student = rows[0]
        student_id = student["student_id"]
        onboarding_completed = True
    else:
        # Create new student placeholder
        student_id = f"nmit_std_{uuid.uuid4().hex[:8]}"
        db.execute_query(
            "INSERT INTO students (student_id, name, photo_url, program, department, year, section, grad_year, email_hash, usn_encrypted, cgpa, profile_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (student_id, email_clean.split("@")[0].capitalize(), "", "B.Tech", "Computer Science & Engineering", 1, "A", 2029, email_hash, f"1NT26CS_{student_id[-4:]}", None, "searchable")
        )
        onboarding_completed = False

    token = f"token_{uuid.uuid4().hex}"
    SESSIONS[token] = student_id
    return {
        "token": token,
        "student_id": student_id,
        "onboarding_completed": onboarding_completed
    }

def get_student_id_from_token(token: str) -> Optional[str]:
    return SESSIONS.get(token)

def filter_profile_for_viewer(owner_id: str, viewer_id: Optional[str]) -> Dict[str, Any]:
    """Applies strict server-side privacy filtering to student profile."""
    # Fetch base student
    students = db.execute_query("SELECT * FROM students WHERE student_id = ?", (owner_id,))
    if not students:
        return {}

    student = dict(students[0])
    is_owner = (viewer_id == owner_id)

    # Fetch privacy settings
    privacy_rows = db.execute_query("SELECT field_name, visibility FROM privacy_settings WHERE student_id = ?", (owner_id,))
    privacy_map = {row["field_name"]: row["visibility"] for row in privacy_rows}

    # Fetch skills, interests, goals, projects, clubs
    skills = [r["skill"] for r in db.execute_query("SELECT skill FROM student_skills WHERE student_id = ?", (owner_id,))]
    interests = [r["interest"] for r in db.execute_query("SELECT interest FROM student_interests WHERE student_id = ?", (owner_id,))]
    goals = [r["goal_text"] for r in db.execute_query("SELECT goal_text FROM student_goals WHERE student_id = ?", (owner_id,))]
    projects = db.execute_query("SELECT title, domain, skills_used, description, year FROM projects WHERE student_id = ?", (owner_id,))
    clubs = [r["name"] for r in db.execute_query("SELECT c.name FROM club_memberships cm JOIN clubs c ON cm.club_id = c.club_id WHERE cm.student_id = ?", (owner_id,))]

    notices: List[str] = []

    # PRIVACY ENFORCEMENT RULES:
    # Rule 1: USN & Raw Email are NEVER returned to anyone except the owner
    if not is_owner:
        student.pop("usn_encrypted", None)
        student.pop("email_hash", None)
        notices.append("USN and Email address are private.")

    # Rule 2: CGPA Privacy Filtering
    cgpa_visibility = privacy_map.get("cgpa", "private")
    if not is_owner and cgpa_visibility == "private":
        student["cgpa"] = None
        notices.append("CGPA is marked private by student.")

    return {
        "student_id": student["student_id"],
        "name": student["name"],
        "photo_url": student.get("photo_url", ""),
        "program": student["program"],
        "department": student["department"],
        "year": student["year"],
        "section": student.get("section", ""),
        "grad_year": student["grad_year"],
        "usn": student.get("usn_encrypted") if is_owner else None,
        "cgpa": student["cgpa"] if (is_owner or cgpa_visibility != "private") else None,
        "profile_mode": student["profile_mode"],
        "skills": skills,
        "interests": interests,
        "goals": goals,
        "projects": projects,
        "clubs": clubs,
        "privacy_notices": notices if not is_owner else []
    }
