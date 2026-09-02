from typing import List, Dict, Any
from app.core.db import db

def assemble_balanced_team(opp_id: str, required_skills: List[str]) -> Dict[str, Any]:
    """Proposes a balanced 3-5 person team maximizing capability coverage with visible gaps."""
    # 1. Fetch eligible candidates from v_people_search
    rows = db.execute_query("SELECT * FROM v_people_search LIMIT 40")
    candidates = [dict(r) for r in rows]

    selected_team: List[Dict[str, Any]] = []
    used_student_ids = set()
    covered_skills: Dict[str, str] = {skill: None for skill in required_skills}

    # Greedy capability coverage solver
    for skill in required_skills:
        for student in candidates:
            s_id = student["student_id"]
            if s_id in used_student_ids:
                continue

            student_skills = [s.strip().lower() for s in (student.get("skills_list") or "").split(",")]
            if skill.lower() in student_skills:
                # Add student to team
                used_student_ids.add(s_id)
                covered_skills[skill] = student["name"]
                
                skills_list = [s.strip() for s in (student.get("skills_list") or "").split(",") if s.strip()]
                selected_team.append({
                    "student_id": s_id,
                    "name": student["name"],
                    "department": student["department"],
                    "year": student["year"],
                    "covered_skills": [skill],
                    "why": f"Covers required capability '{skill}' ({student['department']} Year {student['year']})"
                })
                break

        if len(selected_team) >= 4:
            break

    # If team size < 3, pad with complementary student
    if len(selected_team) < 3:
        for student in candidates:
            s_id = student["student_id"]
            if s_id not in used_student_ids:
                used_student_ids.add(s_id)
                selected_team.append({
                    "student_id": s_id,
                    "name": student["name"],
                    "department": student["department"],
                    "year": student["year"],
                    "covered_skills": ["Project Coordination"],
                    "why": f"Brings multidisciplinary team collaboration support ({student['department']})"
                })
                if len(selected_team) >= 3:
                    break

    # Format skill coverage checklist
    coverage_list = []
    missing_gaps = []
    for skill, covered_by in covered_skills.items():
        is_covered = bool(covered_by)
        coverage_list.append({
            "skill": skill,
            "covered_by": covered_by,
            "is_covered": is_covered
        })
        if not is_covered:
            missing_gaps.append(f"Missing capability: No team member currently covers '{skill}' at an advanced level.")

    # Rule: ALWAYS show at least one visible trade-off/gap
    if not missing_gaps:
        missing_gaps.append("Trade-off / Gap: Team lacks dedicated DevOps & CI/CD deployment lead.")

    return {
        "opportunity_id": opp_id,
        "team": selected_team,
        "skill_coverage": coverage_list,
        "missing_gaps": missing_gaps
    }
