import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, TextArea, TagInput, Badge } from '../components/ui';

const STEPS = [
  '1. Identity',
  '2. Skills',
  '3. Interests',
  '4. Goals',
  '5. Projects',
  '6. Clubs',
  '7. Privacy'
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('Aditya Rao');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3');
  const [usn, setUsn] = useState('1NT23CS045');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Python', 'FastAPI']);
  const [techInterests, setTechInterests] = useState(['AI Research', 'Robotics & Drones']);
  const [extraInterests, setExtraInterests] = useState(['Music & Band', 'Badminton']);
  const [goal, setGoal] = useState('Looking for hackathon teammates for SIH 2026.');
  const [projectTitle, setProjectTitle] = useState('AI Autonomous Campus Assistant');
  const [projectDesc, setProjectDesc] = useState('Built with FastAPI and Databricks Genie.');
  const [selectedClubs, setSelectedClubs] = useState(['E-Cell NMIT', 'NMIT Robotics Club']);
  const [cgpaVisibility, setCgpaVisibility] = useState('private');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Badge variant="accent">CampusOne Mandatory Student Onboarding</Badge>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>
          Setup Your NMIT Verified Identity
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
        </p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: idx <= currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      <Card style={{ padding: '24px' }}>
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 1: Academic Identity</h2>
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="Current Year" value={year} onChange={(e) => setYear(e.target.value)} required />
              <Input label="USN (Encrypted & Private)" value={usn} onChange={(e) => setUsn(e.target.value)} required />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 2: Technical & Core Skills</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Type skills and press Enter or comma to add tags.
            </p>
            <TagInput label="Skills" tags={skills} onChange={setSkills} />
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 3: Technical & Extracurricular Interests</h2>
            <TagInput label="Technical Focus Areas" tags={techInterests} onChange={setTechInterests} />
            <TagInput label="Extracurricular & Hobbies" tags={extraInterests} onChange={setExtraInterests} />
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 4: Academic & Collaboration Goals</h2>
            <TextArea
              label="What are you looking to achieve this semester?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 5: Featured Project</h2>
            <Input label="Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
            <TextArea label="Project Description" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
          </div>
        )}

        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 6: NMIT Clubs & Organizations</h2>
            <TagInput label="Joined / Interested Clubs" tags={selectedClubs} onChange={setSelectedClubs} />
          </div>
        )}

        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Step 7: Privacy Controls</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Configure field visibility. USN and Email are strictly private by default.
            </p>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span>USN & Institutional Email</span>
                <Badge variant="warning">Strictly Private</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>CGPA Visibility</span>
                <select
                  value={cgpaVisibility}
                  onChange={(e) => setCgpaVisibility(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="private">Private (Only Me)</option>
                  <option value="public">Visible to All</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? 'Complete Onboarding' : 'Next Step'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
