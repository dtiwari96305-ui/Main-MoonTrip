import React, { useMemo } from 'react';
import { blockNonNumericKeys } from '../../utils/inputHelpers';

const RupeeField = ({ label, value, onChange, hint, required }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label">{label}{required && ' *'}</label>
    <div className="cvb-rupee-wrap">
      <span className="cvb-rupee-prefix">₹</span>
      <input
        className="cvb-rupee-input"
        type="number"
        step="0.01"
        value={value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        onKeyDown={blockNonNumericKeys}
        placeholder="0"
      />
      {hint && <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 11, color: '#9ca3af', background: '#f9fafb', borderLeft: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{hint}</span>}
    </div>
  </div>
);

export const AdjustmentsSection = ({ form, onChange }) => {
  const netPayable = useMemo(() => {
    const g = Number(form.grossAmount) || 0;
    const c = Number(form.commissionAmount) || 0;
    const t = Number(form.tdsReceivable) || 0;
    const pf = Number(form.processingFee) || 0;
    const cgst = Number(form.vendorGstCgst) || 0;
    const sgst = Number(form.vendorGstSgst) || 0;
    const ro = Number(form.roundOff) || 0;
    return g - c - t + pf + cgst + sgst + ro;
  }, [form]);

  const set = (k) => (v) => onChange({ ...form, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Gross Amount — full width */}
      <RupeeField label="Gross Amount" required value={form.grossAmount || ''} onChange={set('grossAmount')} />

      {/* 3-col: Commission / TDS / Processing Fee */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <RupeeField label="Commission" value={form.commissionAmount || ''} onChange={set('commissionAmount')} hint="deduct" />
        <RupeeField label="TDS Receivable" value={form.tdsReceivable || ''} onChange={set('tdsReceivable')} hint="deduct" />
        <RupeeField label="Processing Fee" value={form.processingFee || ''} onChange={set('processingFee')} hint="add" />
      </div>

      {/* 2-col: CGST / SGST */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <RupeeField label="Vendor GST CGST" value={form.vendorGstCgst || ''} onChange={set('vendorGstCgst')} hint="add" />
        <RupeeField label="Vendor GST SGST" value={form.vendorGstSgst || ''} onChange={set('vendorGstSgst')} hint="add" />
      </div>

      {/* Round Off — half width */}
      <div style={{ maxWidth: '50%' }}>
        <RupeeField label="Round Off" value={form.roundOff || ''} onChange={set('roundOff')} />
      </div>

      {/* Net Payable — green card */}
      <div className="cvb-net-payable">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Net Payable to Vendor</div>
          <div style={{ fontSize: 11, color: '#4ade80', marginTop: 3 }}>
            = Gross − Commission − TDS + Processing Fee + CGST + SGST + Round Off
          </div>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: netPayable < 0 ? '#ef4444' : '#16a34a' }}>
          ₹{Number(netPayable || 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};
