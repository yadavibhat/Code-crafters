const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface UrgentItem {
  title: string;
  category: string;
  deadline: string;
  hours_remaining: number;
  action_label: string;
  action_path: string;
  why_urgent: string;
}

export interface HomePersonCard {
  student_id: string;
  name: string;
  department: string;
  year: number;
  skills: string[];
  why_reason: string;
}

export interface HomeOpportunityCard {
  opp_id: string;
  title: string;
  type: string;
  organizer: string;
  deadline: string;
  hours_remaining: number;
  fit_score: number;
  why_fit: string;
  is_synthetic: boolean;
}

export interface PulseItem {
  club_id: string;
  club_name: string;
  headline: string;
  description: string;
  recruitment_status: string;
}

export interface CampusStoryItem {
  story_id: string;
  title: string;
  author_or_source: string;
  published_date: string;
  excerpt: string;
  source_url: string;
  category: string;
  is_synthetic: boolean;
}

export interface HomeData {
  greeting: string;
  urgent_item?: UrgentItem;
  top_people: HomePersonCard[];
  top_opportunities: HomeOpportunityCard[];
  pulse_item?: PulseItem;
  campus_story?: CampusStoryItem;
}

export async function fetchHomeData(): Promise<HomeData> {
  const res = await fetch(`${API_BASE_URL}/api/home`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Home dashboard: ${res.statusText}`);
  }
  return res.json();
}

export async function submitFeedback(itemType: string, itemId: string, signal: 'more' | 'less'): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_type: itemType, item_id: itemId, signal }),
  });
  return res.ok;
}

export async function fetchCampusDigest(): Promise<CampusStoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/digest`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Campus Digest: ${res.statusText}`);
  }
  const data = await res.json();
  return data.stories || [];
}
