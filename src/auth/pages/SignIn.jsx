import React, { useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import '../styles/auth.css';

export const SignIn = ({ onSuccess, onSignUp, onForgotPassword, onDemo }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending]   = useState(false);
  const [resendMsg, setResendMsg]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverified(false);
    setResendMsg('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }

    setLoading(true);
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (signInErr) {
      if (signInErr.message.toLowerCase().includes('email not confirmed')) {
        setUnverified(true);
      } else {
        setError('Invalid email or password. Please try again.');
      }
      return;
    }

    if (data?.session) {
      onSuccess();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    const { error: resendErr } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    setResending(false);
    if (resendErr) {
      setResendMsg('Failed to resend. Please try again.');
    } else {
      setResendMsg('Verification email sent! Check your inbox.');
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo-row">
          <img src="/assets/touridoo-logo.png" alt="Touridoo" className="auth-logo-img" />
          <span className="auth-logo-name">Touridoo</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && <div className="auth-global-error">{error}</div>}

        {unverified && (
          <div className="auth-global-error">
            Please verify your email before signing in.{' '}
            <span
              className="auth-link"
              onClick={handleResend}
              style={{ pointerEvents: resending ? 'none' : 'auto' }}
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </span>
            {resendMsg && <div style={{ marginTop: 6, color: resendMsg.startsWith('Verification') ? '#86efac' : '#fca5a5' }}>{resendMsg}</div>}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <div className="auth-label">Email address</div>
            <input
              type="email"
              className="auth-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <div className="auth-label">Password</div>
              <span className="auth-forgot-link" onClick={onForgotPassword}>Forgot password?</span>
            </div>
            <div className="auth-input-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn-primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Signing in…' : <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>}
          </button>
        </form>

        <div className="auth-bottom-links">
          Don't have an account?{' '}
          <span className="auth-link" onClick={onSignUp}>Create one</span>
        </div>
        <div className="auth-bottom-links" style={{ marginTop: 4 }}>
          <span className="auth-link" style={{ color: '#6b7280', fontWeight: 400 }} onClick={onDemo}>View as Guest</span>
        </div>
      </div>
    </div>
  );
};
