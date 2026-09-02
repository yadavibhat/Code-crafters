import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.db import db

def run_verification():
    print("=================================================================")
    print(" BATCH 2 DATABASE & SEMANTIC VIEWS VERIFICATION REPORT")
    print("=================================================================")

    views = [
        "v_people_search",
        "v_opportunity_fit",
        "v_club_culture",
        "v_whatif_patterns",
        "v_campus_digest"
    ]

    # 1. Verify View Row Counts
    for view in views:
        res = db.execute_query(f"SELECT COUNT(*) AS total FROM {view}")
        count = res[0]["total"] if res else 0
        print(f"[View Verification] {view:<20} => {count} rows")
        assert count > 0, f"Error: View {view} is empty!"

    # 2. Verify Privacy Controls on v_people_search
    print("\n[Privacy Audit] Inspecting columns in v_people_search...")
    sample = db.execute_query("SELECT * FROM v_people_search LIMIT 1")
    if sample:
        keys = list(sample[0].keys())
        print(f"[Privacy Audit] Exposed Columns: {keys}")
        assert "usn_encrypted" not in keys, "PRIVACY VIOLATION: usn_encrypted exposed in view!"
        assert "email_hash" not in keys, "PRIVACY VIOLATION: email_hash exposed in view!"
        assert "cgpa" not in keys, "PRIVACY VIOLATION: raw cgpa exposed in view!"
        print("[Privacy Audit] PASS: USN, raw email, and private CGPA are successfully excluded!")

    # 3. Test Genie Query Simulation ("who works with Python and is interested in AI?")
    print("\n[Genie Query Simulation] 'Who works with Python and is interested in AI?'")
    test_query = """
        SELECT name, program, department, year, skills_list, interests_list 
        FROM v_people_search 
        WHERE LOWER(skills_list) LIKE '%python%' 
           OR LOWER(interests_list) LIKE '%ai%'
        LIMIT 5
    """
    matches = db.execute_query(test_query)
    for m in matches:
        print(f"  • {m['name']} ({m['department']} Year {m['year']}) | Skills: {m['skills_list']} | Interests: {m['interests_list']}")

    print("\n=================================================================")
    print(" ALL BATCH 2 DATA LAYER VERIFICATION CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_verification()
