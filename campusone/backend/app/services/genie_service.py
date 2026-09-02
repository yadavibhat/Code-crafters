import re
from typing import List, Dict, Any
from app.core.db import db

def parse_query_terms(query: str) -> List[str]:
    """Strips punctuation and extracts meaningful search tokens."""
    clean = re.sub(r'[^\w\s]', ' ', query.lower())
    stop_words = {'find', 'me', 'a', 'an', 'the', 'who', 'knows', 'is', 'into', 'and', 'or', 'student', 'year', 'year-old', 'with', 'in', 'for', 'to'}
    tokens = [t for t in clean.split() if t not in stop_words and len(t) > 1]
    return tokens

def generate_why_match(student: Dict[str, Any], query_terms: List[str]) -> List[str]:
    """Generates transparent WhyMatch chips for student match cards."""
    reasons: List[str] = []

    skills = (student.get("skills_list") or "").split(",")
    interests = (student.get("interests_list") or "").split(",")
    dept = student.get("department", "")
    year = student.get("year", 1)
    clubs = (student.get("clubs_list") or "").split(",")

    # 1. Skill overlap reason
    matched_skills = [s.strip() for s in skills if any(term in s.lower() for term in query_terms)]
    if matched_skills:
        reasons.append(f"Matching skills: {', '.join(matched_skills[:2])}")

    # 2. Interest alignment
    matched_interests = [i.strip() for i in interests if any(term in i.lower() for term in query_terms)]
    if matched_interests:
        reasons.append(f"Shared interest: {', '.join(matched_interests[:2])}")

    # 3. Multidisciplinary & Extracurricular overlap
    if "Mechanical" in dept or "Aeronautical" in dept or "Civil" in dept:
        tech_skills = [s for s in skills if s.strip() in ['React', 'Python', 'TypeScript', 'FastAPI', 'Databricks']]
        if tech_skills:
            reasons.append(f"Multidisciplinary combo: {dept.split()[0]} + {tech_skills[0]} skills")

    # 4. Club & Extracurricular overlap
    if clubs and clubs[0]:
        reasons.append(f"Active in {clubs[0]}")

    # 5. Default fallback explanation (Every result card MUST have a non-empty why_match string)
    if not reasons:
        reasons.append(f"Relevant Year {year} {dept.split()[0]} student with complementary skillset")

    return reasons

def execute_people_search(query: str) -> List[Dict[str, Any]]:
    """Queries v_people_search using natural language terms and returns ranked, explained cards."""
    if not query.strip():
        return []

    query_terms = parse_query_terms(query)
    if not query_terms:
        return []

    # Fetch searchable students from governed view v_people_search
    rows = db.execute_query("SELECT * FROM v_people_search")
    results: List[Dict[str, Any]] = []

    for row in rows:
        student = dict(row)
        search_blob = f"{student.get('name', '')} {student.get('department', '')} {student.get('year', '')} {student.get('skills_list', '')} {student.get('interests_list', '')} {student.get('projects_list', '')} {student.get('clubs_list', '')}".lower()
        
        # Count term matches
        match_score = sum(1 for term in query_terms if term in search_blob)

        if match_score > 0:
            why_chips = generate_why_match(student, query_terms)
            skills = [s.strip() for s in (student.get("skills_list") or "").split(",") if s.strip()]
            interests = [i.strip() for i in (student.get("interests_list") or "").split(",") if i.strip()]

            results.append({
                "student_id": student["student_id"],
                "name": student["name"],
                "photo_url": student.get("photo_url", ""),
                "program": student["program"],
                "department": student["department"],
                "year": student["year"],
                "section": student.get("section", ""),
                "grad_year": student["grad_year"],
                "skills": skills,
                "interests": interests,
                "why_match": why_chips,
                "score": match_score
            })

    # Sort results by match score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
