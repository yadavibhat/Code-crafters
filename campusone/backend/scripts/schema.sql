-- ============================================================================
-- CampusOne Databricks Unity Catalog Schema & DDL Blueprint
-- Catalog: campusone | Schema: core
-- Compatible with Databricks Free Edition, Serverless SQL & Delta Lake
-- ============================================================================

CREATE CATALOG IF NOT EXISTS campusone;
USE CATALOG campusone;
CREATE SCHEMA IF NOT EXISTS core;
USE SCHEMA core;

-- 1. Source Registry (Verified institutional sources & citations)
CREATE TABLE IF NOT EXISTS campusone.core.source_registry (
    source_id VARCHAR(64) NOT NULL PRIMARY KEY,
    source_url VARCHAR(512) NOT NULL,
    source_title VARCHAR(256) NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- official_website | social_media | news_feed | academic_portal
    published_at TIMESTAMP,
    retrieved_at TIMESTAMP,
    trust_level VARCHAR(32) NOT NULL, -- verified | user_generated | synthetic
    entity_type VARCHAR(64),
    entity_id VARCHAR(64)
);

-- 2. Students (Core Identity)
CREATE TABLE IF NOT EXISTS campusone.core.students (
    student_id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    photo_url VARCHAR(512),
    program VARCHAR(64) NOT NULL, -- B.Tech | M.Tech | MBA | MCA | Ph.D
    department VARCHAR(128) NOT NULL, -- CSE | ISE | AI&DS | AI&ML | ECE | EEE | Mech | Aero | Civil | Robotics
    year INT NOT NULL, -- 1 | 2 | 3 | 4
    section VARCHAR(10),
    grad_year INT NOT NULL,
    email_hash VARCHAR(128) NOT NULL, -- Encrypted/hashed email for session auth
    usn_encrypted VARCHAR(128) NOT NULL, -- Encrypted USN (Private by default)
    cgpa FLOAT, -- Opt-in visible
    profile_mode VARCHAR(32) NOT NULL, -- searchable | limited | private
    created_at TIMESTAMP
);

