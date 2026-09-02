import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, LoadingState, ErrorState } from '../components/ui';
import { fetchOpportunities } from '../lib/opportunities_api';
import type { OpportunityItem } from '../lib/opportunities_api';

export const OpportunitiesList: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (filter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpportunities(filter === 'all' ? undefined : filter);
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(typeFilter);
  }, [typeFilter]);

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Opportunities Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            SIH, Hackathons, Internships & Research Assistantships Genie-scored for your profile fit.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'Hackathon', 'Research', 'Competition', 'Internship'].map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? 'All Opportunities' : type}
            </Button>
          ))}
        </div>
      </div>

      {loading && <LoadingState count={3} />}

      {error && <ErrorState title="Failed to Load Opportunities" message={error} onRetry={() => loadData(typeFilter)} />}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {opportunities.map((opp) => (
            <Card key={opp.opp_id} hoverable>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <Badge variant="accent">{opp.type}</Badge>

                      {/* Deadline Urgency Visual Treatment (< 72 hours warning badge) */}
                      {opp.deadline_urgency === 'urgent' ? (
                        <Badge variant="warning">⏳ Urgent: {opp.hours_remaining}h Remaining</Badge>
                      ) : (
                        <Badge variant="neutral">Deadline: {opp.deadline.split(' ')[0]}</Badge>
                      )}

                      {/* Verified vs Synthetic Data Labeling */}
                      {opp.is_synthetic ? (
                        <Badge variant="synthetic">Synthetic Demo Data</Badge>
                      ) : (
                        <Badge variant="verified">✓ Verified NMIT Source</Badge>
                      )}
                    </div>

                    <Link to={`/opportunities/${opp.opp_id}`}>
                      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {opp.title}
                      </h2>
                    </Link>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Organized by {opp.organizer}
                    </p>
                  </div>

                  <Link to={`/opportunities/${opp.opp_id}`}>
                    <Button variant="outline" size="sm">View Details & Build Team</Button>
                  </Link>
                </div>

                {/* Short Why-Fit Rationale Line */}
                <div style={{ padding: '8px 12px', background: 'var(--accent-light)', borderLeft: '3px solid var(--accent-color)', borderRadius: '4px', fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500 }}>
                  💡 {opp.why_fit}
                </div>

                {/* Skill Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {opp.required_skills.map((skill) => (
                    <Badge key={skill} variant="neutral">{skill}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
