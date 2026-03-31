import React, { useState, useEffect } from 'react';
import { InfoBtn } from '../../shared/components/InfoBtn';
import { RealHeader as Header } from '../components/RealHeader';
import { useData } from '../context/DataContext';

const NOM_DOC_TYPES = [
  { key: 'quote',       label: 'Quotes',              icon: '\uD83D\uDCC4', defaultPrefix: 'WL-Q-' },
  { key: 'booking',     label: 'Bookings',            icon: '\uD83D\uDCC5', defaultPrefix: 'WL-B-' },
  { key: 'invoice',     label: 'Tax Invoices',        icon: '\uD83E\uDDFE', defaultPrefix: 'INV-' },
  { key: 'receipt',     label: 'Receipts',            icon: '\uD83D\uDCB3', defaultPrefix: 'REC-' },
  { key: 'cn',          label: 'Cancellation Notes',  icon: '\uD83D\uDD04', defaultPrefix: 'CN-' },
  { key: 'vendor_bill', label: 'Vendor Bills',        icon: '\uD83C\uDFEA', defaultPrefix: 'VB-' },
  { key: 'hm_invoice',  label: 'HM Invoices',         icon: '\uD83D\uDCCA', defaultPrefix: 'HM-' },
];

const NOM_PADDING_OPTIONS = [
  { value: 4, label: '4 digits (0001)' },
  { value: 3, label: '3 digits (001)' },
  { value: 2, label: '2 digits (01)' },
  { value: 1, label: 'No padding (1)' },
];

