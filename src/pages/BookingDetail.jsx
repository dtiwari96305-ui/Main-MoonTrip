import React from 'react';
import { openQuoteDetail } from '../utils/quoteNav';
import { openCustomerProfile } from '../utils/customerNav';
import { useDemoPopup } from '../context/DemoContext';
import { openBilling } from '../utils/billingNav';
import { InfoBtn } from '../shared/components/InfoBtn';

// ── Mock detailed booking data ─────────────────────────────────────────────────
const bookingDetailData = {
  'WL-B-0001': {
    id: 'WL-B-0001',
    bookedOn: '10 Mar 2026',
    status: 'confirmed',
    paymentStatus: 'partial',
    type: 'Domestic',
    destination: 'Goa',
    customer: { name: 'Vikram Iyer', avatar: 'V', avatarColor: '#7c3aed', phone: '+91 9845678901', email: 'vikram@globaltech.co.in', customerId: 'WL-C-0001' },
    travel: { destination: 'Goa', type: 'Domestic', duration: '3 Nights / 4 Days', travelers: '15 Pax' },
    services: [
      { icon: 'flight',      name: 'Flight',         vendor: 'IndiGo',            cost: '₹1,20,000' },
      { icon: 'hotel',       name: 'Hotel',           vendor: 'Novotel Goa Resort', cost: '₹1,80,000' },
      { icon: 'activities',  name: 'Activities',      vendor: 'Goa Adventures',    cost: '₹45,000' },
      { icon: 'fooding',     name: 'Fooding',         vendor: 'Hotel catering',    cost: '₹60,000' },
    ],
    totalServiceCost: '₹4,05,000',
    financial: {
      totalCost: '₹4,05,000', hiddenMarkup: '₹0', processingCharge: '₹55,000',
      costOfTravel: '₹4,05,000', totalProfit: '₹55,000', profitPct: '13.6%',
      packagePrice: '₹4,60,000', cgst: '₹4,950', sgst: '₹4,950',
      invoiceValue: '₹4,69,900', totalPayable: '₹4,69,900',
    },
    payment: {
      totalPayable: '₹4,69,900', amountPaid: '₹2,35,000', remaining: '₹2,34,900', progressPct: 50,
      history: [{ id: 'REC-0001', date: '10 Mar 2026', method: 'bank transfer', ref: 'NEFT/2026/03/HDFC123456', amount: '+₹2,35,000' }],
    },
    linkedQuoteId: 'WL-Q-0001',
  },
  'WL-B-0002': {
    id: 'WL-B-0002',
    bookedOn: '09 Mar 2026',
    status: 'confirmed',
    paymentStatus: 'paid',
    type: 'International',
    destination: 'Bali, Indonesia',
    customer: { name: 'Rahul Sharma', avatar: 'R', avatarColor: '#0891b2', phone: '+91 9812345678', email: 'rahul@sharma.co.in', customerId: 'WL-C-0002' },
    travel: { destination: 'Bali, Indonesia', type: 'International', duration: '5 Nights / 6 Days', travelers: '2 Pax' },
    services: [
      { icon: 'flight',     name: 'Flight',     vendor: 'Air Asia',         cost: '₹60,000' },
      { icon: 'hotel',      name: 'Hotel',      vendor: 'The Layar Bali',   cost: '₹55,000' },
      { icon: 'activities', name: 'Activities', vendor: 'Bali Tours',       cost: '₹15,952' },
    ],
    totalServiceCost: '₹1,30,952',
    financial: {
      totalCost: '₹1,30,952', hiddenMarkup: '₹0', processingCharge: '₹10,000',
      costOfTravel: '₹1,30,952', totalProfit: '₹18,000', profitPct: '12.8%',
      packagePrice: '₹1,40,952', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹1,40,952', totalPayable: '₹1,40,952',
    },
    payment: {
      totalPayable: '₹1,40,952', amountPaid: '₹1,40,952', remaining: '—', progressPct: 100,
      history: [{ id: 'REC-0003', date: '09 Mar 2026', method: 'online transfer', ref: 'TXN/2026/03/456789', amount: '+₹1,40,952' }],
    },
    linkedQuoteId: 'WL-Q-0002',
  },
  'WL-B-0003': {
    id: 'WL-B-0003',
    bookedOn: '01 Mar 2026',
    status: 'completed',
    paymentStatus: 'paid',
    type: 'Domestic',
    destination: 'Srinagar - Gulmarg - Pahalgam',
    customer: { name: 'Rajesh Patel', avatar: 'R', avatarColor: '#059669', phone: '+91 9876543210', email: 'rajesh@patel.co.in', customerId: 'WL-C-0003' },
    travel: { destination: 'Srinagar - Gulmarg - Pahalgam', type: 'Domestic', duration: '4 Nights / 5 Days', travelers: '4 Pax' },
    services: [
      { icon: 'flight',    name: 'Flight',         vendor: 'IndiGo',               cost: '₹40,000' },
      { icon: 'hotel',     name: 'Hotel',           vendor: 'Hotel Grand Srinagar', cost: '₹85,000' },
      { icon: 'transport', name: 'Cab / Transport', vendor: 'Local Taxi',           cost: '₹20,000' },
    ],
    totalServiceCost: '₹1,45,000',
    financial: {
      totalCost: '₹1,45,000', hiddenMarkup: '₹0', processingCharge: '₹11,880',
      costOfTravel: '₹1,45,000', totalProfit: '₹16,000', profitPct: '10.2%',
      packagePrice: '₹1,56,880', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹1,56,880', totalPayable: '₹1,56,880',
    },
    payment: {
      totalPayable: '₹1,56,880', amountPaid: '₹1,56,880', remaining: '—', progressPct: 100,
      history: [{ id: 'REC-0002', date: '01 Mar 2026', method: 'cash', ref: 'CASH/2026/03/001', amount: '+₹1,56,880' }],
    },
    linkedQuoteId: null,
  },
};

