import React from 'react';

export const TopDemoBanner = () => {
  return (
    <div className="demo-banner" id="demoBanner">
      <div className="demo-banner-left">
        <img 
          src="/assets/touridoo-logo.png" 
          alt="Touridoo Logo" 
          style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '4px', 
            objectFit: 'contain' 
          }} 
        />
        <span><strong>Demo Account</strong><span className="banner-detail-text"> — Browse freely. Saving is disabled.</span></span>
      </div>
      <a href="#" className="demo-banner-cta">Create Your Account →</a>
    </div>
  );
};
