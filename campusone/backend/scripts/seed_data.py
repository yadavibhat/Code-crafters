import os
import sqlite3
import random
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "campusone.db")

INDIAN_FIRST_NAMES = [
    "Aditya", "Ananya", "Rahul", "Priya", "Karthik", "Sneha", "Vikram", "Pooja", 
    "Rohan", "Divya", "Siddharth", "Meera", "Varun", "Kavya", "Akash", "Riya",
    "Nikhil", "Shreya", "Abhinav", "Tanvi", "Pranav", "Nisha", "Harsh", "Deepika"
]

INDIAN_LAST_NAMES = [
    "Rao", "Sharma", "Verma", "Bhat", "Nair", "Hegde", "Patil", "Reddy",
    "Deshmukh", "Gowda", "Kulkarni", "Joshi", "Iyer", "Menon", "Shetty", "Kumar"
]

DEPARTMENTS = [
    "Artificial Intelligence & Data Science",
    "Artificial Intelligence & Machine Learning",
    "Computer Science & Engineering",
    "Information Science & Engineering",
    "Electronics & Communication Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
    "Aeronautical Engineering",
    "Civil Engineering",
    "Robotics & Artificial Intelligence"
]

SKILLS_POOL = [
    "React", "TypeScript", "Python", "FastAPI", "Databricks", "PyTorch", "TensorFlow",
    "OpenCV", "Embedded C", "Arduino", "ROS2", "CAD / SolidWorks", "UI/UX Design",
    "Node.js", "Docker", "Git", "SQL", "MATLAB", "Flutter", "Kubernetes"
]

INTERESTS_TECH = [
    "AI Research", "Web3", "Robotics & Drones", "Competitive Programming",
    "IoT & Embedded Systems", "Cybersecurity", "Autonomous Vehicles", "Open Source"
]

INTERESTS_EXTRA = [
    "Music & Band", "Photography", "Badminton", "Public Speaking",
    "Social Impact", "Theatre", "Cricket", "Event Organizing", "Quiz & Debate"
]