// ── Service icon map ──────────────────────────────────────────────────────────
const SVC_ICONS = {
  flight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/>
    </svg>
  ),
  hotel: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  activities: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
    </svg>
  ),
  fooding: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
  transport: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
};

const SVC_COLORS = {
  flight: '#16A34A', hotel: '#3b82f6', activities: '#8b5cf6', fooding: '#ec4899', transport: '#f59e0b',
};

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_LABEL = { confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' };
const PAY_LABEL    = { paid: 'Paid', partial: 'Partial' };

export const BookingDetail = ({ bookingId, fromView, onBack }) => {
  const triggerDemoPopup = useDemoPopup();
  const detail = bookingDetailData[bookingId];

  if (!detail) {
    return (
      <div className="fade-in bd-page">
        <div className="bd-page-header">
          <button className="bd-back-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div>
            <h1 className="bd-page-title">{bookingId || 'Booking'}</h1>
            <p className="bd-page-subtitle">Booking not found</p>
          </div>
        </div>
        <div className="bd-not-found">No booking data found for {bookingId}.</div>
      </div>
    );
  }

  const { customer, travel, services, financial, payment } = detail;

  const handleViewQuote = () => {
    if (detail.linkedQuoteId) {
      openQuoteDetail(detail.linkedQuoteId, 'booking-detail');
    }
  };

  return (
    <div className="fade-in bd-page">
      {/* ── Page header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <button className="bd-back-btn" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 className="page-title">{detail.id}</h1>
            <p className="page-subtitle">Booked on {detail.bookedOn}</p>
          </div>
          <div className="dash-header-right">
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

      {/* ── Hero card ── */}
      <div className="bd-hero-card">
        <div className="bd-hero-left">
          <div className="bd-hero-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div className="bd-hero-id-row">
              <span className="bd-hero-id">{detail.id}</span>
              <span className={`bd-status-badge bd-status-${detail.status}`}>{STATUS_LABEL[detail.status]}</span>
              <span className={`bd-pay-badge bd-pay-${detail.paymentStatus}`}>{PAY_LABEL[detail.paymentStatus]}</span>
            </div>
            <div className="bd-hero-dest">{detail.type} · {detail.destination}</div>
          </div>
        </div>
        <div className="bd-hero-actions">
          <button className="bd-action-btn bd-action-complete" onClick={triggerDemoPopup}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 10.5"/></svg>
            Mark Completed
          </button>
          <button className="bd-action-btn bd-action-cancel" onClick={triggerDemoPopup}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Cancel
          </button>
          <button className="bd-action-btn bd-action-invoice" onClick={triggerDemoPopup}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Tax Invoice
          </button>
          <button
            className={`bd-action-btn bd-action-quote${!detail.linkedQuoteId ? ' bd-action-disabled' : ''}`}
            onClick={handleViewQuote}
            title={detail.linkedQuoteId ? '' : 'No quote linked to this booking'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Quote
          </button>
        </div>
      </div>

      {/* ── Customer + Travel Details grid ── */}
      <div className="bd-grid-2" style={{ marginTop: 20 }}>
        {/* Customer card */}
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            CUSTOMER
          </div>
          <div className="bd-cust-body">
            <div className="bd-cust-name-row">
              <div className="bd-cust-avatar" style={{ background: customer.avatarColor }}>{customer.avatar}</div>
              <span
                className="bd-cust-name cp-name-link"
                onClick={() => customer.customerId && openCustomerProfile(customer.customerId, 'booking-detail')}
              >{customer.name}</span>
            </div>
            <div className="bd-cust-contacts">
              <div className="bd-cust-contact">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.5 5.5l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92"/></svg>
                {customer.phone}
              </div>
              <div className="bd-cust-contact">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {customer.email}
              </div>
            </div>
          </div>
        </div>

        {/* Travel Details card */}
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
            TRAVEL DETAILS
          </div>
          <div className="bd-travel-grid">
            {[
              { label: 'DESTINATION', value: travel.destination },
              { label: 'TYPE',        value: travel.type },
              { label: 'DURATION',    value: travel.duration },
              { label: 'TRAVELERS',   value: travel.travelers },
            ].map(({ label, value }) => (
              <div key={label} className="bd-travel-item">
                <span className="bd-travel-label">{label}</span>
                <span className="bd-travel-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services & Financial ── */}
      <div className="bd-grid-2" style={{ marginTop: 16 }}>
        {/* Services & Costs */}
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            SERVICES &amp; COSTS
          </div>
          <div className="bd-services-list">
            {services.map((svc, i) => (
              <div key={i} className="bd-service-row">
                <div className="bd-service-icon-wrap" style={{ background: (SVC_COLORS[svc.icon] || '#6b7280') + '18', color: SVC_COLORS[svc.icon] || '#6b7280' }}>
                  {SVC_ICONS[svc.icon] || SVC_ICONS.activities}
                </div>
                <div className="bd-service-info">
                  <span className="bd-service-name">{svc.name}</span>
                  <span className="bd-service-vendor">Vendor: {svc.vendor}</span>
                </div>
                <span className="bd-service-cost">{svc.cost}</span>
              </div>
            ))}
            <div className="bd-total-service-row">
              <span>Total Service Cost</span>
              <span>{detail.totalServiceCost}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            FINANCIAL SUMMARY
          </div>

          {/* Agent view */}
          <div className="bd-fin-section-lbl">
            ACTUAL (AGENT VIEW)
            <InfoBtn infoKey="bd_actual_agent_view" />
          </div>
          {[
            { label: 'Total Cost',                      value: financial.totalCost },
            { label: 'Hidden Markup',                   value: financial.hiddenMarkup },
            { label: 'Processing Charge (excl GST)',    value: financial.processingCharge },
            { label: 'Cost of Travel (customer sees)',  value: financial.costOfTravel },
          ].map(({ label, value }) => (
            <div key={label} className="bd-fin-row">
              <span className="bd-fin-label">{label}</span>
              <span className="bd-fin-value">{value}</span>
            </div>
          ))}
          <div className="bd-profit-card">
            <div>
              <div className="bd-profit-label">Total Profit ({financial.profitPct})</div>
              <div className="bd-profit-value">{financial.totalProfit}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>

          {/* Customer Invoice */}
          <div className="bd-fin-section-lbl" style={{ marginTop: 16 }}>CUSTOMER INVOICE</div>
          {[
            { label: 'Package Price',  value: financial.packagePrice },
            { label: 'CGST @9%',       value: financial.cgst },
            { label: 'SGST @9%',       value: financial.sgst },
            { label: 'Invoice Value',  value: financial.invoiceValue },
          ].map(({ label, value }) => (
            <div key={label} className="bd-fin-row">
              <span className="bd-fin-label">{label}</span>
              <span className="bd-fin-value">{value}</span>
            </div>
          ))}
          <div className="bd-total-payable-row">
            <span>Total Payable</span>
            <span>{financial.totalPayable}</span>
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
            <span className="bd-pay-stat-value">{payment.totalPayable}</span>
          </div>
          <div className="bd-pay-stat bd-pay-stat-green">
            <span className="bd-pay-stat-label">Amount Paid</span>
            <span className="bd-pay-stat-value">{payment.amountPaid}</span>
          </div>
          <div className="bd-pay-stat bd-pay-stat-orange">
            <span className="bd-pay-stat-label">Remaining</span>
            <span className="bd-pay-stat-value">{payment.remaining}</span>
          </div>
        </div>
        <div className="bd-progress-wrap">
          <span className="bd-progress-label">Payment Progress</span>
          <span className="bd-progress-pct">{payment.progressPct}%</span>
        </div>
        <div className="bd-progress-track">
          <div className="bd-progress-fill" style={{ width: payment.progressPct + '%' }} />
        </div>

        {/* Payment History */}
        {payment.history.length > 0 && (
          <>
            <div className="bd-hist-label">PAYMENT HISTORY</div>
            {payment.history.map((rec, i) => (
              <div key={i} className="bd-hist-row">
                <div>
                  <span className="bd-hist-ref">{rec.id}</span>
                  <span className="bd-hist-detail">{rec.date} · {rec.method} · Ref: {rec.ref}</span>
                </div>
                <span className="bd-hist-amount">{rec.amount}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
