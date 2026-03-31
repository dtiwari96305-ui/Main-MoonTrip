import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const DOC_TYPES = [
  { key: 'quote',       label: 'Quotes',              icon: '\uD83D\uDCC4', defaultPrefix: 'WL-Q-' },
  { key: 'booking',     label: 'Bookings',            icon: '\uD83D\uDCC5', defaultPrefix: 'WL-B-' },
  { key: 'invoice',     label: 'Tax Invoices',        icon: '\uD83E\uDDFE', defaultPrefix: 'INV-' },
  { key: 'receipt',     label: 'Receipts',            icon: '\uD83D\uDCB3', defaultPrefix: 'REC-' },
  { key: 'cn',          label: 'Cancellation Notes',  icon: '\uD83D\uDD04', defaultPrefix: 'CN-' },
  { key: 'vendor_bill', label: 'Vendor Bills',        icon: '\uD83C\uDFEA', defaultPrefix: 'VB-' },
  { key: 'hm_invoice',  label: 'HM Invoices',         icon: '\uD83D\uDCCA', defaultPrefix: 'HM-' },
];

const PADDING_OPTIONS = [
  { value: 4, label: '0001 (4 digits)' },
  { value: 3, label: '001 (3 digits)' },
  { value: 2, label: '01 (2 digits)' },
  { value: 1, label: '1 (no padding)' },
];

function padNumber(num, padding) {
  return String(num).padStart(padding, '0');
}

export const NomenclatureSetup = ({ onComplete }) => {
  const { saveDocumentSequences } = useData();
  const [saving, setSaving] = useState(false);
  const [globalPadding, setGlobalPadding] = useState(4);
  const [rows, setRows] = useState(
    DOC_TYPES.map(d => ({
      document_type: d.key,
      prefix: d.defaultPrefix,
      startNumber: 1,
      suffix: '',
    }))
  );

  const updateRow = (idx, field, value) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sequences = rows.map(r => ({
        document_type: r.document_type,
        prefix: r.prefix,
        suffix: r.suffix,
        current_number: Math.max(0, Number(r.startNumber) - 1),
        padding: globalPadding,
      }));
      await saveDocumentSequences(sequences);
      onComplete();
    } catch (err) {
      console.error('NomenclatureSetup: save failed', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUseDefaults = async () => {
    setSaving(true);
    try {
      const sequences = DOC_TYPES.map(d => ({
        document_type: d.key,
        prefix: d.defaultPrefix,
        suffix: '',
        current_number: 0,
        padding: 4,
      }));
      await saveDocumentSequences(sequences);
      onComplete();
    } catch (err) {
      console.error('NomenclatureSetup: defaults save failed', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 680, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '40px 32px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#22c55e', borderRadius: 12, marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          </div>
        </div>

        {/* Header */}
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Set Up Your Document Numbers
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7280', margin: '0 0 32px', lineHeight: 1.5 }}>
          Customize how your quotes, bookings, and invoices are numbered. You can change these anytime in Settings.
        </p>

        {/* Document type rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DOC_TYPES.map((docType, idx) => {
            const row = rows[idx];
            const preview = `${row.prefix}${padNumber(row.startNumber || 1, globalPadding)}${row.suffix}`;
            return (
              <div key={docType.key} style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.1rem' }}>{docType.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{docType.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#22c55e', fontWeight: 500, fontFamily: 'monospace', background: '#f0fdf4', padding: '2px 8px', borderRadius: 6 }}>
                    {preview}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Prefix"
                    value={row.prefix}
                    onChange={e => updateRow(idx, 'prefix', e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Start #"
                    value={row.startNumber}
                    onChange={e => updateRow(idx, 'startNumber', e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', textAlign: 'center' }}
                  />
                  <input
                    type="text"
                    placeholder="Suffix (optional)"
                    value={row.suffix}
                    onChange={e => updateRow(idx, 'suffix', e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Padding selector */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>Number Format:</label>
          <select
            value={globalPadding}
            onChange={e => setGlobalPadding(Number(e.target.value))}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
          >
            {PADDING_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', marginTop: 28, padding: '14px 24px',
            background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
          }}
        >
          {saving ? 'Saving...' : 'Save & Enter Dashboard \u2192'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button
            onClick={handleUseDefaults}
            disabled={saving}
            style={{
              background: 'none', border: 'none', color: '#6b7280',
              fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            Use Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