-- 3. Student Skills (Tagged capabilities)
CREATE TABLE IF NOT EXISTS campusone.core.student_skills (
    student_id VARCHAR(64) NOT NULL,
    skill VARCHAR(64) NOT NULL,
    proficiency VARCHAR(32), -- Beginner | Intermediate | Advanced
    source VARCHAR(32),
    PRIMARY KEY (student_id, skill),
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 4. Student Interests (Technical & Extracurricular)
CREATE TABLE IF NOT EXISTS campusone.core.student_interests (
    student_id VARCHAR(64) NOT NULL,
    interest VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL, -- technical | extracurricular
    PRIMARY KEY (student_id, interest),
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 5. Student Goals (Short/Medium term targets)
CREATE TABLE IF NOT EXISTS campusone.core.student_goals (
    student_id VARCHAR(64) NOT NULL,
    goal_text TEXT NOT NULL,
    horizon VARCHAR(32), -- immediate | this_semester | long_term
    PRIMARY KEY (student_id, goal_text),
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 6. Privacy Settings (Per-field visibility enforcement)
CREATE TABLE IF NOT EXISTS campusone.core.privacy_settings (
    student_id VARCHAR(64) NOT NULL,
    field_name VARCHAR(64) NOT NULL, -- usn | email | cgpa | skills | interests | projects
    visibility VARCHAR(32) NOT NULL, -- public | nmit_only | connections | private
    PRIMARY KEY (student_id, field_name),
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 7. Projects (Student project portfolio)
CREATE TABLE IF NOT EXISTS campusone.core.projects (
    project_id VARCHAR(64) NOT NULL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    domain VARCHAR(64) NOT NULL,
    skills_used VARCHAR(256),
    description TEXT,
    year INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 8. Clubs (NMIT Co-curricular & Technical organizations)
CREATE TABLE IF NOT EXISTS campusone.core.clubs (
    club_id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- technical | cultural | social_impact | sports | competitive
    culture_tags VARCHAR(256),
    description TEXT,
    instagram_url VARCHAR(256),
    website_url VARCHAR(256),
    recruitment_status VARCHAR(32), -- open | closed | upcoming
    source_id VARCHAR(64),
    FOREIGN KEY (source_id) REFERENCES campusone.core.source_registry(source_id)
);

-- 9. Club Memberships
CREATE TABLE IF NOT EXISTS campusone.core.club_memberships (
    student_id VARCHAR(64) NOT NULL,
    club_id VARCHAR(64) NOT NULL,
    role VARCHAR(64), -- Lead | Core Member | Member
    joined_at TIMESTAMP,
    PRIMARY KEY (student_id, club_id),
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id),
    FOREIGN KEY (club_id) REFERENCES campusone.core.clubs(club_id)
);

-- 10. Club Posts (Activity updates & photos)
CREATE TABLE IF NOT EXISTS campusone.core.club_posts (
    post_id VARCHAR(64) NOT NULL PRIMARY KEY,
    club_id VARCHAR(64) NOT NULL,
    author_id VARCHAR(64) NOT NULL,
    caption TEXT NOT NULL,
    image_url VARCHAR(512),
    posted_at TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES campusone.core.clubs(club_id),
    FOREIGN KEY (author_id) REFERENCES campusone.core.students(student_id)
);

-- 11. Opportunities (SIH, Hackathons, Internships, Research)
CREATE TABLE IF NOT EXISTS campusone.core.opportunities (
    opp_id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL, -- Hackathon | Internship | Research | Competition | Project
    description TEXT NOT NULL,
    required_skills VARCHAR(256) NOT NULL,
    eligibility VARCHAR(128),
    deadline TIMESTAMP NOT NULL,
    organizer VARCHAR(128) NOT NULL,
    source_url VARCHAR(512),
    status VARCHAR(32), -- active | closed
    is_synthetic BOOLEAN
);

-- 12. Events (Campus activities & fest events)
CREATE TABLE IF NOT EXISTS campusone.core.events (
    event_id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    club_id VARCHAR(64),
    date TIMESTAMP NOT NULL,
    location VARCHAR(128) NOT NULL,
    description TEXT,
    source_id VARCHAR(64),
    FOREIGN KEY (club_id) REFERENCES campusone.core.clubs(club_id),
    FOREIGN KEY (source_id) REFERENCES campusone.core.source_registry(source_id)
);

-- 13. Campus News (Institutional announcements & alumni stories)
CREATE TABLE IF NOT EXISTS campusone.core.campus_news (
    news_id VARCHAR(64) NOT NULL PRIMARY KEY,
    headline VARCHAR(256) NOT NULL,
    body TEXT NOT NULL,
    published_at TIMESTAMP NOT NULL,
    source_id VARCHAR(64),
    category VARCHAR(64), -- Announcement | Alumni Story | Placement News | Fest
    FOREIGN KEY (source_id) REFERENCES campusone.core.source_registry(source_id)
);

-- 14. Academic Resources (Syllabus, exam links, research labs)
CREATE TABLE IF NOT EXISTS campusone.core.academic_resources (
    resource_id VARCHAR(64) NOT NULL PRIMARY KEY,
    department VARCHAR(128) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL, -- Syllabus | Exam Schedule | Research Lab | Faculty Profile
    url VARCHAR(512) NOT NULL,
    source_id VARCHAR(64),
    FOREIGN KEY (source_id) REFERENCES campusone.core.source_registry(source_id)
);

-- 15. Connections (Student peer network)
CREATE TABLE IF NOT EXISTS campusone.core.connections (
    from_id VARCHAR(64) NOT NULL,
    to_id VARCHAR(64) NOT NULL,
    status VARCHAR(32), -- pending | accepted | declined
    created_at TIMESTAMP,
    PRIMARY KEY (from_id, to_id),
    FOREIGN KEY (from_id) REFERENCES campusone.core.students(student_id),
    FOREIGN KEY (to_id) REFERENCES campusone.core.students(student_id)
);

-- 16. Feedback (Inline recommendation signal tuning)
CREATE TABLE IF NOT EXISTS campusone.core.feedback (
    feedback_id VARCHAR(64) NOT NULL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    target_type VARCHAR(32) NOT NULL, -- student | opportunity | club
    target_id VARCHAR(64) NOT NULL,
    signal VARCHAR(32) NOT NULL, -- more_like_this | less_like_this
    created_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES campusone.core.students(student_id)
);

-- 17. Student Outcomes (Aggregated outcome graph for What-If simulator)
CREATE TABLE IF NOT EXISTS campusone.core.student_outcomes (
    outcome_id VARCHAR(64) NOT NULL PRIMARY KEY,
    department VARCHAR(128) NOT NULL,
    internship_bool BOOLEAN,
    project_count INT,
    cert_count INT,
    placement_role VARCHAR(128),
    avg_hours_per_week INT,
    is_synthetic BOOLEAN
);


-- ============================================================================
-- 5 GOVERNED SEMANTIC VIEWS FOR DATABRICKS GENIE AGENT
-- ============================================================================

-- View 1: v_people_search (Privacy-governed search view: USN, raw email, and private CGPA are EXCLUDED)
DROP VIEW IF EXISTS campusone.core.v_people_search;
CREATE VIEW campusone.core.v_people_search AS
SELECT 
    s.student_id,
    s.name,
    s.photo_url,
    s.program,
    s.department,
    s.year,
    s.section,
    s.grad_year,
    s.profile_mode,
    CASE 
        WHEN ps.visibility = 'public' OR ps.visibility IS NULL THEN s.cgpa 
        ELSE NULL 
    END AS visible_cgpa,
    CONCAT_WS(',', COLLECT_SET(sk.skill)) AS skills_list,
    CONCAT_WS(',', COLLECT_SET(si.interest)) AS interests_list,
    CONCAT_WS(',', COLLECT_SET(p.title)) AS projects_list,
    CONCAT_WS(',', COLLECT_SET(c.name)) AS clubs_list
FROM campusone.core.students s
LEFT JOIN campusone.core.student_skills sk ON s.student_id = sk.student_id
LEFT JOIN campusone.core.student_interests si ON s.student_id = si.student_id
LEFT JOIN campusone.core.projects p ON s.student_id = p.student_id
LEFT JOIN campusone.core.club_memberships cm ON s.student_id = cm.student_id
LEFT JOIN campusone.core.clubs c ON cm.club_id = c.club_id
LEFT JOIN campusone.core.privacy_settings ps ON s.student_id = ps.student_id AND ps.field_name = 'cgpa'
WHERE s.profile_mode != 'private'
GROUP BY s.student_id, s.name, s.photo_url, s.program, s.department, s.year, s.section, s.grad_year, s.profile_mode, visible_cgpa;

-- View 2: v_opportunity_fit (Opportunities with required skills and metadata)
DROP VIEW IF EXISTS campusone.core.v_opportunity_fit;
CREATE VIEW campusone.core.v_opportunity_fit AS
SELECT 
    o.opp_id,
    o.title,
    o.type,
    o.description,
    o.required_skills,
    o.eligibility,
    o.deadline,
    o.organizer,
    o.source_url,
    o.status,
    o.is_synthetic,
    COUNT(DISTINCT cm.student_id) AS total_interested_students
FROM campusone.core.opportunities o
LEFT JOIN campusone.core.student_skills sk ON INSTR(LOWER(o.required_skills), LOWER(sk.skill)) > 0
LEFT JOIN campusone.core.students cm ON sk.student_id = cm.student_id
WHERE o.status = 'active'
GROUP BY o.opp_id, o.title, o.type, o.description, o.required_skills, o.eligibility, o.deadline, o.organizer, o.source_url, o.status, o.is_synthetic;

-- View 3: v_club_culture (Verified clubs, tags, recruitment status, official URLs, and recent posts)
DROP VIEW IF EXISTS campusone.core.v_club_culture;
CREATE VIEW campusone.core.v_club_culture AS
SELECT 
    c.club_id,
    c.name,
    c.category,
    c.culture_tags,
    c.description,
    c.instagram_url,
    c.website_url,
    c.recruitment_status,
    sr.trust_level,
    sr.source_url AS official_source_url,
    COUNT(DISTINCT cm.student_id) AS member_count,
    COUNT(DISTINCT cp.post_id) AS total_posts
FROM campusone.core.clubs c
LEFT JOIN campusone.core.source_registry sr ON c.source_id = sr.source_id
LEFT JOIN campusone.core.club_memberships cm ON c.club_id = cm.club_id
LEFT JOIN campusone.core.club_posts cp ON c.club_id = cp.club_id
GROUP BY c.club_id, c.name, c.category, c.culture_tags, c.description, c.instagram_url, c.website_url, c.recruitment_status, sr.trust_level, sr.source_url;

-- View 4: v_whatif_patterns (Anonymized, aggregate outcome patterns for What-If simulator)
DROP VIEW IF EXISTS campusone.core.v_whatif_patterns;
CREATE VIEW campusone.core.v_whatif_patterns AS
SELECT 
    department,
    AVG(project_count) AS avg_projects,
    AVG(cert_count) AS avg_certifications,
    AVG(avg_hours_per_week) AS avg_weekly_hours,
    ROUND(SUM(CASE WHEN internship_bool THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS internship_rate_pct,
    placement_role,
    COUNT(*) AS sample_size,
    1 AS is_synthetic_estimate
FROM campusone.core.student_outcomes
GROUP BY department, placement_role;

-- View 5: v_campus_digest (Source-attributed campus news & events feed)
DROP VIEW IF EXISTS campusone.core.v_campus_digest;
CREATE VIEW campusone.core.v_campus_digest AS
SELECT 
    n.news_id AS item_id,
    'news' AS item_type,
    n.headline AS title,
    n.body AS content,
    n.published_at AS event_date,
    n.category,
    sr.source_title,
    sr.source_url,
    sr.trust_level
FROM campusone.core.campus_news n
LEFT JOIN campusone.core.source_registry sr ON n.source_id = sr.source_id

UNION ALL

SELECT 
    e.event_id AS item_id,
    'event' AS item_type,
    e.title AS title,
    e.description AS content,
    e.date AS event_date,
    'Club Event' AS category,
    sr.source_title,
    sr.source_url,
    sr.trust_level
FROM campusone.core.events e
LEFT JOIN campusone.core.source_registry sr ON e.source_id = sr.source_id;
