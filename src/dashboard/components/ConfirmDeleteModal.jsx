import React from 'react';
import ReactDOM from 'react-dom';

export const ConfirmDeleteModal = ({ isOpen, title = 'Confirm Delete', message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const content = (
    <>
      <div className="pdm-overlay pdm-overlay-visible" onClick={onCancel} />
      <div className="pdm-modal pdm-modal-visible" style={{ maxWidth: 380, padding: 28, textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary, #1e293b)' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)', lineHeight: 1.5 }}>
            {message || 'This action cannot be undone. Are you sure?'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: 'var(--text-primary, #1e293b)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(content, document.body);
};
