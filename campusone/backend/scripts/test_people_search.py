import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.genie_service import execute_people_search
from app.services.team_builder import assemble_balanced_team

TEST_QUERIES = [
    "React and TypeScript",
    "AI Research",
    "CSE student into PyTorch and Drones",
    "Mechanical student into music and Arduino",
    "Quantum Teleportation Superconductors XYZ999"
]

def run_people_search_tests():
    print("=================================================================")
    print(" BATCH 4 FIND MY PEOPLE & TEAM BUILDER VERIFICATION TEST")
    print("=================================================================")

    for idx, q in enumerate(TEST_QUERIES, 1):
        print(f"\n[Test Query {idx}] '{q}'")
        results = execute_people_search(q)
        print(f"  Total Matches: {len(results)}")
        if results:
            top = results[0]
            print(f"  Top Match: {top['name']} ({top['department']} Year {top['year']})")
            print(f"  Skills: {', '.join(top['skills'])}")
            print(f"  WhyMatch Chips: {top['why_match']}")
            assert len(top['why_match']) > 0, "ERROR: why_match chips array must be non-empty!"
        else:
            print("  Result: No matches found (Clear empty state)")

    print("\n-----------------------------------------------------------------")
    print("[Team Assembly Solver Audit]")
    team_data = assemble_balanced_team("opp_001", ["React", "Python", "FastAPI", "Databricks"])
    print(f"Selected Team Size: {len(team_data['team'])}")
    team_ids = [m["student_id"] for m in team_data["team"]]
    print(f"Team Member IDs: {team_ids}")
    assert len(team_ids) == len(set(team_ids)), "ERROR: Duplicate student in proposed team!"

    print("Skill Coverage:")
    for item in team_data["skill_coverage"]:
        print(f"  • {item['skill']}: {item['covered_by'] if item['is_covered'] else 'NOT COVERED'}")

    print("Missing Gaps / Trade-offs:")
    for gap in team_data["missing_gaps"]:
        print(f"  ⚠️ {gap}")
    assert len(team_data["missing_gaps"]) >= 1, "ERROR: Team builder must show at least 1 visible trade-off/gap!"

    print("\n=================================================================")
    print(" ALL BATCH 4 FIND MY PEOPLE & TEAM BUILDER CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_people_search_tests()
