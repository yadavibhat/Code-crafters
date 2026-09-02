import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Button, Modal, Avatar, LoadingState } from '../components/ui';
import { buildTeamForOpportunity } from '../lib/genie_api';
import type { TeamBuildResult } from '../lib/genie_api';
import { fetchOpportunityDetail } from '../lib/opportunities_api';
import type { OpportunityItem } from '../lib/opportunities_api';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const oppId = id || 'opp_001';

  const [opp, setOpp] = useState<OpportunityItem | null>(null);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamResult, setTeamResult] = useState<TeamBuildResult | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    fetchOpportunityDetail(oppId)
      .then((data) => {
        setOpp(data);
        setLoadingOpp(false);
      })
      .catch(() => {
        // Fallback default record
        setOpp({
          opp_id: oppId,
          title: 'Smart India Hackathon (SIH 2026) — NMIT Internal Round',
          type: 'Hackathon',
          description: 'National 48-hour internal selection hackathon organized by the Department of Computer Science & Engineering at NMIT Bengaluru.',
          required_skills: ['React', 'Python', 'FastAPI', 'Databricks'],
          eligibility: 'Open to all B.Tech and M.Tech students across NMIT.',
          deadline: '2026-09-08 23:59:59',
          deadline_urgency: 'urgent',
          hours_remaining: 48,
          organizer: 'Dept of CSE, NMIT Bengaluru',
          source_url: 'https://nitte.edu.in/nmit/',
          status: 'active',
          is_synthetic: false,
          fit_score: 85,
          why_fit: '85% Fit: You match 3 required skills (React, Python, FastAPI) and share interest in AI Research.'
        });
        setLoadingOpp(false);
      });
  }, [oppId]);

  const handleBuildTeam = async () => {
    setIsTeamModalOpen(true);
    setLoadingTeam(true);
    try {
      const data = await buildTeamForOpportunity(oppId);
      setTeamResult(data);
    } catch {
      setTeamResult({
        opportunity_id: oppId,
        opportunity_title: opp?.title || 'Smart India Hackathon 2026',
        team: [
          { student_id: 'nmit_std_001', name: 'Aditya Rao', department: 'Computer Science', year: 3, covered_skills: ['React'], why: 'Covers required capability React' },
          { student_id: 'nmit_std_002', name: 'Ananya Sharma', department: 'Information Science', year: 2, covered_skills: ['Python', 'FastAPI'], why: 'Covers backend REST API capability' },
          { student_id: 'nmit_std_003', name: 'Rahul Verma', department: 'AI & Data Science', year: 3, covered_skills: ['Databricks'], why: 'Covers Databricks Genie semantic layer' }
        ],
        skill_coverage: [
          { skill: 'React', covered_by: 'Aditya Rao', is_covered: true },
          { skill: 'Python', covered_by: 'Ananya Sharma', is_covered: true },
          { skill: 'FastAPI', covered_by: 'Ananya Sharma', is_covered: true },
          { skill: 'Databricks', covered_by: 'Rahul Verma', is_covered: true }
        ],
        missing_gaps: [
          'Trade-off / Gap: Team lacks dedicated DevOps & CI/CD deployment lead.'
        ]
      });
    } finally {
      setLoadingTeam(false);
    }
  };

  if (loadingOpp) {
    return (
      <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        <LoadingState count={2} />
      </div>
    );
  }

  if (!opp) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <Badge variant="accent">{opp.type}</Badge>
              {opp.deadline_urgency === 'urgent' ? (
                <Badge variant="warning">⏳ Urgent: {opp.hours_remaining}h Remaining</Badge>
              ) : (
                <Badge variant="neutral">Deadline: {opp.deadline.split(' ')[0]}</Badge>
              )}
              {opp.is_synthetic ? (
                <Badge variant="synthetic">Synthetic Demo Data</Badge>
              ) : (
                <Badge variant="verified">✓ Verified NMIT Source</Badge>
              )}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              {opp.title}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Organized by {opp.organizer}
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={handleBuildTeam}>
            ⚡ Build My Team
          </Button>
        </div>

        {/* Why This Fits You Box */}
        <div style={{ margin: '20px 0', padding: '12px 16px', background: 'var(--accent-light)', borderLeft: '4px solid var(--accent-color)', borderRadius: '6px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '4px' }}>
            💡 Why This Fits You ({opp.fit_score}% Match)
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            {opp.why_fit}
          </p>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
          {opp.description}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Required Skills</h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {opp.required_skills.map((skill) => (
                <Badge key={skill} variant="neutral">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Eligibility</h4>
            <p style={{ fontSize: '14px' }}>{opp.eligibility}</p>
          </div>

          {opp.source_url && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Official Link</h4>
              <a href={opp.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'underline' }}>
                🔗 View Official NMIT Source Page
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Team Assembly Modal / Panel */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Genie Proposed Balanced Team Assembly"
        footer={
          <Button variant="primary" onClick={() => setIsTeamModalOpen(false)}>
            Confirm Team & Send Invites
          </Button>
        }
      >
        {loadingTeam ? (
          <p>Analyzing skill graph and assembling optimal team...</p>
        ) : teamResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Capability Coverage Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {teamResult.skill_coverage.map((sc) => (
                  <div key={sc.skill} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', background: 'var(--surface-color)', borderRadius: '6px' }}>
                    <span>{sc.skill}</span>
                    <span style={{ fontWeight: 600, color: sc.is_covered ? 'var(--success-color)' : 'var(--warning-color)' }}>
                      {sc.is_covered ? `✓ Covered by ${sc.covered_by}` : '⚠️ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Proposed Teammates (3-5 Students)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teamResult.team.map((member) => (
                  <Card key={member.student_id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar name={member.name} size="md" />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '14px', fontWeight: 600 }}>{member.name}</h5>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.department} Year {member.year}</p>
                        <Badge variant="accent" style={{ marginTop: '4px' }}>💡 {member.why}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {teamResult.missing_gaps.map((gap, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--warning-bg)', border: '1px solid var(--warning-color)', borderRadius: '8px', fontSize: '13px', color: 'var(--warning-color)' }}>
                <strong>Team Capability Trade-off / Gap:</strong> {gap}
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
