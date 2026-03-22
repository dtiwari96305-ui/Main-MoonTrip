import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../shared/components/Sidebar';
import { openBilling } from '../../utils/billingNav';

const PAGE_TITLES = {
  'dashboard':        'Dashboard',
  'customers':        'Customers',
  'quotes':           'Quotes',
  'bookings':         'Bookings',
  'live-trips':       'Live Trips',
  'payments':         'Payments',
  'sales-invoices':   'Sales Invoices',
  'accounts':         'Accounts',
  'settings':         'Settings',
  'billing':          'Billing',
  'quote-detail':     'Quote Detail',
  'booking-detail':   'Booking Detail',
  'create-quote':     'Create Quote',
  'quote-designer':   'Design Builder',
  'customer-profile': 'Customer',
};

export const RealLayout = ({
  activeView,
  onViewChange,
  onSwitchMode,
  userName = 'Admin',
  userRole = 'admin',
  companyName = 'My Agency',
  companySubtitle = 'Travel & Tourism',
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = PAGE_TITLES[activeView] || companyName;

  // Apply app-mode-real class to root
  useEffect(() => {
    document.documentElement.classList.add('app-mode-real');
    return () => document.documentElement.classList.remove('app-mode-real');
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile / Tablet top navigation bar */}
      <div className="mobile-topbar">
        <button
          className="mobile-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="mobile-topbar-logo">
          <span className="mobile-topbar-name">{pageTitle}</span>
        </div>
        <div
          className="mobile-topbar-avatar"
          onClick={() => openBilling()}
          title={userName}
          style={{ cursor: 'pointer' }}
        >
          <div className="header-user-avatar">{initials}</div>
        </div>
      </div>

      <div className="app-layout">
        <Sidebar
          activeView={activeView}
          onViewChange={onViewChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mode="real"
          userName={userName}
          userRole={userRole}
          companyName={companyName}
          companySubtitle={companySubtitle}
          onSwitchMode={onSwitchMode}
        />

        <div
          className={`sidebar-overlay${sidebarOpen ? ' sidebar-overlay-active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        <main className="main-content" id="main-content">
          {children}
        </main>
      </div>
    </>
  );
};
