from typing import List, Dict, Any

def generate_good_for_you_if(club: Dict[str, Any], student_skills: List[str], student_interests: List[str]) -> str:
    """Generates a personalized 'Good for you if...' line for student profile alignment."""
    club_name = club.get("name", "")
    category = club.get("category", "")
    culture_tags = [t.strip().lower() for t in (club.get("culture_tags") or "").split(",")]
    std_skills = [s.strip().lower() for s in student_skills]
    std_interests = [i.strip().lower() for i in student_interests]

    # Specific club rules
    if "hacks" in club_name.lower():
        if "react" in std_skills or "python" in std_skills:
            return "Good for you if... you want to build 48-hour hackathon prototypes and compete nationally."
        return "Good for you if... you want to dive into hackathon culture, rapid prototyping, and industry mentorship."

    if "ecell" in club_name.lower() or "enigma" in club_name.lower():
        return "Good for you if... you want to turn your project ideas into an IDEATHON startup pitch."

    if "gdg" in club_name.lower():
        return "Good for you if... you want hands-on Google GenAI workshops and competitive Codesprint events."

    if "oscode" in club_name.lower():
        return "Good for you if... you want to contribute to open-source Git repositories and software dev."

    if "music" in club_name.lower():
        if any(i in ['music & band', 'singing', 'instrumental'] for i in std_interests):
            return "Good for you if... you play acoustic instruments or want to perform live in NMIT campus bands."
        return "Good for you if... you love acoustic jam sessions and live fest performances."

    if "sangharsh" in club_name.lower() or "dance" in club_name.lower():
        return "Good for you if... you are into group dance, hip-hop, and competing at inter-collegiate cultural fests."

    if "dop" in club_name.lower() or "photography" in club_name.lower():
        return "Good for you if... you love visual storytelling, camera gear, and covering Anaadyanta fest events."

    if "mc" in club_name.lower() or "anchoring" in club_name.lower():
        return "Good for you if... you want to master public speaking, stage hosting, and audience mic handling."

    # General category fallback
    if category == "technical":
        return "Good for you if... you are looking for hands-on technical workshops and collaborative peer builds."
    elif category == "cultural":
        return "Good for you if... you want to express creative talents and showcase work at campus cultural fests."
    else:
        return "Good for you if... you care about leadership development, social impact, and community service."

def ask_genie_about_club(club: Dict[str, Any], question: str) -> str:
    """Answers a Genie question scoped to a single club's verified data without hallucination."""
    q_lower = question.lower()
    club_name = club.get("name", "")
    desc = club.get("description", "")
    status = club.get("recruitment_status", "open")
    insta = club.get("instagram_url", "")
    web = club.get("website_url", "")

    if "recruit" in q_lower or "join" in q_lower or "open" in q_lower:
        return f"{club_name} recruitment status is currently **{status.upper()}**. You can check official updates on their Instagram page: {insta}"

    if "event" in q_lower or "activity" in q_lower or "hackathon" in q_lower or "fest" in q_lower:
        return f"{club_name} organizes major campus activities including workshops, hackathons, and fest performances as described: '{desc}'"

    if "member" in q_lower or "count" in q_lower or "many students" in q_lower:
        # Strict anti-hallucination rule: Do NOT invent unverified exact numbers!
        return f"{club_name} is an active NMIT organization. Exact verified student roster counts are maintained via institutional registration. Check official link: {web}"

    if "website" in q_lower or "instagram" in q_lower or "link" in q_lower:
        return f"Official links for {club_name} — Website: {web} | Instagram: {insta}"

    # Default scoped response
    return f"{club_name} ({club.get('category', 'Club')}): '{desc}' Visit official portal: {web}"
