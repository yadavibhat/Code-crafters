import React, { useEffect, useState } from 'react';
import { Badge, LoadingState, ErrorState } from '../components/ui';
import { fetchCampusDigest } from '../lib/home_api';
import type { CampusStoryItem } from '../lib/home_api';

export const Stories: React.FC = () => {
  const [stories, setStories] = useState<CampusStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampusDigest()
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load campus stories.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '850px', margin: '32px auto', padding: '0 16px' }}>
      {/* Editorial Title Block */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid var(--border-color)', paddingBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
          Official NMIT Editorial Feed
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 700, marginTop: '8px', marginBottom: '12px', color: 'var(--text-primary)' }}>
          Campus Digest & Notable Alumni Stories
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>
          Celebrating verified institutional milestones, research breakthroughs, and inspiring journeys of NMIT graduates globally.
        </p>
      </div>

      {loading && <LoadingState count={3} />}

      {error && <ErrorState title="Failed to Load Stories" message={error} onRetry={() => window.location.reload()} />}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {stories.map((story) => (
            <article key={story.story_id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <Badge variant="accent">{story.category.toUpperCase()}</Badge>
                {story.is_synthetic ? (
                  <Badge variant="synthetic">Synthetic Demo Story</Badge>
                ) : (
                  <Badge variant="verified">✓ Verified NMIT Alumni & News</Badge>
                )}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', alignSelf: 'center' }}>
                  {story.published_date.split(' ')[0]}
                </span>
              </div>

              {/* Serif Headline */}
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                {story.title}
              </h2>

              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Reported by {story.author_or_source}
              </p>

              {/* Excerpt Body */}
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '14px' }}>
                {story.excerpt}
              </p>

              {/* Verified Source Link */}
              <a
                href={story.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'underline', fontWeight: 500 }}
              >
                🔗 Read Verified Source Announcement on nitte.edu.in →
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
