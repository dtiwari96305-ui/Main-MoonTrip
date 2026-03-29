import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export const QuoteTypeModal = ({ onClose, onContinue }) => {
  const [selected, setSelected] = useState(null);

  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 18, padding: '32px', width: 540, maxWidth: '94vw', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>Create New Quote</h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>Choose your quote type</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Type cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Quick Quote */}
          <div
            onClick={() => setSelected('quick')}
            style={{
              border: `2px solid ${selected === 'quick' ? '#f97316' : '#e5e7eb'}`,
              borderRadius: 14, padding: '20px', cursor: 'pointer',
              background: selected === 'quick' ? '#fff7ed' : '#fff',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f97316, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>Quick Quote</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>Create a simple quote in 60 seconds. Best for straightforward domestic trips.</div>
          </div>

          {/* Detailed Quote */}
          <div
            onClick={() => setSelected('detailed')}
            style={{
              border: `2px solid ${selected === 'detailed' ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: 14, padding: '20px', cursor: 'pointer',
              background: selected === 'detailed' ? '#eff6ff' : '#fff',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>Detailed Quote</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>Full multi-step quote with services, pricing & itinerary. Best for complex or international trips.</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onContinue(selected)}
            disabled={!selected}
            style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: 10,
              background: selected ? '#f97316' : '#fed7aa',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
