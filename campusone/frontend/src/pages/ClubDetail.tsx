import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Button, Input, LoadingState, ErrorState } from '../components/ui';
import { fetchClubDetail, askGenieClub } from '../lib/clubs_api';
import type { ClubItem } from '../lib/clubs_api';

export const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = id || 'nmit_hacks';

  const [club, setClub] = useState<ClubItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-Club Genie Q&A state
  const [genieQuestion, setGenieQuestion] = useState('');
  const [genieAnswer, setGenieAnswer] = useState<string | null>(null);
  const [genieLoading, setGenieLoading] = useState(false);

  useEffect(() => {
    fetchClubDetail(clubId)
      .then((data) => {
        setClub(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load club detail.');
        setLoading(false);
      });
  }, [clubId]);

  const handleAskGenie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genieQuestion.trim()) return;
    setGenieLoading(true);
    try {
      const answer = await askGenieClub(clubId, genieQuestion);
      setGenieAnswer(answer);
    } catch {
      setGenieAnswer(`Genie scoped response for ${club?.name}: Please check official link: ${club?.website_url || club?.instagram_url}`);
    } finally {
      setGenieLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        <LoadingState count={2} />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        <ErrorState title="Club Not Found" message={error || 'Unable to load club.'} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px 100px' }}>
      {/* Header Card */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <Badge variant="accent">{club.category.toUpperCase()}</Badge>
              <Badge variant={club.recruitment_status === 'open' ? 'verified' : 'neutral'}>
                Recruitment: {club.recruitment_status.toUpperCase()}
              </Badge>
              {club.is_synthetic ? (
                <Badge variant="synthetic">Synthetic Demo Data</Badge>
              ) : (
                <Badge variant="verified">✓ Verified NMIT Source</Badge>
              )}
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>
              {club.name}
            </h1>

            {/* Culture Tag Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {club.culture_tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized "Good for you if..." */}
        <div style={{ margin: '16px 0', padding: '10px 14px', background: 'var(--accent-light)', borderLeft: '4px solid var(--accent-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>
          💡 {club.good_for_you_if}
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
          {club.description}
        </p>

        {/* Official Links Row */}
        <div style={{ padding: '12px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {club.instagram_url && (
            <a href={club.instagram_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'underline', fontWeight: 500 }}>
              📷 Official Instagram ({club.instagram_url.split('.com/')[1] || '@nmit'})
            </a>
          )}
          {club.website_url && (
            <a href={club.website_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'underline', fontWeight: 500 }}>
              🌐 Official Website Portal
            </a>
          )}
        </div>
      </Card>

      {/* Posts Photo Grid */}
      <Card style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Recent Club Posts & Activity
        </h3>

        {club.recent_posts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            No recent activity posts. Club leads can post updates directly.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {club.recent_posts.map((post) => (
              <div key={post.post_id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-primary)' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{post.author_name}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>{post.caption}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{post.posted_at.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pinned "Ask Genie about this club" Input */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '768px', padding: '0 16px', zIndex: 950 }}>
        <Card style={{ padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '2px solid var(--accent-color)' }}>
          {genieAnswer && (
            <div style={{ marginBottom: '12px', padding: '10px 12px', background: 'var(--surface-color)', borderRadius: '6px', fontSize: '13px', lineHeight: 1.5 }}>
              <strong>Genie:</strong> {genieAnswer}
            </div>
          )}

          <form onSubmit={handleAskGenie} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder={`Ask Genie about ${club.name} (recruitment, events, activities)...`}
                value={genieQuestion}
                onChange={(e) => setGenieQuestion(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="md" isLoading={genieLoading}>
              Ask Genie
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
