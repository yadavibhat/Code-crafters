import React, { useState } from 'react';
import {
  Button,
  Card,
  Avatar,
  Badge,
  Input,
  TextArea,
  TagInput,
  Modal,
  Tabs,
  EmptyState,
  LoadingState,
  ErrorState,
} from '../components/ui';
import styles from './StyleGuide.module.css';

export const StyleGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Python', 'Databricks']);
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>CampusOne Design System</h1>
        <p className={styles.subtitle}>
          Visual QA & Component Showcase for NMIT Bengaluru Campus Platform
        </p>
      </div>

      {/* Palette Tokens */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Color Palette Tokens</h2>
        <div className={styles.paletteGrid}>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--bg-primary)' }} />
            <span className={styles.swatchLabel}>Background</span>
            <span className={styles.swatchVar}>--bg-primary (#FFFFFF)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--text-primary)' }} />
            <span className={styles.swatchLabel}>Primary Text</span>
            <span className={styles.swatchVar}>--text-primary (#0B0B0C)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--text-secondary)' }} />
            <span className={styles.swatchLabel}>Secondary Text</span>
            <span className={styles.swatchVar}>--text-secondary (#5B5F66)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--accent-color)' }} />
            <span className={styles.swatchLabel}>Accent Navy</span>
            <span className={styles.swatchVar}>--accent-color (#1E3A8A)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--badge-verified)' }} />
            <span className={styles.swatchLabel}>Verified Badge</span>
            <span className={styles.swatchVar}>--badge-verified (#0F766E)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--badge-synthetic)' }} />
            <span className={styles.swatchLabel}>Synthetic Badge</span>
            <span className={styles.swatchVar}>--badge-synthetic (#71717A)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--warning-color)' }} />
            <span className={styles.swatchLabel}>Warning</span>
            <span className={styles.swatchVar}>--warning-color (#B45309)</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--success-color)' }} />
            <span className={styles.swatchLabel}>Success</span>
            <span className={styles.swatchVar}>--success-color (#16A34A)</span>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Buttons</h2>
        <div className={styles.flexRow}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="outline">Outline Action</Button>
          <Button variant="ghost">Ghost Action</Button>
          <Button variant="primary" isLoading>
            Loading...
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className={styles.flexRow} style={{ marginTop: '16px' }}>
          <Button size="sm" variant="primary">
            Small Button
          </Button>
          <Button size="md" variant="primary">
            Medium Button
          </Button>
          <Button size="lg" variant="primary">
            Large Button
          </Button>
        </div>
      </section>

      {/* Avatars */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Avatars</h2>
        <div className={styles.flexRow}>
          <Avatar name="Aditya Rao" size="sm" />
          <Avatar name="Ananya Sharma" size="md" />
          <Avatar name="Rahul Verma" size="lg" />
          <Avatar name="NMIT Student Council" size="lg" />
        </div>
      </section>

      {/* Badges / Chips */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Badges & Chips</h2>
        <div className={styles.flexRow}>
          <Badge variant="neutral">Neutral Chip</Badge>
          <Badge variant="accent">WhyMatch: Complementary Skills</Badge>
          <Badge variant="verified">✓ Verified NMIT Source</Badge>
          <Badge variant="synthetic">Synthetic Demo Data</Badge>
          <Badge variant="warning">Deadline: 48 Hours Left</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Cards</h2>
        <div className={styles.grid}>
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              Standard Bordered Card
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Card component with no heavy shadow, 1px border, and clean padding.
            </p>
          </Card>
          <Card hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Avatar name="Srinidhi Sudhindra" size="md" />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Srinidhi Sudhindra</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>NMIT Aeronautical 2018</p>
              </div>
            </div>
            <Badge variant="accent">Hoverable Student Match Card</Badge>
          </Card>
        </div>
      </section>

      {/* Form Controls */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Form Inputs & TagInput</h2>
        <div className={styles.grid}>
          <Input
            label="Student Name"
            placeholder="e.g. Aditya Rao"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <TextArea
            label="Project Description"
            placeholder="Describe your SIH or Hackathon project idea..."
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <TagInput
            label="Technical & Extracurricular Skills (Press Enter to add)"
            tags={skills}
            onChange={setSkills}
          />
        </div>
      </section>

      {/* Tabs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Mode Tabs</h2>
        <Tabs
          tabs={[
            { id: 'general', label: 'General Mode' },
            { id: 'academic', label: 'Academic Mode' },
            { id: 'whatif', label: 'What-If Mode' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Active Mode: <strong>{activeTab}</strong>
        </div>
      </section>

      {/* Modal Trigger */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Modal / Sheet</h2>
        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
          Open Team Builder Modal
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Build My Team - Smart India Hackathon"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm Team Selection
              </Button>
            </>
          }
        >
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Genie proposed team for <strong>NMIT SIH Hackathon Team</strong>:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar name="Rahul Verma" size="sm" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Rahul Verma (CSE 3rd Year)</span>
                </div>
                <Badge variant="accent">Embedded Systems</Badge>
              </div>
            </Card>
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar name="Ananya Sharma" size="sm" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Ananya Sharma (ISE 2nd Year)</span>
                </div>
                <Badge variant="accent">UI/UX Design</Badge>
              </div>
            </Card>
          </div>
        </Modal>
      </section>

      {/* Shared States */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Shared UI States</h2>
        <div className={styles.grid}>
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Empty State</h3>
            <EmptyState
              title="No People Matches Found"
              description="No NMIT students match your current query filters."
              actionLabel="Reset Search"
              onAction={() => alert('Search reset')}
            />
          </Card>
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Loading Skeleton</h3>
            <LoadingState count={1} />
          </Card>
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Error State</h3>
            <ErrorState
              title="Genie Connection Failed"
              message="Unable to reach Databricks Genie service. Retrying..."
              onRetry={() => alert('Retrying...')}
            />
          </Card>
        </div>
      </section>

      {/* Editorial Accent */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>10. Typography Accent (Stories Section Only)</h2>
        <div className={styles.serifSection}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Campus Digest Story Headline
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.6 }}>
            "From NMIT Bengaluru labs to leading payload systems at UK Space Agency: The journey of
            Dr. Mamatha Maheshwarappa." — <em>Source: NMIT Public Records</em>
          </p>
        </div>
      </section>
    </div>
  );
};
