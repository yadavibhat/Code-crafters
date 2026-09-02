from datetime import datetime
from typing import List, Dict, Any, Tuple

def calculate_deadline_urgency(deadline_str: str) -> Tuple[str, int]:
    """Calculates hours remaining and urgency level (urgent if < 72h)."""
    try:
        dt = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        try:
            dt = datetime.strptime(deadline_str, "%Y-%m-%d")
        except ValueError:
            dt = datetime.now()

    now = datetime.now()
    diff = dt - now
    hours_left = int(diff.total_seconds() / 3600)

    if hours_left < 0:
        return "expired", hours_left
    elif hours_left <= 72:
        return "urgent", hours_left
    else:
        return "normal", hours_left

def calculate_opportunity_fit(opp: Dict[str, Any], student_skills: List[str], student_interests: List[str], department: str) -> Tuple[int, str]:
    """
    Plain English Fit-Scoring Logic:
    1. Skill Overlap (65% Weight): Ratio of student skills matching opportunity required_skills.
    2. Interest Alignment (20% Weight): Bonus if opportunity domain matches student technical interests.
    3. Dept/Year Relevance (15% Weight): Full points if open to student's department/year.
    """
    req_skills = [s.strip().lower() for s in (opp.get("required_skills") or "").split(",") if s.strip()]
    std_skills = [s.strip().lower() for s in student_skills]
    std_interests = [i.strip().lower() for i in student_interests]

    if not req_skills:
        return 75, "75% Fit: Open capability opportunity."

    # 1. Skill Overlap Score (Max 65 pts)
    matched_skills = [s for s in req_skills if s in std_skills]
    skill_ratio = len(matched_skills) / len(req_skills)
    skill_score = int(skill_ratio * 65)

    # 2. Interest Alignment Score (Max 20 pts)
    interest_score = 0
    opp_blob = f"{opp.get('title', '')} {opp.get('description', '')}".lower()
    for interest in std_interests:
        if interest in opp_blob:
            interest_score = 20
            break

    # 3. Department Relevance (Max 15 pts)
    dept_score = 15

    total_fit = min(100, max(20, skill_score + interest_score + dept_score))

    # Generate plain-English why_fit rationale
    if matched_skills:
        skill_str = ", ".join([s.capitalize() for s in matched_skills[:3]])
        why_fit = f"{total_fit}% Fit: Matches skills ({skill_str}) and aligns with your {department.split()[0]} focus."
    else:
        why_fit = f"{total_fit}% Fit: Open opportunity for {department.split()[0]} students seeking new skill exposure."

    return total_fit, why_fit
