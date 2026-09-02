import os
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Header, HTTPException
from typing import Optional, List
from app.models.genie_chat import ChatMessageRequest, ChatMessageResponse, ResourceCard, WhatIfComparisonCard
from app.services.auth_service import get_student_id_from_token
from app.services.genie_engine import process_genie_chat

router = APIRouter(prefix="/api/genie", tags=["Genie Chat Centerpiece"])

LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "logs", "conversations.jsonl")

def log_conversation_turn(conv_id: str, student_id: str, mode: str, user_msg: str, bot_reply: str):
    """Logs conversation turns for QA in Batch 9 without private plaintext fields."""
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    entry = {
        "timestamp": datetime.now().isoformat(),
        "conversation_id": conv_id,
        "student_id": student_id,
        "mode": mode,
        "user_message": user_msg,
        "bot_reply": bot_reply
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_genie(payload: ChatMessageRequest, authorization: Optional[str] = Header(None)):
    student_id = "nmit_std_001"
    if authorization:
        token = authorization.replace("Bearer ", "")
        extracted = get_student_id_from_token(token)
        if extracted:
            student_id = extracted

    conv_id = payload.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"

    res = process_genie_chat(payload.mode, payload.message, student_id)

    # Log turn for Batch 9 QA
    log_conversation_turn(conv_id, student_id, payload.mode, payload.message, res["reply"])

    resource_cards = [ResourceCard(**c) for c in res.get("resource_cards", [])]
    whatif_card = WhatIfComparisonCard(**res["whatif_card"]) if res.get("whatif_card") else None

    return ChatMessageResponse(
        success=True,
        mode=payload.mode,
        conversation_id=conv_id,
        reply=res["reply"],
        routing_suggestion=res.get("routing_suggestion"),
        resource_cards=resource_cards,
        whatif_card=whatif_card,
        source_url=res.get("source_url", "")
    )

@router.get("/prompts/{mode}")
def get_example_prompts(mode: str):
    prompts = {
        "general": [
            "Where is the Innovation Block at NMIT?",
            "What is the highest package offered in placements this year?",
            "What clubs are recruiting right now?",
            "Tell me the story of notable NMIT alumni.",
            "I need a React and Python developer for SIH"
        ],
        "academic": [
            "Which professor works on computer vision?",
            "Where can I find the 3rd-year CSE syllabus and exam timetable?",
            "Show me research lab opportunities in aerospace and robotics.",
            "How do I access the NMIT central library digital portal?"
        ],
        "whatif": [
            "What if I spend 8 hours/week on research instead of another club?",
            "What if I switch focus from web dev to AI/ML?",
            "What if I build an SIH hackathon project with a multidisciplinary team?",
            "What if I join two clubs in my 2nd year?"
        ]
    }
    return {"mode": mode, "prompts": prompts.get(mode, prompts["general"])}
