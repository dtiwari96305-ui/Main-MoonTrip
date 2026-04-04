import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function parsePNR(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const legs = [];
  let passengerName = '';

  // Try passenger name
  const nameMatch = text.match(/(?:NAME|PAX|PASSENGER)[:\s]+([A-Z][A-Z\s/]+)/i)
    || text.match(/([A-Z]{2,}\/[A-Z]{2,})/);
  if (nameMatch) passengerName = nameMatch[1].trim();

  // Pattern: FlightNo Date Sector Times — e.g. EY245 01MAR AMD/AUH 0600 0800
  const p1 = /([A-Z]{2}\s?\d{1,4})\s+(\d{1,2}[A-Z]{3}(?:\d{2,4})?)\s+([A-Z]{3})[\/\-]([A-Z]{3})\s+(\d{3,4})\s+(\d{3,4})/g;
  let m;
  while ((m = p1.exec(text)) !== null) {
    legs.push({
      flightNumber: m[1].replace(/\s/g, ''),
      date: m[2],
      sector: `${m[3]}/${m[4]}`,
      depTime: m[5],
      arrTime: m[6],
      passenger: passengerName,
      ticketNumber: '',
      baseFare: '',
      taxes: '',
    });
  }

  // Pattern: FlightNo Date Sector (no times)
  if (legs.length === 0) {
    const p2 = /([A-Z]{2}\s?\d{1,4})\s+(\d{1,2}[A-Z]{3}(?:\d{2,4})?)\s+([A-Z]{3})[\/\-]([A-Z]{3})/g;
    while ((m = p2.exec(text)) !== null) {
      legs.push({
        flightNumber: m[1].replace(/\s/g, ''),
        date: m[2],
        sector: `${m[3]}/${m[4]}`,
        depTime: '',
        arrTime: '',
        passenger: passengerName,
        ticketNumber: '',
        baseFare: '',
        taxes: '',
      });
    }
  }

  // Try ticket number
  const ticketMatch = text.match(/(?:TICKET|TKT|ETKT)[:\s#]*(\d[\d\s-]{8,})/i);
  const ticketNum = ticketMatch ? ticketMatch[1].replace(/[\s-]/g, '') : '';
  if (ticketNum) {
    legs.forEach(l => { l.ticketNumber = ticketNum; });
  }

  // Fallback: if no legs found but text has content, create one empty leg with what we have
  if (legs.length === 0 && text.length > 5) {
    legs.push({
      flightNumber: '',
      date: '',
      sector: '',
      depTime: '',
      arrTime: '',
      passenger: passengerName,
      ticketNumber: ticketNum,
      baseFare: '',
      taxes: '',
    });
  }

  return { legs, passengerName };
}

export const ImportPNRModal = ({ onImport, onClose }) => {
  const [pnrText, setPnrText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');

  const handleParse = () => {
    if (!pnrText.trim()) { setError('Please paste your PNR data first.'); return; }
    setError('');
    const result = parsePNR(pnrText);
    if (result.legs.length === 0) {
      setError('Could not parse flight info. Please enter details manually.');
      return;
    }
    setParsed(result);
  };

  const handleImport = () => {
    if (parsed) { onImport(parsed); onClose(); }
  };

  const content = (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </div>
            <h2 className="modal-title">Import PNR</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="modal-body" style={{ padding: '16px 24px 20px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
            Paste your PNR confirmation text or e-ticket content below. The system will extract flight details automatically.
          </p>

          <textarea
            value={pnrText}
            onChange={e => { setPnrText(e.target.value); setParsed(null); setError(''); }}
            placeholder={'Paste PNR or e-ticket text here...\n\nExample:\nPNR: ABC123\nPassenger: SHARMA/RAHUL\nEY 245 01MAR AMD/AUH 0600 0800\nEY 101 01MAR AUH/LHR 1000 1400'}
            style={{ width: '100%', boxSizing: 'border-box', minHeight: 140, padding: 14, border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', outline: 'none' }}
          />

          {!parsed && (
            <button onClick={handleParse} disabled={!pnrText.trim()} style={{ marginTop: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Parse PNR Data
            </button>
          )}

          {error && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: '#fef2f2', color: '#ef4444', fontSize: 13, border: '1px solid #fecaca' }}>{error}</div>
          )}

          {parsed && (
            <div style={{ marginTop: 12 }}>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#f0fdf4', color: '#16a34a', fontSize: 13, fontWeight: 600, border: '1px solid #bbf7d0', marginBottom: 8 }}>
                Found {parsed.legs.length} flight leg{parsed.legs.length > 1 ? 's' : ''}
                {parsed.passengerName && ` — ${parsed.passengerName}`}
              </div>
              {parsed.legs.map((leg, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', marginBottom: 6, fontSize: 13, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600 }}>Leg {i + 1}</span>
                  {leg.flightNumber && <span>Flight: {leg.flightNumber}</span>}
                  {leg.sector && <span>Route: {leg.sector}</span>}
                  {leg.date && <span>Date: {leg.date}</span>}
                  {leg.ticketNumber && <span>Ticket: {leg.ticketNumber}</span>}
                </div>
              ))}
              <button onClick={() => setParsed(null)} style={{ marginTop: 4, background: 'none', border: 'none', color: '#6366f1', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>← Parse Again</button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="rp-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="rp-record-btn" onClick={handleImport} disabled={!parsed} style={{ opacity: parsed ? 1 : 0.5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Import to Flight Form
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
