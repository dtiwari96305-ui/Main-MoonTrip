import React, { useState, useRef, useEffect } from 'react';
import { DemoLogButton } from '../demo/components/DemoLogButton';
import { openBilling } from '../utils/billingNav';
import { useDemoPopup } from '../context/DemoContext';

// ─── Plan data ─────────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Get started for free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { label: '5 quotes/month', included: true },
      { label: 'All GST forms', included: true },
      { label: '25 customers', included: true },
      { label: 'WhatsApp sharing', included: true },
      { label: 'Editable itinerary without images', included: true },
      { label: 'Branded PDF', included: false },
      { label: 'Payment management', included: false },
      { label: 'Reports & analytics', included: false },
    ],
    cta: 'Downgrade',
    isCurrent: false,
    isMostPopular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo travel agents',
    monthlyPrice: 499,
    annualPrice: 399,
    features: [
      { label: '50 quotes/month', included: true },
      { label: 'All GST forms', included: true },
      { label: '200 customers', included: true },
      { label: 'Branded PDF', included: true },
      { label: 'WhatsApp sharing', included: true },
      { label: 'Payment management', included: true },
      { label: 'Logo on PDF', included: true },
      { label: 'Editable itinerary without images', included: true },
      { label: 'Reports & analytics', included: false },
    ],
    cta: 'Downgrade',
    isCurrent: false,
    isMostPopular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For growing agencies',
    monthlyPrice: 999,
    annualPrice: 799,
    features: [
      { label: 'Unlimited quotes', included: true },
      { label: 'Unlimited customers', included: true },
      { label: 'All Starter features', included: true },
      { label: 'Reports & analytics', included: true },
      { label: 'Custom itinerary with images', included: true },
      { label: 'All itinerary themes', included: true },
      { label: '3 users', included: true },
    ],
    cta: 'Downgrade',
    isCurrent: false,
    isMostPopular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For large agencies & enterprises',
    monthlyPrice: 4999,
    annualPrice: 3999,
    features: [
      { label: 'Everything unlimited', included: true },
      { label: '10 users', included: true },
      { label: 'Vendor quote import', included: true },
      { label: 'Custom itinerary with images', included: true },
      { label: 'All itinerary themes', included: true },
      { label: 'Priority support', included: true },
      { label: 'Extra seats available', included: true },
    ],
    cta: 'Your current plan',
    isCurrent: true,
    isMostPopular: false,
  },
];

// ─── Check / X icons ──────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#22c55e', flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#cbd5e1', flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Main Billing Component ───────────────────────────────────────────────────
// ─── Logs Popup ──────────────────────────────────────────────────────────────


