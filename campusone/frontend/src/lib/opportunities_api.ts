const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface OpportunityItem {
  opp_id: string;
  title: string;
  type: string;
  description: string;
  required_skills: string[];
  eligibility: string;
  deadline: string;
  deadline_urgency: 'urgent' | 'normal' | 'expired';
  hours_remaining: number;
  organizer: string;
  source_url?: string;
  status: string;
  is_synthetic: boolean;
  fit_score: number;
  why_fit: string;
}

export async function fetchOpportunities(typeFilter?: string): Promise<OpportunityItem[]> {
  const url = new URL(`${API_BASE_URL}/api/opportunities`);
  if (typeFilter) url.searchParams.append('type', typeFilter);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch opportunities: ${res.statusText}`);
  }
  const data = await res.json();
  return data.opportunities || [];
}

export async function fetchOpportunityDetail(oppId: string): Promise<OpportunityItem> {
  const res = await fetch(`${API_BASE_URL}/api/opportunities/${oppId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch opportunity detail: ${res.statusText}`);
  }
  return res.json();
}
