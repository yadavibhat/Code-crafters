import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib import colors

def generate_pdf():
    pdf_path = "/Users/yadavibhat/Downloads/CampusOne/CampusOne_Master_Specification_and_Prompts.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY_COLOR = colors.HexColor("#1E3A8A")   # NMIT Deep Accent Blue
    DARK_TEXT = colors.HexColor("#0B0B0C")       # Primary Black Text
    SECONDARY_TEXT = colors.HexColor("#5B5F66")  # Muted Secondary Gray
    BORDER_COLOR = colors.HexColor("#E4E4E7")    # Light Neutral Border
    BG_LIGHT = colors.HexColor("#F4F4F5")        # Surface Color

    # Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY_COLOR,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=12,
        leading=16,
        textColor=SECONDARY_TEXT,
        spaceAfter=16
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY_COLOR,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=DARK_TEXT,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#111827"),
        backColor=BG_LIGHT,
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=8
    )

    story = []

    # Title & Header
    story.append(Paragraph("CampusOne — Master Specification & Prompt Engineering Book", title_style))
    story.append(Paragraph("Nitte Meenakshi Institute of Technology (NMIT) Bengaluru | Databricks Genie Hackathon 2026", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_COLOR, spaceAfter=12))

    # Section 1: Executive Summary & Hackathon Theme Alignment
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(Paragraph(
        "CampusOne is the definitive AI-native student intelligence platform engineered specifically for <b>Nitte Meenakshi Institute of Technology (NMIT)</b>, Bengaluru. Built on top of <b>Databricks Free Edition</b> and driven by a multi-mode <b>Databricks Genie Agent</b> over Unity Catalog governed Delta tables, CampusOne solves the chronic campus discovery barrier faced by students in crisis: finding project collaborators across 10 engineering departments, navigating SIH hackathon team assembly, discovering co-curricular clubs, and seeking data-backed academic guidance.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Theme Alignment:</b> Genie-Powered Campus Intelligence (Bengaluru Tech Week / Databricks Hackathon 2026). CampusOne combines real institutional facts (NMIT official alumni, verified clubs, placement stats) with 80+ synthetic student profiles to deliver a data-informed 'What-If?' simulator, natural language team matching, and source-linked campus news.",
        body_style
    ))

    # Section 2: NanoBanana Logo Generation Prompt
    story.append(Paragraph("2. NanoBanana Logo Generation Prompt", h1_style))
    story.append(Paragraph("Use the exact prompt below in <b>NanoBanana / Midjourney / DALL-E 3</b> to generate the official minimalist logo icon for CampusOne:", body_style))
    story.append(Paragraph(
        "Minimalist vector logo for 'CampusOne', an AI-native university intelligence platform for Nitte Meenakshi Institute of Technology (NMIT). Abstract geometric combination of a stylized letter 'C' intertwined with a single solid numeral '1', integrated with a subtle glowing neural node network spark. Colors: Deep Navy Blue (#1E3A8A), Verified Teal (#0F766E), and Charcoal (#0B0B0C) on a clean, solid pure white background (#FFFFFF). Flat vector design, modern SaaS app icon style, zero gradients, 8k resolution, crisp vector contours, ultra-clean UI branding --no 3d, realistic photos, mockups, shadows.",
        code_style
    ))

    # Section 3: Feature Architecture & UI Placement Map
    story.append(Paragraph("3. Feature Architecture & UI Placement Map", h1_style))
    feature_data = [
        [Paragraph("<b>Feature Name</b>", body_style), Paragraph("<b>Core Value & Description</b>", body_style), Paragraph("<b>UI Location</b>", body_style)],
        [
            Paragraph("<b>F1: Mandatory Onboarding & Identity</b>", body_style),
            Paragraph("Simple OTP authentication restricted to <code>@nitte.edu.in</code> or <code>@nmit.ac.in</code>. Multi-step wizard capturing skills, interests, goals, and granular field-level privacy controls.", body_style),
            Paragraph("<code>/login</code> & <code>/onboarding</code>", body_style)
        ],
        [
            Paragraph("<b>F2: Find My People (NL Search)</b>", body_style),
            Paragraph("Natural language semantic search powered by <code>v_people_search</code> view. Returns student cards with transparent WhyMatch chips (e.g. <i>'Matching skills: PyTorch + Shared interest: Drones'</i>).", body_style),
            Paragraph("<code>/people</code>", body_style)
        ],
        [
            Paragraph("<b>F3: Opportunities & Team Assembly</b>", body_style),
            Paragraph("Hackathons (SIH 2026), research assistantships, and internships with Genie Fit Scores. Includes 'Build My Team' constraint solver assembling 3–5 balanced student teams with skill coverage checklist and gap callout.", body_style),
            Paragraph("<code>/opportunities</code> & <code>/opportunities/:id</code>", body_style)
        ],
        [
            Paragraph("<b>F4: Clubs & Culture Wall</b>", body_style),
            Paragraph("Co-curricular directory (NMIT Hacks, GDG on Campus, E-Cell NMIT, etc.) with verified Instagram/website links, photo post feeds, recruitment badges, and personalized <i>'Good for you if...'</i> recommendation chips.", body_style),
            Paragraph("<code>/clubs</code> & <code>/clubs/:id</code>", body_style)
        ],
        [
            Paragraph("<b>F5: Campus Digest & Alumni Stories</b>", body_style),
            Paragraph("Editorial news feed in Source Serif 4 typography featuring real NMIT announcements and 10 verified alumni (Kathmandu Mayor Balen Shah, UK Space Agency Lead Dr. Mamatha, etc.) with direct <code>nitte.edu.in</code> source links.", body_style),
            Paragraph("<code>/stories</code>", body_style)
        ],
        [
            Paragraph("<b>F6–F8: Universal Genie Agent</b>", body_style),
            Paragraph("Multi-mode conversational AI (General Q&A / Academic Guidance / What-If Simulator). Features prompt-injection defense, structured card rendering, and mandatory estimate disclaimer footnotes.", body_style),
            Paragraph("<code>/genie</code>", body_style)
        ],
        [
            Paragraph("<b>F9–F10: Scannable Home & Feedback</b>", body_style),
            Paragraph("7-tier scannable homepage with urgent action banner, capped recommendation strips (max 3 items), and <code>👍 More / 👎 Less like this</code> feedback affordances.", body_style),
            Paragraph("<code>/</code> (Home)", body_style)
        ]
    ]

    t = Table(feature_data, colWidths=[130, 290, 120])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # Section 4: Implementation Plan & Prompts in 10 Batches
    story.append(Paragraph("4. Implementation Plan & Prompts in 10 Batches", h1_style))

    batches = [
        ("Batch 0 — Foundation & Repository Scaffolding",
         "Scaffold React+TS+Vite frontend and FastAPI backend with strict ESLint, Prettier, folder structure, .env.example, and /health endpoint.",
         "Create a production Vite+React+TS app in campusone/frontend with strict tsconfig, Inter font, and a FastAPI app in campusone/backend with CORS and /health endpoint."),

        ("Batch 1 — Design System & Shared Components",
         "Build core design tokens in tokens.css (#FFFFFF, #0B0B0C, #1E3A8A, Inter, Source Serif 4) and 13 UI components (Button, Card, Avatar, Badge, Input, TextArea, TagInput, Modal, Tabs, NavBar, EmptyState, LoadingState, ErrorState).",
         "Build reusable design tokens and UI components in frontend/src/components/ui ensuring 0 hardcoded hex codes outside tokens.css and clean mobile responsive collapse."),

        ("Batch 2 — Databricks Free Edition Data Layer & Seeding",
         "Write schema.sql for Unity Catalog catalog campusone schema core with 17 Delta tables and 5 governed semantic views. Seed verified NMIT facts (10 alumni, 8 clubs) and 80 synthetic student profiles via seed_data.py.",
         "Create schema.sql and seed_data.py creating Unity Catalog views v_people_search, v_opportunity_fit, v_club_culture, v_whatif_patterns, v_campus_digest with fallback SQLite support."),

        ("Batch 3 — CampusOne Identity, Auth & Privacy (F1)",
         "Implement session auth for @nitte.edu.in emails, 7-step mandatory onboarding wizard, and server-side privacy enforcement popping usn_encrypted and email_hash for non-owners.",
         "Build backend routers auth.py & profile.py and frontend pages Login.tsx, Onboarding.tsx, ProfileEdit.tsx, ProfileView.tsx with strict field-level privacy masking."),

        ("Batch 4 — Find My People & Team Assembly (F2 + F3)",
         "Build /genie/people-search with natural language query parsing and transparent why_match chips. Build /opportunities/:id/build-team constraint solver proposing 3-5 distinct members with skill coverage checklist.",
         "Implement genie_service.py, team_builder.py, /people search UI, OpportunityDetail.tsx team modal, and /connections API."),

        ("Batch 5 — Opportunities Hub & Fit Scorer (F3 continued)",
         "Build /opportunities list endpoint with Genie fit calculation (65% skill overlap + 20% interest bonus + 15% dept relevance). Add deadline urgency visual treatment (< 72h warning badge) and verified vs synthetic badging.",
         "Implement fit_scorer.py, opportunities.py router, OpportunitiesList.tsx with type filter pills, and OpportunityDetail.tsx with official nitte.edu.in link out."),

        ("Batch 6 — Clubs & Culture Wall (F4)",
         "Build /clubs list with culture tags and personalized 'Good for you if...' lines. Build /clubs/:id with post feed, official Instagram/website links, and pinned '/genie/ask-club/:id' Q&A input box.",
         "Implement club_service.py, clubs.py router, ClubsDirectory.tsx, and ClubDetail.tsx with anti-hallucination scoping for unverified member counts."),

        ("Batch 7 — Genie Centerpiece: Universal, Academic, What-If (F6+F7+F8)",
         "Build multi-mode /genie/chat endpoint (General / Academic / What-If). Implement 3-vector prompt injection defense (stripping malicious control vectors), inline routing to People Search, and What-If comparison card with estimate disclaimer footnote.",
         "Implement genie_engine.py, genie_chat.py router, and GenieChat.tsx with 3 mode tabs, example prompt chips, and conversation turn logging."),

        ("Batch 8 — Campus Pulse, Recommendations & Digest (F9+F10+F5)",
         "Build /home aggregation endpoint (urgent item waterfall P1->P2->P3, top 3 people, top 3 opps, 1 pulse, 1 story). Build /feedback endpoint for more/less signals and /stories Campus Digest styled in Source Serif 4.",
         "Implement home_service.py, home_digest.py router, scannable Home.tsx, and editorial Stories.tsx with nitte.edu.in source links."),

        ("Batch 9 — QA, Privacy & Hardening",
         "Run automated test suite (run_full_qa.py) verifying happy path, empty states, contradiction resolution, privacy boundaries, stale source dates, synthetic badging, 3-vector prompt injections, and 10-question anti-hallucination benchmark.",
         "Build run_full_qa.py and execute 11-category audit matrix to guarantee 100% test coverage and zero privacy leaks before deployment."),

        ("Batch 10 — Deployment & Demo Packaging",
         "Create DEPLOY.md guide for 20-minute stack reproduction, literal 90-second DEMO_SCRIPT.md timeline, fallback recording archive, and final visual palette hex audit.",
         "Package production bundle via npm run build, write DEPLOY.md and DEMO_SCRIPT.md, and push commit 'deployed campusone platform' to GitHub.")
    ]

    for title, desc, prompt_text in batches:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Paragraph(f"<b>Executable Agent Prompt:</b><br/><code>{prompt_text}</code>", code_style))

    # Build PDF
    doc.build(story)
    print(f"PDF Specification Document successfully generated at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