export const Billing = ({ fromView, onBack }) => {
  const triggerDemoPopup = useDemoPopup();
    const [billingPeriod, setBillingPeriod] = useState('monthly');

  const fmtPrice = (n) => n.toLocaleString('en-IN');

  return (
    <div className="page-view fade-in">

      {/* ── Page Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="bl-breadcrumb">
              <button className="cp-back-btn" onClick={onBack}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                Back
              </button>
              <span className="bl-breadcrumb-sep">/</span>
              <span className="bl-breadcrumb-current">Billing</span>
            </div>
            <h1 className="page-title">Billing</h1>
            <p className="page-subtitle">Manage your subscription and usage</p>
          </div>
          <div className="dash-header-right">
            {/* Powered by Dodo */}
            <button className="bl-dodo-btn" onClick={triggerDemoPopup}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Powered by Dodo
            </button>
            {/* Bell with badge */}
            <div className="bl-bell-wrap">
              <button className="icon-btn" onClick={triggerDemoPopup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <span className="bl-bell-badge">2</span>
            </div>
            {/* Log button */}
            <DemoLogButton />
            {/* User block */}
            <div className="header-user bl-user-clickable" onClick={triggerDemoPopup}>
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bl-body">

        {/* ── Current Plan Card ── */}
        <div className="bl-current-plan-card">
          <div className="bl-current-left">
            <div className="bl-plan-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z" />
              </svg>
            </div>
            <div className="bl-current-info">
              <div className="bl-current-name-row">
                <span className="bl-current-plan-name">Pro Plan</span>
                <span className="bl-active-badge">
                  <span className="bl-active-dot"></span>
                  Active
                </span>
              </div>
              <span className="bl-current-tagline">For large agencies &amp; enterprises</span>
              <button className="bl-manage-btn" onClick={triggerDemoPopup}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Manage Subscription
              </button>
            </div>
          </div>
          <div className="bl-current-price">
            <span className="bl-current-price-num">₹4999</span>
            <span className="bl-current-price-per">/mo</span>
          </div>
        </div>

        {/* ── Usage Stats ── */}
        <div className="bl-usage-grid">
          <div className="bl-usage-card">
            <div className="bl-usage-left">
              <span className="bl-usage-label">Quotes Used</span>
              <div className="bl-usage-count">
                <span className="bl-usage-num">2</span>
                <span className="bl-usage-sep">/</span>
                <span className="bl-usage-limit">∞</span>
              </div>
              <span className="bl-usage-note bl-usage-note-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited <span style={{color:'#94a3b8', fontWeight:400}}>on your plan</span>
              </span>
            </div>
            <div className="bl-usage-icon bl-usage-icon-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>

          <div className="bl-usage-card">
            <div className="bl-usage-left">
              <span className="bl-usage-label">Customers</span>
              <div className="bl-usage-count">
                <span className="bl-usage-num">7</span>
                <span className="bl-usage-sep">/</span>
                <span className="bl-usage-limit">∞</span>
              </div>
              <span className="bl-usage-note bl-usage-note-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited <span style={{color:'#94a3b8', fontWeight:400}}>on your plan</span>
              </span>
            </div>
            <div className="bl-usage-icon bl-usage-icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          <div className="bl-usage-card">
            <div className="bl-usage-left">
              <span className="bl-usage-label">Team Members</span>
              <div className="bl-usage-count">
                <span className="bl-usage-num">1</span>
                <span className="bl-usage-sep">/</span>
                <span className="bl-usage-limit">10</span>
              </div>
              <div className="bl-progress-wrap">
                <div className="bl-progress-bar">
                  <div className="bl-progress-fill" style={{ width: '10%' }}></div>
                </div>
                <span className="bl-progress-label">10% used</span>
              </div>
            </div>
            <div className="bl-usage-icon bl-usage-icon-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Available Plans ── */}
        <div className="bl-plans-section">
          <div className="bl-plans-header">
            <div>
              <h2 className="bl-plans-title">Available Plans</h2>
              <p className="bl-plans-sub">Choose the plan that fits your agency</p>
            </div>
            <div className="bl-period-toggle">
              <button
                className={`bl-period-btn ${billingPeriod === 'monthly' ? 'bl-period-active' : ''}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`bl-period-btn ${billingPeriod === 'annually' ? 'bl-period-active' : ''}`}
                onClick={() => setBillingPeriod('annually')}
              >
                Annually
              </button>
            </div>
          </div>

          <div className="bl-plan-cards">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bl-plan-card${plan.isMostPopular ? ' bl-plan-popular' : ''}${plan.isCurrent ? ' bl-plan-current' : ''}`}
              >
                {plan.isMostPopular && (
                  <div className="bl-popular-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z" />
                    </svg>
                    Most Popular
                  </div>
                )}
                {plan.isCurrent && (
                  <div className="bl-current-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Current Plan
                  </div>
                )}

                <div className="bl-plan-name">{plan.name}</div>
                <div className="bl-plan-tagline">{plan.tagline}</div>

                <div className="bl-plan-price-row">
                  {plan.monthlyPrice === 0 ? (
                    <span className="bl-plan-price">₹0</span>
                  ) : (
                    <>
                      <span className="bl-plan-price">
                        ₹{fmtPrice(billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice)}
                      </span>
                      <span className="bl-plan-per">/month</span>
                    </>
                  )}
                </div>
                {billingPeriod === 'annually' && plan.monthlyPrice > 0 && (
                  <div className="bl-annual-note">billed annually</div>
                )}

                <div className="bl-feature-list">
                  {plan.features.map((f, i) => (
                    <div key={i} className={`bl-feature-row${!f.included ? ' bl-feature-excluded' : ''}`}>
                      {f.included ? <CheckIcon /> : <XIcon />}
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>

                {plan.isCurrent ? (
                  <div className="bl-current-plan-label">Your current plan</div>
                ) : (
                  <button className="bl-plan-cta" onClick={triggerDemoPopup}>
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Billing History ── */}
        <div className="bl-history-card">
          <div className="bl-history-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Billing History
          </div>
          <div className="bl-history-empty">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: 12 }}>
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="bl-history-empty-title">No billing events yet</p>
            <p className="bl-history-empty-sub">Events will appear here once you subscribe to a plan</p>
          </div>
        </div>

        {/* ── Support Cards ── */}
        <div className="bl-support-grid">
          <button className="bl-support-card" onClick={triggerDemoPopup}>
            <div className="bl-support-icon bl-support-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="bl-support-info">
              <span className="bl-support-label">WhatsApp Support</span>
              <span className="bl-support-value">+91 85113 62508</span>
            </div>
            <svg className="bl-support-ext" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>

          <button className="bl-support-card" onClick={triggerDemoPopup}>
            <div className="bl-support-icon bl-support-red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="bl-support-info">
              <span className="bl-support-label">Email Support</span>
              <span className="bl-support-value">support@touridoo.app</span>
            </div>
            <svg className="bl-support-ext" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
};
