import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Avatar, Badge, Button, Input, LoadingState } from '../components/ui';
import { fetchHomeData, submitFeedback } from '../lib/home_api';
import type { HomeData } from '../lib/home_api';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackState, setFeedbackState] = useState<Record<string, 'more' | 'less'>>({});

  useEffect(() => {
    fetchHomeData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFeedback = async (itemType: string, itemId: string, signal: 'more' | 'less') => {
    const key = `${itemType}:${itemId}`;
    setFeedbackState((prev) => ({ ...prev, [key]: signal }));
    await submitFeedback(itemType, itemId, signal);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/people?q=${encodeURIComponent(searchQuery)}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 16px' }}>
        <LoadingState count={3} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px 60px' }}>
      {/* 1. Greeting */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{data.greeting} 👋</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Here is your personalized campus intelligence pulse across NMIT Bengaluru.
        </p>
      </div>

      {/* 2. Genie Natural Language Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Ask Genie or find people (e.g. 'Find a CSE student into PyTorch & drones')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Search Genie
          </Button>
        </form>
      </div>

      {/* 3. Urgent Action Item Banner (Capped at 1) */}
      {data.urgent_item && (
        <Card style={{ marginBottom: '24px', borderLeft: '4px solid var(--warning-color)', background: 'var(--warning-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <Badge variant="warning" style={{ marginBottom: '4px' }}>🔥 Urgent Action Required</Badge>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--warning-color)' }}>
                {data.urgent_item.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                {data.urgent_item.why_urgent}
              </p>
            </div>
            <Link to={data.urgent_item.action_path}>
              <Button variant="primary" size="sm">
                {data.urgent_item.action_label} →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 4. Recommended People Strip (Strictly Capped at 3) */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recommended Collaborators (Capped at 3)</h2>
          <Link to="/people" style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>View All People →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {data.top_people.map((person) => {
            const key = `person:${person.student_id}`;
            const fb = feedbackState[key];
            if (fb === 'less') return null;

            return (
              <Card key={person.student_id} hoverable>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Avatar name={person.name} size="md" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/profile/${person.student_id}`}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{person.name}</h4>
                    </Link>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{person.department} Year {person.year}</p>
                    <Badge variant="accent" style={{ marginTop: '4px' }}>💡 {person.why_reason}</Badge>

                    {/* Feedback affordance buttons */}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleFeedback('person', person.student_id, 'more')}
                        style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        👍 More like this
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback('person', person.student_id, 'less')}
                        style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        👎 Less like this
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. Recommended Opportunities Strip (Strictly Capped at 3) */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recommended Opportunities (Capped at 3)</h2>
          <Link to="/opportunities" style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>View All Opportunities →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {data.top_opportunities.map((opp) => {
            const key = `opportunity:${opp.opp_id}`;
            const fb = feedbackState[key];
            if (fb === 'less') return null;

            return (
              <Card key={opp.opp_id} hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <Badge variant="accent">{opp.type}</Badge>
                    <Badge variant="neutral">{opp.fit_score}% Fit</Badge>
                  </div>
                  <Link to={`/opportunities/${opp.opp_id}`}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{opp.title}</h4>
                  </Link>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0' }}>By {opp.organizer}</p>
                  <Badge variant="accent" style={{ marginTop: '4px' }}>💡 {opp.why_fit}</Badge>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleFeedback('opportunity', opp.opp_id, 'more')}
                      style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback('opportunity', opp.opp_id, 'less')}
                      style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      👎
                    </button>
                  </div>
                  <Link to={`/opportunities/${opp.opp_id}`}>
                    <Button variant="outline" size="sm">Build Team</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 6. Club/Event Pulse Item (Strictly Capped at 1) */}
      {data.pulse_item && (
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Club & Culture Pulse (Spotlight 1)</h2>
            <Link to="/clubs" style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>View All Clubs →</Link>
          </div>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <Badge variant="verified" style={{ marginBottom: '4px' }}>✓ {data.pulse_item.club_name}</Badge>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{data.pulse_item.headline}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{data.pulse_item.description}</p>
              </div>
              <Link to={`/clubs/${data.pulse_item.club_id}`}>
                <Button variant="outline" size="sm">View Club Portal →</Button>
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* 7. Campus Story Feature (Strictly Capped at 1) */}
      {data.campus_story && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Campus Digest Story Spotlight (Spotlight 1)</h2>
            <Link to="/stories" style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>Read All Stories →</Link>
          </div>

          <Card style={{ fontFamily: 'var(--font-serif)' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <Badge variant="accent">{data.campus_story.category.toUpperCase()}</Badge>
              <Badge variant="verified">✓ Verified NMIT Story</Badge>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              {data.campus_story.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '10px' }}>
              {data.campus_story.excerpt}
            </p>
            <a href={data.campus_story.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--accent-color)', textDecoration: 'underline' }}>
              🔗 Read Source Article on nitte.edu.in →
            </a>
          </Card>
        </section>
      )}
    </div>
  );
};
