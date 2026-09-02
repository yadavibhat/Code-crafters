import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/ui/NavBar';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '40px 16px', maxWidth: '1120px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{title}</h1>
    <p style={{ color: 'var(--text-secondary)' }}>This section will be built in upcoming batches.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar user={{ name: 'Aditya Rao' }} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/people" element={<PlaceholderPage title="Find My People" />} />
            <Route path="/opportunities" element={<PlaceholderPage title="Opportunities Hub" />} />
            <Route path="/clubs" element={<PlaceholderPage title="Clubs & Culture Wall" />} />
            <Route path="/genie" element={<PlaceholderPage title="Universal Genie" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
