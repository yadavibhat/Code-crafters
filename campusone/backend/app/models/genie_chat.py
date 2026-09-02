from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class ChatMessageRequest(BaseModel):
    mode: str = Field(..., example="general") # general | academic | whatif
    message: str = Field(..., example="Where is the Innovation Block at NMIT?")
    conversation_id: Optional[str] = None

class ResourceCard(BaseModel):
    title: str
    department: str
    type: str
    url: str

class WhatIfComparisonCard(BaseModel):
    scenario: str
    current_metrics: Dict[str, Any]
    projected_metrics: Dict[str, Any]
    assumptions: List[str] = []
    trade_offs: List[str] = []
    disclaimer: str = "Note: This is a data-informed estimate based on historical and synthetic campus patterns, not a guarantee."

class ChatMessageResponse(BaseModel):
    success: bool
    mode: str
    conversation_id: str
    reply: str
    routing_suggestion: Optional[Dict[str, str]] = None # e.g. {"label": "Open People Search", "path": "/people"}
    resource_cards: List[ResourceCard] = []
    whatif_card: Optional[WhatIfComparisonCard] = None
    source_url: Optional[str] = ""
