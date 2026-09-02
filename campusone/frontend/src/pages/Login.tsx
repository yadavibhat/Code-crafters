import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Badge } from '../components/ui';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailClean = email.trim().toLowerCase();

    if (!emailClean.endsWith('@nmit.ac.in') && !emailClean.includes('nmit')) {
      setError('Only institutional emails (@nmit.ac.in) are permitted.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(email, otp || '123456');
    setIsLoading(false);
    if (success) {
      navigate('/onboarding');
    } else {
      setError('Invalid OTP code. Please try 123456.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            Campus<span style={{ color: 'var(--accent-color)' }}>One</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            NMIT Campus Intelligence Platform Login
          </p>
          <div style={{ marginTop: '12px' }}>
            <Badge variant="verified">NMIT Institutional SSO</Badge>
          </div>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="NMIT Institutional Email"
              placeholder="student.name@nmit.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" variant="primary" size="lg">
              Get Login OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              OTP sent to <strong>{email}</strong>. Use <strong>123456</strong> for testing.
            </div>
            <Input
              label="6-Digit Verification OTP"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
              Verify & Enter CampusOne
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep('email')}>
              ← Change Email
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
