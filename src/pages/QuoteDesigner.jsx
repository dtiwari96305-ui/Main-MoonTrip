import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDemoPopup } from '../context/DemoContext';
import jsPDF from 'jspdf';

const TEMPLATES = [
  { id: 'wanderlust', label: 'Wanderlust', color: '#16A34A', bg: '#f0fdf4' },
  { id: 'explorer',   label: 'Explorer',   color: '#3B82F6', bg: '#eff6ff' },
  { id: 'classic',    label: 'Classic',    color: '#1e293b', bg: '#f8fafc' },
  { id: 'horizon',    label: 'Horizon',    color: '#0EA5E9', bg: '#f0f9ff' },
  { id: 'serenity',   label: 'Serenity',   color: '#8B5CF6', bg: '#f5f3ff' },
  { id: 'riviera',    label: 'Riviera',    color: '#EC4899', bg: '#fdf2f8' },
  { id: 'onyx',       label: 'Onyx',       color: '#334155', bg: '#f1f5f9' },
  { id: 'atlas',      label: 'Atlas',      color: '#10B981', bg: '#f0fdf4' },
  { id: 'majestic',   label: 'Majestic',   color: '#F59E0B', bg: '#fffbeb' },
];

const ACCENT_COLORS = ['#16A34A', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

const GSTIN = 'GSTIN 27AABCW1234F1ZP';

const getMonthName = (m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m];

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
};

