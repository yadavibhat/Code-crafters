import React, { useEffect, useState } from 'react';
import { Card, Avatar, Badge } from '../components/ui';

interface ConnectionItem {
  student_id: string;
  name: string;
  department: string;
  year: number;
  status: string;
}

export const Connections: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/connections')
      .then((res) => res.json())
      .then((data) => setConnections(data.connections || []))
      .catch(() => {
        // Fallback connections list
        setConnections([
          { student_id: 'nmit_std_002', name: 'Ananya Sharma', department: 'Information Science & Engineering', year: 2, status: 'pending' },
          { student_id: 'nmit_std_003', name: 'Rahul Verma', department: 'Computer Science & Engineering', year: 3, status: 'accepted' }
        ]);
      });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>My Student Connections</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage pending connection requests and your peer network across NMIT.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {connections.map((c) => (
          <Card key={c.student_id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar name={c.name} size="md" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{c.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.department} · Year {c.year}</p>
                </div>
              </div>
              <Badge variant={c.status === 'accepted' ? 'verified' : 'neutral'}>
                {c.status === 'accepted' ? '✓ Connected' : 'Pending Request'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
