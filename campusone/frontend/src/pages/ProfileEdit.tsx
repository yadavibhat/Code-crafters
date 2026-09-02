import React, { useState } from 'react';
import { Card, Button, Input, TextArea, TagInput, Badge } from '../components/ui';

export const ProfileEdit: React.FC = () => {
  const [name, setName] = useState('Aditya Rao');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3');
  const [usn] = useState('1NT23CS045');
  const [cgpa, setCgpa] = useState('9.42');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Python', 'FastAPI', 'Databricks']);
  const [techInterests, setTechInterests] = useState(['AI Research', 'Robotics & Drones']);
  const [goal, setGoal] = useState('Looking for SIH 2026 hackathon teammates.');
  const [cgpaVisibility, setCgpaVisibility] = useState('private');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Profile and privacy settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Edit My Profile & Privacy</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage identity details and per-field visibility settings.</p>
        </div>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>

      {savedMessage && (
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="verified">{savedMessage}</Badge>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Identity */}
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>1. Academic Identity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            <div>
              <Input label="USN (Encrypted - Private)" value={usn} disabled />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>USNs are never shown to other students.</span>
            </div>
            <Input label="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
          </div>
        </Card>

        {/* Visually Prominent Privacy Settings */}
        <Card style={{ border: '2px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent-color)' }}>
              🔒 Visually Prominent Privacy Controls
            </h2>
            <Badge variant="accent">Per-Field Visibility</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-color)', borderRadius: '6px' }}>
              <span>USN Code & Raw Email</span>
              <Badge variant="warning">Strictly Private (System Enforced)</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--surface-color)', borderRadius: '6px' }}>
              <span>CGPA Visibility</span>
              <select
                value={cgpaVisibility}
                onChange={(e) => setCgpaVisibility(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              >
                <option value="private">Private (Only Me)</option>
                <option value="public">Public to All NMIT</option>
                <option value="connections">Connections Only</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Skills & Interests */}
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>2. Skills & Interests</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TagInput label="Technical Skills" tags={skills} onChange={setSkills} />
            <TagInput label="Technical Interests" tags={techInterests} onChange={setTechInterests} />
          </div>
        </Card>

        {/* Goals */}
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>3. Current Goals</h2>
          <TextArea label="Current Academic / Hackathon Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </Card>
      </div>
    </div>
  );
};
