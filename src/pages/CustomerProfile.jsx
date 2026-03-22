import React, { useState } from 'react';
import { demoCustomers as customers } from '../shared/data/demoData';
import { openQuoteDetail } from '../utils/quoteNav';
import { openBookingDetail } from '../utils/bookingNav';
import { openCreateQuoteWithCustomer } from '../utils/createQuoteNav';
import { openBilling } from '../utils/billingNav';
import { generateLedgerPdf } from '../shared/utils/generateLedgerPdf';
import { CustomerSidePanel } from '../shared/components/CustomerSidePanel';
import { RecordPaymentModal } from '../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../shared/components/PaymentDetailModal';
import { useDemoPopup } from '../context/DemoContext';
import { getDemoPaymentById } from '../shared/data/demoData';

// ─── Extended profile data per customer ───────────────────────────────────────
export const profileData = {
  'WL-C-0001': {
    city: 'Mumbai', state: 'Maharashtra', country: 'India',
    emailOverride: 'rahul.sharma@email.com',
    tags: ['international', 'solo'],
    pan: '', gstin: '', company: '',
    ledger: [
      { id: 'REC-0001', date: '09 Mar 2026', desc: 'Cash(Advance) - INV-101', credit: 140952, balance: 140952 },
    ],
    payments: [
      { id: 'REC-0001', badge: 'Advance', date: '09 Mar 2026', method: 'cash', amount: 140952 },
    ],
  },
  'WL-C-0002': {
    city: 'New Delhi', state: 'Delhi', country: 'India',
    emailOverride: 'priya.mehta@email.com',
    tags: ['domestic', 'family'],
    pan: '', gstin: '', company: '',
    ledger: [
      { id: 'REC-0005', date: '07 Mar 2026', desc: 'upi(Advance) - UPI/326541239876', credit: 25000, balance: 25000 },
    ],
    payments: [
      { id: 'REC-0005', badge: 'Advance', date: '07 Mar 2026', method: 'upi', amount: 25000 },
    ],
  },
  'WL-C-0003': {
    city: 'Bangalore', state: 'Karnataka', country: 'India',
    emailOverride: 'vikram.iyer@email.com',
    tags: ['domestic', 'corporate', 'group'],
    pan: 'AABCV1234D', gstin: '29AABCV1234D1Z5', company: 'Iyer Enterprises Pvt. Ltd.',
    ledger: [
      { id: 'REC-0002', date: '09 Mar 2026', desc: 'Bank Transfer(Advance) - REF/449827312', credit: 469900, balance: 469900 },
    ],
    payments: [
      { id: 'REC-0002', badge: 'Advance', date: '09 Mar 2026', method: 'bank', amount: 469900 },
    ],
  },
  'WL-C-0004': {
    city: 'Hyderabad', state: 'Telangana', country: 'India',
    emailOverride: 'ananya.reddy@email.com',
    tags: ['international', 'honeymoon'],
    pan: '', gstin: '', company: '',
    ledger: [],
    payments: [],
  },
  'WL-C-0005': {
    city: 'Ahmedabad', state: 'Gujarat', country: 'India',
    emailOverride: 'rajesh.patel@email.com',
    tags: ['domestic', 'corporate', 'family'],
    pan: 'ABCPR9876F', gstin: '24ABCPR9876F1ZP', company: 'Patel Group of Companies',
    ledger: [
      { id: 'REC-0003', date: '01 Mar 2026', desc: 'Card(Full Payment) - TXID/889234100', credit: 156880, balance: 156880 },
    ],
    payments: [
      { id: 'REC-0003', badge: 'Full', date: '01 Mar 2026', method: 'card', amount: 156880 },
    ],
  },
  'WL-C-0006': {
    city: 'Jaipur', state: 'Rajasthan', country: 'India',
    emailOverride: 'arjun.singh@email.com',
    tags: ['domestic', 'adventure'],
    pan: '', gstin: '', company: '',
    ledger: [],
    payments: [],
  },
};

// ─── Booking data (mirrored from Bookings.jsx) ────────────────────────────────
const allBookings = [
  { id: 'WL-B-0002', customerName: 'Rahul Sharma', destination: 'Bali, Indonesia', amount: '₹1,40,952', profit: '₹18,000', paymentStatus: 'paid', paymentText: '₹1,40,952 / ₹1,40,952', remaining: '—', status: 'confirmed', date: '09 Mar 2026' },
  { id: 'WL-B-0001', customerName: 'Vikram Iyer', destination: 'Goa', amount: '₹4,69,900', profit: '₹55,000', paymentStatus: 'partial', paymentText: '₹2,35,000 / ₹4,69,900', remaining: '₹2,34,900', status: 'confirmed', date: '09 Mar 2026' },
  { id: 'WL-B-0003', customerName: 'Rajesh Patel', destination: 'Srinagar - Gulmarg - Pahalgam', amount: '₹1,56,880', profit: '₹16,000', paymentStatus: 'paid', paymentText: '₹1,56,880 / ₹1,56,880', remaining: '—', status: 'completed', date: '01 Mar 2026' },
];

