import React, { useState, useRef, useEffect } from 'react';
import { DemoLogButton } from '../demo/components/DemoLogButton';
import { openQuoteDetail } from '../utils/quoteNav';
import { openCustomerProfile } from '../utils/customerNav';
import { useDemoPopup, useDemoData } from '../context/DemoContext';
import { RecordPaymentModal } from '../shared/components/RecordPaymentModal';
import { openBilling } from '../utils/billingNav';
import { InfoBtn } from '../shared/components/InfoBtn';
import { InvoiceDetailModal } from '../dashboard/components/InvoiceDetailModal';
import { CancelBookingModal } from '../dashboard/components/CancelBookingModal';

const DEMO_SETTINGS = {
  companyName: 'Wanderlust Travels',
  address: '301, Trade Center, BKC, Mumbai',
  phone: '+91 98765 43210',
  email: 'demo@touridoo.in',
};

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

const parseINR = (s) => {
  if (!s || s === '—') return 0;
  return parseInt(String(s).replace(/[₹,\s]/g, ''), 10) || 0;
};

// ── Mock booking detail data ──────────────────────────────────────────────────
const bookingDetailData = {
  'WL-B-0001': {
    id: 'WL-B-0001', bookedOn: '10 Mar 2026', status: 'confirmed', paymentStatus: 'partial',
    type: 'Domestic', destination: 'Goa',
    customer: { name: 'Vikram Iyer', avatar: 'V', avatarColor: '#7c3aed', phone: '+91 9845678901', email: 'vikram@globaltech.co.in', customerId: 'WL-C-0001' },
    travel: { destination: 'Goa', type: 'Domestic', duration: '3 Nights / 4 Days', travelers: '15 Pax', departure: '12 Mar 2026', returnDate: '15 Mar 2026' },
    services: [
      { icon: 'flight',     name: 'Flight',     vendor: 'IndiGo',             cost: '₹1,20,000' },
      { icon: 'hotel',      name: 'Hotel',       vendor: 'Novotel Goa Resort', cost: '₹1,80,000' },
      { icon: 'activities', name: 'Activities',  vendor: 'Goa Adventures',     cost: '₹45,000'   },
      { icon: 'fooding',    name: 'Fooding',     vendor: 'Hotel Catering',     cost: '₹60,000'   },
    ],
    totalServiceCost: '₹4,05,000',
    financial: {
      totalCost: '₹4,05,000', hiddenMarkup: '₹0', processingCharge: '₹55,000',
      costOfTravelCustomer: '₹0', totalProfit: '₹55,000', profitPct: '13.6',
      costOfTravel: '₹4,05,000', cgst: '₹4,950', sgst: '₹4,950',
      invoiceValue: '₹4,69,900', totalPayable: '₹4,69,900',
    },
    payment: {
      totalPayable: '₹4,69,900', amountPaid: '₹2,35,000', remaining: '₹2,34,900', progressPct: 50,
      history: [{ id: 'REC-0001', date: '10 Mar 2026', method: 'bank transfer', amount: '+₹2,35,000' }],
    },
    linkedQuoteId: 'WL-Q-0001',
  },
  'WL-B-0002': {
    id: 'WL-B-0002', bookedOn: '09 Mar 2026', status: 'in_progress', paymentStatus: 'paid',
    type: 'International', destination: 'Bali, Indonesia',
    customer: { name: 'Rahul Sharma', avatar: 'R', avatarColor: '#0891b2', phone: '+91 9812345678', email: 'rahul@sharma.co.in', customerId: 'WL-C-0002' },
    travel: { destination: 'Bali, Indonesia', type: 'International', duration: '5 Nights / 6 Days', travelers: '2 Pax', departure: '09 Mar 2026', returnDate: '15 Mar 2026' },
    services: [
      { icon: 'flight',     name: 'Flight',     vendor: 'Air Asia',       cost: '₹60,000' },
      { icon: 'hotel',      name: 'Hotel',       vendor: 'The Layar Bali', cost: '₹55,000' },
      { icon: 'activities', name: 'Activities',  vendor: 'Bali Tours',     cost: '₹15,952' },
    ],
    totalServiceCost: '₹1,30,952',
    financial: {
      totalCost: '₹1,30,952', hiddenMarkup: '₹0', processingCharge: '₹10,000',
      costOfTravelCustomer: '₹0', totalProfit: '₹10,000', profitPct: '7.6',
      costOfTravel: '₹1,30,952', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹1,40,952', totalPayable: '₹1,40,952',
    },
    payment: {
      totalPayable: '₹1,40,952', amountPaid: '₹1,40,952', remaining: '₹0', progressPct: 100,
      history: [{ id: 'REC-0003', date: '09 Mar 2026', method: 'online transfer', amount: '+₹1,40,952' }],
    },
    linkedQuoteId: 'WL-Q-0002',
  },
  'WL-B-0003': {
    id: 'WL-B-0003', bookedOn: '01 Mar 2026', status: 'completed', paymentStatus: 'paid',
    type: 'Domestic', destination: 'Srinagar - Gulmarg - Pahalgam',
    customer: { name: 'Rajesh Patel', avatar: 'R', avatarColor: '#059669', phone: '+91 9876543210', email: 'rajesh@patel.co.in', customerId: 'WL-C-0003' },
    travel: { destination: 'Srinagar - Gulmarg - Pahalgam', type: 'Domestic', duration: '4 Nights / 5 Days', travelers: '4 Pax', departure: '01 Mar 2026', returnDate: '05 Mar 2026' },
    services: [
      { icon: 'flight',    name: 'Flight',         vendor: 'IndiGo',               cost: '₹40,000' },
      { icon: 'hotel',     name: 'Hotel',           vendor: 'Hotel Grand Srinagar', cost: '₹85,000' },
      { icon: 'transport', name: 'Cab / Transport', vendor: 'Local Taxi',           cost: '₹20,000' },
    ],
    totalServiceCost: '₹1,45,000',
    financial: {
      totalCost: '₹1,45,000', hiddenMarkup: '₹0', processingCharge: '₹11,880',
      costOfTravelCustomer: '₹0', totalProfit: '₹11,880', profitPct: '8.2',
      costOfTravel: '₹1,45,000', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹1,56,880', totalPayable: '₹1,56,880',
    },
    payment: {
      totalPayable: '₹1,56,880', amountPaid: '₹1,56,880', remaining: '₹0', progressPct: 100,
      history: [{ id: 'REC-0002', date: '01 Mar 2026', method: 'cash', amount: '+₹1,56,880' }],
    },
    linkedQuoteId: null,
  },
};

