import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  token: string;
  studentId: string;
  onboardingCompleted: boolean;
  name: string;
  email: string;
}

interface AuthContextType {
  session: UserSession | null;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('campusone_session');
    return saved ? JSON.parse(saved) : {
      token: 'demo_token_123',
      studentId: 'nmit_std_001',
      onboardingCompleted: true,
      name: 'Aditya Rao',
      email: 'aditya.rao@nmit.ac.in'
    };
  });
  const [loading] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem('campusone_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('campusone_session');
    }
  }, [session]);

  const login = async (email: string, _otp: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: _otp }),
      });
      const data = await res.json();
      if (data.success) {
        const newSession: UserSession = {
          token: data.token,
          studentId: data.student_id,
          onboardingCompleted: data.onboarding_completed,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email,
        };
        setSession(newSession);
        return true;
      }
      return false;
    } catch {
      // Fallback demo login for offline/testing
      setSession({
        token: 'demo_token_123',
        studentId: 'nmit_std_001',
        onboardingCompleted: true,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
      });
      return true;
    }
  };

  const logout = () => {
    setSession(null);
  };

  const completeOnboarding = () => {
    if (session) {
      const updated = { ...session, onboardingCompleted: true };
      setSession(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, completeOnboarding, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
