const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ClubPost {
  post_id: string;
  club_id: string;
  author_name: string;
  caption: string;
  image_url?: string;
  posted_at: string;
}

export interface ClubItem {
  club_id: string;
  name: string;
  category: string;
  culture_tags: string[];
  description: string;
  instagram_url?: string;
  website_url?: string;
  recruitment_status: string;
  is_synthetic: boolean;
  trust_level: string;
  member_count: number;
  good_for_you_if: string;
  recent_posts: ClubPost[];
}

export async function fetchClubs(): Promise<ClubItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/clubs`);
  if (!res.ok) {
    throw new Error(`Failed to fetch clubs: ${res.statusText}`);
  }
  const data = await res.json();
  return data.clubs || [];
}

export async function fetchClubDetail(clubId: string): Promise<ClubItem> {
  const res = await fetch(`${API_BASE_URL}/api/clubs/${clubId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch club detail: ${res.statusText}`);
  }
  return res.json();
}

export async function askGenieClub(clubId: string, question: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/clubs/genie/ask-club/${clubId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    throw new Error(`Per-club Genie question failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.answer;
}
