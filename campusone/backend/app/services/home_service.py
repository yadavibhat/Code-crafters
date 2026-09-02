from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from app.core.db import db
from app.services.fit_scorer import calculate_deadline_urgency, calculate_opportunity_fit
from app.services.genie_service import generate_why_match

# In-memory session store for feedback signals (more/less)
FEEDBACK_STORE: Dict[str, Dict[str, str]] = {} # {student_id: {item_id: 'more'|'less'}}

def register_feedback(student_id: str, item_type: str, item_id: str, signal: str):
    """Registers lightweight recommendation feedback signals."""
    if student_id not in FEEDBACK_STORE:
        FEEDBACK_STORE[student_id] = {}
    FEEDBACK_STORE[student_id][f"{item_type}:{item_id}"] = signal

def get_urgent_item() -> Tuple[Dict[str, Any], str]:
    """
    Exact Aggregation Waterfall Logic for "Urgent Item" Pick:
    P1: Opportunity with deadline < 72 hours remaining (urgent).
    P2: Active club recruitment ending soon.
    P3: Smart India Hackathon internal selection deadline.
    """
    opp_rows = db.execute_query("SELECT * FROM opportunities WHERE status='active'")
    for opp in opp_rows:
        urgency, hours_left = calculate_deadline_urgency(opp["deadline"])
        if urgency == "urgent":
            return {
                "title": opp["title"],
                "category": "deadline",
                "deadline": opp["deadline"],
                "hours_remaining": hours_left,
                "action_label": "Build My Team",
                "action_path": f"/opportunities/{opp['opp_id']}",
                "why_urgent": f"🔥 Deadline Warning: Only {hours_left} hours remaining to register team!"
            }, "P1: Opportunity Deadline Urgency (<72h)"

    club_rows = db.execute_query("SELECT * FROM v_club_culture WHERE recruitment_status='open'")
    if club_rows:
        c = club_rows[0]
        return {
            "title": f"{c['name']} Recruitment Open",
            "category": "recruitment",
            "deadline": "2026-09-10 23:59:59",
            "hours_remaining": 48,
            "action_label": "View Club & Apply",
            "action_path": f"/clubs/{c['club_id']}",
            "why_urgent": "⚡ Recruitment Alert: Open application window for core team leads!"
        }, "P2: Active Club Recruitment"

    return {
        "title": "Smart India Hackathon 2026 — NMIT Selection",
        "category": "hackathon",
        "deadline": "2026-09-08 23:59:59",
        "hours_remaining": 72,
        "action_label": "Assemble Hackathon Team",
        "action_path": "/opportunities/opp_001",
        "why_urgent": "🏆 Hackathon Alert: Internal NMIT selection round closes soon!"
    }, "P3: National Hackathon Event"

def get_home_aggregation(student_id: str = "nmit_std_001") -> Dict[str, Any]:
    """Aggregates strictly capped Home sections matching IA hierarchy."""

    # 1. Urgent Item
    urgent_data, _ = get_urgent_item()

    # Fetch student skills/interests/dept
    std_skills = [r["skill"] for r in db.execute_query("SELECT skill FROM student_skills WHERE student_id=?", (student_id,))]
    std_interests = [r["interest"] for r in db.execute_query("SELECT interest FROM student_interests WHERE student_id=?", (student_id,))]
    std_rows = db.execute_query("SELECT name, department FROM students WHERE student_id=?", (student_id,))
    std_name = std_rows[0]["name"] if std_rows else "Aditya Rao"
    std_dept = std_rows[0]["department"] if std_rows else "Computer Science & Engineering"

    # Time-based greeting
    hour = datetime.now().hour
    greeting = f"Good morning, {std_name}" if hour < 12 else (f"Good afternoon, {std_name}" if hour < 17 else f"Good evening, {std_name}")

    # 2. Recommended People (CAPPED STRICTLY AT 3)
    people_rows = db.execute_query("SELECT * FROM v_people_search WHERE student_id != ? LIMIT 10", (student_id,))
    top_people = []
    student_feedback = FEEDBACK_STORE.get(student_id, {})

    for p in people_rows:
        if student_feedback.get(f"person:{p['student_id']}") == "less":
            continue # Respect 'less like this' feedback signal
        why_chips = generate_why_match(dict(p), std_skills + std_interests)
        why_str = f"Why Match: {why_chips[0]}" if why_chips else f"Why Match: Complementary {p['department']} skill set"
        tags = [t.strip() for t in (p.get("skills") or "").split(",") if t.strip()]

        top_people.append({
            "student_id": p["student_id"],
            "name": p["name"],
            "department": p["department"],
            "year": p.get("year", 3),
            "skills": tags[:3],
            "why_reason": why_str
        })
        if len(top_people) == 3: # STRICT CAP = 3
            break

    # 3. Recommended Opportunities (CAPPED STRICTLY AT 3)
    opp_rows = db.execute_query("SELECT * FROM opportunities WHERE status='active' LIMIT 10")
    top_opps = []
    for opp in opp_rows:
        if student_feedback.get(f"opportunity:{opp['opp_id']}") == "less":
            continue
        fit_score, why_fit = calculate_opportunity_fit(dict(opp), std_skills, std_interests, std_dept)
        urgency, hours_left = calculate_deadline_urgency(opp["deadline"])

        top_opps.append({
            "opp_id": opp["opp_id"],
            "title": opp["title"],
            "type": opp["type"],
            "organizer": opp["organizer"],
            "deadline": opp["deadline"],
            "hours_remaining": hours_left,
            "fit_score": fit_score,
            "why_fit": why_fit,
            "is_synthetic": bool(opp["is_synthetic"])
        })
        if len(top_opps) == 3: # STRICT CAP = 3
            break

    # 4. Club/Event Pulse Item (CAPPED STRICTLY AT 1)
    pulse_rows = db.execute_query("SELECT * FROM v_club_culture LIMIT 1")
    pulse_item = None
    if pulse_rows:
        c = dict(pulse_rows[0])
        pulse_item = {
            "club_id": c["club_id"],
            "club_name": c["name"],
            "headline": f"{c['name']} Active Recruitment & Event Workshop",
            "description": c["description"],
            "recruitment_status": c.get("recruitment_status", "open")
        }

    # 5. Campus Story Spotlight (CAPPED STRICTLY AT 1)
    story_rows = db.execute_query("SELECT item_id AS story_id, title, source_title AS author_or_source, event_date AS published_date, content AS excerpt, source_url, category, trust_level FROM v_campus_digest ORDER BY event_date DESC LIMIT 1")
    campus_story = None
    if story_rows:
        s = dict(story_rows[0])
        campus_story = {
            "story_id": s["story_id"],
            "title": s["title"],
            "author_or_source": s["author_or_source"] or "NMIT Institutional News",
            "published_date": s["published_date"],
            "excerpt": s["excerpt"],
            "source_url": s["source_url"] or "https://nitte.edu.in/nmit/",
            "category": s["category"],
            "is_synthetic": (s["trust_level"] == "synthetic")
        }

    return {
        "greeting": greeting,
        "urgent_item": urgent_data,
        "top_people": top_people,
        "top_opportunities": top_opps,
        "pulse_item": pulse_item,
        "campus_story": campus_story
    }
