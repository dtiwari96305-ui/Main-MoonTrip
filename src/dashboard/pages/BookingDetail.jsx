import React, { useState, useMemo } from 'react';
import { RealLogButton } from '../components/RealLogButton';
import { useData } from '../context/DataContext';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openCustomerProfile } from '../../utils/customerNav';
import { InfoBtn } from '../../shared/components/InfoBtn';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';
import { RecordPaymentModal } from '../../shared/components/RecordPaymentModal';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { openBilling } from '../../utils/billingNav';

// ── Service icons & colors ────────────────────────────────────────────────────
const SVC_ICONS = {
  flight: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>),
  hotel: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>),
  activities: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>),
  fooding: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>),
  transport: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
};

const SVC_COLORS = {
  flight: '#16A34A', hotel: '#3b82f6', activities: '#8b5cf6', fooding: '#ec4899', transport: '#f59e0b',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABEL = {
  confirmed: 'Confirmed', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};
const PAY_LABEL = { paid: 'Paid', partial: 'Partial', unpaid: 'Unpaid', overpaid: 'Overpaid' };

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const parseINR = (s) => {
  if (!s || s === '—') return 0;
  return parseInt(String(s).replace(/[₹,\s]/g, ''), 10) || 0;
};

const getAvatarColor = (name) => {
  const colors = ['#7c3aed', '#0891b2', '#059669', '#dc2626', '#d97706', '#2563eb', '#db2777'];
  if (!name) return colors[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % colors.length;
  return colors[h];
};

// ── Component ─────────────────────────────────────────────────────────────────
export const RealBookingDetail = ({ bookingId, onBack }) => {
  const {
    bookings, payments, invoices, customers, settings,
    updateBooking, addPayment, updateInvoice, getQuoteDetail,
  } = useData();

  const [invoiceOpen, setInvoiceOpen]   = useState(false);
  const [recordPayOpen, setRecordPayOpen] = useState(false);
  const [cancelOpen, setCancelOpen]     = useState(false);
  
  const booking = useMemo(() => bookings.find(b => b.id === bookingId), [bookings, bookingId]);

  const customer = useMemo(() => {
    if (!booking) return null;
    return customers.find(c => c.name === booking.customerName) || { name: booking.customerName, phone: '', email: '' };
  }, [customers, booking]);

  const invoice = useMemo(() => invoices.find(i => i.bookingId === bookingId), [invoices, bookingId]);

  const quoteDetail = useMemo(() => {
    if (!booking?.quoteId) return null;
    try { return getQuoteDetail(booking.quoteId); } catch { return null; }
  }, [booking?.quoteId, getQuoteDetail]);

  // Services list — stored on booking as array, or fall back to quote detail snapshot.
  // quoteDetail.services is a boolean map {hotel:true,...}, not an array — always guard.
  const services = useMemo(() => {
    const s = booking?.services ?? quoteDetail?.services;
    return Array.isArray(s) ? s : [];
  }, [booking, quoteDetail]);
  const totalServiceCost = booking?.totalServiceCost || quoteDetail?.totalServiceCost || booking?.amount || '₹0';

  // Financial values ─────────────────────────────────────────────────────────
  const travelCost   = invoice?.travelCost   ?? parseINR(booking?.amount) ?? 0;
  const serviceFee   = invoice?.serviceFee   ?? 200;
  const cgstVal      = invoice?.cgst         ?? 0;
  const sgstVal      = invoice?.sgst         ?? 0;
  const invoiceValue = invoice?.invoiceValue ?? (travelCost + serviceFee + cgstVal + sgstVal);

  // Agent view fields
  const agentTotalCost = parseINR(booking?.totalCost) || travelCost;
  const hiddenMarkup   = parseINR(booking?.hiddenMarkup) || 0;
  const profitTotal    = parseINR(booking?.profit) || serviceFee;
  const profitPct      = booking?.profitPct
    ?? (invoiceValue > 0 ? ((profitTotal / (agentTotalCost || invoiceValue)) * 100).toFixed(1) : '0');

  // Payments ─────────────────────────────────────────────────────────────────
  const bookingPayments = useMemo(
    () => payments.filter(p => p.against === bookingId || p.bookingId === bookingId),
    [payments, bookingId]
  );
  const amountPaid  = bookingPayments.reduce((sum, p) => sum + parseINR(p.amount), 0);
  const remaining   = Math.max(0, invoiceValue - amountPaid);
  const progressPct = invoiceValue > 0 ? Math.min(100, Math.round((amountPaid / invoiceValue) * 100)) : 0;
  const progressColor = progressPct >= 100 ? '#16a34a' : progressPct > 0 ? '#f59e0b' : '#dc2626';

  // Handlers ─────────────────────────────────────────────────────────────────
  const handleStatusChange = (newStatus) => {
    updateBooking(bookingId, { status: newStatus });
  };

  const handleCancelNote = () => {
    updateBooking(bookingId, { status: 'cancelled' });
    if (invoice?.id) updateInvoice(invoice.id, { status: 'Cancelled' });
    setCancelOpen(false);
  };

  const handleVoid = () => {
    updateBooking(bookingId, { status: 'cancelled' });
    if (invoice?.id) updateInvoice(invoice.id, { status: 'Void' });
    setCancelOpen(false);
  };

  const handleRecordPayment = (formData) => {
    addPayment({
      ...formData,
      customerName: booking.customerName,
      against: bookingId,
      bookingId,
      againstType: 'booking',
    });
    setRecordPayOpen(false);
  };

  // Not-found guard ──────────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="fade-in bd-page">
        <div className="page-header-strip">
          <div className="dash-header">
            <div className="dash-header-left">
              <h1 className="page-title">{bookingId || 'Booking'}</h1>
              <p className="page-subtitle">Booking not found</p>
            </div>
            <div className="dash-header-right">
              <button className="bd-back-btn" onClick={onBack}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="bd-not-found">No booking data found for {bookingId}.</div>
      </div>
    );
  }

  const avatarColor  = getAvatarColor(booking.customerName);
  const avatarLetter = (booking.customerName || '?').charAt(0).toUpperCase();
  const userName     = settings?.userName || 'Admin';
  const userInitials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const invoiceModalData = {
    id: invoice?.id || booking.id,
    date: invoice?.date || booking.date || booking.createdDate,
    customerName: booking.customerName,
    customerPhone: customer?.phone || '',
    customerEmail: customer?.email || '',
    customerPan:   invoice?.customerPan   || customer?.pan   || '',
    customerGstin: invoice?.customerGstin || customer?.gstin || '',
    destination: booking.destination,
    destType:    booking.destType || 'domestic',
    travelers:   invoice?.travelers || booking.pax || 1,
    duration:    invoice?.duration  || booking.duration || '',
    travelDate:  invoice?.travelDate || booking.travelDate || '',
    travelCost, serviceFee, cgst: cgstVal, sgst: sgstVal, invoiceValue,
    status: progressPct >= 100 ? 'Paid' : 'Unpaid',
  };

  // Action buttons ───────────────────────────────────────────────────────────
  const renderActionButtons = () => {
    const btns = [];

    if (booking.status === 'confirmed') {
      btns.push(
        <button key="prog" className="bd-action-btn bd-action-progress" onClick={() => handleStatusChange('in_progress')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Mark In Progress
        </button>,
        <button key="cancel" className="bd-action-btn bd-action-cancel" onClick={() => setCancelOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancel
        </button>
      );
    } else if (booking.status === 'in_progress') {
      btns.push(
        <button key="comp" className="bd-action-btn bd-action-complete" onClick={() => handleStatusChange('completed')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 10.5"/></svg>
          Mark Completed
        </button>,
        <button key="cancel" className="bd-action-btn bd-action-cancel" onClick={() => setCancelOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancel
        </button>
      );
    } else if (booking.status === 'completed') {
      btns.push(
        <button key="reopen" className="bd-action-btn bd-action-reopen" onClick={() => handleStatusChange('confirmed')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
          Reopen
        </button>
      );
    }

    btns.push(
      <button key="inv" className="bd-action-btn bd-action-invoice" onClick={() => setInvoiceOpen(true)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Tax Invoice
      </button>
    );

    if (booking.quoteId) {
      btns.push(
        <button key="quote" className="bd-action-btn bd-action-quote" onClick={() => openQuoteDetail(booking.quoteId, 'booking-detail')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Quote
        </button>
      );
    }

    if (booking.status !== 'cancelled' && (booking.status !== 'completed' || progressPct < 100)) {
      btns.push(
        <button key="pay" className="bd-action-btn bd-action-record-pay" onClick={() => setRecordPayOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Record Payment
        </button>
      );
    }

    return btns;
  };

  const destTypeLabel = booking.destType === 'international' ? 'International' : 'Domestic';

  return (
    <div className="fade-in bd-page">
      {/* ── Page header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">{booking.id}</h1>
            <p className="page-subtitle">Booked on {booking.date || booking.createdDate}</p>
          </div>
          <div className="dash-header-right">
            <button className="bd-back-btn" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <RealLogButton />
            <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
              <div className="header-user-avatar">{userInitials}</div>
              <div className="header-user-info">
                <span className="header-user-name">{userName}</span>
                <span className="header-user-role"><span className="role-dot"></span> {settings?.userRole || 'admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Summary Bar ── */}
      <div className="bd-hero-card">
        <div className="bd-hero-left">
          <div className="bd-hero-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div className="bd-hero-id-row">
              <span className="bd-hero-id">{booking.id}</span>
              <span className={`bd-status-badge bd-status-${booking.status}`}>{STATUS_LABEL[booking.status] || booking.status}</span>
              <span className={`bd-pay-badge bd-pay-${booking.paymentStatus}`}>{PAY_LABEL[booking.paymentStatus] || booking.paymentStatus}</span>
            </div>
            <div className="bd-hero-dest">{destTypeLabel} · {booking.destination}</div>
          </div>
        </div>
        <div className="bd-hero-actions">
          {renderActionButtons()}
        </div>
      </div>

      {/* ── Customer + Travel Details ── */}
      <div className="bd-grid-2" style={{ marginTop: 20 }}>
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            CUSTOMER
          </div>
          <div className="bd-cust-body">
            <div className="bd-cust-name-row">
              <div className="bd-cust-avatar" style={{ background: avatarColor }}>{avatarLetter}</div>
              <span
                className="bd-cust-name cp-name-link"
                onClick={() => customer?.id && openCustomerProfile(customer.id, 'booking-detail')}
              >
                {booking.customerName}
              </span>
            </div>
            <div className="bd-cust-contacts">
              <div className="bd-cust-contact">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.5 5.5l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92"/></svg>
                {customer?.phone || 'N/A'}
              </div>
              <div className="bd-cust-contact">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {customer?.email || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
            TRAVEL DETAILS
          </div>
          <div className="bd-travel-grid">
            <div className="bd-travel-item">
              <span className="bd-travel-label">DESTINATION</span>
              <span className="bd-travel-value">{booking.destination || 'N/A'}</span>
            </div>
            <div className="bd-travel-item">
              <span className="bd-travel-label">TYPE</span>
              <span className="bd-travel-value">{destTypeLabel}</span>
            </div>
            {booking.travelDate && (
              <div className="bd-travel-item">
                <span className="bd-travel-label">TRAVEL DATE</span>
                <span className="bd-travel-value">{booking.travelDate}</span>
              </div>
            )}
            <div className="bd-travel-item">
              <span className="bd-travel-label">TRAVELERS</span>
              <span className="bd-travel-value">{booking.pax || 1} Pax</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Services & Financial Summary ── */}
      <div className="bd-grid-2" style={{ marginTop: 16 }}>
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            SERVICES &amp; COSTS
          </div>
          <div className="bd-services-list">
            {services.length === 0 ? (
              <div className="bd-empty-svc">No services recorded</div>
            ) : services.map((svc, i) => (
              <div key={i} className="bd-service-row">
                <div className="bd-service-icon-wrap" style={{ background: (SVC_COLORS[svc.icon] || '#6b7280') + '18', color: SVC_COLORS[svc.icon] || '#6b7280' }}>
                  {SVC_ICONS[svc.icon] || SVC_ICONS.activities}
                </div>
                <div className="bd-service-info">
                  <span className="bd-service-name">{svc.name}</span>
                  {svc.vendor && <span className="bd-service-vendor">Vendor: {svc.vendor}</span>}
                </div>
                <span className="bd-service-cost">{svc.cost}</span>
              </div>
            ))}
            <div className="bd-total-service-row">
              <span>Total Service Cost</span>
              <span>{totalServiceCost}</span>
            </div>
          </div>
        </div>

        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            FINANCIAL SUMMARY
          </div>

          <div className="bd-fin-section-lbl">
            ACTUAL (AGENT VIEW) <InfoBtn infoKey="bd_actual_agent_view" />
          </div>
          {[
            { label: 'Total Cost',                     value: fmtINR(agentTotalCost) },
            { label: 'Hidden Markup',                  value: fmtINR(hiddenMarkup)   },
            { label: 'Processing Charge (excl GST)',   value: fmtINR(serviceFee)     },
            { label: 'Cost of Travel (customer sees)', value: '₹0'                   },
          ].map(({ label, value }) => (
            <div key={label} className="bd-fin-row">
              <span className="bd-fin-label">{label}</span>
              <span className="bd-fin-value">{value}</span>
            </div>
          ))}
          <div className="bd-profit-card">
            <div>
              <div className="bd-profit-label">Total Profit ({profitPct}%)</div>
              <div className="bd-profit-value">{fmtINR(profitTotal)}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>

          <div className="bd-fin-section-lbl" style={{ marginTop: 16 }}>CUSTOMER INVOICE</div>
          <div className="bd-fin-row">
            <span className="bd-fin-label bd-fin-label-row">
              Cost of Travel (Reimbursement) <InfoBtn infoKey="bd_cost_of_travel_reimb" />
            </span>
            <span className="bd-fin-value">{fmtINR(travelCost)}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label bd-fin-label-row">
              <strong>Processing / Service Charge</strong>
              <span className="bd-sac-tag">SAC: 998551</span>
              <InfoBtn infoKey="bd_processing_charge" />
            </span>
            <span className="bd-fin-value"><strong>{fmtINR(serviceFee)}</strong></span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label">CGST @9% (on service charge)</span>
            <span className="bd-fin-value">{fmtINR(cgstVal)}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label">SGST @9% (on service charge)</span>
            <span className="bd-fin-value">{fmtINR(sgstVal)}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label"><strong>Invoice Value</strong></span>
            <span className="bd-fin-value"><strong>{fmtINR(invoiceValue)}</strong></span>
          </div>
          <div className="bd-total-payable-highlight">
            <span>Total Payable</span>
            <span>{fmtINR(invoiceValue)}</span>
          </div>
        </div>
      </div>

      {/* ── Payment Status ── */}
      <div className="bd-card" style={{ marginTop: 16 }}>
        <div className="bd-card-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          PAYMENT STATUS
        </div>
        <div className="bd-payment-stats">
          <div className="bd-pay-stat bd-pay-stat-blue">
            <span className="bd-pay-stat-label">Total Payable</span>
            <span className="bd-pay-stat-value">{fmtINR(invoiceValue)}</span>
          </div>
          <div className="bd-pay-stat bd-pay-stat-green">
            <span className="bd-pay-stat-label">Amount Paid</span>
            <span className="bd-pay-stat-value">{fmtINR(amountPaid)}</span>
          </div>
          <div className="bd-pay-stat bd-pay-stat-orange">
            <span className="bd-pay-stat-label">Remaining</span>
            <span className="bd-pay-stat-value">{fmtINR(remaining)}</span>
          </div>
        </div>
        <div className="bd-progress-wrap">
          <span className="bd-progress-label">Payment Progress</span>
          <span className="bd-progress-pct">{progressPct}%</span>
        </div>
        <div className="bd-progress-track">
          <div className="bd-progress-fill" style={{ width: `${progressPct}%`, background: progressColor }} />
        </div>

        <div className="bd-hist-label">PAYMENT HISTORY</div>
        {bookingPayments.length === 0 ? (
          <div className="bd-hist-empty">No payments recorded yet</div>
        ) : bookingPayments.map((rec, i) => (
          <div key={i} className="bd-hist-row">
            <div>
              <span className="bd-hist-ref">{rec.id}</span>
              <span className="bd-hist-detail">{rec.date} · {rec.modeLabel || rec.modeType}</span>
            </div>
            <span className="bd-hist-amount">+{rec.amount}</span>
          </div>
        ))}
      </div>

      {/* ── Modals ── */}
      {invoiceOpen && (
        <InvoiceDetailModal
          invoice={invoiceModalData}
          settings={settings}
          onClose={() => setInvoiceOpen(false)}
        />
      )}

      {recordPayOpen && (
        <RecordPaymentModal
          isOpen={recordPayOpen}
          onClose={() => setRecordPayOpen(false)}
          preselectedCustomer={customer}
          customers={customers}
          onSave={handleRecordPayment}
        />
      )}

      {cancelOpen && (
        <CancelBookingModal
          booking={booking}
          invoices={invoices}
          onClose={() => setCancelOpen(false)}
          onCancelNote={handleCancelNote}
          onVoid={handleVoid}
        />
      )}
    </div>
  );
};
