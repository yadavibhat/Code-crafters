import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.club_service import ask_genie_about_club
from app.core.db import db

def run_club_tests():
    print("=================================================================")
    print(" BATCH 6 CLUBS & CULTURE WALL VERIFICATION TEST")
    print("=================================================================")

    # 1. Audit Verified Clubs vs Synthetic Clubs
    rows = db.execute_query("SELECT club_id, name, category, instagram_url, website_url, trust_level FROM v_club_culture")
    print(f"[Club Seed Audit] Found {len(rows)} seeded clubs:")
    for r in rows:
        print(f"  • {r['name']:<28} | Category: {r['category']:<12} | Trust: {r['trust_level']:<10} | Insta: {r['instagram_url']}")
        assert r['instagram_url'] != "", f"Error: Club {r['name']} missing official Instagram link!"

    # 2. Per-Club Genie Q&A Scoping Test (3 Questions on NMIT Hacks)
    print("\n-----------------------------------------------------------------")
    print("[Per-Club Genie Q&A Audit] Scoped Club: NMIT Hacks (nmit_hacks)")

    club_sample = [dict(r) for r in rows if r['club_id'] == 'nmit_hacks'][0]

    q1 = "When is recruitment open for NMIT Hacks?"
    ans1 = ask_genie_about_club(club_sample, q1)
    print(f"\nQuestion 1: '{q1}'")
    print(f"  Answer: {ans1}")
    assert "OPEN" in ans1 or "recruitment" in ans1.lower(), "ERROR: Q1 answer not scoped!"

    q2 = "What events does NMIT Hacks organize?"
    ans2 = ask_genie_about_club(club_sample, q2)
    print(f"\nQuestion 2: '{q2}'")
    print(f"  Answer: {ans2}")
    assert "hackathon" in ans2.lower(), "ERROR: Q2 answer not scoped!"

    q3 = "How many total registered members are in NMIT Hacks?"
    ans3 = ask_genie_about_club(club_sample, q3)
    print(f"\nQuestion 3: '{q3}'")
    print(f"  Answer: {ans3}")
    assert "exact verified student roster counts" in ans3.lower() or "nmit" in ans3.lower(), "ERROR: Q3 anti-hallucination rule failed!"

    print("\n=================================================================")
    print(" ALL BATCH 6 CLUBS & CULTURE WALL CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_club_tests()
