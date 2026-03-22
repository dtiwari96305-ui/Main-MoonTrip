import React from 'react';

export const LandingScreen = ({ onSelectMode }) => {
  return (
    <div className="landing-screen">
      <div className="landing-logo">
        <div className="landing-logo-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#fff' }}>
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/>
          </svg>
        </div>
        <span className="landing-logo-text">Touridoo</span>
      </div>
      <p className="landing-subtitle">Choose your dashboard experience</p>

      <div className="landing-cards">
        {/* Demo Dashboard Card */}
        <div className="landing-card landing-card-demo" onClick={() => onSelectMode('demo')}>
          <span className="landing-card-badge">Sample Data</span>
          <div className="landing-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="landing-card-title">Demo Dashboard</div>
          <p className="landing-card-desc">
            Explore with pre-loaded sample data. All features visible, but saving is disabled.
          </p>
          <button className="landing-card-btn" onClick={(e) => { e.stopPropagation(); onSelectMode('demo'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
            Try Demo
          </button>
        </div>

        {/* Real Dashboard Card */}
        <div className="landing-card landing-card-real" onClick={() => onSelectMode('real')}>
          <span className="landing-card-badge">Full Access</span>
          <div className="landing-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div className="landing-card-title">Real Dashboard</div>
          <p className="landing-card-desc">
            Start fresh with your own data. Full CRUD operations enabled, data saved locally.
          </p>
          <button className="landing-card-btn" onClick={(e) => { e.stopPropagation(); onSelectMode('real'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
            </svg>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