function NomenclatureTab() {
  const { getDocumentSequences, saveDocumentSequences } = useData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [globalPadding, setGlobalPadding] = useState(4);
  const [rows, setRows] = useState(
    NOM_DOC_TYPES.map(d => ({
      document_type: d.key,
      prefix: d.defaultPrefix,
      nextNumber: 1,
      suffix: '',
    }))
  );

  // Load existing sequences on mount
  useEffect(() => {
    (async () => {
      try {
        const sequences = await getDocumentSequences();
        if (sequences && sequences.length > 0) {
          const mapped = NOM_DOC_TYPES.map(d => {
            const seq = sequences.find(s => s.document_type === d.key);
            if (seq) {
              return {
                document_type: d.key,
                prefix: seq.prefix,
                nextNumber: (seq.current_number || 0) + 1,
                suffix: seq.suffix || '',
              };
            }
            return { document_type: d.key, prefix: d.defaultPrefix, nextNumber: 1, suffix: '' };
          });
          setRows(mapped);
          // Use padding from first found sequence
          const firstSeq = sequences[0];
          if (firstSeq?.padding) setGlobalPadding(firstSeq.padding);
        }
      } catch (err) {
        console.error('NomenclatureTab: load failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getDocumentSequences]);

  const updateRow = (idx, field, value) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleSaveNom = async () => {
    setSaving(true);
    try {
      const sequences = rows.map(r => ({
        document_type: r.document_type,
        prefix: r.prefix,
        suffix: r.suffix,
        current_number: Math.max(0, Number(r.nextNumber) - 1),
        padding: globalPadding,
      }));
      await saveDocumentSequences(sequences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('NomenclatureTab: save failed', err);
      alert('Failed to save nomenclature settings.');
    } finally {
      setSaving(false);
    }
  };

  const padPreview = (num, pad) => String(num || 1).padStart(pad, '0');

  if (loading) {
    return (
      <div id="nomenclature-tab" className="settings-pane active">
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading nomenclature settings...</div>
      </div>
    );
  }

  return (
    <div id="nomenclature-tab" className="settings-pane active">
      <div className="nom-intro">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Document Numbering</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Customize the prefix, suffix, and starting number for each document type. Changes apply to all future documents immediately.
        </p>
      </div>

      <div className="nom-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
        {NOM_DOC_TYPES.map((docType, idx) => {
          const row = rows[idx];
          const preview = `${row.prefix}${padPreview(row.nextNumber, globalPadding)}${row.suffix}`;
          return (
            <div key={docType.key} className="nom-card">
              <div className="nom-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 className="nom-title" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.1rem' }}>{docType.icon}</span> {docType.label}
                </h3>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace',
                  color: '#22c55e', background: '#f0fdf4', padding: '3px 10px', borderRadius: 6,
                }}>
                  Next: {preview}
                </span>
              </div>
              <div className="nom-grid">
                <div className="form-group m-0">
                  <label className="form-label">Prefix</label>
                  <input
                    type="text"
                    className="form-input"
                    value={row.prefix}
                    onChange={e => updateRow(idx, 'prefix', e.target.value)}
                  />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">Next Number</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    value={row.nextNumber}
                    onChange={e => updateRow(idx, 'nextNumber', e.target.value)}
                  />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">Suffix</label>
                  <input
                    type="text"
                    className="form-input"
                    value={row.suffix}
                    onChange={e => updateRow(idx, 'suffix', e.target.value)}
                    placeholder="optional"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global padding selector */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label className="form-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Number Format:</label>
        <div className="select-wrapper" style={{ flex: 1, maxWidth: 240 }}>
          <select
            className="form-input"
            value={globalPadding}
            onChange={e => setGlobalPadding(Number(e.target.value))}
          >
            {NOM_PADDING_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      {/* Warning note */}
      <div style={{
        marginTop: 20, padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: 10, fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>
          Changing the starting number will affect the next document created. Existing documents are not renamed. Ensure your new numbers do not conflict with already issued document numbers.
        </span>
      </div>

      {/* Save button */}
      <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn-primary" onClick={handleSaveNom} disabled={saving}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Nomenclature Settings'}
        </button>
      </div>
    </div>
  );
}

export const RealSettings = () => {
  const { settings, updateSettings } = useData();
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('real_settings_activeTab') || 'profile-tab');
  const [pdfTheme, setPdfTheme] = useState(() => settings.pdfTheme || 'classic');
  const [isAnnual, setIsAnnual] = useState(true);
  const [saved, setSaved] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    userName: settings.userName || '',
    email: settings.email || '',
    phone: settings.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  // Company form
  const [companyForm, setCompanyForm] = useState({
    companyName: settings.companyName || '',
    companySubtitle: settings.companySubtitle || '',
    slug: settings.slug || '',
    gstin: settings.gstin || '',
    pan: settings.pan || '',
    companyPhone: settings.companyPhone || '',
    companyEmail: settings.companyEmail || '',
    streetAddress: settings.streetAddress || '',
    city: settings.city || '',
    state: settings.state || 'Maharashtra',
    pincode: settings.pincode || '',
    accountNumber: settings.accountNumber || '',
    ifscCode: settings.ifscCode || '',
    bankName: settings.bankName || '',
    branch: settings.branch || '',
    accountHolderName: settings.accountHolderName || '',
    upiId: settings.upiId || '',
    invoiceTerms: settings.invoiceTerms || '',
    gstEnabled: settings.gstEnabled !== false,
  });

  // Itinerary state
  const [headerMode, setHeaderMode] = useState('design');
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [footerExpanded, setFooterExpanded] = useState(true);
  const [showCompanyLogo, setShowCompanyLogo] = useState(true);
  const [logoPosition, setLogoPosition] = useState('left');
  const [companyNameHeader, setCompanyNameHeader] = useState(settings.companyName || '');
  const [tagline, setTagline] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [footerLeft, setFooterLeft] = useState('');
  const [footerCenter, setFooterCenter] = useState('');
  const [footerRight, setFooterRight] = useState('');

  useEffect(() => {
    sessionStorage.setItem('real_settings_activeTab', activeTab);
  }, [activeTab]);

  const handleSave = (formData) => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile-tab', label: 'Profile' },
    { id: 'company-tab', label: 'Company' },
    { id: 'nomenclature-tab', label: 'Nomenclature' },
    { id: 'team-tab', label: 'Team' },
    { id: 'billing-tab', label: 'Billing' },
    { id: 'itinerary-tab', label: 'Itinerary' },
  ];

  const initials = (settings.userName || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-view fade-in">
      <Header title="Settings" subtitle="Manage your account and company settings" showNewQuote={false} />

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
          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile-tab' && (
            <div id="profile-tab" className="settings-pane active">
              <div className="profile-header-info">
                <div className="profile-avatar-large">{initials}</div>
                <div className="profile-meta">
                  <h2>{settings.userName || 'Admin'}</h2>
                  <p>{settings.email || 'admin@agency.com'}</p>
                  <span className="role-pill-red">{settings.userRole || 'Admin'}</span>
                </div>
              </div>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Full Name
                    </label>
                    <input type="text" className="form-input" value={profileForm.userName} onChange={e => setProfileForm(p => ({ ...p, userName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </label>
                    <input type="email" className="form-input" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
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
                    <input type="text" className="form-input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} style={{paddingLeft: 96}} />
                  </div>
                </div>
                <div className="form-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Change Password
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" value={profileForm.currentPassword} onChange={e => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" value={profileForm.newPassword} onChange={e => setProfileForm(p => ({ ...p, newPassword: e.target.value }))} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-primary" onClick={() => handleSave({ userName: profileForm.userName, email: profileForm.email, phone: profileForm.phone })}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── COMPANY TAB ── */}
          {activeTab === 'company-tab' && (
            <div id="company-tab" className="settings-pane active">
              <div className="profile-header-info">
                <div className="company-logo-upload" style={{cursor:'pointer'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'var(--text-muted)'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Upload
                </div>
                <div className="profile-meta">
                  <h2>{companyForm.companyName || 'My Agency'}</h2>
                  <p>{companyForm.slug || 'my-agency'}.touridoo.app</p>
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
                  <div className={`toggle-switch ${companyForm.gstEnabled ? 'active' : ''}`} onClick={() => setCompanyForm(f => ({ ...f, gstEnabled: !f.gstEnabled }))} style={{cursor:'pointer'}}>
                    <div className="toggle-knob"></div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>
                    Company Name
                  </label>
                  <input type="text" className="form-input" value={companyForm.companyName} onChange={e => setCompanyForm(f => ({ ...f, companyName: e.target.value }))} />
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      Slug <InfoBtn infoKey="slug" />
                    </label>
                    <input type="text" className="form-input" value={companyForm.slug} onChange={e => setCompanyForm(f => ({ ...f, slug: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GSTIN <InfoBtn infoKey="gstin" /></label>
                    <div className="input-with-action">
                      <input type="text" className="form-input uppercase-text" value={companyForm.gstin} onChange={e => setCompanyForm(f => ({ ...f, gstin: e.target.value }))} />
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
                  <input type="text" className="form-input uppercase-text" value={companyForm.pan} onChange={e => setCompanyForm(f => ({ ...f, pan: e.target.value }))} />
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Company Phone</label>
                    <div className="input-with-prefix">
                      <div className="input-prefix-select">IN +91<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></div>
                      <input type="text" className="form-input" value={companyForm.companyPhone} onChange={e => setCompanyForm(f => ({ ...f, companyPhone: e.target.value }))} style={{paddingLeft: 96}} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Email</label>
                    <input type="email" className="form-input" value={companyForm.companyEmail} onChange={e => setCompanyForm(f => ({ ...f, companyEmail: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-input" value={companyForm.streetAddress} onChange={e => setCompanyForm(f => ({ ...f, streetAddress: e.target.value }))} />
                </div>
                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" value={companyForm.city} onChange={e => setCompanyForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <div className="select-wrapper">
                      <select className="form-input" value={companyForm.state} onChange={e => setCompanyForm(f => ({ ...f, state: e.target.value }))}>
                        <option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option><option>Rajasthan</option><option>Kerala</option>
                      </select>
                      <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-input" value={companyForm.pincode} onChange={e => setCompanyForm(f => ({ ...f, pincode: e.target.value }))} />
                  </div>
                </div>
                <div className="form-section-header">Bank Details</div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input type="text" className="form-input" value={companyForm.accountNumber} onChange={e => setCompanyForm(f => ({ ...f, accountNumber: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC Code <InfoBtn infoKey="ifsc" /></label>
                    <input type="text" className="form-input uppercase-text" value={companyForm.ifscCode} onChange={e => setCompanyForm(f => ({ ...f, ifscCode: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-input" value={companyForm.bankName} onChange={e => setCompanyForm(f => ({ ...f, bankName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input type="text" className="form-input" value={companyForm.branch} onChange={e => setCompanyForm(f => ({ ...f, branch: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Account Holder Name</label>
                  <input type="text" className="form-input" value={companyForm.accountHolderName} onChange={e => setCompanyForm(f => ({ ...f, accountHolderName: e.target.value }))} />
                </div>

                <div className="form-section-header" style={{marginTop:32}}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  UPI Payment
                </div>
                <div className="form-group">
                  <label className="form-label">UPI ID <InfoBtn infoKey="upi" /></label>
                  <input type="text" className="form-input" value={companyForm.upiId} onChange={e => setCompanyForm(f => ({ ...f, upiId: e.target.value }))} />
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6}}>A QR code will be auto-generated on invoices and quotes for this UPI ID.</p>
                </div>

                <div className="form-section-header" style={{marginTop:32}}>Terms & Conditions</div>
                <div className="form-group">
                  <label className="form-label">Invoice Terms & Conditions <InfoBtn infoKey="terms" /></label>
                  <textarea className="form-input" style={{height: 72}} value={companyForm.invoiceTerms} onChange={e => setCompanyForm(f => ({ ...f, invoiceTerms: e.target.value }))}></textarea>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6}}>Appears at the bottom of tax invoice PDFs.</p>
                </div>

                <div className="form-actions" style={{justifyContent: 'flex-end', marginTop: 16}}>
                  <button className="btn-primary" onClick={() => handleSave(companyForm)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>

                <div className="form-section-header" style={{marginTop:32}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  PDF Theme <InfoBtn infoKey="pdf_theme" />
                </div>
                <div className="pdf-theme-grid">
                  <div className={`pdf-theme-card${pdfTheme === 'classic' ? ' active' : ''}`} onClick={() => { setPdfTheme('classic'); handleSave({ pdfTheme: 'classic' }); }} style={{ cursor: 'pointer' }}>
                    <div className="pdf-theme-preview classic-preview">
                      <div className="pt-header"></div><div className="pt-title"></div><div className="pt-lines"></div><div className="pt-total"></div>
                    </div>
                    <div className="pdf-theme-label">Classic</div>
                  </div>
                  <div className={`pdf-theme-card${pdfTheme === 'elegant' ? ' active' : ''}`} onClick={() => { setPdfTheme('elegant'); handleSave({ pdfTheme: 'elegant' }); }} style={{ cursor: 'pointer' }}>
                    <div className="pdf-theme-preview elegant-preview">
                      <div className="pt-header"></div><div className="pt-title"></div><div className="pt-lines"></div><div className="pt-total"></div>
                    </div>
                    <div className="pdf-theme-label">Elegant</div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── NOMENCLATURE TAB ── */}
          {activeTab === 'nomenclature-tab' && (
            <NomenclatureTab />
          )}

          {/* ── TEAM TAB ── */}
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

          {/* ── BILLING TAB ── */}
          {activeTab === 'billing-tab' && (
            <div id="billing-tab" className="settings-pane active">
              <div className="billing-current-plan" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', border:'1px solid var(--border-color)', borderRadius:16, padding:24, background:'#fff', marginBottom:20}}>
                <div className="plan-identity">
                  <div className="plan-icon" style={{background:'#f59e0b', color:'#fff', width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 16L3 7L8 10L12 4L16 10L21 7L22 16H2Z"/><path d="M2 20H22"/></svg>
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
                  <div className="buc-stats">0 <small>/ &infin;</small></div>
                  <div className="buc-desc"><span className="highlight">Unlimited</span> <span className="muted">on your plan</span></div>
                </div>
                <div className="b-usage-card blue-tint">
                  <div className="buc-icon blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="buc-title">Customers</div>
                  <div className="buc-stats">0 <small>/ &infin;</small></div>
                  <div className="buc-desc"><span className="highlight">Unlimited</span> <span className="muted">on your plan</span></div>
                </div>
                <div className="b-usage-card purple-tint">
                  <div className="buc-icon purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  </div>
                  <div className="buc-title">Team Members</div>
                  <div className="buc-stats">1 <small>/ 5</small></div>
                  <div className="buc-progress-bar"><div className="buc-progress-fill" style={{width: '20%'}}></div></div>
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
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 25 customers</li>
                      <li className="pc-feature exc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Branded PDF</li>
                    </ul>
                  </div>
                  <div className="price-card popular">
                    <div className="pc-badge popular"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:4, marginBottom:-1}}><path d="M2 16h20v4H2v-4zM4.08 14H19.92l1.6-9.6L17 7.6 12 2l-5 5.6L3.48 4.4 4.08 14z"/></svg> Most Popular</div>
                    <div className="pc-title">Growth</div>
                    <div className="pc-subtitle">Most popular choice</div>
                    <div className="pc-price">{isAnnual ? '₹499' : '₹599'}<small>/month</small></div>
                    <ul className="pc-features">
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited quotes</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited customers</li>
                      <li className="pc-feature inc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Reports & analytics</li>
                    </ul>
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
                    </ul>
                    <div className="pc-action"><div className="pc-current-text">Your current plan</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ITINERARY TAB ── */}
          {activeTab === 'itinerary-tab' && (
            <div id="itinerary-tab" className="settings-pane active">
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

              <div className="itin-card">
                <div className="itin-card-top">
                  <div className="itin-card-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="itin-card-title">Page Library</h3>
                    <p className="itin-card-subtitle">Upload cover pages, terms & conditions, or any full-page images</p>
                  </div>
                </div>
                <div className="itin-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>
                    <strong>Prefix pages</strong> appear before itinerary content. <strong>Suffix pages</strong> appear after.
                  </span>
                </div>
                <div className="itin-pages-grid">
                  <div className="itin-pages-col">
                    <div className="itin-pages-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                      <span className="itin-pages-row-label">PREFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-empty">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p>No prefix pages yet</p>
                    </div>
                    <button className="itin-add-page-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add page
                    </button>
                  </div>
                  <div className="itin-pages-divider" />
                  <div className="itin-pages-col">
                    <div className="itin-pages-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                      <span className="itin-pages-row-label">SUFFIX PAGES</span>
                      <span className="itin-pages-badge">0</span>
                    </div>
                    <div className="itin-pages-empty">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p>No suffix pages yet</p>
                    </div>
                    <button className="itin-add-page-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add page
                    </button>
                  </div>
                </div>
              </div>

              <div className="itin-card">
                <div className="itin-hf-card-header">
                  <div style={{display:'flex', alignItems:'center', gap:14}}>
                    <div className="itin-hf-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="itin-card-title">Default Header & Footer</h3>
                      <p className="itin-card-subtitle">Applied to all new itineraries — can be overridden per itinerary</p>
                    </div>
                  </div>
                  <button className="itin-save-btn" onClick={() => handleSave({})}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save
                  </button>
                </div>

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
                        <button className={`itin-mode-btn ${headerMode==='design' ? 'itin-mode-active' : ''}`} onClick={() => setHeaderMode('design')}>Design</button>
                        <button className={`itin-mode-btn ${headerMode==='image' ? 'itin-mode-active' : ''}`} onClick={() => setHeaderMode('image')}>Image</button>
                      </div>
                      <div className="form-group" style={{marginTop: 16}}>
                        <label className="form-label">Company Name</label>
                        <input type="text" className="form-input" value={companyNameHeader} onChange={e => setCompanyNameHeader(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tagline</label>
                        <input type="text" className="form-input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Your tagline..." />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Info</label>
                        <input type="text" className="form-input" value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="Phone, email, website..." />
                      </div>
                    </div>
                  )}
                </div>

                <div className="itin-section">
                  <button className="itin-section-label" onClick={() => setFooterExpanded(v => !v)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{transform: footerExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition:'transform 0.2s'}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    FOOTER
                  </button>
                  {footerExpanded && (
                    <div className="itin-section-body">
                      <div className="form-row form-row-3">
                        <div className="form-group">
                          <label className="form-label">Left</label>
                          <input type="text" className="form-input" value={footerLeft} onChange={e => setFooterLeft(e.target.value)} placeholder="Footer left..." />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Center</label>
                          <input type="text" className="form-input" value={footerCenter} onChange={e => setFooterCenter(e.target.value)} placeholder="Footer center..." />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Right</label>
                          <input type="text" className="form-input" value={footerRight} onChange={e => setFooterRight(e.target.value)} placeholder="Footer right..." />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
