const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ResourceCard {
  title: string;
  department: string;
  type: string;
  url: string;
}

export interface WhatIfComparisonCard {
  scenario: string;
  current_metrics: Record<string, any>;
  projected_metrics: Record<string, any>;
  assumptions: string[];
  trade_offs: string[];
  disclaimer: string;
}

export interface ChatMessage {
  sender: 'user' | 'genie';
  text: string;
  routing_suggestion?: { label: string; path: string };
  resource_cards?: ResourceCard[];
  whatif_card?: WhatIfComparisonCard;
  source_url?: string;
  timestamp: string;
}

export async function sendChatMessage(mode: string, message: string, conversationId?: string): Promise<{
  reply: string;
  routing_suggestion?: { label: string; path: string };
  resource_cards?: ResourceCard[];
  whatif_card?: WhatIfComparisonCard;
  source_url?: string;
}> {
  const res = await fetch(`${API_BASE_URL}/api/genie/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, message, conversation_id: conversationId }),
  });
  if (!res.ok) {
    throw new Error(`Genie Chat request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchExamplePrompts(mode: string): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/genie/prompts/${mode}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.prompts || [];
}