export const QuoteDesigner = ({ quoteId, quoteData, fromView, onBack }) => {
  const openDemo = useDemoPopup();

  const [selectedTemplate, setSelectedTemplate] = useState('wanderlust');
  const [accentColor, setAccentColor]           = useState('#16A34A');
  const [showPreview, setShowPreview]           = useState(false);
  const [hfTab, setHfTab]                       = useState('design');
  const [companyName, setCompanyName]           = useState('WANDERLUST TRAVELS');
  const [tagline, setTagline]                   = useState('Crafting Memories, One Journey at a Time');
  const [phone, setPhone]                       = useState('+91 98765 43210');
  const [email, setEmail]                       = useState('demo@touridoo.in');
  const [logoPosition, setLogoPosition]         = useState('left');
  const [headerLayout, setHeaderLayout]         = useState('split');
  const [headerHeight, setHeaderHeight]         = useState(80);
  const [fontSize, setFontSize]                 = useState(14);
  const [horizPadding, setHorizPadding]         = useState(24);
  const [headerBg, setHeaderBg]                 = useState('#16A34A');
  const [headerText, setHeaderText]             = useState('#ffffff');
  const [dividerLine, setDividerLine]           = useState(true);
  const [hoveredDay, setHoveredDay]             = useState(null);
  const [activeDayIdx, setActiveDayIdx]         = useState(null);

  // Extract quote data
  const customerName  = quoteData?.customerSearch || quoteData?.newCustomerName || 'Customer';
  const destination   = quoteData?.destination || '—';
  const duration      = quoteData?.duration || '—';
  const travelers     = quoteData?.numTravelers || '—';
  const startDate     = quoteData?.startDate || '—';
  const endDate       = quoteData?.endDate || '—';
  const inclusions    = quoteData?.inclusions || [];
  const exclusions    = quoteData?.exclusions || [];
  const itDays        = quoteData?.itDays || [];
  const totalPayable  = parseFloat(quoteData?.totalQuoteAmount) || 0;

  const defaultDays = itDays.length > 0
    ? itDays.map(d => ({ title: d.title || '', content: Array.isArray(d.activities) ? d.activities.join(', ') : (d.highlight || '') }))
    : [{ title: 'Arrival', content: '' }, { title: '', content: '' }, { title: 'Departure', content: '' }];
  const [editDays, setEditDays] = useState(defaultDays);

  const updateDay = (idx, field, val) => setEditDays(days => days.map((d, i) => i === idx ? { ...d, [field]: val } : d));
  const addDay = () => setEditDays(days => [...days, { title: '', content: '' }]);
  const removeDay = (idx) => setEditDays(days => days.filter((_, i) => i !== idx));
  const customerNotes = quoteData?.customerNotes || '';

  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleExportPDF = () => {
    const doc    = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW  = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y        = 0;
    const rgb    = hexToRgb(accentColor);

    // Header
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(0, 0, pageW, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15); doc.setFont('helvetica', 'bold');
    doc.text(companyName, margin, 11);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.text(tagline, margin, 17);
    doc.text(`${phone}  |  ${email}`, margin, 23);
    doc.setFontSize(7);
    doc.text(GSTIN, margin, 29);
    y = 42;

    // Quote ID + Customer
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text(quoteId || 'WL-Q-0001', margin, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`For: ${customerName}`, margin, y);
    doc.setFontSize(9);
    doc.text(`Date: ${todayStr}`, pageW - margin, y, { align: 'right' });
    y += 12;

    // Trip Details
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Trip Details', margin, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.setFontSize(9);
    doc.text(`Destination: ${destination}`, margin, y); y += 5;
    doc.text(`Duration: ${duration}  |  Travelers: ${travelers}  |  Dates: ${startDate} – ${endDate}`, margin, y); y += 12;

    // Itinerary
    if (itDays.length > 0) {
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('Day-by-Day Itinerary', margin, y); y += 5;
      itDays.forEach((day, i) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 50, 50);
        doc.text(`Day ${i + 1}: ${day.title || ''}`, margin, y); y += 4;
        if (day.activities) {
          doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(90, 90, 90);
          const lines = doc.splitTextToSize(day.activities, pageW - margin * 2);
          doc.text(lines, margin + 3, y); y += lines.length * 4 + 3;
        }
      });
      y += 4;
    }

    // Inclusions
    if (inclusions.length > 0) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('Inclusions', margin, y); y += 5;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
      inclusions.forEach(inc => { doc.text(`• ${inc}`, margin + 3, y); y += 4; });
      y += 4;
    }

    // Exclusions
    if (exclusions.length > 0) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('Exclusions', margin, y); y += 5;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
      exclusions.forEach(exc => { doc.text(`• ${exc}`, margin + 3, y); y += 4; });
      y += 6;
    }

    // Notes
    if (customerNotes) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('Notes', margin, y); y += 5;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
      const noteLines = doc.splitTextToSize(customerNotes, pageW - margin * 2);
      doc.text(noteLines, margin, y); y += noteLines.length * 4 + 8;
    }

    // Total Payable bar
    if (y > 255) { doc.addPage(); y = 20; }
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(0, y, pageW, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAYABLE', margin, y + 9);
    doc.text(`₹${totalPayable.toLocaleString('en-IN')}`, pageW - margin, y + 9, { align: 'right' });
    y += 22;

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y); y += 5;
    doc.setFontSize(7); doc.setTextColor(140, 140, 140); doc.setFont('helvetica', 'normal');
    doc.text(`${companyName}  ·  ${GSTIN}  ·  ${email}`, pageW / 2, y, { align: 'center' });

    const now = new Date();
    const fileName = `Quote-${quoteId || 'WL-Q-0001'}-Design-${String(now.getDate()).padStart(2,'0')}${getMonthName(now.getMonth())}${String(now.getFullYear()).slice(2)}.pdf`;
    doc.save(fileName);
  };

  const DocumentPreview = () => (
    <div className="qds-doc" style={{ '--qds-accent': accentColor }}>
      {/* Header */}
      <div
        className={`qds-doc-header qds-doc-header-${headerLayout}`}
        style={{ background: accentColor, padding: `${Math.round(horizPadding * 0.6)}px ${horizPadding}px`, minHeight: headerHeight }}
      >
        <div className="qds-doc-company-block">
          <div className="qds-doc-company-name" style={{ fontSize: Math.max(10, fontSize), color: headerText }}>{companyName}</div>
          <div className="qds-doc-tagline" style={{ color: headerText + 'bb', fontSize: Math.max(8, fontSize - 4) }}>{tagline}</div>
        </div>
        <div className="qds-doc-header-contact" style={{ color: headerText + 'bb', fontSize: Math.max(7, fontSize - 5) }}>
          <div>{phone}</div>
          <div>{email}</div>
          <div>{GSTIN}</div>
        </div>
        {dividerLine && <div className="qds-header-divider" style={{ background: headerText + '44' }} />}
      </div>

      {/* Quote ID row */}
      <div className="qds-doc-id-row">
        <div>
          <div className="qds-doc-quote-id" style={{ color: accentColor }}>{quoteId || 'WL-Q-0001'}</div>
          <div className="qds-doc-for">Prepared for: <strong>{customerName}</strong></div>
        </div>
        <div className="qds-doc-date-block">
          <div className="qds-doc-date-label">Date</div>
          <div className="qds-doc-date-val">{todayStr}</div>
        </div>
      </div>

      {/* Trip chips */}
      <div className="qds-doc-chips-row">
        <span className="qds-trip-chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {destination}
        </span>
        <span className="qds-trip-chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {startDate} – {endDate}
        </span>
        <span className="qds-trip-chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          {travelers} Traveler{travelers !== 1 ? 's' : ''}
        </span>
        <span className="qds-trip-chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {duration}
        </span>
      </div>

      {/* Itinerary */}
      {itDays.length > 0 && (
        <div className="qds-doc-section">
          <div className="qds-doc-sec-title" style={{ color: accentColor, borderLeftColor: accentColor }}>Day-by-Day Itinerary</div>
          {itDays.map((day, i) => (
            <div key={i} className="qds-doc-day-row">
              <div className="qds-doc-day-badge" style={{ background: accentColor }}>Day {i + 1}</div>
              <div className="qds-doc-day-info">
                <div className="qds-doc-day-title">{day.title || `Day ${i + 1}`}</div>
                {day.activities && <div className="qds-doc-day-acts">{day.activities}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inclusions / Exclusions */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <div className="qds-doc-ie-grid">
          {inclusions.length > 0 && (
            <div className="qds-doc-ie-col">
              <div className="qds-doc-ie-hdr" style={{ color: '#16a34a', borderBottomColor: '#bbf7d0' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                INCLUSIONS
              </div>
              {inclusions.map((inc, i) => <div key={i} className="qds-doc-ie-item">• {inc}</div>)}
            </div>
          )}
          {exclusions.length > 0 && (
            <div className="qds-doc-ie-col">
              <div className="qds-doc-ie-hdr" style={{ color: '#dc2626', borderBottomColor: '#fecdd3' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                EXCLUSIONS
              </div>
              {exclusions.map((exc, i) => <div key={i} className="qds-doc-ie-item">• {exc}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {customerNotes && (
        <div className="qds-doc-section">
          <div className="qds-doc-sec-title" style={{ color: accentColor, borderLeftColor: accentColor }}>Notes</div>
          <div className="qds-doc-notes-text">{customerNotes}</div>
        </div>
      )}

      {/* Total Payable */}
      <div className="qds-doc-total-bar" style={{ background: accentColor }}>
        <span className="qds-doc-total-label">TOTAL PAYABLE</span>
        <span className="qds-doc-total-val">₹{totalPayable.toLocaleString('en-IN')}</span>
      </div>

      {/* Footer */}
      <div className="qds-doc-footer">
        <span>{companyName}</span>
        <span className="qds-doc-footer-dot">·</span>
        <span>{GSTIN}</span>
        <span className="qds-doc-footer-dot">·</span>
        <span>{email}</span>
      </div>
    </div>
  );

  return (
    <div className="qds-page fade-in">
      {/* Top Bar */}
      <div className="qds-topbar">
        <div className="qds-topbar-left">
          <button className="qds-back-btn" onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            {fromView === 'quotes' ? `Quotes / ${quoteId || ''} / Designer` : 'Back'}
          </button>
          <div className="qds-topbar-meta">
            <span className="qds-topbar-id">{quoteId || 'WL-Q-0001'}</span>
            <span className="qds-topbar-sub">Itinerary Design Builder</span>
          </div>
        </div>
        <div className="qds-topbar-actions">
          <button className="qds-top-btn qds-top-btn-preview" onClick={() => setShowPreview(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <button className="qds-top-btn qds-top-btn-export" onClick={handleExportPDF}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
          <button className="qds-top-btn qds-top-btn-save" onClick={openDemo}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="qds-body">
        {/* ── Left Panel ── */}
        <div className="qds-left-panel">

          {/* Templates */}
          <div className="qds-panel-section">
            <div className="qds-panel-sec-label">Templates</div>
            <div className="qds-template-grid">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  className={`qds-template-card${selectedTemplate === t.id ? ' qds-tmpl-active' : ''}`}
                  onClick={() => { setSelectedTemplate(t.id); setAccentColor(t.color); setHeaderBg(t.color); }}
                  title={t.label}
                >
                  <div className="qds-tmpl-thumb" style={{ background: t.bg }}>
                    <div className="qds-tmpl-top" style={{ background: t.color }} />
                    <div className="qds-tmpl-body">
                      <div className="qds-tmpl-line" style={{ background: t.color + '55', width: '65%' }} />
                      <div className="qds-tmpl-line" style={{ background: '#cbd5e1', width: '90%' }} />
                      <div className="qds-tmpl-line" style={{ background: '#cbd5e1', width: '75%' }} />
                      <div className="qds-tmpl-line" style={{ background: '#cbd5e1', width: '55%' }} />
                    </div>
                    <div className="qds-tmpl-foot" style={{ background: t.color + '33' }} />
                  </div>
                  <span className="qds-tmpl-label">{t.label}</span>
                  {selectedTemplate === t.id && (
                    <div className="qds-tmpl-check" style={{ background: t.color }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="qds-panel-section">
            <div className="qds-panel-sec-label">Accent Color</div>
            <div className="qds-color-row">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c}
                  className={`qds-color-swatch${accentColor === c ? ' qds-color-active' : ''}`}
                  style={{ background: c }}
                  onClick={() => { setAccentColor(c); setHeaderBg(c); }}
                  title={c}
                >
                  {accentColor === c && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              ))}
              <label className="qds-color-custom-wrap" title="Custom color">
                <input type="color" className="qds-color-custom-input" value={accentColor} onChange={e => { setAccentColor(e.target.value); setHeaderBg(e.target.value); }} />
                <span className="qds-color-custom-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                </span>
              </label>
            </div>
          </div>

          {/* Cover Pages */}
          <div className="qds-panel-section">
            <div className="qds-panel-sec-label">Cover Pages</div>
            <div className="qds-cover-empty">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#94a3b8' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
              <p className="qds-cover-empty-txt">No cover pages added</p>
              <button className="qds-cover-add-btn" onClick={openDemo}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Cover Page
              </button>
            </div>
          </div>

          {/* Header & Footer */}
          <div className="qds-panel-section">
            <div className="qds-panel-sec-label">Header &amp; Footer</div>

            <div className="qds-hf-tabs">
              <button className={`qds-hf-tab${hfTab === 'design' ? ' qds-hf-tab-on' : ''}`} onClick={() => setHfTab('design')}>Design</button>
              <button className={`qds-hf-tab${hfTab === 'image' ? ' qds-hf-tab-on' : ''}`} onClick={() => setHfTab('image')}>Image</button>
            </div>

            {hfTab === 'image' ? (
              <div className="qds-hf-img-zone" onClick={openDemo}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#94a3b8' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Upload header image</p>
                <span>Click to browse</span>
              </div>
            ) : (
              <div className="qds-hf-design-form">
                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Company Name</label>
                  <input className="qds-hf-inp" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Tagline</label>
                  <input className="qds-hf-inp" value={tagline} onChange={e => setTagline(e.target.value)} />
                </div>
                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Contact / Phone</label>
                  <input className="qds-hf-inp" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Email</label>
                  <input className="qds-hf-inp" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Logo Position</label>
                  <div className="qds-hf-radio-row">
                    {['left','center','right'].map(p => (
                      <button key={p} className={`qds-hf-radio-btn${logoPosition === p ? ' qds-hf-radio-on' : ''}`} onClick={() => setLogoPosition(p)}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qds-hf-fg">
                  <label className="qds-hf-lbl">Layout</label>
                  <div className="qds-hf-radio-row">
                    {['split','centered','compact'].map(l => (
                      <button key={l} className={`qds-hf-radio-btn${headerLayout === l ? ' qds-hf-radio-on' : ''}`} onClick={() => setHeaderLayout(l)}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style & Sizing */}
                <div className="qds-hf-subsection">
                  <div className="qds-hf-sub-label">Style &amp; Sizing</div>

                  <div className="qds-hf-slider-row">
                    <div className="qds-hf-slider-top">
                      <label className="qds-hf-lbl">Height</label>
                      <span className="qds-hf-val">{headerHeight}px</span>
                    </div>
                    <input type="range" min="50" max="140" value={headerHeight} onChange={e => setHeaderHeight(+e.target.value)} className="qds-hf-slider" />
                  </div>

                  <div className="qds-hf-slider-row">
                    <div className="qds-hf-slider-top">
                      <label className="qds-hf-lbl">Font Size</label>
                      <span className="qds-hf-val">{fontSize}px</span>
                    </div>
                    <input type="range" min="10" max="22" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="qds-hf-slider" />
                  </div>

                  <div className="qds-hf-slider-row">
                    <div className="qds-hf-slider-top">
                      <label className="qds-hf-lbl">Horiz. Padding</label>
                      <span className="qds-hf-val">{horizPadding}px</span>
                    </div>
                    <input type="range" min="10" max="60" value={horizPadding} onChange={e => setHorizPadding(+e.target.value)} className="qds-hf-slider" />
                  </div>

                  <div className="qds-hf-color-pair">
                    <div className="qds-hf-fg" style={{ flex: 1 }}>
                      <label className="qds-hf-lbl">Background</label>
                      <div className="qds-hf-color-pick">
                        <input type="color" className="qds-hf-color-input" value={headerBg} onChange={e => { setHeaderBg(e.target.value); setAccentColor(e.target.value); }} />
                        <span className="qds-hf-color-hex">{headerBg.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="qds-hf-fg" style={{ flex: 1 }}>
                      <label className="qds-hf-lbl">Text Color</label>
                      <div className="qds-hf-color-pick">
                        <input type="color" className="qds-hf-color-input" value={headerText} onChange={e => setHeaderText(e.target.value)} />
                        <span className="qds-hf-color-hex">{headerText.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="qds-hf-toggle-row">
                    <span className="qds-hf-lbl">Divider Line</span>
                    <button
                      className={`qds-toggle${dividerLine ? ' qds-toggle-on' : ''}`}
                      style={{ '--tc': accentColor }}
                      onClick={() => setDividerLine(!dividerLine)}
                    >
                      <span className="qds-toggle-thumb" />
                    </button>
                  </div>
                </div>

                <button className="qds-hf-preview-btn" onClick={() => setShowPreview(true)}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  PREVIEW
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── Right Panel — Editable Day Editor ── */}
        <div className="qds-right-panel">
          {/* Toolbar */}
          <div className="qds-editor-toolbar">
            <div className="qds-tb-group">
              <button className="qds-tb-btn" onClick={openDemo} title="Font">T</button>
              <button className="qds-tb-btn qds-tb-size" onClick={openDemo}>16 <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              <button className="qds-tb-btn qds-tb-bold" onClick={openDemo} title="Bold">B</button>
              <button className="qds-tb-btn qds-tb-italic" onClick={openDemo} title="Italic">I</button>
              <button className="qds-tb-btn qds-tb-under" onClick={openDemo} title="Underline">U</button>
              <button className="qds-tb-btn qds-tb-strike" onClick={openDemo} title="Strikethrough">S</button>
              <button className="qds-tb-btn" onClick={openDemo} title="Emoji">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
              <button className="qds-tb-btn" onClick={openDemo} title="Highlight">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              {['H₁','H₂','H₃','H₄'].map(h => <button key={h} className="qds-tb-btn qds-tb-h" onClick={openDemo}>{h}</button>)}
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              {[
                <svg key="al" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
                <svg key="ac" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>,
                <svg key="ar" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
                <svg key="aj" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
              ].map((icon, i) => <button key={i} className="qds-tb-btn" onClick={openDemo}>{icon}</button>)}
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg></button>
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              <button className="qds-tb-btn qds-tb-blocks" onClick={openDemo}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Blocks
              </button>
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg></button>
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              <button className="qds-tb-img-btn" onClick={openDemo}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                0/20
              </button>
            </div>
            <div className="qds-tb-sep"/>
            <div className="qds-tb-group">
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></button>
              <button className="qds-tb-btn" onClick={openDemo}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg></button>
            </div>
          </div>

          {/* Editable Document */}
          <div className="qds-editor-scroll">
            <div className="qds-editor-doc">
              {editDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`qds-edit-day${hoveredDay === idx ? ' qds-edit-day-hovered' : ''}`}
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Delete button */}
                  {hoveredDay === idx && editDays.length > 1 && (
                    <button className="qds-edit-day-del" onClick={() => removeDay(idx)} title="Delete day">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  )}
                  <div className="qds-edit-day-row">
                    <div className="qds-edit-day-badge" style={{ background: accentColor }}>{idx + 1}</div>
                    <div
                      className="qds-edit-day-title"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateDay(idx, 'title', e.currentTarget.textContent)}
                      onFocus={() => setActiveDayIdx(idx)}
                      data-placeholder="Click to add title..."
                    >
                      {day.title}
                    </div>
                  </div>
                  <div className="qds-edit-day-content-wrap" style={{ borderLeftColor: accentColor }}>
                    <div
                      className="qds-edit-day-content"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateDay(idx, 'content', e.currentTarget.textContent)}
                      onFocus={() => setActiveDayIdx(idx)}
                      data-placeholder={`Day ${idx + 1} activities and details...`}
                    >
                      {day.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Day */}
              <button className="qds-edit-add-day" onClick={addDay}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && ReactDOM.createPortal(
        <div className="qds-overlay" onClick={() => setShowPreview(false)}>
          <div className="qds-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="qds-preview-bar">
              <span className="qds-preview-bar-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview — {quoteId || 'WL-Q-0001'}
              </span>
              <div className="qds-preview-bar-actions">
                <button className="qds-top-btn qds-top-btn-export" style={{ fontSize: '0.8rem' }} onClick={handleExportPDF}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </button>
                <button className="qds-preview-close" onClick={() => setShowPreview(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div className="qds-preview-scroll">
              <div className="qds-preview-doc">
                <DocumentPreview />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