def seed_database():
    print(f"[Seeding] Initializing database at: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Execute DDL Schema Creation
    schema_sql_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    with open(schema_sql_path, "r", encoding="utf-8") as f:
        schema_script = f.read()

    # Strip Unity Catalog specific syntax for SQLite compatibility
    clean_sql = []
    for line in schema_script.splitlines():
        if line.strip().startswith("CREATE CATALOG") or line.strip().startswith("USE CATALOG") or \
           line.strip().startswith("CREATE SCHEMA") or line.strip().startswith("USE SCHEMA"):
            continue
        line = line.replace("campusone.core.", "")
        line = line.replace("TIMESTAMP DEFAULT CURRENT_TIMESTAMP", "TEXT DEFAULT (datetime('now'))")
        line = line.replace("TIMESTAMP", "TEXT")
        clean_sql.append(line)

    cursor.executescript("\n".join(clean_sql))

    # Clear existing data
    tables = [
        "source_registry", "students", "student_skills", "student_interests",
        "student_goals", "privacy_settings", "projects", "clubs", "club_memberships",
        "club_posts", "opportunities", "events", "campus_news", "academic_resources",
        "connections", "feedback", "student_outcomes"
    ]
    for table in tables:
        cursor.execute(f"DELETE FROM {table}")

    print("[Seeding] 1. Populating Verified Grounding Sources (NMIT Official)")
    sources = [
        ("src_nmit_main", "https://nitte.edu.in/nmit/", "NMIT Main Portal", "official_website", "verified", "Institution", "nmit"),
        ("src_nmit_clubs", "https://nitte.edu.in/nmit/clubs.php", "NMIT Student Clubs & Societies", "official_website", "verified", "Clubs", "clubs_nmit"),
        ("src_nmit_placements", "https://nitte.edu.in/nmit/placements.php", "NMIT Placements Statistics", "official_website", "verified", "Placements", "placements"),
        ("src_nmit_alumni", "https://nitte.edu.in/nmit/alumni-association.php", "NMIT Official Alumni Association", "news_feed", "verified", "Alumni", "alumni"),
        ("src_nmithacks", "https://www.nmithacks.com/", "NMIT Hacks Portal", "official_website", "verified", "Hackathons", "nmit_hacks"),
        ("src_gdgnmit", "https://gdg.community.dev/gdg-on-campus-nitte-meenakshi-institute-of-technology-bengaluru-india/", "GDG on Campus NMIT", "official_website", "verified", "Clubs", "gdg_nmit"),
        ("src_ecellnmit", "https://www.ecellnmit.in/", "ENIGMA E-Cell NMIT", "official_website", "verified", "Clubs", "enigma_ecell_nmit"),
        ("src_oscode", "https://www.oscode.co.in/", "OSCode NMIT Open Source", "official_website", "verified", "Clubs", "oscode_nmit")
    ]
    cursor.executemany(
        "INSERT INTO source_registry (source_id, source_url, source_title, source_type, trust_level, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        sources
    )

    # 2. Populating Verified NMIT Featured Clubs
    print("[Seeding] 2. Populating Verified NMIT Featured Clubs")
    clubs = [
        ("nmit_hacks", "NMIT Hacks", "technical", "Hackathons, Innovation, Web Dev, AI, Open Innovation", "NMIT Hacks is a student innovation and hackathon community associated with CSE ecosystem, hosting national-level 48-hour hackathons.", "https://www.instagram.com/nmit_hacks/", "https://www.nmithacks.com/", "open", "src_nmithacks"),
        ("gdg_nmit", "GDG on Campus NMIT", "technical", "Google Tech, AI, GenAI, Competitive Coding, Hackathons", "Google Developer Groups on Campus at NMIT driving peer learning, Codesprint 4.0, and Solution Challenge.", "https://www.instagram.com/gdgnmit/", "https://gdg.community.dev/gdg-on-campus-nitte-meenakshi-institute-of-technology-bengaluru-india/", "open", "src_gdgnmit"),
        ("enigma_ecell_nmit", "ENIGMA - E-Cell NMIT", "technical", "Entrepreneurship, Startups, Business Strategy, Pitching", "Student-led entrepreneurship cell hosting IDEATHON 6.0 and ENFINITY national entrepreneurship fest.", "https://www.instagram.com/ecellnmit/", "https://www.ecellnmit.in/", "open", "src_ecellnmit"),
        ("oscode_nmit", "OSCode NMIT", "technical", "Open Source, Git, GitHub, Software Dev, AI", "Student technical community focused on open-source software, collaborative learning, and GitHub workshops.", "https://www.instagram.com/oscode_nmit/", "https://www.oscode.co.in/", "open", "src_oscode"),
        ("mc_nmit", "MC NMIT", "cultural", "Public Speaking, Anchoring, Stage Hosting, Mic Handling", "Passion-oriented student club handling anchoring and stage-hosting responsibilities at Anaadyanta fest.", "https://www.instagram.com/mcnmit/", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("sangharsh_nmit", "Sangharsh NMIT", "cultural", "Dance, Contemporary, Hip-Hop, Group Performance", "NMIT dance team founded in 2014, winners at Mood Indigo IIT Bombay and Pravah St. Josephs.", "https://www.instagram.com/sangharsh_nmit/", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("music_club_nmit", "Music Club NMIT", "cultural", "Singing, Instrumental, Bands, Acoustic, Western & Indian", "Student cultural community for music enthusiasts, performing live acoustic and band shows.", "https://www.instagram.com/music_club_nmit/", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("dop_nmit", "DOP NMIT", "cultural", "Photography, Visual Storytelling, Event Coverage, Documentation", "Department of Photography covering campus festivals, Anaadyanta, and professional student events.", "https://www.instagram.com/dop_nmit/", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs")
    ]
    cursor.executemany(
        "INSERT INTO clubs (club_id, name, category, culture_tags, description, instagram_url, website_url, recruitment_status, source_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        clubs
    )

    # 3. Generating 80 Synthetic Student Profiles
    print("[Seeding] 3. Generating 80 Synthetic NMIT Student Profiles")
    random.seed(42)

    student_rows = []
    skill_rows = []
    interest_rows = []
    goal_rows = []
    privacy_rows = []
    project_rows = []
    membership_rows = []

    for i in range(1, 81):
        s_id = f"nmit_std_{i:03d}"
        first_name = random.choice(INDIAN_FIRST_NAMES)
        last_name = random.choice(INDIAN_LAST_NAMES)
        full_name = f"{first_name} {last_name}"
        program = "B.Tech"
        department = random.choice(DEPARTMENTS)
        year = random.randint(1, 4)
        grad_year = 2026 + (4 - year)
        section = random.choice(["A", "B", "C"])
        email_hash = f"hash_{first_name.lower()}_{i}@nmit.ac.in"
        usn_enc = f"1NT{26-year:02d}CS{i:03d}"
        cgpa = round(random.uniform(7.2, 9.8), 2)
        profile_mode = "searchable" if i <= 75 else "limited"

        student_rows.append((s_id, full_name, "", program, department, year, section, grad_year, email_hash, usn_enc, cgpa, profile_mode))

        # Privacy settings (USN and email private by default)
        privacy_rows.append((s_id, "usn", "private"))
        privacy_rows.append((s_id, "email", "private"))
        privacy_rows.append((s_id, "cgpa", "public" if random.random() > 0.3 else "private"))

        # Skills (2-4 skills per student)
        num_skills = random.randint(2, 4)
        chosen_skills = random.sample(SKILLS_POOL, num_skills)
        for skill in chosen_skills:
            skill_rows.append((s_id, skill, random.choice(["Beginner", "Intermediate", "Advanced"]), "self_reported"))

        # Interests
        t_interest = random.choice(INTERESTS_TECH)
        e_interest = random.choice(INTERESTS_EXTRA)
        interest_rows.append((s_id, t_interest, "technical"))
        interest_rows.append((s_id, e_interest, "extracurricular"))

        # Goal
        goal_text = f"Looking to build an impactful project in {t_interest} and crack upcoming hackathons."
        goal_rows.append((s_id, goal_text, "this_academic_year"))

        # Projects (1 per student)
        p_id = f"proj_{i:03d}"
        p_title = f"{t_interest.split()[0]} {random.choice(['Assistant', 'Detector', 'Tracker', 'Platform', 'Engine'])}"
        p_desc = f"Built a {t_interest} solution using {chosen_skills[0]} and {chosen_skills[1]}."
        project_rows.append((p_id, s_id, p_title, t_interest, ", ".join(chosen_skills), p_desc, 2026))

        # Club Membership
        c_id = random.choice([c[0] for c in clubs])
        membership_rows.append((s_id, c_id, "Member"))

    cursor.executemany("INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))", student_rows)
    cursor.executemany("INSERT INTO student_skills VALUES (?, ?, ?, ?)", skill_rows)
    cursor.executemany("INSERT INTO student_interests VALUES (?, ?, ?)", interest_rows)
    cursor.executemany("INSERT INTO student_goals VALUES (?, ?, ?)", goal_rows)
    cursor.executemany("INSERT INTO privacy_settings VALUES (?, ?, ?)", privacy_rows)
    cursor.executemany("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?)", project_rows)
    cursor.executemany("INSERT INTO club_memberships VALUES (?, ?, ?, datetime('now'))", membership_rows)

    # 4. Generating 25 Synthetic Opportunities
    print("[Seeding] 4. Generating 25 Synthetic Opportunities")
    opp_titles = [
        ("NMIT Hacks 2026 - National 48hr Hackathon", "Hackathon", "React, Python, FastAPI, Databricks", "National level 48-hour hackathon organized by Department of Computer Science & Engineering."),
        ("NMIT AI & Autonomous Drones Research Assistantship", "Research", "Python, OpenCV, PyTorch, ROS2", "Research fellowship under NMIT Robotics Research Centre."),
        ("IDEATHON 6.0 - ENIGMA E-Cell NMIT", "Competition", "UI/UX Design, Flutter, Business Strategy", "Annual innovation and brainstorming competition to solve real-life issues."),
        ("OSCode Open Source Developer Sprint", "Hackathon", "Git, GitHub, Python, Docker", "Collaborative open-source sprint hosted by OSCode NMIT."),
        ("GDG Solution Challenge 2026", "Competition", "Google Tech, GenAI, Android, Flutter", "Global solution challenge building technology for sustainable development goals.")
    ]

    opp_rows = []
    now = datetime.now()
    for idx in range(1, 26):
        template = opp_titles[(idx - 1) % len(opp_titles)]
        o_id = f"opp_{idx:03d}"
        title = f"{template[0]} #{idx}"
        o_type = template[1]
        req_skills = template[2]
        desc = template[3]
        deadline = (now + timedelta(days=random.randint(2, 45))).strftime("%Y-%m-%d %H:%M:%S")
        organizer = random.choice(["ENIGMA E-Cell NMIT", "GDG on Campus NMIT", "OSCode NMIT", "NMIT Hacks", "NMIT Robotics Club"])
        opp_rows.append((o_id, title, o_type, desc, req_skills, "Open to all B.Tech / M.Tech students", deadline, organizer, "https://nitte.edu.in/nmit/", "active", 1))

    cursor.executemany(
        "INSERT INTO opportunities (opp_id, title, type, description, required_skills, eligibility, deadline, organizer, source_url, status, is_synthetic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        opp_rows
    )

    # 5. Populating 10 Official Verified NMIT Alumni Stories & News
    print("[Seeding] 5. Populating 10 Official Verified NMIT Alumni Stories")
    news_rows = [
        ("alumni_balen_shah", "Balen Shah (MTech Structural 2016) — First Independent Mayor of Kathmandu & Nepal Political Leader", "Balendra Shah, an alumnus of NMIT MTech Structural Engineering (2016), became the first independent candidate elected Mayor of Kathmandu, spearheading infrastructure and civic beautification.", "2026-08-10 10:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_mamatha", "Dr. Mamatha Maheshwarappa (ECE 2005) — Payload Systems Lead at UK Space Agency", "Dr. Mamatha Maheshwarappa (B.E. ECE 2005 alumna) serves as the Payload Systems Lead at the UK Space Agency, advancing satellite communication and space systems engineering.", "2026-08-15 11:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_meghashree", "Meghashree D R (CSE 2017) — IAS Officer & District Collector", "Meghashree D R (B.E. CSE 2017 alumna) cracked the Civil Services Examination and serves as an IAS Officer and District Collector in Kerala public administration.", "2026-08-18 09:30:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_aniruddha", "Aniruddha Sastry (CSE 2018) — Playback Singer & Actor in Kannada Film Industry", "Aniruddha Sastry (B.E. CSE 2018 alumnus) built a creative career as a playback singer, actor, music producer, and lyricist in the Kannada cinema industry.", "2026-08-20 14:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_prakash", "Prakash Matada (CSE 2005) — NatGeo Explorer & Wildlife Filmmaker (Planet Earth III)", "Prakash Matada (B.E. CSE 2005 alumnus) is a National Geographic Explorer and Wildscreen-recognized filmmaker whose cinematography was featured on BBC Planet Earth III.", "2026-08-22 16:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_srinidhi", "Srinidhi Sudhindra (Aero 2018) — Wing Design Engineer at Airbus", "Srinidhi Sudhindra (B.E. Aeronautical 2018 alumnus) works as a Wing Design Engineer at Airbus, engineering aircraft structural design and supply-chain systems.", "2026-08-24 10:30:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_shriram", "Shriram (EEE 2012) — Team Lead at ASML & Cisco SVP Award Winner", "Shriram (B.E. EEE 2012 alumnus) leads multidisciplinary semiconductor lithography engineering at ASML and won Cisco's SVP Award for Early Career Excellence.", "2026-08-25 12:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_anirudh", "Anirudh Asokan (2013) — Software Engineer at Google & Tech Entrepreneur", "Anirudh Asokan (2013 alumnus) serves as a Software Engineer at Google and formerly co-founded Havstruck Solutions as CTO.", "2026-08-26 15:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_roshan", "Roshan Sah (Aero 2017) — Space Systems Researcher at TCS Research (25+ Patents)", "Roshan Sah (B.E. Aeronautical 2017 alumnus) conducts space robotics and swirl combustion research at TCS Research with over 25 research papers and patents.", "2026-08-27 11:00:00", "src_nmit_alumni", "Alumni Story"),
        ("alumni_sharath", "Sharath Appaiah (CSE 2009) — Co-Founder of Trebound & Monk Mantra", "Sharath Appaiah (B.E. CSE 2009 alumnus) co-founded Trebound, delivering over 2,000 corporate experiential learning and team-building programs.", "2026-08-28 09:00:00", "src_nmit_alumni", "Alumni Story")
    ]
    cursor.executemany(
        "INSERT INTO campus_news (news_id, headline, body, published_at, source_id, category) VALUES (?, ?, ?, ?, ?, ?)",
        news_rows
    )

    # 6. Generating Synthetic Outcomes for What-If Simulator
    print("[Seeding] 6. Populating 50 Synthetic Outcomes for What-If Simulator")
    outcomes = []
    roles = ["SDE-1", "AI Engineer", "Embedded Hardware Engineer", "Product Designer", "Data Analyst"]
    for j in range(1, 51):
        oc_id = f"out_{j:03d}"
        dept = random.choice(DEPARTMENTS)
        intern_bool = random.choice([0, 1])
        p_count = random.randint(1, 4)
        c_count = random.randint(1, 5)
        role = random.choice(roles)
        hours = random.randint(4, 12)
        outcomes.append((oc_id, dept, intern_bool, p_count, c_count, role, hours, 1))

    cursor.executemany(
        "INSERT INTO student_outcomes (outcome_id, department, internship_bool, project_count, cert_count, placement_role, avg_hours_per_week, is_synthetic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        outcomes
    )

    conn.commit()
    conn.close()
    print("[Seeding] SUCCESS: Databricks Unity Catalog local database updated with Official NMIT Alumni & Featured Clubs!")

if __name__ == "__main__":
    seed_database()
