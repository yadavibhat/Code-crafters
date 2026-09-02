import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Badge, Button, Input, EmptyState, LoadingState, ErrorState } from '../components/ui';
import { searchPeople, sendConnectionRequest } from '../lib/genie_api';
import type { StudentCard } from '../lib/genie_api';

export const PeopleSearch: React.FC = () => {
  const [query, setQuery] = useState('React and TypeScript');
  const [results, setResults] = useState<StudentCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchPeople(searchQuery);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to reach Genie search service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, []);

  const handleConnect = async (studentId: string) => {
    const success = await sendConnectionRequest(studentId);
    if (success) {
      setConnectedIds((prev) => new Set(prev).add(studentId));
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 16px' }}>
      {/* Prominent Search Bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Find My People</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Type a plain-English query to find multidisciplinary project collaborators across NMIT.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ display: 'flex', gap: '12px' }}
        >
          <div style={{ flex: 1 }}>
            <Input
              placeholder="e.g. Find a 3rd-year CSE student who knows React and is into drones..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="md" isLoading={loading}>
            Search Genie
          </Button>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Try searching:</span>
          {['React and TypeScript', 'AI Research', 'PyTorch and Drones', 'Mechanical student into music'].map((suggest) => (
            <button
              key={suggest}
              type="button"
              onClick={() => {
                setQuery(suggest);
                handleSearch(suggest);
              }}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '2px 10px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              "{suggest}"
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {loading && <LoadingState count={3} />}

      {error && (
        <ErrorState
          title="Genie Search Error"
          message={error}
          onRetry={() => handleSearch(query)}
        />
      )}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          title="No Matching Students Found"
          description={`No NMIT students match "${query}". Try adjusting your skills or interest filters.`}
          actionLabel="Clear Search"
          onAction={() => {
            setQuery('');
            setResults([]);
          }}
        />
      )}

      {!loading && !error && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Found <strong>{results.length}</strong> matching NMIT students
          </div>

          {results.map((student) => {
            const isConnected = connectedIds.has(student.student_id);
            return (
              <Card key={student.student_id} hoverable>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Avatar name={student.name} src={student.photo_url} size="lg" />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/profile/${student.student_id}`}>
                          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {student.name}
                          </h3>
                        </Link>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {student.program} in {student.department} · Year {student.year} (Batch {student.grad_year})
                        </p>
                      </div>

                      <Button
                        variant={isConnected ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleConnect(student.student_id)}
                        disabled={isConnected}
                      >
                        {isConnected ? '✓ Request Sent' : 'Connect'}
                      </Button>
                    </div>

                    {/* WhyMatch Accent Chips */}
                    {student.why_match && student.why_match.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {student.why_match.map((why, idx) => (
                          <Badge key={idx} variant="accent">
                            💡 Recommended: {why}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Skill Chips */}
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {student.skills.map((skill) => (
                        <Badge key={skill} variant="neutral">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
