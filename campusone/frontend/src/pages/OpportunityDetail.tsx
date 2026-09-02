import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Button, Modal, Avatar } from '../components/ui';
import { buildTeamForOpportunity } from '../lib/genie_api';
import type { TeamBuildResult } from '../lib/genie_api';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const oppId = id || 'opp_001';

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamResult, setTeamResult] = useState<TeamBuildResult | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

  const handleBuildTeam = async () => {
    setIsTeamModalOpen(true);
    setLoadingTeam(true);
    try {
      const data = await buildTeamForOpportunity(oppId);
      setTeamResult(data);
    } catch {
      // Fallback mock team result
      setTeamResult({
        opportunity_id: oppId,
        opportunity_title: 'Smart India Hackathon 2026',
        team: [
          { student_id: 'nmit_std_001', name: 'Aditya Rao', department: 'Computer Science', year: 3, covered_skills: ['React'], why: 'Covers frontend UI development capability' },
          { student_id: 'nmit_std_002', name: 'Ananya Sharma', department: 'Information Science', year: 2, covered_skills: ['Python', 'FastAPI'], why: 'Covers backend REST API framework' },
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

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Badge variant="accent">National Hackathon</Badge>
              <Badge variant="warning">Deadline: 5 Days Left</Badge>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Smart India Hackathon (SIH 2026) — NMIT Internal Selection
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Organized by Department of Computer Science & Engineering · NMIT Bengaluru
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={handleBuildTeam}>
            ⚡ Build My Team
          </Button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Required Skills</h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {['React', 'TypeScript', 'Python', 'FastAPI', 'Databricks'].map((skill) => (
                <Badge key={skill} variant="neutral">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Eligibility</h4>
            <p style={{ fontSize: '14px' }}>Open to all B.Tech / M.Tech students across NMIT departments.</p>
          </div>
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
            {/* Skill Coverage Bars */}
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

            {/* Proposed Teammates */}
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

            {/* Visible Missing Gap / Trade-off Callout */}
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
