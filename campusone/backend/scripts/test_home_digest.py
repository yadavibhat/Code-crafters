import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.home_service import get_home_aggregation, get_urgent_item
from app.core.db import db

def run_home_digest_tests():
    print("=================================================================")
    print(" BATCH 8 HOME AGGREGATION & CAMPUS DIGEST VERIFICATION TEST")
    print("=================================================================")

    # 1. Urgent Item Aggregation Waterfall Audit
    urgent_item, priority_str = get_urgent_item()
    print(f"\n[1. Urgent Item Waterfall Audit]")
    print(f"  Priority Rule Applied: {priority_str}")
    print(f"  Title: '{urgent_item['title']}'")
    print(f"  Why Urgent: '{urgent_item['why_urgent']}'")
    assert urgent_item["title"] != "", "ERROR: Urgent item title is empty!"

    # 2. Strip Capping Audit (Strict IA Caps)
    print("\n-----------------------------------------------------------------")
    print("[2. Strip Capping Audit]")
    data = get_home_aggregation("nmit_std_001")
    print(f"  Greeting: {data['greeting']}")
    print(f"  Top People Count: {len(data['top_people'])} (Must be <= 3)")
    print(f"  Top Opps Count:   {len(data['top_opportunities'])} (Must be <= 3)")
    print(f"  Pulse Item Present: {bool(data['pulse_item'])} (Must be 1)")
    print(f"  Campus Story Present: {bool(data['campus_story'])} (Must be 1)")

    assert len(data['top_people']) <= 3, "ERROR: People strip exceeded cap of 3!"
    assert len(data['top_opportunities']) <= 3, "ERROR: Opportunities strip exceeded cap of 3!"
    assert data['pulse_item'] is not None, "ERROR: Missing pulse item!"
    assert data['campus_story'] is not None, "ERROR: Missing campus story!"

    # 3. Campus Digest Source Link & Published Date Audit
    print("\n-----------------------------------------------------------------")
    print("[3. Campus Digest Source Link & Published Date Audit]")
    stories = db.execute_query("SELECT title, source_title AS author_or_source, event_date AS published_date, source_url FROM v_campus_digest")
    print(f"Found {len(stories)} Campus Digest stories:")
    for s in stories:
        print(f"  • {s['title'][:45]:<45} | Date: {s['published_date']} | Source: {s['source_url']}")
        assert s['source_url'] != "", f"ERROR: Story '{s['title']}' missing source URL!"
        assert s['published_date'] != "", f"ERROR: Story '{s['title']}' missing published date!"

    print("\n=================================================================")
    print(" ALL BATCH 8 HOME AGGREGATION & DIGEST CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_home_digest_tests()
