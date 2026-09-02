import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, LoadingState, ErrorState } from '../components/ui';
import { fetchClubs } from '../lib/clubs_api';
import type { ClubItem } from '../lib/clubs_api';

export const ClubsDirectory: React.FC = () => {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClubs()
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load clubs.');
        setLoading(false);
      });
  }, []);

  const filteredClubs = categoryFilter === 'all'
    ? clubs
    : clubs.filter((c) => c.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Clubs & Culture Wall</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            NMIT Bengaluru co-curricular organizations, technical guilds, and student cultural teams.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'technical', 'cultural', 'social_impact'].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All Clubs' : cat.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {loading && <LoadingState count={3} />}

      {error && <ErrorState title="Failed to Load Clubs" message={error} onRetry={() => window.location.reload()} />}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredClubs.map((club) => (
            <Card key={club.club_id} hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <Badge variant="accent">{club.category.toUpperCase()}</Badge>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Badge variant={club.recruitment_status === 'open' ? 'verified' : 'neutral'}>
                      Recruitment: {club.recruitment_status.toUpperCase()}
                    </Badge>
                    {club.is_synthetic ? (
                      <Badge variant="synthetic">Synthetic Data</Badge>
                    ) : (
                      <Badge variant="verified">✓ Verified</Badge>
                    )}
                  </div>
                </div>

                <Link to={`/clubs/${club.club_id}`}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {club.name}
                  </h2>
                </Link>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  {club.description}
                </p>

                {/* Culture Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {club.culture_tags.map((tag) => (
                    <Badge key={tag} variant="neutral">{tag}</Badge>
                  ))}
                </div>

                {/* Personalized "Good for you if..." line */}
                <div style={{ padding: '8px 10px', background: 'var(--accent-light)', borderLeft: '3px solid var(--accent-color)', borderRadius: '4px', fontSize: '12px', color: 'var(--accent-color)', fontWeight: 500, marginBottom: '16px' }}>
                  💡 {club.good_for_you_if}
                </div>
              </div>

              <Link to={`/clubs/${club.club_id}`}>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  View Club & Ask Genie →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
