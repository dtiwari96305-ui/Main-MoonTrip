import React from 'react';

export const TopDemoBanner = () => {
  return (
    <div className="demo-banner" id="demoBanner">
      <div className="demo-banner-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
        <span><strong>Demo Account</strong> — Browse freely. Saving is disabled.</span>
      </div>
      <a href="#" className="demo-banner-cta">Create Your Account →</a>
    </div>
  );
};
