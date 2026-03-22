import React from 'react';

export const DemoModal = ({ onClose }) => (
  <div className="demo-modal-overlay" onClick={onClose}>
    <div className="demo-modal" onClick={e => e.stopPropagation()}>
      <div className="demo-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h3>Demo Account</h3>
      <p>You are viewing a demo account. Changes cannot be made.</p>
      <button className="demo-modal-btn" onClick={onClose}>Got it</button>
    </div>
  </div>
);

export default DemoModal;
