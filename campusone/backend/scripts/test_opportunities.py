import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.fit_scorer import calculate_opportunity_fit, calculate_deadline_urgency

def run_opportunity_tests():
    print("=================================================================")
    print(" BATCH 5 OPPORTUNITIES HUB & FIT SCORER VERIFICATION TEST")
    print("=================================================================")

    # 1. Fit Score Sensitivity Test
    opp = {
        "title": "Smart India Hackathon 2026",
        "description": "National AI & Web Innovation Challenge",
        "required_skills": "React, Python, FastAPI, Databricks"
    }

    # Student 1: High skill match
    skills_high = ["React", "Python", "FastAPI", "TypeScript"]
    score_high, why_high = calculate_opportunity_fit(opp, skills_high, ["AI Research"], "Computer Science")
    print(f"\n[Fit Score Test - High Match] Student Skills: {skills_high}")
    print(f"  Result: {score_high}% Fit | Rationale: {why_high}")

    # Student 2: Low skill match
    skills_low = ["CAD / SolidWorks"]
    score_low, why_low = calculate_opportunity_fit(opp, skills_low, ["CAD"], "Mechanical Engineering")
    print(f"[Fit Score Test - Low Match] Student Skills: {skills_low}")
    print(f"  Result: {score_low}% Fit | Rationale: {why_low}")

    assert score_high > score_low, "ERROR: Fit score did not change sensibly when skills were edited!"

    # 2. Deadline Urgency Visual Treatment Test
    print("\n-----------------------------------------------------------------")
    print("[Deadline Urgency Test]")
    urg_urgent, hrs_urgent = calculate_deadline_urgency("2026-09-03 12:00:00")
    print(f"  Near Deadline (within 72h) => Urgency: '{urg_urgent}' ({hrs_urgent} hrs left)")
    assert urg_urgent == "urgent", "ERROR: Deadline within 72h should trigger 'urgent' badge!"

    urg_norm, hrs_norm = calculate_deadline_urgency("2026-10-15 12:00:00")
    print(f"  Future Deadline (> 72h)    => Urgency: '{urg_norm}' ({hrs_norm} hrs left)")
    assert urg_norm == "normal", "ERROR: Future deadline should trigger 'normal' badge!"

    print("\n=================================================================")
    print(" ALL BATCH 5 OPPORTUNITIES HUB CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_opportunity_tests()
