import React, { useState, useRef, useEffect } from 'react';
import { DemoLogButton } from '../demo/components/DemoLogButton';
import { openQuoteDetail } from '../utils/quoteNav';
import { openBookingDetail } from '../utils/bookingNav';
import { openCreateQuoteWithCustomer } from '../utils/createQuoteNav';
import { openBilling } from '../utils/billingNav';
import { generateLedgerPdf } from '../shared/utils/generateLedgerPdf';
import { CustomerSidePanel } from '../shared/components/CustomerSidePanel';
import { RecordPaymentModal } from '../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../shared/components/PaymentDetailModal';
import { IndiaMapD3 } from '../shared/components/IndiaMapD3';
import { WorldMapD3 } from '../shared/components/WorldMapD3';
import { useDemoPopup, useDemoData } from '../context/DemoContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtAmount = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const parseAmt = (s) => parseInt((s || '0').replace(/[₹,\s]/g, ''), 10) || 0;

const StatusPill = ({ status }) => {
  const map = { confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', converted: 'Converted', sent: 'Sent', draft: 'Draft', approved: 'Approved', rejected: 'Rejected' };
  return <span className={`status-pill status-${status}`}>{map[status] || status}</span>;
};

// Extract paid amount from paymentText (e.g. "₹2,35,000 / ₹4,69,900" → 235000)
const getPaidAmt = (b) => {
  if (b.paymentStatus === 'paid') return parseAmt(b.amount);
  const m = (b.paymentText || '').match(/₹([0-9,]+)\s*\//);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
};

// Aggregate bookings by destination → sorted list
const aggDestinations = (bookings) => {
  const map = {};
  bookings.forEach(b => {
    const k = b.destination;
    if (!map[k]) map[k] = { name: k, trips: 0, total: 0 };
    map[k].trips++;
    map[k].total += parseAmt(b.amount);
  });
  return Object.values(map).sort((a, b) => b.total - a.total);
};

// Build ledger from bookings (debit) + payments (credit)
const buildLedger = (myBookings, myPayments) => {
  const entries = [];

  myBookings.filter(b => b.status !== 'cancelled').forEach(b => {
    entries.push({
      date: b.date,
      ref: b.id,
      refType: 'debit',
      desc: `Tax Invoice${b.destination ? ` (${b.destination})` : ''}`,
      debit: parseAmt(b.amount),
      credit: 0,
    });
  });

  myPayments.forEach(p => {
    entries.push({
      date: p.date,
      ref: p.id,
      refType: 'credit',
      desc: p.method || 'payment',
      debit: 0,
      credit: p.amount,
      bookingId: p.bookingId || '',
    });
  });

  // Sort oldest-first for running balance
  entries.sort((a, b) => {
    const da = new Date(a.date.split(' ').reverse().join(' '));
    const db = new Date(b.date.split(' ').reverse().join(' '));
    return da - db;
  });

  let running = 0;
  entries.forEach(e => {
    running += e.debit - e.credit;
    e.balance = running;
  });

  // Display newest first
  return entries.reverse();
};

// ─── Main CustomerProfile Component ──────────────────────────────────────────
// ─── Logs Popup ──────────────────────────────────────────────────────────────


export const CustomerProfile = ({ customerId, fromView, onBack, onViewChange }) => {
  const triggerDemoPopup = useDemoPopup();
  const { customers, profileData, bookings: allBookings, quotes: allQuotes, getPaymentById } = useDemoData();
    const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);

  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;

  const ext = (profileData && profileData[customerId]) || { city: '', state: '', country: '', emailOverride: '', tags: [], pan: '', gstin: '', company: '', payments: [] };
  const email = ext.emailOverride || customer.email;

  const myBookings = allBookings.filter(b => b.customerName === customer.name);
  const myQuotes   = allQuotes.filter(q => q.customerName === customer.name);
  const myPayments = ext.payments || [];

  // Financial stats
  const totalBookingValue = myBookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + parseAmt(b.amount), 0);
  const totalPaid         = myPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const pending           = Math.max(0, totalBookingValue - totalPaid);
  const advanceBalance    = Math.max(0, totalPaid - totalBookingValue);
  const progressPct       = totalBookingValue > 0 ? Math.min(100, Math.round((totalPaid / totalBookingValue) * 100)) : 0;

  // Top destinations
  const domesticBookings = myBookings.filter(b => b.destType === 'domestic' && b.status !== 'cancelled');
  const intlBookings     = myBookings.filter(b => b.destType === 'international' && b.status !== 'cancelled');
  const topDomestic      = aggDestinations(domesticBookings);
  const topIntl          = aggDestinations(intlBookings);

  // Ledger
  const ledgerEntries = buildLedger(myBookings, myPayments);
  const ledgerDebitTotal  = ledgerEntries.reduce((s, e) => s + e.debit,  0);
  const ledgerCreditTotal = ledgerEntries.reduce((s, e) => s + e.credit, 0);
  const ledgerBalance     = ledgerDebitTotal - ledgerCreditTotal;

  // Sorted bookings (newest first)
  const sortedBookings = [...myBookings].sort((a, b) => {
    const da = new Date(a.date.split(' ').reverse().join(' '));
    const db = new Date(b.date.split(' ').reverse().join(' '));
    return db - da;
  });

  // Sorted payments (newest first)
  const sortedPayments = [...myPayments].sort((a, b) => {
    const da = new Date(a.date.split(' ').reverse().join(' '));
    const db = new Date(b.date.split(' ').reverse().join(' '));
    return db - da;
  });

  const myLedger = (ext.ledger || []);

  return (
    <div id="view-customer-profile" className="fade-in">

      {/* ── Page Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">{customer.name}</h1>
            <p className="page-subtitle">{customer.id}</p>
          </div>
          <div className="dash-header-right">
            <button className="cp-back-btn" onClick={onBack}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <button className="cp-action-btn cp-action-outline" onClick={() => openCreateQuoteWithCustomer({ id: customer.id, name: customer.name, phone: customer.phone, email }, 'customer-profile')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Quote
            </button>
            <button className="cp-action-btn cp-action-outline" onClick={() => setRecordPaymentOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Add Payment
            </button>
            <button className="cp-action-btn cp-action-edit" onClick={() => setEditPanelOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              Edit
            </button>
            <button className="icon-btn" onClick={triggerDemoPopup} title="Export">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </button>
            <DemoLogButton />
            <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cp-body">

        {/* ── PANEL 1: Hero Card ── */}
        <div className="cp-hero-card">
          <div className="cp-hero-left">
            <div className="cp-hero-avatar" style={{ background: customer.gradient }}>{customer.initials}</div>
            <div className="cp-hero-info">
              <div className="cp-hero-name-row">
                <span className="cp-hero-name">{customer.name}</span>
                <span className="cp-type-badge cp-type-individual">{customer.type}</span>
                <button className="cp-ledger-btn" onClick={() => generateLedgerPdf({ customer, ext, myLedger: [...ledgerEntries].reverse().map(e => ({ date: e.date, desc: e.desc, debit: e.debit || undefined, credit: e.credit || undefined, balance: -e.balance })) })}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Ledger
                </button>
              </div>
              <div className="cp-hero-meta">
                <span className="cp-hero-id">{customer.id}</span>
                <span className="cp-hero-sep">·</span>
                <span className="cp-hero-since">Member since {customer.joined}</span>
              </div>
              {ext.tags && ext.tags.length > 0 && (
                <div className="cp-tags">
                  {ext.tags.map(tag => (
                    <span key={tag} className="cp-tag">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── PANEL 2: Personal Details + Address ── */}
        <div className="cp-detail-grid">
          <div className="cp-detail-card">
            <div className="cp-detail-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              PERSONAL DETAILS
            </div>
            <div className="cp-detail-rows">
              <div className="cp-detail-row">
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <span className="cp-field-label">PHONE</span>
                    <span className="cp-field-value">{customer.phone || '—'}</span>
                  </div>
                </div>
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <span className="cp-field-label">EMAIL</span>
                    <span className="cp-field-value">{email || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cp-detail-card">
            <div className="cp-detail-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ADDRESS
            </div>
            <div className="cp-detail-rows">
              <div className="cp-detail-row cp-addr-grid">
                {ext.city && (
                  <div className="cp-detail-field">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div>
                      <span className="cp-field-label">CITY</span>
                      <span className="cp-field-value">{ext.city}</span>
                    </div>
                  </div>
                )}
                {ext.state && (
                  <div className="cp-detail-field">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div>
                      <span className="cp-field-label">STATE</span>
                      <span className="cp-field-value">{ext.state}</span>
                    </div>
                  </div>
                )}
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <span className="cp-field-label">COUNTRY</span>
                    <span className="cp-field-value">{ext.country || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL 3: Business & Identity ── */}
        <div className="cp-section-card">
          <div className="cp-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M9 7h6M9 11h6"/></svg>
            BUSINESS &amp; IDENTITY
          </div>
          {ext.company || ext.pan || ext.gstin ? (
            <div className="cp-biz-rows">
              {ext.company && (
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
                  <div>
                    <span className="cp-field-label">COMPANY</span>
                    <span className="cp-field-value">{ext.company}</span>
                  </div>
                </div>
              )}
              {ext.pan && (
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h5"/></svg>
                  <div>
                    <span className="cp-field-label">PAN</span>
                    <span className="cp-field-value">{ext.pan}</span>
                  </div>
                </div>
              )}
              {ext.gstin && (
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div>
                    <span className="cp-field-label">GSTIN</span>
                    <span className="cp-field-value">{ext.gstin}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="cp-empty-text">No business details added.</p>
          )}
        </div>

        {/* ── PANEL 4: Financial Summary ── */}
        <div className="cp-fin-section">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            FINANCIAL SUMMARY
          </div>
          <div className="cp-fin-grid">
            <div className="cp-fin-card cp-fin-blue">
              <span className="cp-fin-label">Total Booking Value</span>
              <span className="cp-fin-value">{fmtAmount(totalBookingValue)}</span>
            </div>
            <div className="cp-fin-card cp-fin-green">
              <span className="cp-fin-label">Total Paid</span>
              <span className="cp-fin-value">{fmtAmount(totalPaid)}</span>
            </div>
            <div className="cp-fin-card cp-fin-amber">
              <span className="cp-fin-label">Pending</span>
              <span className="cp-fin-value">{fmtAmount(pending)}</span>
            </div>
            <div className="cp-fin-card cp-fin-purple">
              <span className="cp-fin-label">Advance Balance</span>
              <span className="cp-fin-value">{fmtAmount(advanceBalance)}</span>
            </div>
          </div>
          <div className="cp-fin-progress-wrap">
            <div className="cp-fin-progress-label">
              <span>Overall Payment Progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="cp-fin-progress-bar">
              <div className="cp-fin-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* ── PANEL 5: Top Domestic Destinations ── */}
        {topDomestic.length > 0 && (
          <div className="cp-dest-section">
            <div className="cp-dest-card">
              <div className="cp-dest-header">
                <div className="cp-dest-icon-row">
                  <div className="cp-dest-icon-wrap cp-dest-icon-wrap-orange">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="cp-dest-title-col">
                    <span className="cp-dest-title">Top Domestic Destinations</span>
                    <span className="cp-dest-subtitle">{topDomestic.length} destination{topDomestic.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="cp-dest-layout">
                <div className="cp-dest-map">
                  <IndiaMapD3 destinations={topDomestic} />
                </div>
                <div className="cp-dest-list">
                  <div className="cp-dest-list-label">TOP DESTINATIONS</div>
                  {topDomestic.map((d, i) => (
                    <div key={d.name} className="cp-dest-item">
                      <div className="cp-dest-rank">{i + 1}</div>
                      <div className="cp-dest-info">
                        <span className="cp-dest-name">{d.name}</span>
                        <span className="cp-dest-trips">{d.trips} trip{d.trips !== 1 ? 's' : ''} · {fmtAmount(d.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PANEL 6: Top International Destinations ── */}
        {topIntl.length > 0 && (
          <div className="cp-dest-section">
            <div className="cp-dest-card">
              <div className="cp-dest-header">
                <div className="cp-dest-icon-row">
                  <div className="cp-dest-icon-wrap cp-dest-icon-wrap-blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div className="cp-dest-title-col">
                    <span className="cp-dest-title">Top International Destinations</span>
                    <span className="cp-dest-subtitle">{topIntl.length} destination{topIntl.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="cp-dest-layout">
                <div className="cp-dest-map">
                  <WorldMapD3 destinations={topIntl} />
                </div>
                <div className="cp-dest-list">
                  <div className="cp-dest-list-label">TOP DESTINATIONS</div>
                  {topIntl.map((d, i) => (
                    <div key={d.name} className="cp-dest-item">
                      <div className="cp-dest-rank cp-dest-rank-blue">{i + 1}</div>
                      <div className="cp-dest-info">
                        <span className="cp-dest-name">{d.name}</span>
                        <span className="cp-dest-trips">{d.trips} trip{d.trips !== 1 ? 's' : ''} · {fmtAmount(d.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PANEL 7: Customer Ledger ── */}
        <div className="cp-section-card">
          <div className="cp-table-section-header">
            <div className="cp-section-heading" style={{marginBottom:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              CUSTOMER LEDGER ({ledgerEntries.length})
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="cp-tbl-btn" onClick={() => generateLedgerPdf({ customer, ext, myLedger: [...ledgerEntries].reverse().map(e => ({ date: e.date, desc: e.desc, debit: e.debit || undefined, credit: e.credit || undefined, balance: -e.balance })) })}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
              <button className="cp-tbl-btn" onClick={triggerDemoPopup}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>
          </div>
          {ledgerEntries.length > 0 ? (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>REF</th>
                    <th>DESCRIPTION</th>
                    <th style={{textAlign:'right'}}>DEBIT</th>
                    <th style={{textAlign:'right'}}>CREDIT</th>
                    <th style={{textAlign:'right'}}>BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((e, i) => (
                    <tr key={i}>
                      <td className="cp-td-date">{e.date}</td>
                      <td>
                        {e.refType === 'debit' ? (
                          <span className="cp-ref-debit" onClick={() => openBookingDetail(e.ref, 'customer-profile')}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                            {e.ref}
                          </span>
                        ) : (
                          <span className="cp-ref-credit" onClick={() => setPaymentDetailId(e.ref)}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>
                            {e.ref}
                          </span>
                        )}
                      </td>
                      <td className="cp-td-desc">{e.desc}</td>
                      <td className="cp-td-debit">{e.debit > 0 ? fmtAmount(e.debit) : ''}</td>
                      <td className="cp-td-credit">{e.credit > 0 ? fmtAmount(e.credit) : ''}</td>
                      <td className={e.balance === 0 ? 'cp-td-bal-zero' : e.balance > 0 ? 'cp-td-bal-dr' : 'cp-td-bal-cr'}>
                        {e.balance === 0 ? '₹0' : `${fmtAmount(Math.abs(e.balance))} ${e.balance > 0 ? 'Dr' : 'Cr'}`}
                      </td>
                    </tr>
                  ))}
                  <tr className="cp-ledger-totals">
                    <td colSpan={3} className="cp-ledger-totals-label">TOTALS</td>
                    <td className="cp-td-debit">{ledgerDebitTotal > 0 ? fmtAmount(ledgerDebitTotal) : '—'}</td>
                    <td className="cp-td-credit">{ledgerCreditTotal > 0 ? fmtAmount(ledgerCreditTotal) : '—'}</td>
                    <td className={ledgerBalance === 0 ? 'cp-td-bal-zero' : ledgerBalance > 0 ? 'cp-td-bal-dr' : 'cp-td-bal-cr'}>
                      {ledgerBalance === 0 ? '₹0' : `${fmtAmount(Math.abs(ledgerBalance))} ${ledgerBalance > 0 ? 'Dr' : 'Cr'}`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="cp-ledger-due" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px'}}>
                <span className="cp-ledger-due-label">Amount Due from Customer</span>
                <span className="cp-ledger-due-amount">{ledgerBalance > 0 ? fmtAmount(ledgerBalance) : '₹0'}</span>
              </div>
            </div>
          ) : (
            <p className="cp-empty-text">No transactions yet.</p>
          )}
        </div>

        {/* ── PANEL 8: Bookings ── */}
        <div className="cp-section-card">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            BOOKINGS ({sortedBookings.length})
          </div>
          {sortedBookings.length > 0 ? (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>BOOKING</th>
                    <th>DESTINATION</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th style={{textAlign:'right'}}>PAYABLE</th>
                    <th style={{textAlign:'right'}}>PAID</th>
                    <th>PAYMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings.map(b => {
                    const paidAmt = getPaidAmt(b);
                    return (
                      <tr key={b.id}>
                        <td><span className="qt-id cp-name-link" onClick={() => openBookingDetail(b.id, 'customer-profile')}>{b.id}</span></td>
                        <td>{b.destination || '—'}</td>
                        <td className="cp-td-date">{b.date}</td>
                        <td><StatusPill status={b.status} /></td>
                        <td className="cp-bk-payable">{b.amount}</td>
                        <td className={paidAmt > 0 ? 'cp-bk-paid' : 'cp-bk-paid-zero'}>{paidAmt > 0 ? fmtAmount(paidAmt) : '₹0'}</td>
                        <td>
                          <span className={`payment-badge payment-${b.paymentStatus}`}>
                            {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'partial' ? 'Partial' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="cp-empty-text">No bookings yet.</p>
          )}
        </div>

        {/* ── PANEL 9: Payment History ── */}
        <div className="cp-section-card">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            PAYMENT HISTORY ({sortedPayments.length})
          </div>
          {sortedPayments.length > 0 ? (
            <div className="cp-payment-list">
              {sortedPayments.map((p, i) => (
                <div key={i} className="cp-payment-row">
                  <div className="cp-payment-left">
                    <span className="cp-pay-ref-link" onClick={() => setPaymentDetailId(p.id)}>{p.id}</span>
                    <span className="cp-pay-meta">
                      {p.date} · {p.method}{p.bookingId ? ` · ${p.bookingId}` : ''}
                    </span>
                  </div>
                  <span className="cp-pay-amount">+{fmtAmount(p.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="cp-empty-text">No payments recorded yet.</p>
          )}
        </div>

        {/* ── Quotes (keep existing) ── */}
        <div className="cp-section-card">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            QUOTES ({myQuotes.length})
          </div>
          {myQuotes.length > 0 ? (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>QUOTE #</th>
                    <th>DESTINATION</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>TRIP DATE</th>
                    <th>CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {myQuotes.map(q => (
                    <tr key={q.id}>
                      <td><span className="qt-id cp-name-link" onClick={() => openQuoteDetail(q.id, 'customer-profile')}>{q.id}</span></td>
                      <td>
                        <div>
                          <span className="qt-dest-name">{q.destName}</span>
                          <span className="qt-dest-type">{q.destType}</span>
                        </div>
                      </td>
                      <td><span className="qt-amount">{q.amount}</span></td>
                      <td><StatusPill status={q.status} /></td>
                      <td><span className="qt-date">{q.tripDate}</span></td>
                      <td><span className="qt-date">{q.createdDate}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="cp-empty-text">No quotes yet.</p>
          )}
        </div>

      </div>

      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getPaymentById}
          onSave={triggerDemoPopup}
        />
      )}

      <CustomerSidePanel
        isOpen={editPanelOpen}
        mode="edit"
        customer={customer}
        profileExt={ext}
        onClose={() => setEditPanelOpen(false)}
        onSave={triggerDemoPopup}
      />

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        preselectedCustomer={customer}
        customers={customers}
        onSave={(data) => {
          addPayment({
            ...data,
            customerName: customer.name,
            customerId: customer.id,
          });
          setRecordPaymentOpen(false);
        }}
      />
    </div>
  );
};

export default CustomerProfile;
