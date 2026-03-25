import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import '../styles/auth.css';

/* ─── helpers ─────────────────────────────────────────────── */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const countryCodes = [
  { code: 'IN', dial: '+91' },
  { code: 'US', dial: '+1' },
  { code: 'GB', dial: '+44' },
  { code: 'AE', dial: '+971' },
  { code: 'SG', dial: '+65' },
  { code: 'AU', dial: '+61' },
];

/* ─── Step Indicator ──────────────────────────────────────── */
const StepIndicator = ({ step }) => {
  const steps = ['Your Details', 'Nomenclature', 'Verify Email'];
  return (
    <div className="auth-steps">
      {steps.map((label, i) => {
        const num     = i + 1;
        const isDone  = step > num;
        const isActive = step === num;
        const state   = isDone ? 'completed' : isActive ? 'active' : 'upcoming';
        return (
          <React.Fragment key={num}>
            <div className="auth-step">
              <div className={`auth-step-circle ${state}`}>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : num}
              </div>
              <span className={`auth-step-label ${state}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`auth-step-line ${step > num ? 'done' : 'pending'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Accordion (Nomenclature) ────────────────────────────── */
const NomenclatureAccordion = ({ title, values, onChange }) => {
  const [open, setOpen] = useState(false);
  const preview = [values.prefix, values.startNum, values.suffix].filter(Boolean).join('-');

  return (
    <div className="auth-accordion">
      <div
        className={`auth-accordion-header${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className="auth-accordion-hash">#</span>
        <span>{title}</span>
        <svg className={`auth-accordion-chevron${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open && (
        <div className="auth-accordion-body">
          {/* Prefix */}
          <div className="auth-field">
            <div className="auth-label">
              Prefix (Optional)
              <span className="auth-info-icon" title="Letters, numbers, hyphens only.">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
            </div>
            <input
              type="text"
              className="auth-input"
              value={values.prefix}
              onChange={(e) => onChange('prefix', e.target.value)}
              maxLength={10}
            />
            <div className="auth-hint">Optional. Letters, numbers, hyphens. Can be changed later.</div>
          </div>

          {/* Starting Number */}
          <div className="auth-field">
            <div className="auth-label">Starting Number</div>
            <input
              type="number"
              className="auth-input"
              value={values.startNum}
              onChange={(e) => onChange('startNum', e.target.value)}
              min={1}
            />
            <div className="auth-hint">Default is 1. Set higher if continuing from another system.</div>
          </div>

          {/* Suffix */}
          <div className="auth-field">
            <div className="auth-label">
              Suffix (Optional)
              <span className="auth-info-icon" title="E.g., financial year code.">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
            </div>
            <input
              type="text"
              className="auth-input"
              value={values.suffix}
              onChange={(e) => onChange('suffix', e.target.value)}
              maxLength={10}
            />
            <div className="auth-hint">Optional. E.g., financial year code. Can be changed later.</div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="auth-preview-card">
              <div className="auth-preview-label">Preview — Your first booking number</div>
              <div className="auth-preview-value">{preview}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── OTP Boxes ────────────────────────────────────────────── */
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
   SIGN UP — 3-step flow
═══════════════════════════════════════════════════════════ */
export const SignUp = ({ onSuccess, onSignIn, onDemo }) => {
  const [step, setStep] = useState(1);

  /* Step 1 fields */
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [dialCode, setDialCode]     = useState('IN +91');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [company, setCompany]       = useState('');
  const [hasGst, setHasGst]         = useState(false);
  const [gstin, setGstin]           = useState('');
  const [gstStatus, setGstStatus]   = useState(''); // '', 'verifying', 'ok', 'error'
  const [gstMsg, setGstMsg]         = useState('');
  const [step1Error, setStep1Error] = useState('');

  /* Step 2 fields */
  const [booking, setBooking]   = useState({ prefix: 'M', startNum: '1', suffix: 'FY26' });
  const [invoice, setInvoice]   = useState({ prefix: 'INV', startNum: '1', suffix: 'FY26' });
  const [step2Error, setStep2Error] = useState('');

  /* Step 3 OTP */
  const [otp, setOtp]           = useState('');
  const [sending, setSending]   = useState(true);
  const [sendError, setSendError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);

  /* ── Step 1 validation ─────────────────────────────────── */
  const step1Valid = firstName.trim() && lastName.trim() && phone.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8 && company.trim() &&
    (!hasGst || gstStatus === 'ok');

  const verifyGstin = () => {
    const val = gstin.trim().toUpperCase();
    if (!GSTIN_REGEX.test(val)) {
      setGstStatus('error');
      setGstMsg('Invalid GSTIN format. Please check and try again.');
      return;
    }
    setGstStatus('verifying');
    setGstMsg('');
    // Simulate API call — replace with real GST API integration
    setTimeout(() => {
      setGstStatus('ok');
      setGstMsg('GSTIN verified successfully.');
    }, 1200);
  };

  const handleStep1 = () => {
    setStep1Error('');
    if (!firstName.trim() || !lastName.trim()) { setStep1Error('First and last name are required.'); return; }
    if (!phone.trim()) { setStep1Error('Phone number is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStep1Error('Please enter a valid email address.'); return; }
    if (password.length < 8) { setStep1Error('Password must be at least 8 characters.'); return; }
    if (!company.trim()) { setStep1Error('Company name is required.'); return; }
    if (hasGst && gstStatus !== 'ok') { setStep1Error('Please verify your GSTIN before proceeding.'); return; }
    setStep(2);
  };

  const handleStep2 = () => {
    setStep(3);
  };

  /* ── Send OTP when step 3 mounts ───────────────────────── */
  useEffect(() => {
    if (step !== 3) return;
    setSending(true);
    setSendError('');
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          company_name: company.trim(),
        },
      },
    }).then(({ error }) => {
      setSending(false);
      if (error && !error.message.toLowerCase().includes('already registered')) {
        setSendError(error.message);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleResendOtp = async () => {
    setSending(true);
    setSendError('');
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    setSending(false);
    if (error) setSendError('Failed to resend. Please try again.');
  };

  const handleCreateAccount = async () => {
    if (otp.length < 6) return;
    setOtpError('');
    setVerifying(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: 'signup',
    });
    setVerifying(false);

    if (error) {
      setOtpError('Invalid or expired code. Try again.');
      setOtp('');
      return;
    }

    /* Save profile data */
    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: `${dialCode} ${phone.trim()}`,
        company_name: company.trim(),
        gstin: hasGst ? gstin.trim().toUpperCase() : null,
        booking_prefix: booking.prefix,
        booking_start: parseInt(booking.startNum) || 1,
        booking_suffix: booking.suffix,
        invoice_prefix: invoice.prefix,
        invoice_start: parseInt(invoice.startNum) || 1,
        invoice_suffix: invoice.suffix,
      });
    }

    onSuccess();
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="auth-root">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo-row">
          <img src="/assets/touridoo-logo.png" alt="Touridoo" className="auth-logo-img" />
          <span className="auth-logo-name">Touridoo</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Set up your travel agency in minutes</p>

        <StepIndicator step={step} />

        {/* ── STEP 1: Your Details ─────────────────────────── */}
        {step === 1 && (
          <>
            {step1Error && <div className="auth-global-error">{step1Error}</div>}

            {/* Name row */}
            <div className="auth-field-row">
              <div className="auth-field" style={{ marginBottom: 0 }}>
                <div className="auth-label">First Name <span className="auth-required">*</span></div>
                <input type="text" className="auth-input" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="auth-field" style={{ marginBottom: 0 }}>
                <div className="auth-label">Last Name <span className="auth-required">*</span></div>
                <input type="text" className="auth-input" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            {/* Phone */}
            <div className="auth-field">
              <div className="auth-label">Phone Number <span className="auth-required">*</span></div>
              <div className="auth-phone-row">
                <select className="auth-phone-select" value={dialCode} onChange={e => setDialCode(e.target.value)}>
                  {countryCodes.map(c => (
                    <option key={c.code} value={`${c.code} ${c.dial}`}>{c.code} {c.dial}</option>
                  ))}
                </select>
                <input type="tel" className="auth-phone-input" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <div className="auth-label">Email <span className="auth-required">*</span></div>
              <input type="email" className="auth-input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-label">Create Password <span className="auth-required">*</span></div>
              <div className="auth-input-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            {/* Company */}
            <div className="auth-field">
              <div className="auth-label">Company Name <span className="auth-required">*</span></div>
              <input type="text" className="auth-input" placeholder="My Travel Agency" value={company} onChange={e => setCompany(e.target.value)} />
            </div>

            {/* GST checkbox */}
            <div
              className="auth-checkbox-row"
              onClick={() => { setHasGst(v => !v); setGstStatus(''); setGstMsg(''); }}
            >
              <div className={`auth-checkbox${hasGst ? ' checked' : ''}`}>
                {hasGst && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span className="auth-checkbox-label">Does your company have GST?</span>
            </div>

            {hasGst && (
              <div className="auth-field">
                <div className="auth-gstin-row">
                  <input
                    type="text"
                    className={`auth-input${gstStatus === 'error' ? ' auth-input-error' : ''}`}
                    placeholder="22AAAAA0000A1Z5"
                    value={gstin}
                    onChange={e => { setGstin(e.target.value.toUpperCase()); setGstStatus(''); setGstMsg(''); }}
                    maxLength={15}
                  />
                  <button
                    type="button"
                    className={`auth-verify-btn${gstStatus === 'verifying' ? ' verifying' : ''}`}
                    onClick={verifyGstin}
                    disabled={gstStatus === 'verifying'}
                  >
                    {gstStatus === 'verifying' ? (
                      <span className="auth-spinner" style={{ width: 14, height: 14 }} />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    )}
                    Verify
                  </button>
                </div>
                <div className="auth-hint">Enter GSTIN and click Verify to auto-fill company details</div>
                {gstMsg && (
                  <div style={{ fontSize: 12.5, marginTop: 5, color: gstStatus === 'ok' ? '#86efac' : '#fca5a5' }}>
                    {gstStatus === 'ok' && '✓ '}{gstMsg}
                  </div>
                )}
              </div>
            )}

            <button className="auth-btn-primary" style={{ marginTop: 8 }} onClick={handleStep1} disabled={!step1Valid}>
              Proceed{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div className="auth-bottom-links">
              Already have an account?{' '}
              <span className="auth-link" onClick={onSignIn}>Sign in</span>
            </div>
            <div className="auth-bottom-links" style={{ marginTop: 4 }}>
              <span className="auth-link" style={{ color: '#6b7280', fontWeight: 400 }} onClick={onDemo}>View as Guest</span>
            </div>
          </>
        )}

        {/* ── STEP 2: Nomenclature ────────────────────────── */}
        {step === 2 && (
          <>
            {step2Error && <div className="auth-global-error">{step2Error}</div>}

            <NomenclatureAccordion
              title="Booking Nomenclature"
              values={booking}
              onChange={(field, val) => setBooking(prev => ({ ...prev, [field]: val }))}
            />
            <NomenclatureAccordion
              title="Tax Invoice / Booking Nomenclature"
              values={invoice}
              onChange={(field, val) => setInvoice(prev => ({ ...prev, [field]: val }))}
            />

            <div className="auth-btn-row">
              <button className="auth-btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="auth-btn-primary" onClick={handleStep2}>
                Proceed{' '}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            <div className="auth-trial-link-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="auth-link" style={{ fontWeight: 400, color: '#6b7280' }} onClick={onDemo}>Create a trial account instead</span>
            </div>
            <div className="auth-bottom-links">
              Already have an account?{' '}
              <span className="auth-link" onClick={onSignIn}>Sign in</span>
            </div>
            <div className="auth-bottom-links" style={{ marginTop: 4 }}>
              <span className="auth-link" style={{ color: '#6b7280', fontWeight: 400 }} onClick={onDemo}>View as Guest</span>
            </div>
          </>
        )}

        {/* ── STEP 3: Verify Email ─────────────────────────── */}
        {step === 3 && (
          <>
            <div className="auth-otp-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e8eaed', textAlign: 'center', margin: '0 0 8px' }}>
              Verify your email
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', margin: '0 0 4px' }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: '#e8eaed' }}>{email}</strong>
            </p>

            {sendError && <div className="auth-global-error" style={{ marginTop: 14 }}>{sendError}</div>}

            <OtpBoxes value={otp} onChange={setOtp} hasError={!!otpError} />

            {otpError && (
              <div className="auth-error-msg" style={{ justifyContent: 'center', marginBottom: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {otpError}
              </div>
            )}

            <div className="auth-otp-status">
              {sending ? (
                <>
                  <span className="auth-spinner" />
                  Sending code…
                </>
              ) : (
                <>
                  Didn't receive a code?{' '}
                  <span className="auth-link" onClick={handleResendOtp}>Resend</span>
                </>
              )}
            </div>

            <div className="auth-btn-row" style={{ marginTop: 20 }}>
              <button className="auth-btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button
                className="auth-btn-primary"
                onClick={handleCreateAccount}
                disabled={otp.length < 6 || verifying}
              >
                {verifying ? <span className="auth-spinner" /> : null}
                {verifying ? 'Verifying…' : <>Create Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></>}
              </button>
            </div>

            <div className="auth-trial-link-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="auth-link" style={{ fontWeight: 400, color: '#6b7280' }} onClick={onDemo}>Create a trial account instead</span>
            </div>
            <div className="auth-bottom-links">
              Already have an account?{' '}
              <span className="auth-link" onClick={onSignIn}>Sign in</span>
            </div>
            <div className="auth-bottom-links" style={{ marginTop: 4 }}>
              <span className="auth-link" style={{ color: '#6b7280', fontWeight: 400 }} onClick={onDemo}>View as Guest</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
