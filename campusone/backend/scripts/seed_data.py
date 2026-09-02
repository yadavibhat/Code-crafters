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
        ("src_nmit_alumni", "https://nitte.edu.in/nmit/alumni.php", "NMIT Alumni Spotlight", "news_feed", "verified", "Alumni", "alumni")
    ]
    cursor.executemany(
        "INSERT INTO source_registry (source_id, source_url, source_title, source_type, trust_level, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        sources
    )

    # 2. Populating Real NMIT Clubs
    print("[Seeding] 2. Populating NMIT Real Co-curricular Clubs")
    clubs = [
        ("club_ncc", "NCC NMIT Wing", "social_impact", "Leadership, Discipline, Parade, Social Service", "National Cadet Corps unit at NMIT.", "https://instagram.com/ncc_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("club_nss", "NSS NMIT Unit", "social_impact", "Community Service, Blood Donation, Environment", "National Service Scheme driving campus social impact.", "https://instagram.com/nss_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("club_rotaract", "Rotaract Club of NMIT", "social_impact", "Youth Leadership, Event Organizing, Service", "Rotary youth wing promoting community development.", "https://instagram.com/rotaract_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("club_chiguru", "Chiguru Cultural Forum", "cultural", "Kannada Literature, Folk Dance, Heritage", "NMIT cultural forum celebrating regional heritage.", "https://instagram.com/chiguru_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("club_anaadyanta", "Anaadyanta Fest Committee", "cultural", "Music, Dance, Fashion, Fest Management", "Annual national cultural fest organization team.", "https://instagram.com/anaadyanta_nmit", "https://nitte.edu.in/nmit/", "upcoming", "src_nmit_clubs"),
        ("club_ecell", "E-Cell NMIT", "competitive", "Entrepreneurship, Startups, Pitching, Incubation", "NMIT Innovation & Entrepreneurship Development Cell.", "https://instagram.com/ecell_nmit", "https://ecellnmit.in", "open", "src_nmit_clubs"),
        ("club_robotics", "NMIT Robotics Club", "technical", "ROS2, Embedded Systems, Drones, Hardware", "Student hardware and robotics research collective.", "https://instagram.com/robotics_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs"),
        ("club_ai", "NMIT AI & Data Guild", "technical", "Machine Learning, LLMs, Computer Vision, Kaggle", "Technical club focused on applied AI projects.", "https://instagram.com/ai_nmit", "https://nitte.edu.in/nmit/", "open", "src_nmit_clubs")
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
        ("Smart India Hackathon (SIH 2026) - NMIT Internal Round", "Hackathon", "React, Python, FastAPI, Databricks", "Smart India Hackathon national competition team selection."),
        ("NMIT AI & Autonomous Drones Research Assistantship", "Research", "Python, OpenCV, PyTorch, ROS2", "Research fellowship under NMIT Robotics Research Centre."),
        ("E-Cell Pitch Fest 2026", "Competition", "UI/UX Design, Flutter, Python", "Annual NMIT pitch competition with incubation prizes."),
        ("Campus Cloud Computing Internship", "Internship", "Docker, Kubernetes, Git, SQL", "Hands-on cloud infrastructure assistant role."),
        ("Embedded Systems & IoT Hardware Challenge", "Hackathon", "Embedded C, Arduino, ROS2", "Hardware buildathon organized by NMIT Robotics Club.")
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
        organizer = random.choice(["E-Cell NMIT", "NMIT Robotics Club", "Dept of CSE", "Dept of AI&DS"])
        opp_rows.append((o_id, title, o_type, desc, req_skills, "Open to all B.Tech / M.Tech students", deadline, organizer, "https://nitte.edu.in/nmit/", "active", 1))

    cursor.executemany(
        "INSERT INTO opportunities (opp_id, title, type, description, required_skills, eligibility, deadline, organizer, source_url, status, is_synthetic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        opp_rows
    )

    # 5. Populating Verified NMIT Campus News & Alumni Stories
    print("[Seeding] 5. Populating Campus News & Alumni Stories")
    news_rows = [
        ("news_001", "NMIT Alumna Dr. Mamatha Maheshwarappa Leads UK Space Agency Payload Systems", "Dr. Mamatha Maheshwarappa (B.E. ECE alumna) serves as the Payload Systems Lead at the UK Space Agency, inspiring aerospace and satellite engineering research at NMIT.", "2026-08-15 10:00:00", "src_nmit_alumni", "Alumni Story"),
        ("news_002", "Balen Shah (NMIT M.Tech 2016) Appointed Prime Minister of Nepal", "Balen Shah, an alumnus of NMIT M.Tech Structural Engineering (2016) and former Mayor of Kathmandu, continues to make national leadership strides.", "2026-08-20 12:00:00", "src_nmit_alumni", "Alumni Story"),
        ("news_003", "NMIT Placement Drive Reaches Peak Package of ₹58.93 LPA", "Over 300 companies visited NMIT Bengaluru this season, offering over 1200 jobs with a highest package of ₹58.93 LPA.", "2026-08-28 09:00:00", "src_nmit_placements", "Placement News")
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
    print("[Seeding] SUCCESS: Databricks Unity Catalog local database seeded successfully!")

if __name__ == "__main__":
    seed_database()
