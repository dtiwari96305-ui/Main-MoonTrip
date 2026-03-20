import React, { useState, useMemo, useEffect } from 'react';
import { openCustomerProfile } from '../utils/customerNav';

export const customers = [
  { id: 'WL-C-0001', name: 'Rahul Sharma', phone: '+91 99876 54321', email: 'rahul@example.com', location: 'Mumbai', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', initials: 'RS' },
  { id: 'WL-C-0002', name: 'Priya Mehta', phone: '+91 98765 12345', email: 'priya@example.com', location: 'Delhi', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', initials: 'PM' },
  { id: 'WL-C-0003', name: 'Vikram Iyer', phone: '+91 98456 78901', email: 'vikram@example.com', location: 'Bangalore', type: 'Corporate', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', initials: 'VI' },
  { id: 'WL-C-0004', name: 'Ananya Reddy', phone: '+91 87654 32109', email: 'ananya@example.com', location: 'Hyderabad', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', initials: 'AR' },
  { id: 'WL-C-0005', name: 'Rajesh Patel', phone: '+91 97654 32100', email: 'rajesh@example.com', location: 'Ahmedabad', type: 'Corporate', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', initials: 'RP' },
  { id: 'WL-C-0006', name: 'Arjun Singh', phone: '+91 91234 56789', email: 'arjun@example.com', location: 'Jaipur', type: 'Individual', joined: '10 Mar 2026', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', initials: 'AS' },
];

export const CustomersTable = ({ searchQuery = '', onFilteredChange }) => {
  const [showInlineSearch, setShowInlineSearch] = useState(false);
  const [inlineSearchQuery, setInlineSearchQuery] = useState('');

  const filtered = useMemo(() => customers.filter(c => {
    const matchesTop = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInline = !inlineSearchQuery ||
      c.name.toLowerCase().includes(inlineSearchQuery.toLowerCase());
    return matchesTop && matchesInline;
  }), [searchQuery, inlineSearchQuery]);

  useEffect(() => {
    if (onFilteredChange) onFilteredChange(filtered);
  }, [filtered]);

  return (
    <div className="data-table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th className="th-with-search">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                CUSTOMER 
                <span 
                  className={`th-search-btn ${showInlineSearch ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setShowInlineSearch(!showInlineSearch); }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: showInlineSearch ? 1 : 0.4 }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </span>
              </div>
              {showInlineSearch && (
                <div className="table-inline-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#94a3b8' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input 
                    type="text" 
                    className="inline-search-input"
                    placeholder="Search name..."
                    autoFocus
                    value={inlineSearchQuery}
                    onChange={(e) => setInlineSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </th>
            <th>CONTACT</th>
            <th>LOCATION</th>
            <th>TYPE</th>
            <th>JOINED</th>
            <th style={{width: 80}}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map((c) => (
            <tr key={c.id} className="animate-row">
              <td>
                <div className="dt-customer">
                  <div className="dt-avatar" style={{ background: c.gradient }}>{c.initials}</div>
                  <div className="dt-customer-info">
                    <span className="dt-customer-name cp-name-link" onClick={() => openCustomerProfile(c.id, 'customers')}>{c.name}</span>
                    <span className="dt-customer-id">{c.id}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="dt-contact-info">
                  <span className="dt-phone">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {c.phone}
                  </span>
                  <span className="dt-email">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {c.email}
                  </span>
                </div>
              </td>
              <td>
                <span className="dt-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {c.location}
                </span>
              </td>
              <td><span className={`type-badge type-${c.type.toLowerCase()}`}>{c.type}</span></td>
              <td><span className="dt-date">{c.joined}</span></td>
              <td className="dt-actions">
                <button className="action-btn edit-btn" title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
                <button className="action-btn delete-btn" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>No results found</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Try adjusting your search.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
