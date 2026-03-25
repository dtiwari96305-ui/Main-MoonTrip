import React, { useState, useRef } from 'react';
import { supabase } from '../../shared/lib/supabase';
import '../styles/auth.css';

/* ─── OTP Boxes (same pattern as SignUp) ──────────────────── */
const OtpBoxes = ({ value, onChange, hasError }) => {
  const refs = useRef([]);
  const digits = Array(6).fill('').map((_, i) => value[i] || '');

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits]; next[i] = '';
        onChange(next.join(''));
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        const next = [...digits]; next[i - 1] = '';
        onChange(next.join(''));
      }
    }
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const next = [...digits]; next[i] = char;
    onChange(next.join(''));
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
    e.preventDefault();
  };

  return (
    <div className="auth-otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`auth-otp-input${hasError ? ' auth-otp-error' : ''}`}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   FORGOT PASSWORD — 3 sub-steps:
   1) Enter email → send reset code
   2) Enter OTP
   3) New password
═══════════════════════════════════════════════════════════ */
export const ForgotPassword = ({ onBack }) => {
  const [subStep, setSubStep] = useState(1);

  /* Sub-step 1 */
  const [email, setEmail]       = useState('');
  const [sending, setSending]   = useState(false);
  const [sendError, setSendError] = useState('');

  /* Sub-step 2 */
  const [otp, setOtp]           = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);

  /* Sub-step 3 */
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetting, setResetting]   = useState(false);
  const [done, setDone]             = useState(false);

  /* ── Sub-step 1: Send reset code ───────────────────────── */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setSendError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSendError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setSending(false);
    if (error) {
      setSendError(error.message);
      return;
    }
    setSubStep(2);
  };

  /* ── Sub-step 2: Verify OTP ────────────────────────────── */
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setOtpError('');
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: 'recovery',
    });
    setVerifying(false);
    if (error) {
      setOtpError('Invalid or expired code. Try again.');
      setOtp('');
      return;
    }
    setSubStep(3);
  };

  const handleResend = async () => {
    setSending(true);
    await supabase.auth.resetPasswordForEmail(email.trim());
    setSending(false);
  };

  /* ── Sub-step 3: Set new password ──────────────────────── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (newPw.length < 8)       { setResetError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw)    { setResetError('Passwords do not match.'); return; }
    setResetting(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setResetting(false);
    if (error) { setResetError(error.message); return; }
    setDone(true);
    setTimeout(() => onBack(), 2200);
  };

  return (
    <div className="auth-root">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo-row">
          <img src="/assets/touridoo-logo.png" alt="Touridoo" className="auth-logo-img" />
          <span className="auth-logo-name">Touridoo</span>
        </div>

        {/* ── Sub-step 1: Email ──────────────────────────── */}
        {subStep === 1 && (
          <>
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a reset code</p>

            {sendError && <div className="auth-global-error">{sendError}</div>}

            <form onSubmit={handleSendCode} noValidate>
              <div className="auth-field">
                <div className="auth-label">Email address</div>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <button type="submit" className="auth-btn-primary" style={{ marginTop: 8 }} disabled={sending || !email.trim()}>
                {sending ? <span className="auth-spinner" /> : null}
                {sending ? 'Sending…' : <>Send Reset Code <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>}
              </button>
            </form>

            <div className="auth-bottom-links">
              <span className="auth-link" onClick={onBack}>← Back to Sign In</span>
            </div>
          </>
        )}

        {/* ── Sub-step 2: OTP ───────────────────────────── */}
        {subStep === 2 && (
          <>
            <div className="auth-otp-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e8eaed', textAlign: 'center', margin: '0 0 8px' }}>
              Enter reset code
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', margin: '0 0 4px' }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: '#e8eaed' }}>{email}</strong>
            </p>

            {otpError && (
              <div className="auth-error-msg" style={{ justifyContent: 'center', margin: '12px 0 4px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {otpError}
              </div>
            )}

            <OtpBoxes value={otp} onChange={setOtp} hasError={!!otpError} />

            <div className="auth-otp-status" style={{ marginBottom: 20 }}>
              Didn't receive a code?{' '}
              <span className="auth-link" onClick={handleResend}>
                {sending ? 'Sending…' : 'Resend'}
              </span>
            </div>

            <div className="auth-btn-row">
              <button className="auth-btn-secondary" onClick={() => setSubStep(1)}>Back</button>
              <button
                className="auth-btn-primary"
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || verifying}
              >
                {verifying ? <span className="auth-spinner" /> : null}
                {verifying ? 'Verifying…' : <>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>}
              </button>
            </div>
          </>
        )}

        {/* ── Sub-step 3: New password ─────────────────── */}
        {subStep === 3 && (
          <>
            <h1 className="auth-title">Set new password</h1>
            <p className="auth-subtitle">Choose a strong password for your account</p>

            {done && (
              <div className="auth-global-success">
                ✓ Password reset successfully! Redirecting to Sign In…
              </div>
            )}

            {!done && (
              <>
                {resetError && <div className="auth-global-error">{resetError}</div>}
                <form onSubmit={handleResetPassword} noValidate>
                  {/* New Password */}
                  <div className="auth-field">
                    <div className="auth-label">New Password</div>
                    <div className="auth-input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="Min 8 characters"
                        value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        autoFocus
                      />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                        {showNew ? (
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

                  {/* Confirm Password */}
                  <div className="auth-field">
                    <div className="auth-label">Confirm Password</div>
                    <div className="auth-input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="Re-enter password"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                      />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                        {showConfirm ? (
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

                  <button type="submit" className="auth-btn-primary" style={{ marginTop: 8 }} disabled={resetting || !newPw || !confirmPw}>
                    {resetting ? <span className="auth-spinner" /> : null}
                    {resetting ? 'Resetting…' : <>Reset Password <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
