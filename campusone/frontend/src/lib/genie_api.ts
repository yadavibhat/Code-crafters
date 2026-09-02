const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface StudentCard {
  student_id: string;
  name: string;
  photo_url?: string;
  program: string;
  department: string;
  year: number;
  section?: string;
  grad_year: number;
  skills: string[];
  interests: string[];
  why_match: string[];
  connection_status?: string;
}

export interface TeamMember {
  student_id: string;
  name: string;
  department: string;
  year: number;
  covered_skills: string[];
  why: string;
}

export interface SkillCoverage {
  skill: string;
  covered_by?: string;
  is_covered: boolean;
}

export interface TeamBuildResult {
  opportunity_id: string;
  opportunity_title: string;
  team: TeamMember[];
  skill_coverage: SkillCoverage[];
  missing_gaps: string[];
}

export async function searchPeople(query: string): Promise<StudentCard[]> {
  const res = await fetch(`${API_BASE_URL}/api/genie/people-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Genie search failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.results || [];
}

export async function buildTeamForOpportunity(oppId: string): Promise<TeamBuildResult> {
  const res = await fetch(`${API_BASE_URL}/api/genie/opportunities/${oppId}/build-team`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Team assembly failed: ${res.statusText}`);
  }
  return res.json();
}

export async function sendConnectionRequest(targetId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/connections/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_id: targetId }),
  });
  return res.ok;
}
