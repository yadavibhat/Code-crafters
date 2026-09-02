import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavBar } from './components/ui/NavBar';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { ProfileEdit } from './pages/ProfileEdit';
import { ProfileView } from './pages/ProfileView';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '40px 16px', maxWidth: '1120px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{title}</h1>
    <p style={{ color: 'var(--text-secondary)' }}>This section will be built in upcoming batches.</p>
  </div>
);

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, logout } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={{ name: session.name }} onLogout={logout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/style-guide" element={<ProtectedLayout><StyleGuide /></ProtectedLayout>} />
          <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/profile/me/edit" element={<ProtectedLayout><ProfileEdit /></ProtectedLayout>} />
          <Route path="/profile/:id" element={<ProtectedLayout><ProfileView /></ProtectedLayout>} />
          <Route path="/people" element={<ProtectedLayout><PlaceholderPage title="Find My People" /></ProtectedLayout>} />
          <Route path="/opportunities" element={<ProtectedLayout><PlaceholderPage title="Opportunities Hub" /></ProtectedLayout>} />
          <Route path="/clubs" element={<ProtectedLayout><PlaceholderPage title="Clubs & Culture Wall" /></ProtectedLayout>} />
          <Route path="/genie" element={<ProtectedLayout><PlaceholderPage title="Universal Genie" /></ProtectedLayout>} />
          <Route path="/connections" element={<ProtectedLayout><PlaceholderPage title="Connections" /></ProtectedLayout>} />
          <Route path="/saved" element={<ProtectedLayout><PlaceholderPage title="Saved Items" /></ProtectedLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