// ── Main component ────────────────────────────────────────────────────────────
// ─── Logs Popup ──────────────────────────────────────────────────────────────


export const BookingDetail = ({ bookingId, onBack }) => {
  const triggerDemoPopup = useDemoPopup();
  const { bookings, updateBooking, addPayment, payments, customers } = useDemoData();
    const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const detail = bookingDetailData[bookingId];
  const currentStatus = bookings.find(b => b.id === bookingId)?.status || detail?.status;

  if (!detail) {
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

  const { customer, travel, services, financial, payment } = detail;

  const invoiceData = {
    id: detail.id, date: detail.bookedOn,
    customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email,
    destination: travel.destination, destType: detail.type,
    travelers: parseInt(travel.travelers) || 1, duration: travel.duration, travelDate: travel.departure,
    travelCost: parseINR(financial.costOfTravel), serviceFee: parseINR(financial.processingCharge),
    cgst: parseINR(financial.cgst), sgst: parseINR(financial.sgst),
    invoiceValue: parseINR(financial.invoiceValue),
    status: detail.paymentStatus === 'paid' ? 'Paid' : 'Unpaid',
  };

  const progressColor = payment.progressPct >= 100 ? '#16a34a' : payment.progressPct > 0 ? '#f59e0b' : '#dc2626';

  const renderActionButtons = () => {
    const btns = [];

    if (currentStatus === 'confirmed') {
      btns.push(
        <button key="prog" className="bd-action-btn bd-action-progress" onClick={() => updateBooking(bookingId, { status: 'in_progress' })}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Mark In Progress
        </button>,
        <button key="cancel" className="bd-action-btn bd-action-cancel" onClick={() => setCancelModalOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancel
        </button>
      );
    } else if (currentStatus === 'in_progress') {
      btns.push(
        <button key="comp" className="bd-action-btn bd-action-complete" onClick={() => updateBooking(bookingId, { status: 'completed' })}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 10.5"/></svg>
          Mark Completed
        </button>,
        <button key="cancel" className="bd-action-btn bd-action-cancel" onClick={() => setCancelModalOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancel
        </button>
      );
    } else if (currentStatus === 'completed') {
      btns.push(
        <button key="reopen" className="bd-action-btn bd-action-reopen" onClick={() => updateBooking(bookingId, { status: 'confirmed' })}>
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

    if (detail.linkedQuoteId) {
      btns.push(
        <button key="quote" className="bd-action-btn bd-action-quote" onClick={() => openQuoteDetail(detail.linkedQuoteId, 'booking-detail')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Quote
        </button>
      );
    }

    if (currentStatus !== 'cancelled' && (currentStatus !== 'completed' || payment.progressPct < 100)) {
      btns.push(
        <button key="pay" className="bd-action-btn bd-action-record-pay" onClick={() => setRecordPaymentOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Record Payment
        </button>
      );
    }

    return btns;
  };

  return (
    <div className="fade-in bd-page">
      {/* ── Page header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">{detail.id}</h1>
            <p className="page-subtitle">Booked on {detail.bookedOn}</p>
          </div>
          <div className="dash-header-right">
            <button className="bd-back-btn" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <div className="bd-notif-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="bd-notif-badge">9+</span>
            </div>
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
              <span className="bd-hero-id">{detail.id}</span>
              <span className={`bd-status-badge bd-status-${currentStatus}`}>{STATUS_LABEL[currentStatus] || currentStatus}</span>
              <span className={`bd-pay-badge bd-pay-${detail.paymentStatus}`}>{PAY_LABEL[detail.paymentStatus] || detail.paymentStatus}</span>
            </div>
            <div className="bd-hero-dest">{detail.type} · {detail.destination}</div>
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
              <div className="bd-cust-avatar" style={{ background: customer.avatarColor }}>{customer.avatar}</div>
              <span className="bd-cust-name cp-name-link" onClick={() => customer.customerId && openCustomerProfile(customer.customerId, 'booking-detail')}>
                {customer.name}
              </span>
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

        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
            TRAVEL DETAILS
          </div>
          <div className="bd-travel-grid">
            <div className="bd-travel-item">
              <span className="bd-travel-label">DESTINATION</span>
              <span className="bd-travel-value">{travel.destination}</span>
            </div>
            <div className="bd-travel-item">
              <span className="bd-travel-label">TYPE</span>
              <span className="bd-travel-value">{travel.type}</span>
            </div>
            {travel.departure && (
              <div className="bd-travel-item">
                <span className="bd-travel-label">DEPARTURE</span>
                <span className="bd-travel-value">{travel.departure}</span>
              </div>
            )}
            {travel.returnDate && (
              <div className="bd-travel-item">
                <span className="bd-travel-label">RETURN</span>
                <span className="bd-travel-value">{travel.returnDate}</span>
              </div>
            )}
            <div className="bd-travel-item">
              <span className="bd-travel-label">TRAVELERS</span>
              <span className="bd-travel-value">{travel.travelers}</span>
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
              <div className="bd-empty-svc">No services added</div>
            ) : services.map((svc, i) => (
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

        <div className="bd-card">
          <div className="bd-card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            FINANCIAL SUMMARY
          </div>

          <div className="bd-fin-section-lbl">
            ACTUAL (AGENT VIEW) <InfoBtn infoKey="bd_actual_agent_view" />
          </div>
          {[
            { label: 'Total Cost',                     value: financial.totalCost },
            { label: 'Hidden Markup',                  value: financial.hiddenMarkup },
            { label: 'Processing Charge (excl GST)',   value: financial.processingCharge },
            { label: 'Cost of Travel (customer sees)', value: financial.costOfTravelCustomer || '₹0' },
          ].map(({ label, value }) => (
            <div key={label} className="bd-fin-row">
              <span className="bd-fin-label">{label}</span>
              <span className="bd-fin-value">{value}</span>
            </div>
          ))}
          <div className="bd-profit-card">
            <div>
              <div className="bd-profit-label">Total Profit ({financial.profitPct}%)</div>
              <div className="bd-profit-value">{financial.totalProfit}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>

          <div className="bd-fin-section-lbl" style={{ marginTop: 16 }}>CUSTOMER INVOICE</div>
          <div className="bd-fin-row">
            <span className="bd-fin-label bd-fin-label-row">
              Cost of Travel (Reimbursement) <InfoBtn infoKey="bd_cost_of_travel_reimb" />
            </span>
            <span className="bd-fin-value">{financial.costOfTravel}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label bd-fin-label-row">
              <strong>Processing / Service Charge</strong>
              <span className="bd-sac-tag">SAC: 998551</span>
              <InfoBtn infoKey="bd_processing_charge" />
            </span>
            <span className="bd-fin-value"><strong>{financial.processingCharge}</strong></span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label">CGST @9% (on service charge)</span>
            <span className="bd-fin-value">{financial.cgst}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label">SGST @9% (on service charge)</span>
            <span className="bd-fin-value">{financial.sgst}</span>
          </div>
          <div className="bd-fin-row">
            <span className="bd-fin-label"><strong>Invoice Value</strong></span>
            <span className="bd-fin-value"><strong>{financial.invoiceValue}</strong></span>
          </div>
          <div className="bd-total-payable-highlight">
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
          <div className="bd-progress-fill" style={{ width: `${payment.progressPct}%`, background: progressColor }} />
        </div>

        <div className="bd-hist-label">PAYMENT HISTORY</div>
        {payment.history.length === 0 ? (
          <div className="bd-hist-empty">No payments recorded yet</div>
        ) : payment.history.map((rec, i) => (
          <div key={i} className="bd-hist-row">
            <div>
              <span className="bd-hist-ref">{rec.id}</span>
              <span className="bd-hist-detail">{rec.date} · {rec.method}</span>
            </div>
            <span className="bd-hist-amount">{rec.amount}</span>
          </div>
        ))}
      </div>

      {/* ── Tax Invoice modal ── */}
      {invoiceOpen && (
        <InvoiceDetailModal
          invoice={invoiceData}
          settings={DEMO_SETTINGS}
          onClose={() => setInvoiceOpen(false)}
        />
      )}

      {/* ── Record Payment modal ── */}
      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        preselectedCustomer={{ id: detail.customer?.customerId, name: detail.customer?.name, phone: detail.customer?.phone, email: detail.customer?.email }}
        customers={customers}
        onSave={(data) => {
          addPayment({
            ...data,
            customerName: detail.customer?.name,
            customerId: detail.customer?.customerId,
            allocateTo: bookingId,
          });
          setRecordPaymentOpen(false);
        }}
      />

      {cancelModalOpen && (
        <CancelBookingModal
          booking={bookings.find(b => b.id === bookingId) || { id: bookingId, customerName: detail.customer?.name, destination: detail.travel?.destination, amount: detail.financial?.invoiceValue, remaining: detail.payment?.remaining }}
          invoices={[]}
          onClose={() => setCancelModalOpen(false)}
          onCancelNote={() => { updateBooking(bookingId, { status: 'cancelled' }); setCancelModalOpen(false); }}
          onVoid={() => { updateBooking(bookingId, { status: 'cancelled' }); setCancelModalOpen(false); }}
        />
      )}
    </div>
  );
};
