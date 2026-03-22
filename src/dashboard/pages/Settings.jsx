import React, { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { useData } from '../context/DataContext';

export const RealSettings = () => {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="view-settings" className="fade-in">
      <Header title="Settings" subtitle="Configure your dashboard" />

      <div style={{ maxWidth: 560, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Company Name</label>
          <input
            type="text"
            value={form.companyName || ''}
            onChange={e => handleChange('companyName', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Company Subtitle</label>
          <input
            type="text"
            value={form.companySubtitle || ''}
            onChange={e => handleChange('companySubtitle', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Your Name</label>
          <input
            type="text"
            value={form.userName || ''}
            onChange={e => handleChange('userName', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Role</label>
          <input
            type="text"
            value={form.userRole || ''}
            onChange={e => handleChange('userRole', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={form.email || ''}
            onChange={e => handleChange('email', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Phone</label>
          <input
            type="text"
            value={form.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <button
          onClick={handleSave}
          style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: saved ? '#48bb78' : 'var(--accent, #667eea)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', transition: 'background 0.2s' }}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};
