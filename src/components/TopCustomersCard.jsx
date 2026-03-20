import React from 'react';
import { openCustomerProfile } from '../utils/customerNav';

export const TopCustomersCard = () => {
  const customers = [
    { rank: 1, initials: 'VI', name: 'Vikram Iyer', id: 'WL-C-0003', bookings: 1, revenue: '₹4,69,900', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { rank: 2, initials: 'RP', name: 'Rajesh Patel', id: 'WL-C-0003', bookings: 1, revenue: '₹1,56,880', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { rank: 3, initials: 'RS', name: 'Rahul Sharma', id: 'WL-C-0001', bookings: 1, revenue: '₹1,40,952', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  ];

  return (
    <div className="top-customers-card">
      <div className="tc-header">
        <div className="tc-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <h3 className="tc-title">Top Customers</h3>
          <p className="tc-subtitle">By revenue generated</p>
        </div>
      </div>
      <table className="tc-table">
        <thead>
          <tr>
            <th className="tc-th-rank">#</th>
            <th className="tc-th-customer">CUSTOMER</th>
            <th className="tc-th-bookings">BOOKINGS</th>
            <th className="tc-th-revenue">REVENUE</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.rank}>
              <td className="tc-rank">{c.rank}</td>
              <td className="tc-customer">
                <div className="tc-avatar" style={{ background: c.gradient }}>{c.initials}</div>
                <div className="tc-customer-info">
                  <span className="tc-customer-name cp-name-link" onClick={() => openCustomerProfile(c.id, 'dashboard')}>{c.name}</span>
                  <span className="tc-customer-id">{c.id}</span>
                </div>
              </td>
              <td className="tc-bookings">{c.bookings}</td>
              <td className="tc-revenue">{c.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
