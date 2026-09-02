import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Badge, Button, LoadingState } from '../components/ui';

interface StudentProfile {
  student_id: string;
  name: string;
  photo_url?: string;
  program: string;
  department: string;
  year: number;
  section?: string;
  grad_year: number;
  usn?: string; // Should be undefined for non-owner
  cgpa?: number;
  profile_mode: string;
  skills: string[];
  interests: string[];
  goals: string[];
  projects: any[];
  clubs: string[];
  privacy_notices: string[];
}

export const ProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${id || 'nmit_std_001'}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mockup profile respecting privacy rules
        setProfile({
          student_id: id || 'nmit_std_001',
          name: 'Pranav Bhat',
          program: 'B.Tech',
          department: 'Artificial Intelligence & Data Science',
          year: 3,
          section: 'A',
          grad_year: 2027,
          profile_mode: 'searchable',
          skills: ['Python', 'Databricks', 'FastAPI', 'PyTorch'],
          interests: ['AI Research', 'Autonomous Drones', 'Music & Band'],
          goals: ['Looking to build an AI research team for SIH 2026.'],
          projects: [
            { title: 'AI Campus Assistant', domain: 'AI Research', skills_used: 'Python, FastAPI' }
          ],
          clubs: ['E-Cell NMIT', 'NMIT Robotics Club'],
          privacy_notices: [
            'USN and Email address are private.',
            'CGPA is marked private by student.'
          ]
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        <LoadingState count={2} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      {/* Header Profile Card */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name={profile.name} src={profile.photo_url} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700 }}>{profile.name}</h1>
              <Badge variant="verified">NMIT Verified Student</Badge>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {profile.program} in {profile.department} · Year {profile.year} (Batch {profile.grad_year})
            </p>
          </div>
          <Button variant="primary" size="md">Connect</Button>
        </div>
      </Card>

      {/* Privacy Notice Banner */}
      {profile.privacy_notices.length > 0 && (
        <Card style={{ marginBottom: '24px', backgroundColor: 'var(--surface-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Privacy Protection Active: {profile.privacy_notices.join(' ')}
            </span>
          </div>
        </Card>
      )}

      {/* Profile Detail Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Skills */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Skills & Capabilities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="accent">{skill}</Badge>
            ))}
          </div>
        </Card>

        {/* Interests */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Interests & Focus Areas</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="neutral">{interest}</Badge>
            ))}
          </div>
        </Card>

        {/* Goals */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Current Goals</h3>
          {profile.goals.map((goal, idx) => (
            <p key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{goal}</p>
          ))}
        </Card>

        {/* Clubs */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Club Memberships</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.clubs.map((club) => (
              <Badge key={club} variant="verified">{club}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
