import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.auth_service import verify_otp_and_login, filter_profile_for_viewer
from app.core.db import db

def run_identity_tests():
    print("=================================================================")
    print(" BATCH 3 IDENTITY & PRIVACY VERIFICATION TEST")
    print("=================================================================")

    # 1. Create Test Account A (Aditya Rao)
    email_a = "aditya.rao@nmit.ac.in"
    res_a = verify_otp_and_login(email_a, "123456")
    id_a = res_a["student_id"]
    print(f"[Auth Test] Created/Logged in Account A: {email_a} (ID: {id_a})")

    # 2. Create Test Account B (Ananya Sharma)
    email_b = "ananya.sharma@nmit.ac.in"
    res_b = verify_otp_and_login(email_b, "123456")
    id_b = res_b["student_id"]
    print(f"[Auth Test] Created/Logged in Account B: {email_b} (ID: {id_b})")

    # 3. Account A sets profile data & marks CGPA private
    db.execute_query("UPDATE students SET name='Aditya Rao', usn_encrypted='1NT22CS015', cgpa=9.42 WHERE student_id=?", (id_a,))
    db.execute_query("INSERT OR REPLACE INTO privacy_settings (student_id, field_name, visibility) VALUES (?, 'cgpa', 'private')", (id_a,))
    print("[Profile Test] Account A updated profile: USN=1NT22CS015, CGPA=9.42 (marked PRIVATE)")

    # 4. Account A views own profile (Should see USN & CGPA)
    profile_own = filter_profile_for_viewer(owner_id=id_a, viewer_id=id_a)
    print(f"[Privacy Audit] Account A viewing OWN profile => USN: {profile_own.get('usn')}, CGPA: {profile_own.get('cgpa')}")
    assert profile_own.get("usn") == "1NT22CS015", "Error: Owner should see own USN"
    assert profile_own.get("cgpa") == 9.42, "Error: Owner should see own CGPA"

    # 5. Account B views Account A's profile (Should NOT see USN or private CGPA)
    profile_b_views_a = filter_profile_for_viewer(owner_id=id_a, viewer_id=id_b)
    print(f"[Privacy Audit] Account B viewing Account A profile => USN: {profile_b_views_a.get('usn')}, CGPA: {profile_b_views_a.get('cgpa')}")
    assert profile_b_views_a.get("usn") is None, "PRIVACY VIOLATION: USN exposed to Account B!"
    assert profile_b_views_a.get("email_hash") is None, "PRIVACY VIOLATION: email_hash exposed to Account B!"
    assert profile_b_views_a.get("cgpa") is None, "PRIVACY VIOLATION: Private CGPA exposed to Account B!"
    assert "USN and Email address are private." in profile_b_views_a.get("privacy_notices", []), "Privacy notice missing!"
    assert "CGPA is marked private by student." in profile_b_views_a.get("privacy_notices", []), "CGPA privacy notice missing!"

    print("\n=================================================================")
    print(" ALL BATCH 3 SERVER-SIDE PRIVACY BOUNDARY CHECKS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_identity_tests()