// ─── Quote data (mirrored from Quotes.jsx) ────────────────────────────────────
const allQuotes = [
  { id: 'WL-Q-0001', customerName: 'Rahul Sharma', destName: 'Bali, Indonesia', destType: 'international', amount: '₹1,40,952', profit: '₹18,000', status: 'converted', tripDate: '15 Apr 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0002', customerName: 'Priya Mehta', destName: 'Jaipur - Udaipur - Jodhpur', destType: 'domestic', amount: '₹1,10,520', profit: '₹14,000', status: 'sent', tripDate: '01 May 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0003', customerName: 'Vikram Iyer', destName: 'Goa', destType: 'domestic', amount: '₹4,69,900', profit: '₹55,000', status: 'converted', tripDate: '20 Mar 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0004', customerName: 'Ananya Reddy', destName: 'Paris - Switzerland - Rome', destType: 'international', amount: '₹8,92,400', profit: '₹1,05,000', status: 'draft', tripDate: '10 Jun 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0005', customerName: 'Rajesh Patel', destName: 'Srinagar - Gulmarg - Pahalgam', destType: 'domestic', amount: '₹1,56,880', profit: '₹16,000', status: 'converted', tripDate: '05 Apr 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0006', customerName: 'Arjun Singh', destName: 'Leh - Ladakh', destType: 'domestic', amount: '₹78,500', profit: '₹9,500', status: 'approved', tripDate: '22 May 2026', createdDate: '10 Mar 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtAmount = (n) => `₹${n.toLocaleString('en-IN')}`;

const StatusPill = ({ status }) => {
  const map = { confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', converted: 'Converted', sent: 'Sent', draft: 'Draft', approved: 'Approved', rejected: 'Rejected' };
  return <span className={`status-pill status-${status}`}>{map[status] || status}</span>;
};

// ─── Main CustomerProfile Component ──────────────────────────────────────────
export const CustomerProfile = ({ customerId, fromView, onBack, onViewChange }) => {
  const triggerDemoPopup = useDemoPopup();
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);

  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;

  const ext = profileData[customerId] || { city: '', state: '', country: '', emailOverride: '', tags: [], pan: '', gstin: '', company: '', ledger: [], payments: [] };
  const email = ext.emailOverride || customer.email;

  const myBookings = allBookings.filter(b => b.customerName === customer.name);
  const myQuotes = allQuotes.filter(q => q.customerName === customer.name);
  const myLedger = ext.ledger || [];
  const myPayments = ext.payments || [];

  // Financial stats
  const totalBookingValue = myBookings.reduce((sum, b) => {
    const n = parseInt(b.amount.replace(/[₹,]/g, ''), 10) || 0;
    return sum + n;
  }, 0);
  const totalPaid = myBookings.reduce((sum, b) => {
    if (b.paymentStatus === 'paid') {
      const n = parseInt(b.amount.replace(/[₹,]/g, ''), 10) || 0;
      return sum + n;
    }
    const match = b.paymentText.match(/₹([0-9,]+) \//);
    if (match) return sum + parseInt(match[1].replace(/,/g, ''), 10);
    return sum;
  }, 0);
  const pending = totalBookingValue - totalPaid;
  const advanceBalance = myLedger.reduce((sum, l) => sum + (l.credit || 0) - (l.debit || 0), 0);

  const backLabel = fromView === 'bookings' ? 'Bookings' : fromView === 'quotes' ? 'Quotes' : 'Customers';

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

        {/* ── Hero Card ── */}
        <div className="cp-hero-card">
          <div className="cp-hero-left">
            <div className="cp-hero-avatar" style={{ background: customer.gradient }}>{customer.initials}</div>
            <div className="cp-hero-info">
              <div className="cp-hero-name-row">
                <span className="cp-hero-name">{customer.name}</span>
                <span className="cp-type-badge cp-type-individual">{customer.type}</span>
                <button className="cp-ledger-btn" onClick={() => generateLedgerPdf({ customer, ext, myLedger })}>
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

        {/* ── Personal Details + Address ── */}
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
                    <span className="cp-field-value">{customer.phone}</span>
                  </div>
                </div>
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <span className="cp-field-label">EMAIL</span>
                    <span className="cp-field-value">{email}</span>
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
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <span className="cp-field-label">CITY</span>
                    <span className="cp-field-value">{ext.city || customer.location}</span>
                  </div>
                </div>
                <div className="cp-detail-field">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <span className="cp-field-label">STATE</span>
                    <span className="cp-field-value">{ext.state || ''}</span>
                  </div>
                </div>
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

        {/* ── Business & Identity ── */}
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
            <p className="cp-empty-text">No business details on record.</p>
          )}
        </div>

        {/* ── Financial Summary ── */}
        <div className="cp-fin-section">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            FINANCIAL SUMMARY
          </div>
          <div className="cp-fin-grid">
            <div className="cp-fin-card cp-fin-blue">
              <span className="cp-fin-label">Total Booking Value</span>
              <span className="cp-fin-value">{totalBookingValue > 0 ? fmtAmount(totalBookingValue) : '₹0'}</span>
            </div>
            <div className="cp-fin-card cp-fin-green">
              <span className="cp-fin-label">Total Paid</span>
              <span className="cp-fin-value">{totalPaid > 0 ? fmtAmount(totalPaid) : '₹0'}</span>
            </div>
            <div className="cp-fin-card cp-fin-amber">
              <span className="cp-fin-label">Pending</span>
              <span className="cp-fin-value">{pending > 0 ? fmtAmount(pending) : '₹0'}</span>
            </div>
            <div className="cp-fin-card cp-fin-purple">
              <span className="cp-fin-label">Advance Balance</span>
              <span className="cp-fin-value">{advanceBalance > 0 ? fmtAmount(advanceBalance) : '₹0'}</span>
            </div>
          </div>
        </div>

        {/* ── Customer Ledger ── */}
        <div className="cp-section-card">
          <div className="cp-table-section-header">
            <div className="cp-section-heading" style={{marginBottom:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              CUSTOMER LEDGER ({myLedger.length})
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="cp-tbl-btn" onClick={() => generateLedgerPdf({ customer, ext, myLedger })}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
              <button className="cp-tbl-btn" onClick={triggerDemoPopup}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>
          </div>
          {myLedger.length > 0 ? (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>REF</th>
                    <th>DESCRIPTION</th>
                    <th>DEBIT</th>
                    <th>CREDIT</th>
                    <th>BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {myLedger.map((entry, i) => {
                    const runningBal = entry.balance;
                    return (
                      <tr key={i}>
                        <td className="cp-td-date">{entry.date}</td>
                        <td><span className="cp-ref-link" onClick={() => setPaymentDetailId(entry.id)}>{entry.id}</span></td>
                        <td className="cp-td-desc">{entry.desc}</td>
                        <td className="cp-td-num">{entry.debit ? `₹${entry.debit.toLocaleString('en-IN')}` : ''}</td>
                        <td className="cp-td-credit">{entry.credit ? `₹${entry.credit.toLocaleString('en-IN')}` : ''}</td>
                        <td className="cp-td-balance">₹{runningBal.toLocaleString('en-IN')} Cr</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="cp-empty-text">No ledger entries yet.</p>
          )}
        </div>

        {/* ── Bookings ── */}
        <div className="cp-section-card">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            BOOKINGS ({myBookings.length})
          </div>
          {myBookings.length > 0 ? (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>BOOKING #</th>
                    <th>DESTINATION</th>
                    <th>TOTAL</th>
                    <th>PAYMENT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map(b => (
                    <tr key={b.id}>
                      <td><span className="qt-id cp-name-link" onClick={() => openBookingDetail(b.id, 'customer-profile')}>{b.id}</span></td>
                      <td>
                        <span className="bk-destination">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {b.destination}
                        </span>
                      </td>
                      <td><span className="qt-amount">{b.amount}</span></td>
                      <td>
                        <span className={`payment-badge payment-${b.paymentStatus}`}>{b.paymentStatus === 'paid' ? 'Paid' : 'Partial'}</span>
                      </td>
                      <td><StatusPill status={b.status} /></td>
                      <td><span className="qt-date">{b.date}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="cp-empty-text">No bookings yet.</p>
          )}
        </div>

        {/* ── Quotes ── */}
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

        {/* ── Payment History ── */}
        <div className="cp-section-card">
          <div className="cp-section-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            PAYMENT HISTORY ({myPayments.length})
          </div>
          {myPayments.length > 0 ? (
            <div className="cp-payment-list">
              {myPayments.map((p, i) => (
                <div key={i} className="cp-payment-row">
                  <div className="cp-payment-left">
                    <span className="cp-ref-link" onClick={() => setPaymentDetailId(p.id)}>{p.id}</span>
                    <span className={`cp-pay-badge cp-pay-badge-${p.badge.toLowerCase()}`}>{p.badge}</span>
                    <span className="cp-pay-meta">{p.date} · {p.method}</span>
                  </div>
                  <span className="cp-pay-amount">+{fmtAmount(p.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="cp-empty-text">No payment history.</p>
          )}
        </div>

      </div>



      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getDemoPaymentById}
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
        onSave={triggerDemoPopup}
      />
    </div>
  );
};

export default CustomerProfile;
