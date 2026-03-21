import React, { useState, useEffect } from 'react';
import { TopDemoBanner } from './TopDemoBanner';
import { Sidebar } from './Sidebar';
import { openBilling } from '../utils/billingNav';

export const Layout = ({ activeView, onViewChange, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when navigating to a new view
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when sidebar is open on mobile/tablet
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <>
      <TopDemoBanner />

      {/* Mobile / Tablet top navigation bar — fixed at top, below demo banner */}
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
          <div className="logo-circle"></div>
          <span className="mobile-topbar-name">Moontrip</span>
        </div>
        <div
          className="mobile-topbar-avatar"
          onClick={() => openBilling()}
          title="Demo Admin"
          style={{ cursor: 'pointer' }}
        >
          <div className="header-user-avatar">DA</div>
        </div>
      </div>

      <div className="app-layout">
        <Sidebar
          activeView={activeView}
          onViewChange={onViewChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dark overlay behind sidebar on mobile/tablet */}
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
