import React, { useState, useMemo } from 'react';
import { AddVendorModal } from '../../components/vendor/AddVendorModal';
import { Header } from '../../components/Header';
import { openVendorDetail } from '../../../utils/vendorNav';

export const VendorsList = ({ vendors, vendorBills, vendorPayments, addVendor, onViewChange, mode = 'demo' }) => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vendors.filter(v =>
      v.name.toLowerCase().includes(q) ||
      (v.vendorCode || '').toLowerCase().includes(q) ||
      (v.city || '').toLowerCase().includes(q) ||
      (v.gstNumber || '').toLowerCase().includes(q) ||
      (v.contactPerson || '').toLowerCase().includes(q) ||
      (v.phone || '').includes(q)
    );
  }, [vendors, search]);

  return (
    <div className="page-content">
      <Header title="Vendors" subtitle="Manage your vendor directory" showNewQuote={false} mode={mode}>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vendor
        </button>
      </Header>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search vendors by name, code, city..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 14px 11px 40px',
            border: '1px solid #e5e7eb', borderRadius: 10,
            fontSize: 14, color: 'var(--text-primary)',
            background: '#fff', outline: 'none',
            fontFamily: 'var(--font)',
          }}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>No vendors yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {search ? 'No vendors match your search.' : 'Click "Add Vendor" to get started.'}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>City</th>
                <th>GSTIN</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr
                  key={v.id}
                  onClick={() => mode === 'real' ? openVendorDetail(v.id, 'vendors-list') : onViewChange('vendor-detail', v.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v.vendorCode || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v.city || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace' }}>{v.gstNumber || '—'}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{v.contactPerson || '—'}</div>
                    {(v.phone || v.email) && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.phone || v.email}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddVendorModal
          onSave={addVendor}
          onClose={(result) => {
            setShowAdd(false);
            if (result) {
              mode === 'real' ? openVendorDetail(result.id, 'vendors-list') : onViewChange('vendor-detail', result.id);
            }
          }}
          mode={mode}
          vendors={vendors}
        />
      )}
    </div>
  );
};
