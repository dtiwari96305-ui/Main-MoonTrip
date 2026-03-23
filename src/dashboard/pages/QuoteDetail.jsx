import React, { useState, useRef, useEffect } from 'react';
import { RealLogButton } from '../components/RealLogButton';
import { useData } from '../context/DataContext';
import { openCustomerProfile } from '../../utils/customerNav';
import { openBilling } from '../../utils/billingNav';
import { openEditQuote } from '../../utils/editQuoteNav';
import { openDesigner } from '../../utils/designerNav';
import { openBookingDetail } from '../../utils/bookingNav';
import { generateCustomerPDF, generateAgentPDF } from '../../shared/utils/generateQuotePdf';
import { buildEditFormData } from '../../shared/utils/buildEditFormData';
import { calculate } from '../../shared/utils/calculationEngine';
import { InfoBtn } from '../../shared/components/InfoBtn';
import { ConvertToBookingModal } from '../components/ConvertToBookingModal';
import ReactDOM from 'react-dom';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtINR = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
const pctStr = (n, d) => (d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '0.0%');

const SERVICE_CFG = {
  hotel:       { color: '#16a34a', bg: '#f0fdf4', label: 'Hotel',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"/></svg> },
  cabTransport:{ color: '#ea580c', bg: '#fff7ed', label: 'Transport',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> },
  activities:  { color: '#7c3aed', bg: '#faf5ff', label: 'Activity',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  admission:   { color: '#e11d48', bg: '#fff1f2', label: 'Admission',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg> },
  flight:      { color: '#0ea5e9', bg: '#f0f9ff', label: 'Flight',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/></svg> },
  train:       { color: '#6366f1', bg: '#eef2ff', label: 'Train',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8"/><circle cx="8.5" cy="19" r="1"/><circle cx="15.5" cy="19" r="1"/><path d="M8.5 19H4M15.5 19H20"/></svg> },
  insurance:   { color: '#0d9488', bg: '#f0fdfa', label: 'Insurance',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  visa:        { color: '#9333ea', bg: '#faf5ff', label: 'Visa',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  fooding:     { color: '#f59e0b', bg: '#fffbeb', label: 'Meals',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
};
const SVC_ORDER = ['hotel','cabTransport','flight','train','activities','admission','insurance','visa','fooding','bus','other','flightExtras'];

function buildServiceList(qd) {
  if (!qd) return [];
  const result = [];
  const svcs   = qd.services || {};
  const costs  = qd.serviceCosts || {};
  const dets   = qd.serviceDetails || {};

  SVC_ORDER.forEach(key => {
    if (!svcs[key]) return;
    const cfg   = SERVICE_CFG[key] || SERVICE_CFG.activities;
    const items = dets[key]?.items || [];
    const costNum = parseInt((costs[key] || '0').replace(/[₹,]/g,''), 10) || 0;

    if (items.length > 0) {
      items.forEach(item => {
        const name = item.hotelName || item.activityName || item.fromCity || item.vehicleType || item.admissionName || item.airline || item.trainName || item.name || key;
        const vendor = item.vendor || '';
        const itemCost = parseInt((item.cost || '0').replace(/[₹,]/g,''), 10) || 0;
        result.push({ type: key, name, vendor, cost: itemCost, cfg });
      });
    } else if (costNum > 0) {
      result.push({ type: key, name: cfg.label, vendor: '', cost: costNum, cfg });
    }
  });
  return result;
}

function computeFinancials(qd, settings) {
  if (!qd) return null;
  const businessStateCode = (settings?.gstin || '').substring(0, 2);
  const costs = qd.serviceCosts || {};
  const costOfServices = Object.values(costs).reduce((s, v) => s + (parseInt((v||'0').replace(/[₹,]/g,''),10)||0), 0);

  return calculate({
    costOfServices,
    billingModel:           qd.billingModel       || 'pure-agent',
    pricingMode:            qd.pricingMode         || 'set-margin',
    totalQuoteAmount:       parseFloat(qd.totalQuoteAmount) || 0,
    marginAmount:           parseFloat(qd.marginAmount) || 0,
    totalServiceMargin:     parseFloat(qd.totalServiceMargin) || 0,
    vendorCommission:       parseFloat(qd.vendorCommission) || 0,
    placeOfSupply:          qd.placeOfSupply        || '',
    businessStateCode,
    destType:               qd.destType            || 'domestic',
    serviceCount:           Object.values(qd.services||{}).filter(Boolean).length,
    dpcDisplay:             qd.dpcDisplay           || 'exclusive',
    displayProcessingCharge:parseFloat(qd.displayProcessingCharge) || 0,
  });
}

function buildItinerary(qd) {
  if (!qd) return [];
  const days = qd.itDays || [];
  return days.filter(d => d.title || d.hotel || (d.activities||[]).some(Boolean));
}

function getAvatarBg(name) {
  let h = 0;
  for (let i = 0; i < (name||'').length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  const palettes = [
    'linear-gradient(135deg,#16A34A,#15803D)',
    'linear-gradient(135deg,#2563EB,#1D4ED8)',
    'linear-gradient(135deg,#7C3AED,#6D28D9)',
    'linear-gradient(135deg,#DC2626,#B91C1C)',
    'linear-gradient(135deg,#D97706,#B45309)',
    'linear-gradient(135deg,#0891B2,#0E7490)',
    'linear-gradient(135deg,#DB2777,#BE185D)',
  ];
  return palettes[Math.abs(h) % palettes.length];
}

const statusColors = {
  draft:     'status-draft',
  sent:      'status-sent',
  approved:  'status-approved',
  converted: 'status-converted',
  rejected:  'status-rejected',
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const RealQuoteDetail = ({ quoteId, fromView, onBack }) => {
  const {
    quotes, customers, settings, bookings,
    updateQuote, convertQuote, getQuoteDetail,
  } = useData();

  const [itinView, setItinView]           = useState('simple');
  const [showItinDrop, setShowItinDrop]   = useState(false);
  const [showConvert, setShowConvert]     = useState(false);
  const itinDropRef                        = useRef(null);
    const userInitials = (settings?.userName || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const displayName = settings?.userName || 'Admin';
  const displayRole = settings?.userRole || 'Admin';

  useEffect(() => {
    if (!showItinDrop) return;
    const h = (e) => { if (itinDropRef.current && !itinDropRef.current.contains(e.target)) setShowItinDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showItinDrop]);

  const quote = quotes.find(q => q.id === quoteId);
  if (!quote) return <div className="qd-body"><p style={{padding:24,color:'var(--text-muted)'}}>Quote not found.</p></div>;

  const qd         = getQuoteDetail ? getQuoteDetail(quoteId) : null;
  const fin        = computeFinancials(qd, settings);
  const services   = buildServiceList(qd);
  const itinDays   = buildItinerary(qd);
  const quoteStatus = quote.status || 'draft';

  const customer = customers.find(c => c.name === quote.customerName);
  const customerPhone = quote.customerPhone || qd?.newCustomerPhone || '';
  const customerEmail = customer?.email || qd?.newCustomerEmail || '';
  const destination   = quote.destName   || qd?.destination || '—';
  const destType      = quote.destType   || qd?.destType    || '—';
  const tripDate      = quote.tripDate   || '—';
  const duration      = qd?.duration     || '';
  const travelers     = qd ? `${(qd.adults||1) + (qd.children||0) + (qd.infants||0)} Pax` : '—';
  const departure     = qd?.departureDate ? new Date(qd.departureDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const returnDate    = qd?.returnDate    ? new Date(qd.returnDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const createdDate   = quote.createdDate || '—';

  const totalServiceCost = services.reduce((s, sv) => s + sv.cost, 0);

  // Linked booking (if converted)
  const linkedBooking = quoteStatus === 'converted'
    ? bookings.find(b => b.quoteId === quoteId)
    : null;

  // Detail for PDF (build demo-compatible structure)
  const detailForPdf = {
    customerName: quote.customerName,
    customerId:   customer?.id || '',
    customerPhone,
    customerEmail,
    destination,
    destType,
    tripDate,
    duration,
    departure,
    returnDate,
    travelers,
    createdDate,
    services: services.map(sv => ({ type: sv.type, name: sv.name, vendor: sv.vendor, cost: fmtINR(sv.cost) })),
    totalServiceCost: fmtINR(totalServiceCost),
    fin: fin ? {
      costOfServices:    fmtINR(fin.costOfServices),
      hiddenMarkup:      fmtINR(fin.hiddenMarkup || 0),
      processingCharge:  fmtINR(fin.processingCharge || 0),
      costOfTravel:      fmtINR(fin.costOfTravel),
      processingCustomer:fmtINR(fin.processingCharge || 0),
      gstRate:           fin.gstType === 'cgst-sgst' ? '18.00%' : (fin.gstType === 'igst' ? '18% IGST' : 'N/A'),
      gstAmount:         fmtINR(fin.gstAmount),
      cgst:              fmtINR(fin.cgst),
      sgst:              fmtINR(fin.sgst),
      invoiceValue:      fmtINR(fin.invoiceValue),
      profitProcessing:  fmtINR(fin.processingCharge || 0),
      profitTotal:       fmtINR(fin.totalProfit),
      profitPct:         pctStr(fin.totalProfit, fin.costOfServices),
      packagePrice:      fmtINR(fin.packagePrice),
      custCgst:          fmtINR(fin.cgst),
      custSgst:          fmtINR(fin.sgst),
      custInvoice:       fmtINR(fin.invoiceValue),
      totalPayable:      fmtINR(fin.totalPayable),
      inputMode:         qd?.pricingMode || 'set-margin',
      billingModel:      qd?.billingModel || 'pure-agent',
      quoteDate:         createdDate,
    } : {},
    itinerary: [],
    inclusions: qd?.inclusions || [],
    exclusions: qd?.exclusions || [],
  };

  const handleEditQuote = () => {
    if (qd) openEditQuote(buildEditFormData(detailForPdf, quoteId));
  };
  const handleOpenDesigner = () => openDesigner(quoteId, qd || {}, 'quote-detail');
  const handleSimpleItinerary = () => {
    setShowItinDrop(false);
    if (qd) openEditQuote(buildEditFormData(detailForPdf, quoteId, { _startStep: 6, _fromView: 'quote-detail' }));
  };

  const handleApprove     = () => { updateQuote(quoteId, { status: 'approved'  }); };
  const handleReject      = () => { updateQuote(quoteId, { status: 'rejected'  }); };
  const handleBackToSent  = () => { updateQuote(quoteId, { status: 'sent'      }); };
  const handleReopen      = () => { updateQuote(quoteId, { status: 'draft'     }); };
  const handleViewBooking = () => { if (linkedBooking) openBookingDetail(linkedBooking.id, 'quote-detail'); };

  const handleConvertAccept = (edits) => {
    convertQuote(quoteId, edits);
    setShowConvert(false);
  };

  const initials = (quote.customerName||'').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const avatarBg = customer?.gradient || getAvatarBg(quote.customerName);

  return (
    <div id="view-quote-detail" className="fade-in">

      {/* ── Page Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">{quoteId}</h1>
            <p className="page-subtitle">Created on {createdDate}</p>
          </div>
          <div className="dash-header-right">
            <button className="cp-back-btn" onClick={onBack}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <RealLogButton />
            <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
              <div className="header-user-avatar">{userInitials}</div>
              <div className="header-user-info">
                <span className="header-user-name">{displayName}</span>
                <span className="header-user-role"><span className="role-dot"></span> {displayRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qd-body">

        {/* ── Quote Summary Card ── */}
        <div className="qd-summary-card">
          <div className="qd-summary-top">
            <div className="qd-summary-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="qd-summary-info">
              <div className="qd-summary-id-row">
                <span className="qd-summary-id">{quoteId}</span>
                <span className={`status-pill ${statusColors[quoteStatus] || 'status-draft'}`}>
                  {quoteStatus.charAt(0).toUpperCase() + quoteStatus.slice(1)}
                </span>
              </div>
              <p className="qd-summary-sub">{destType} · {destination}</p>
            </div>
          </div>

          <div className="qd-action-bar">
            {(quoteStatus === 'draft' || quoteStatus === 'sent') && (<>
              <button className="qd-btn qd-btn-approve" onClick={handleApprove}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Approve
              </button>
              <button className="qd-btn qd-btn-reject" onClick={handleReject}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject
              </button>
            </>)}
            {quoteStatus === 'approved' && (<>
              <button className="qd-btn qd-btn-backtosent" onClick={handleBackToSent}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                Back to Sent
              </button>
              <button className="qd-btn qd-btn-reject" onClick={handleReject}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject
              </button>
              <button className="qd-btn qd-btn-convert" onClick={() => setShowConvert(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Convert to Booking
              </button>
            </>)}
            {quoteStatus === 'rejected' && (
              <button className="qd-btn qd-btn-reopen" onClick={handleReopen}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                Reopen as Draft
              </button>
            )}
            {quoteStatus === 'converted' && (
              <button className="qd-btn qd-btn-viewbooking" onClick={handleViewBooking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                View Booking
              </button>
            )}
            <button className="qd-btn qd-btn-edit" onClick={handleEditQuote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              Edit Quote
            </button>
            <button className="qd-btn qd-btn-pdf" onClick={() => generateAgentPDF(quoteId, detailForPdf, quoteStatus)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Agent PDF
            </button>
            <button className="qd-btn qd-btn-pdf" onClick={() => generateCustomerPDF(quoteId, detailForPdf)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Customer PDF
            </button>
            <div className="qd-btn-itin-group" ref={itinDropRef} style={{ position: 'relative' }}>
              <button className="qd-btn qd-btn-itin" onClick={() => setShowItinDrop(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Itinerary
              </button>
              <button className="qd-btn qd-btn-itin qd-btn-itin-caret" onClick={() => setShowItinDrop(v => !v)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {showItinDrop && (
                <div className="qd-itin-action-drop">
                  <button className="qd-itin-action-item" onClick={handleSimpleItinerary}>
                    <span className="qd-itin-action-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </span>
                    <span className="qd-itin-action-text">
                      <span className="qd-itin-action-label">Simple Itinerary</span>
                      <span className="qd-itin-action-sub">Edit quote at Step 6</span>
                    </span>
                  </button>
                  <button className="qd-itin-action-item" onClick={() => { setShowItinDrop(false); handleOpenDesigner(); }}>
                    <span className="qd-itin-action-icon qd-itin-action-icon-design">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                    </span>
                    <span className="qd-itin-action-text">
                      <span className="qd-itin-action-label">Design Itinerary</span>
                      <span className="qd-itin-action-sub">Open Design Builder</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
            <button className="qd-btn qd-btn-share">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>

        {/* ── Customer + Travel Details ── */}
        <div className="qd-two-col">
          {/* Customer Card */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              CUSTOMER
            </div>
            <div className="qd-customer-hero">
              <div className="qd-customer-avatar" style={{ background: avatarBg }}>{initials}</div>
              <div>
                <p className="qd-customer-name">{quote.customerName}</p>
                {customer && (
                  <span className="qd-view-profile" onClick={() => openCustomerProfile(customer.id, 'quote-detail')}>
                    View Profile
                  </span>
                )}
              </div>
            </div>
            <div className="qd-contact-rows">
              {customerPhone && (
                <div className="qd-contact-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {customerPhone}
                </div>
              )}
              {customerEmail && (
                <div className="qd-contact-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {customerEmail}
                </div>
              )}
            </div>
          </div>

          {/* Travel Details Card */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              TRAVEL DETAILS
            </div>
            <div className="qd-travel-grid">
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div><span className="qd-tf-label">DESTINATION</span><span className="qd-tf-value">{destination}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/></svg>
                <div><span className="qd-tf-label">TYPE</span><span className="qd-tf-value">{destType.charAt(0).toUpperCase() + destType.slice(1)}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">TRAVEL DATE</span><span className="qd-tf-value">{tripDate}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div><span className="qd-tf-label">DURATION</span><span className="qd-tf-value">{duration || '—'}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">DEPARTURE</span><span className="qd-tf-value">{departure}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">RETURN</span><span className="qd-tf-value">{returnDate}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <div><span className="qd-tf-label">TRAVELERS</span><span className="qd-tf-value">{travelers}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Services & Costs + Financial Summary ── */}
        <div className="qd-two-col-6-4">
          {/* Services & Costs */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              SERVICES &amp; COSTS
            </div>
            {services.length > 0 ? (
              <div className="qd-service-list">
                {services.map((svc, i) => (
                  <div key={i} className="qd-service-item">
                    <div className="qd-service-icon" style={{ background: svc.cfg.bg, color: svc.cfg.color }}>{svc.cfg.icon}</div>
                    <div className="qd-service-info">
                      <span className="qd-service-name">{svc.name}</span>
                      {svc.vendor && <span className="qd-service-vendor">Vendor: {svc.vendor}</span>}
                    </div>
                    <span className="qd-service-cost">{fmtINR(svc.cost)}</span>
                  </div>
                ))}
                <div className="qd-service-total">
                  <span>Total Service Cost</span>
                  <span>{fmtINR(totalServiceCost)}</span>
                </div>
              </div>
            ) : (
              <div className="qd-itin-empty" style={{padding:'30px 0'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <p className="qd-itin-empty-text">No services added</p>
                <p className="qd-itin-empty-sub">Edit this quote to add services and costs.</p>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              FINANCIAL SUMMARY
            </div>
            {fin ? (<>
              {/* Agent View */}
              <div className="qd-fin-agent-label">
                ACTUAL (AGENT VIEW)
                <InfoBtn infoKey="qd_actual_agent_view" />
              </div>
              <div className="qd-fin-rows">
                <div className="qd-fin-row">
                  <span>Cost of Services <InfoBtn infoKey="qd_cost_of_services" /></span>
                  <span>{fmtINR(fin.costOfServices)}</span>
                </div>
                <div className="qd-fin-row">
                  <span>Hidden Markup</span><span>{fmtINR(fin.hiddenMarkup || 0)}</span>
                </div>
                <div className="qd-fin-row">
                  <span>Processing Charge (excl GST)</span><span>{fmtINR(fin.processingCharge || 0)}</span>
                </div>
                <div className="qd-fin-divider" />
                <div className="qd-fin-row">
                  <span>Cost of Travel (customer sees)</span><span>{fmtINR(fin.costOfTravel)}</span>
                </div>
                <div className="qd-fin-row">
                  <span>Processing Charge (customer sees)</span><span>{fmtINR(fin.processingCharge || 0)}</span>
                </div>
                {!fin.noGst && (<>
                  <div className="qd-fin-row">
                    <span>GST @18% (on processing)</span><span>{fmtINR(fin.gstAmount)}</span>
                  </div>
                  {fin.gstType === 'cgst-sgst' ? (<>
                    <div className="qd-fin-row qd-fin-row-sub"><span>CGST @9%</span><span>{fmtINR(fin.cgst)}</span></div>
                    <div className="qd-fin-row qd-fin-row-sub"><span>SGST @9%</span><span>{fmtINR(fin.sgst)}</span></div>
                  </>) : (
                    <div className="qd-fin-row qd-fin-row-sub"><span>IGST @18%</span><span>{fmtINR(fin.igst)}</span></div>
                  )}
                </>)}
                <div className="qd-fin-row qd-fin-row-bold">
                  <span>Invoice Value</span><span>{fmtINR(fin.invoiceValue)}</span>
                </div>
              </div>

              {/* Profit Box */}
              <div className="qd-profit-box">
                <div className="qd-profit-header">
                  <span>Your Profit <InfoBtn infoKey="qd_your_profit" /></span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <div className="qd-fin-row" style={{paddingLeft:0, paddingRight:0}}>
                  <span>Processing Charge</span><span>{fmtINR(fin.processingCharge || 0)}</span>
                </div>
                <div className="qd-profit-total">
                  <span>Total Profit ({pctStr(fin.totalProfit, fin.costOfServices)})</span>
                  <span className="qd-profit-amount">{fmtINR(fin.totalProfit)}</span>
                </div>
              </div>

              {/* Customer Invoice */}
              <div className="qd-fin-agent-label" style={{marginTop:16}}>CUSTOMER INVOICE</div>
              <div className="qd-fin-rows">
                <div className="qd-fin-row">
                  <span>Cost of Travel Reimbursement</span><span>{fmtINR(fin.costOfTravel)}</span>
                </div>
                <div className="qd-fin-row">
                  <span>Processing / Service Charge <span style={{fontSize:'10px',opacity:0.6}}>SAC:998551</span></span>
                  <span>{fmtINR(fin.processingCharge || 0)}</span>
                </div>
                {!fin.noGst && fin.gstType === 'cgst-sgst' && (<>
                  <div className="qd-fin-row"><span>CGST @9%</span><span>{fmtINR(fin.cgst)}</span></div>
                  <div className="qd-fin-row"><span>SGST @9%</span><span>{fmtINR(fin.sgst)}</span></div>
                </>)}
                {!fin.noGst && fin.gstType === 'igst' && (
                  <div className="qd-fin-row"><span>IGST @18%</span><span>{fmtINR(fin.igst)}</span></div>
                )}
                <div className="qd-fin-row qd-fin-row-bold">
                  <span>Invoice Value</span><span>{fmtINR(fin.invoiceValue)}</span>
                </div>
                <div className="qd-fin-payable">
                  <span>Total Payable</span><span>{fmtINR(fin.totalPayable)}</span>
                </div>
                <div className="qd-fin-divider" />
                <div className="qd-fin-meta">
                  <span className="qd-fin-meta-label">Input Mode <InfoBtn infoKey="qd_input_mode" /></span>
                  <span className="qd-fin-meta-val">{qd?.pricingMode || '—'}</span>
                </div>
                <div className="qd-fin-meta">
                  <span className="qd-fin-meta-label">Billing Model</span>
                  <span className="qd-fin-meta-val">{qd?.billingModel || '—'}</span>
                </div>
                <div className="qd-fin-meta">
                  <span className="qd-fin-meta-label">Quote Date</span>
                  <span className="qd-fin-meta-val">{createdDate}</span>
                </div>
              </div>
            </>) : (
              <div className="qd-itin-empty" style={{padding:'30px 0'}}>
                <p className="qd-itin-empty-text">No financial data</p>
                <p className="qd-itin-empty-sub">Create the quote using the form to see financial details.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Itinerary ── */}
        <div className="qd-card">
          <div className="qd-itin-card-header">
            <div className="qd-card-title" style={{color:'var(--accent)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              ITINERARY
            </div>
            <div className="qd-itin-toggle">
              <button className={`qd-itin-toggle-btn${itinView === 'simple' ? ' active' : ''}`} onClick={() => setItinView('simple')}>Simple</button>
              <button className={`qd-itin-toggle-btn${itinView === 'designed' ? ' active' : ''}`} onClick={() => setItinView('designed')}>Designed</button>
            </div>
          </div>

          {itinView === 'simple' ? (
            itinDays.length > 0 ? (
              <div className="qd-itin-list">
                {itinDays.map((day, di) => (
                  <div key={di} className="qd-day-group">
                    <div className="qd-day-header">
                      <div className="qd-day-badge">{di + 1}</div>
                      <span className="qd-day-date">{(day.title || `Day ${di+1}`).toUpperCase()}{day.date ? ` — ${day.date}` : ''}</span>
                    </div>
                    <div className="qd-day-items">
                      {day.highlight && (
                        <div className="qd-itin-item-row">
                          <div className="qd-itin-icon" style={{background:'#f0fdf4',color:'#16a34a'}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                          </div>
                          <div className="qd-itin-info">
                            <span className="qd-itin-name">{day.highlight}</span>
                            {day.hotel && <span className="qd-itin-sub">Hotel: {day.hotel}{day.meals ? ` · ${day.meals}` : ''}</span>}
                          </div>
                        </div>
                      )}
                      {(day.activities || []).filter(Boolean).map((act, ai) => (
                        <div key={ai} className="qd-itin-item-row">
                          <div className="qd-itin-icon" style={{background:'#faf5ff',color:'#7c3aed'}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          </div>
                          <div className="qd-itin-info">
                            <span className="qd-itin-name">{act}</span>
                          </div>
                        </div>
                      ))}
                      {!day.highlight && (!day.activities || day.activities.every(a => !a)) && (
                        <div className="qd-itin-item-row">
                          <div className="qd-itin-info"><span className="qd-itin-sub" style={{fontStyle:'italic'}}>No activities listed for this day</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="qd-itin-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <p className="qd-itin-empty-text">No itinerary added yet</p>
                <p className="qd-itin-empty-sub">Use the Edit Quote button to add day-by-day itinerary details.</p>
              </div>
            )
          ) : (
            <div className="qd-designed-panel">
              <div className="qd-designed-icon">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <circle cx="13.5" cy="6.5" r=".5" fill="var(--accent)"/>
                  <circle cx="17.5" cy="10.5" r=".5" fill="var(--accent)"/>
                  <circle cx="8.5" cy="7.5" r=".5" fill="var(--accent)"/>
                  <circle cx="6.5" cy="12.5" r=".5" fill="var(--accent)"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                </svg>
              </div>
              <div className="qd-designed-heading">Using Itinerary Design Builder</div>
              <div className="qd-designed-sub">This itinerary is configured to use the visual design builder. Open the editor to customize layouts, templates, and styling.</div>
              <button className="qd-designed-open-btn" onClick={handleOpenDesigner}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                </svg>
                Open Design Editor
              </button>
            </div>
          )}
        </div>

        {/* ── Inclusions + Exclusions ── */}
        {(qd?.inclusions?.length > 0 || qd?.exclusions?.length > 0) && (
          <div className="qd-incl-excl-grid">
            <div className="qd-incl-card">
              <div className="qd-incl-header">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                INCLUSIONS
              </div>
              <div className="qd-incl-list">
                {(qd?.inclusions || []).map((item, i) => (
                  <p key={i} className="qd-list-item">- {item}</p>
                ))}
              </div>
            </div>
            <div className="qd-excl-card">
              <div className="qd-excl-header">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                EXCLUSIONS
              </div>
              <div className="qd-incl-list">
                {(qd?.exclusions || []).map((item, i) => (
                  <p key={i} className="qd-list-item">- {item}</p>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Convert to Booking Modal ── */}
      {showConvert && ReactDOM.createPortal(
        <ConvertToBookingModal
          quote={{ ...quote, customerPhone, amount: fmtINR(fin?.totalPayable || 0) }}
          quoteDetail={qd}
          settings={settings}
          customers={customers}
          onAccept={handleConvertAccept}
          onDecline={() => setShowConvert(false)}
        />,
        document.body
      )}
    </div>
  );
};

export default RealQuoteDetail;
