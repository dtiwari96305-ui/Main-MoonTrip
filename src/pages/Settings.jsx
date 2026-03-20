import React, { useState, useRef, useEffect } from 'react';
import { InfoBtn } from '../components/InfoBtn';

const DemoModal = ({ onClose }) => (
  <div className="demo-modal-overlay" onClick={onClose}>
    <div className="demo-modal" onClick={e => e.stopPropagation()}>
      <div className="demo-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h3>Demo Account</h3>
      <p>This is a demo account. Changes cannot be made.</p>
      <button className="demo-modal-btn" onClick={onClose}>OK, Got it</button>
    </div>
  </div>
);

const LogsPopup = ({ onClose }) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="logs-popup-container" ref={popupRef}>
      <div className="logs-popup-header"><h3>Logs</h3></div>
      <div className="logs-popup-body">
        <div className="logs-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>No logs yet</p>
        </div>
      </div>
    </div>
  );
};

export const Settings = () => {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('settings_activeTab') || 'profile-tab');
  const [pdfTheme, setPdfTheme] = useState('classic');
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  // Itinerary tab state
  const [headerMode, setHeaderMode] = useState('design');
  const [footerMode, setFooterMode] = useState('design');
  const [showCompanyLogo, setShowCompanyLogo] = useState(true);
  const [logoPosition, setLogoPosition] = useState('left');
  const [headerLayout, setHeaderLayout] = useState('sidebyside');
  const [companyName, setCompanyName] = useState('Wanderlust Travels');
  const [tagline, setTagline] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [footerLeft, setFooterLeft] = useState('');
  const [footerCenter, setFooterCenter] = useState('');
  const [footerRight, setFooterRight] = useState('');
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [footerExpanded, setFooterExpanded] = useState(true);

  // Persist tab changes
  useEffect(() => {
    sessionStorage.setItem('settings_activeTab', activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'profile-tab', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    { id: 'company-tab', label: 'Company', icon: 'M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M9 7h6M9 11h6' },
    { id: 'nomenclature-tab', label: 'Nomenclature', icon: 'M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18' },
    { id: 'team-tab', label: 'Team', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7A4 4 0 1 1 9 7M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'billing-tab', label: 'Billing', icon: 'M2 5h20v14H2zM2 10h20' },
    { id: 'itinerary-tab', label: 'Itinerary', icon: '' },
  ];

  return (
    <div className="page-view fade-in">
      <div className="settings-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and company settings</p>
          </div>
          <div className="dash-header-right">
            <div style={{ position: 'relative' }}>
              <button className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`} onClick={() => setIsLogsOpen(!isLogsOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </button>
              {isLogsOpen && <LogsPopup onClose={() => setIsLogsOpen(false)} />}
            </div>
            <div className="header-user">
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-wrap-container">
        <div className="settings-nav" style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'unset', gap: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, minWidth: 0, justifyContent: 'center', textAlign: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {tab.id === 'profile-tab' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
                {tab.id === 'company-tab' && <><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M9 7h6"/><path d="M9 11h6"/></>}
                {tab.id === 'nomenclature-tab' && <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>}
                {tab.id === 'team-tab' && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                {tab.id === 'billing-tab' && <><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></>}
                {tab.id === 'itinerary-tab' && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content-card">
          {activeTab === 'profile-tab' && (
            <div id="profile-tab" className="settings-pane active">
              <div className="profile-header-info">
                <div className="profile-avatar-large">DA</div>
                <div className="profile-meta">
                  <h2>Demo Admin</h2>
                  <p>demo@moontrip.in</p>
                  <span className="role-pill-red">Admin</span>
                </div>
              </div>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Full Name
                    </label>
                    <input type="text" className="form-input" defaultValue="Demo Admin" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </label>
                    <input type="email" className="form-input" defaultValue="demo@moontrip.in" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Phone
                  </label>
                  <div className="input-with-prefix">
                    <div className="input-prefix-select">
                      IN +91
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <input type="text" className="form-input" defaultValue="9876543210" style={{paddingLeft: 96}} />
                  </div>
                </div>
                <div className="form-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Change Password
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" defaultValue="********" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" defaultValue="********" />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'company-tab' && (
            <div id="company-tab" className="settings-pane active">
              <div className="profile-header-info">
                <div className="company-logo-upload">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'var(--text-muted)'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Upload
                </div>
                <div className="profile-meta">
                  <h2>Wanderlust Travels</h2>
                  <p>demo-wanderlust.moontrip.app</p>
                  <div style={{marginTop: 6}}>
                    <span className="pro-badge-small"><span className="role-dot"></span> Pro Plan</span>
                  </div>
                </div>
              </div>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="gst-banner">
                  <div className="gst-banner-left">
                    <div className="gst-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div className="gst-text">
                      <span className="gst-title">GST Billing <InfoBtn infoKey="gst_billing" /></span>
                      <span className="gst-desc">GST is applied to all quotes and invoices</span>
                    </div>
                  </div>
                  <div className="toggle-switch active">
                    <div className="toggle-knob"></div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>
                    Company Name
                  </label>
                  <input type="text" className="form-input" defaultValue="Wanderlust Travels" />
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      Slug <InfoBtn infoKey="slug" />
                    </label>
                    <input type="text" className="form-input" defaultValue="demo-wanderlust" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GSTIN <InfoBtn infoKey="gstin" /></label>
                    <div className="input-with-action">
                      <input type="text" className="form-input uppercase-text" defaultValue="27AABCW1234F1ZP" />
                      <button type="button" className="btn-verify">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><circle cx="8" cy="10" r="2"/><path d="M14 8h5"/><path d="M14 12h5"/><path d="M14 16h5"/></svg>
                    PAN <InfoBtn infoKey="pan" />
                  </label>
                  <input type="text" className="form-input uppercase-text" defaultValue="AABCW1234F" />
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Company Phone
                    </label>
                    <div className="input-with-prefix">
                      <div className="input-prefix-select">
                        IN +91
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      <input type="text" className="form-input" defaultValue="9876543210" style={{paddingLeft: 96}} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Company Email
                    </label>
                    <input type="email" className="form-input" defaultValue="demo@moontrip.in" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-input" defaultValue="301, Trade Center, BKC" />
                </div>
                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" defaultValue="Mumbai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <div className="select-wrapper">
                      <select className="form-input" defaultValue="Maharashtra">
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                      </select>
                      <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-input" defaultValue="400051" />
                  </div>
                </div>
                <div className="form-section-header">Bank Details</div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input type="text" className="form-input" defaultValue="50100123456789" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC Code <InfoBtn infoKey="ifsc" /></label>
                    <input type="text" className="form-input uppercase-text" defaultValue="HDFC0001234" />
                  </div>
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-input" defaultValue="HDFC Bank" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input type="text" className="form-input" defaultValue="BKC Branch, Mumbai" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Account Holder Name</label>
                  <input type="text" className="form-input" defaultValue="Wanderlust Travels" />
                </div>
                
                <div className="form-section-header" style={{marginTop:32}}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  UPI Payment
                </div>
                <div className="form-group">
                  <label className="form-label">UPI ID <InfoBtn infoKey="upi" /></label>
                  <input type="text" className="form-input" defaultValue="wanderlust@hdfcbank" />
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6}}>A QR code will be auto-generated on invoices and quotes for this UPI ID.</p>
                </div>

                <div className="form-section-header" style={{marginTop:32}}>Terms & Conditions</div>
                <div className="form-group">
                  <label className="form-label">Invoice Terms & Conditions <InfoBtn infoKey="terms" /></label>
                  <textarea className="form-input" style={{height: 72}} defaultValue="Payment due within 7 days of invoice date. Late payments attract 1.5% interest per month."></textarea>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6}}>Appears at the bottom of tax invoice PDFs.</p>
                </div>
                
                <div className="form-actions" style={{justifyContent: 'flex-end', marginTop: 16}}>
                  <button className="btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Changes
                  </button>
                </div>

                <div className="form-section-header" style={{marginTop:32}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  PDF Theme <InfoBtn infoKey="pdf_theme" />
                </div>
                <div className="pdf-theme-grid">
                  <div className="pdf-theme-card active">
                    <div className="pdf-theme-preview classic-preview">
                      <div className="pt-header"></div>
                      <div className="pt-title"></div>
                      <div className="pt-lines"></div>
                      <div className="pt-total"></div>
                    </div>
                    <div className="pdf-theme-label">Classic</div>
                  </div>
                  <div className="pdf-theme-card">
                    <div className="pdf-theme-preview elegant-preview">
                      <div className="pt-header"></div>
                      <div className="pt-title"></div>
                      <div className="pt-lines"></div>
                      <div className="pt-total"></div>
                    </div>
                    <div className="pdf-theme-label">Elegant</div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'nomenclature-tab' && (
            <div id="nomenclature-tab" className="settings-pane active">
              <div className="nom-intro">
                <p>Customize how your booking invoices, quotes, and payments are numbered.</p>
                <p className="nom-format-help">Format: Prefix-Number-Suffix (e.g. NT-1-FY26)</p>
              </div>
              
              <div className="nom-cards-grid" style={{display:'flex', flexDirection:'column', gap:24}}>
                <div className="nom-card">
                  <div className="nom-card-header">
                    <h3 className="nom-title"><span className="hash-icon">#</span> Booking / Tax Invoice</h3>
                  </div>
                  <div className="nom-grid">
                    <div className="form-group m-0">
                      <label className="form-label">Prefix (optional) <InfoBtn infoKey="nom_prefix_booking" /></label>
                      <input type="text" className="form-input" defaultValue="WL-B-" />
                    </div>
                    <div className="form-group m-0">
                      <label className="form-label">Next Number <InfoBtn infoKey="nom_number_booking" /></label>
                      <input type="text" className="form-input" defaultValue="6" />
                    </div>
                    <div className="form-group m-0">
                      <label className="form-label">Suffix (optional) <InfoBtn infoKey="nom_suffix_booking" /></label>
                      <input type="text" className="form-input" defaultValue="" placeholder="e.g. FY26" />
                    </div>
                  </div>
                  <div className="nom-preview-box">
                    <div className="nom-preview-row">
                      <span className="np-label">Next:</span> <span className="np-value font-mono">WL-B--6</span>
                    </div>
                    <div className="nom-preview-row">
                      <span className="np-label">Then:</span> <span className="np-value font-mono">WL-B--7</span>
                    </div>
                  </div>
                  <div className="nom-card-save">
                    <button className="nom-card-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Save
                    </button>
                  </div>
                </div>

                <div className="nom-card">
                  <div className="nom-card-header">
                    <h3 className="nom-title"><span className="hash-icon">#</span> Quote</h3>
                  </div>
                  <div className="nom-grid">
                    <div className="form-group m-0">
                      <label className="form-label">Prefix (optional) <InfoBtn infoKey="nom_prefix_quote" /></label>
                      <input type="text" className="form-input" defaultValue="WL-Q-" />
                    </div>
                    <div className="form-group m-0">
                      <label className="form-label">Next Number <InfoBtn infoKey="nom_number_quote" /></label>
                      <input type="text" className="form-input" defaultValue="8" />
                    </div>
                    <div className="form-group m-0">
                      <label className="form-label">Suffix (optional) <InfoBtn infoKey="nom_suffix_quote" /></label>
                      <input type="text" className="form-input" defaultValue="" placeholder="e.g. FY26" />
                    </div>
                  </div>
                  <div className="nom-preview-box">
                    <div className="nom-preview-row">
                      <span className="np-label">Next:</span> <span className="np-value font-mono">WL-Q--8</span>
                    </div>
                    <div className="nom-preview-row">
                      <span className="np-label">Then:</span> <span className="np-value font-mono">WL-Q--9</span>
                    </div>
                  </div>
                  <div className="nom-card-save">
                    <button className="nom-card-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Save
                    </button>
                  </div>
                </div>

                <div className="nom-card" style={{background: '#fafafa'}}>
                  <div className="nom-card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3 className="nom-title" style={{marginBottom:0}}><span className="hash-icon">#</span> Payment</h3>
                    <span className="nom-readonly-pill">Read-only</span>
                  </div>
                  <div className="nom-readonly-preview" style={{marginTop: 16}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Current format: <strong>REC--8</strong>
                  </div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 12, display:'flex', alignItems:'center', gap:4, paddingLeft: 24}}>
                    Payment receipt nomenclature is system-managed. <InfoBtn infoKey="nom_payment" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team-tab' && (
            <div id="team-tab" className="settings-pane active">
              <div className="team-header-action" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
                <div>
                  <h2 style={{fontSize:'1.15rem', fontWeight:700, color:'var(--text-primary)', marginBottom:4}}>Team Members</h2>
                  <p style={{fontSize:'0.85rem', color:'var(--text-secondary)'}}>0 members</p>
                </div>
                <button className="btn-primary" style={{padding: '10px 20px', background: '#ea580c', borderColor: '#ea580c'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Member
                </button>
              </div>
              
              <div className="team-search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" className="team-search-input" placeholder="Search by name or email..." />
              </div>

              <div className="team-empty-state">
                <div className="team-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 style={{fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)', marginBottom:8}}>No team members yet</h3>
                <p style={{color:'var(--text-secondary)', fontSize:'0.9rem'}}>Add your first team member to get started</p>
              </div>
            </div>
          )}

          {activeTab === 'billing-tab' && (
            <div id="billing-tab" className="settings-pane active">
              <div className="billing-current-plan" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', border:'1px solid var(--border-color)', borderRadius:16, padding:24, background:'#fff', marginBottom:20}}>
                <div className="plan-identity">
                  <div className="plan-icon" style={{background:'#f59e0b', color:'#fff', width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 16L3 7L8 10L12 4L16 10L21 7L22 16H2Z"></path><path d="M2 20H22"></path></svg>
                  </div>
                  <div className="plan-title-block" style={{marginLeft: 16}}>
                    <h3 style={{fontSize:'1.2rem', fontWeight:700, margin:0, display:'flex', alignItems:'center'}}>
                      Pro Plan 
                      <span className="status-pill status-active" style={{marginLeft: 12, fontSize:'0.75rem', padding:'2px 8px', borderRadius:12}}>
                        <span className="role-dot" style={{background:'#10b981',boxShadow:'0 0 0 2px #dcfce7, 0 0 4px #10b981'}}></span> Active
                      </span>
                    </h3>
                    <p style={{color:'var(--text-secondary)', fontSize:'0.9rem', marginTop:6}}>For large agencies and teams</p>
                    
                    <div className="plan-actions-group">
                      <button className="plan-action-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Manage Subscription
                      </button>
                      <button className="plan-action-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                        Sync
                      </button>
                    </div>
                  </div>
                </div>
                <div className="plan-price" style={{textAlign:'right'}}>
                  <div style={{fontSize:'1.8rem', fontWeight:800, color:'var(--text-primary)'}}><span style={{fontSize:'1.4rem'}}>₹</span>999<span style={{fontSize:'1rem', color:'var(--text-secondary)', fontWeight:600}}>/mo</span></div>
                </div>
              </div>

              <div className="billing-usage-grid">
                <div className="b-usage-card orange-tint">
                  <div className="buc-icon orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16h16v-8l-6-6z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </div>
                  <div className="buc-title">Quotes Used</div>
                  <div className="buc-stats">
                    0 <small>/ &infin;</small>
                  </div>
                  <div className="buc-desc"><span className="highlight">Unlimited</span> <span className="muted">on your plan</span></div>
                </div>

                <div className="b-usage-card blue-tint">
                  <div className="buc-icon blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="buc-title">Customers</div>
                  <div className="buc-stats">
                    6 <small>/ &infin;</small>
                  </div>
                  <div className="buc-desc"><span className="highlight">Unlimited</span> <span className="muted">on your plan</span></div>
                </div>

                <div className="b-usage-card purple-tint">
                  <div className="buc-icon purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  </div>
                  <div className="buc-title">Team Members</div>
                  <div className="buc-stats">
                    1 <small>/ 5</small>
                  </div>
                  <div className="buc-progress-bar">
                    <div className="buc-progress-fill" style={{width: '20%'}}></div>
                  </div>
                  <div className="buc-desc"><span className="muted">20% used</span></div>
                </div>
              </div>

              <div className="pricing-section">
                <div className="pricing-header">
                  <div>
                    <h3 className="pricing-title">Available Plans</h3>
                    <p className="pricing-subtitle">Choose the plan that fits your agency</p>
                  </div>
                  <div className="pricing-toggle">
                    <div className={`ptoggle-btn ${!isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(false)}>Monthly</div>
                    <div className={`ptoggle-btn ${isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(true)}>Annual</div>
                    <div className="ptoggle-save-text">Save 2 mo</div>
                  </div>
                </div>

                <div className="pricing-grid">
                  <div className="price-card">
                    <div className="pc-title">Free</div>
                    <div className="pc-subtitle">Get started for free</div>
                    <div className="pc-price">₹0</div>
                    <ul className="pc-features">
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 5 quotes/month</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Watermarked GST forms</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 25 customers</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> WhatsApp sharing</li>
                      <li className="pc-feature exc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Branded PDF</li>
                      <li className="pc-feature exc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Payment management</li>
                      <li className="pc-feature exc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Reports & analytics</li>
                    </ul>
                  </div>

                  <div className="price-card">
                    <div className="pc-title">Starter</div>
                    <div className="pc-subtitle">For growing agencies</div>
                    <div className="pc-price">{isAnnual ? '₹249' : '₹299'}<small>/month</small></div>
                    <ul className="pc-features">
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 50 quotes/month</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> All GST forms</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 200 customers</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Branded PDF</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> WhatsApp sharing</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Payment management</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Logo on PDF</li>
                      <li className="pc-feature exc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Reports & analytics</li>
                    </ul>
                    <div className="pc-action">
                      <button className="pc-btn outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg> Downgrade
                      </button>
                    </div>
                  </div>

                  <div className="price-card popular">
                    <div className="pc-badge popular"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:4, marginBottom:-1}}><path d="M2 16h20v4H2v-4zM4.08 14H19.92l1.6-9.6L17 7.6 12 2l-5 5.6L3.48 4.4 4.08 14z"/></svg> Most Popular</div>
                    <div className="pc-title">Growth</div>
                    <div className="pc-subtitle">Most popular choice</div>
                    <div className="pc-price">{isAnnual ? '₹499' : '₹599'}<small>/month</small></div>
                    <ul className="pc-features">
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited quotes</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited customers</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> All Starter features</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Reports & analytics</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 1 user</li>
                    </ul>
                    <div className="pc-action">
                      <button className="pc-btn outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg> Downgrade
                      </button>
                    </div>
                  </div>

                  <div className="price-card current">
                    <div className="pc-badge current"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{marginRight:4, marginBottom:-1}}><polyline points="20 6 9 17 4 12"/></svg> Current Plan</div>
                    <div className="pc-title">Pro</div>
                    <div className="pc-subtitle">For large teams</div>
                    <div className="pc-price">{isAnnual ? '₹833' : '₹999'}<small>/month</small></div>
                    <ul className="pc-features">
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Everything unlimited</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 5 users</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Priority support</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Extra seats available</li>
                    </ul>
                    <div className="pc-action">
                      <div className="pc-current-text">Your current plan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'itinerary-tab' && (
            <div id="itinerary-tab" className="settings-pane active">

              {/* ── Info Banner ── */}
              <div className="itin-info-banner">
                <div className="itin-info-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="itin-info-title">Itinerary Design Settings</h3>
                  <p className="itin-info-desc">Configure reusable page assets and default header/footer for all your itineraries. These settings apply globally — individual itineraries can override them.</p>
                </div>
              </div>

              {/* ── Page Library Card ── */}
              <div className="itin-card">
                <div className="itin-card-top">
                  <div className="itin-card-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="itin-card-title">Page Library</h3>
                    <p className="itin-card-subtitle">Upload cover pages, terms &amp; conditions, or any full-page images</p>
                  </div>
                </div>

                <div className="itin-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>
                    <strong>Prefix pages</strong> appear before itinerary content (e.g. cover page, welcome letter).{' '}
                    <strong>Suffix pages</strong> appear after (e.g. terms, cancellation policy). You can select which pages to include when building each itinerary.
                  </span>
                </div>

                <div className="itin-pages-grid">
                  {/* PREFIX */}
                  <div className="itin-pages-col">
                    <div className="itin-pages-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                      <span className="itin-pages-row-label">PREFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-subrow">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      <span className="itin-pages-row-label">PREFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-empty">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p>No prefix pages yet</p>
                    </div>
                    <button className="itin-add-page-btn" onClick={() => setShowDemoModal(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add page
                    </button>
                  </div>

                  <div className="itin-pages-divider" />

                  {/* SUFFIX */}
                  <div className="itin-pages-col">
                    <div className="itin-pages-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                      <span className="itin-pages-row-label">SUFFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-subrow">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      <span className="itin-pages-row-label">SUFFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-empty">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p>No suffix pages yet</p>
                    </div>
                    <button className="itin-add-page-btn" onClick={() => setShowDemoModal(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add page
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Default Header & Footer Card ── */}
              <div className="itin-card">
                <div className="itin-hf-card-header">
                  <div style={{display:'flex', alignItems:'center', gap:14}}>
                    <div className="itin-hf-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="itin-card-title">Default Header &amp; Footer</h3>
                      <p className="itin-card-subtitle">Applied to all new itineraries — can be overridden per itinerary</p>
                    </div>
                  </div>
                  <button className="itin-save-btn" onClick={() => setShowDemoModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save
                  </button>
                </div>

                {/* HEADER section */}
                <div className="itin-section">
                  <button className="itin-section-label" onClick={() => setHeaderExpanded(v => !v)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{transform: headerExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition:'transform 0.2s'}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    HEADER
                  </button>
                  {headerExpanded && (
                    <div className="itin-section-body">
                      <div className="itin-mode-toggle">
                        <button className={`itin-mode-btn ${headerMode==='design' ? 'itin-mode-active' : ''}`} onClick={() => setHeaderMode('design')}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          Design
                        </button>
                        <button className={`itin-mode-btn ${headerMode==='image' ? 'itin-mode-active' : ''}`} onClick={() => setHeaderMode('image')}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          Image
                        </button>
                      </div>

                      {headerMode === 'design' && (
                        <>
                          <div className="itin-checkbox-row">
                            <input type="checkbox" id="itin-show-logo" checked={showCompanyLogo} onChange={e => setShowCompanyLogo(e.target.checked)} />
                            <label htmlFor="itin-show-logo">Show company logo</label>
                          </div>

                          <div className="form-group" style={{marginTop:18}}>
                            <label className="form-label">Logo position</label>
                            <div className="itin-btn-group">
                              {[{v:'left',label:'Left'},{v:'center',label:'Center'},{v:'right',label:'Right'}].map(opt => (
                                <button key={opt.v} className={`itin-group-btn ${logoPosition===opt.v ? 'itin-group-btn-active' : ''}`} onClick={() => setLogoPosition(opt.v)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {opt.v==='left'   && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></>}
                                    {opt.v==='center' && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>}
                                    {opt.v==='right'  && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></>}
                                  </svg>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Layout</label>
                            <div className="itin-btn-group itin-btn-group-2col">
                              <button className={`itin-group-btn ${headerLayout==='sidebyside' ? 'itin-group-btn-active' : ''}`} onClick={() => setHeaderLayout('sidebyside')}>Side by side</button>
                              <button className={`itin-group-btn ${headerLayout==='stacked' ? 'itin-group-btn-active' : ''}`} onClick={() => setHeaderLayout('stacked')}>Stacked</button>
                            </div>
                          </div>

                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Company name</label>
                            <input type="text" className="form-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                          </div>
                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Tagline</label>
                            <input type="text" className="form-input" placeholder="Your travel, our passion" value={tagline} onChange={e => setTagline(e.target.value)} />
                          </div>
                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Contact info</label>
                            <input type="text" className="form-input" placeholder="email@company.com | +91 98765 43210" value={contactInfo} onChange={e => setContactInfo(e.target.value)} />
                          </div>

                          <button className="itin-style-row">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            Style &amp; sizing
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:'auto'}}><polyline points="9 18 15 12 9 6"/></svg>
                          </button>

                          <div className="itin-preview-wrap">
                            <div className="itin-preview-label-row">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              PREVIEW
                            </div>
                            <div className="itin-preview-box">
                              {companyName && <span style={{fontSize:'0.88rem', color:'var(--text-primary)', fontWeight:500}}>{companyName}</span>}
                              {tagline && <span style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:2}}>{tagline}</span>}
                            </div>
                          </div>
                        </>
                      )}

                      {headerMode === 'image' && (
                        <div className="itin-image-upload" onClick={() => setShowDemoModal(true)}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <p>Click to upload header image</p>
                          <span>PNG, JPG or SVG — recommended 1200×120px</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* FOOTER section */}
                <div className="itin-section" style={{borderTop:'1px solid var(--border-color)'}}>
                  <button className="itin-section-label" onClick={() => setFooterExpanded(v => !v)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{transform: footerExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition:'transform 0.2s'}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    FOOTER
                  </button>
                  {footerExpanded && (
                    <div className="itin-section-body">
                      <div className="itin-mode-toggle">
                        <button className={`itin-mode-btn ${footerMode==='design' ? 'itin-mode-active' : ''}`} onClick={() => setFooterMode('design')}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          Design
                        </button>
                        <button className={`itin-mode-btn ${footerMode==='image' ? 'itin-mode-active' : ''}`} onClick={() => setFooterMode('image')}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          Image
                        </button>
                      </div>

                      {footerMode === 'design' && (
                        <>
                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Left text</label>
                            <input type="text" className="form-input" placeholder="Company name" value={footerLeft} onChange={e => setFooterLeft(e.target.value)} />
                          </div>
                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Center text <span className="itin-label-hint">(use &#123;n&#125; for page #)</span></label>
                            <input type="text" className="form-input" placeholder="Page {n}" value={footerCenter} onChange={e => setFooterCenter(e.target.value)} />
                          </div>
                          <div className="form-group" style={{marginTop:16}}>
                            <label className="form-label">Right text</label>
                            <input type="text" className="form-input" placeholder="+91 98765 43210" value={footerRight} onChange={e => setFooterRight(e.target.value)} />
                          </div>

                          <button className="itin-style-row">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            Style &amp; sizing
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:'auto'}}><polyline points="9 18 15 12 9 6"/></svg>
                          </button>

                          <div className="itin-preview-wrap">
                            <div className="itin-preview-label-row">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              PREVIEW
                            </div>
                            <div className="itin-preview-box itin-footer-preview-box">
                              {(footerLeft || footerCenter || footerRight) && (
                                <div style={{display:'flex', justifyContent:'space-between', width:'100%', fontSize:'0.82rem', color:'var(--text-secondary)'}}>
                                  <span>{footerLeft}</span>
                                  <span>{footerCenter}</span>
                                  <span>{footerRight}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {footerMode === 'image' && (
                        <div className="itin-image-upload" onClick={() => setShowDemoModal(true)}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <p>Click to upload footer image</p>
                          <span>PNG, JPG or SVG — recommended 1200×80px</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};;
