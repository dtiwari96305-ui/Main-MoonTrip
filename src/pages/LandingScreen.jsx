import React from 'react';

export const LandingScreen = ({ onSelectMode }) => {
  return (
    <div className="landing-screen">
      <div className="landing-logo">
        <img 
          src="/assets/touridoo-logo.png" 
          alt="Touridoo Logo" 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '12px', 
            objectFit: 'contain' 
          }} 
        />
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
