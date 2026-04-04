import React, { useState, useRef, useEffect } from 'react';

export const VendorSelectDropdown = ({ value, onChange, vendors = [], placeholder = 'Vendor name', className = 'cq-text-in' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const vendorNames = [...new Set(vendors.map(v => v.name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filtered = search
    ? vendorNames.filter(n => n.toLowerCase().includes(search.toLowerCase()))
    : vendorNames;

  const handleInputChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    onChange(v);
    if (!open) setOpen(true);
  };

  const handleSelect = (name) => {
    onChange(name);
    setSearch('');
    setOpen(false);
  };

  const handleFocus = () => {
    setSearch('');
    setOpen(true);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value || ''}
        onChange={handleInputChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {open && (
        <div className="vendor-dd-list">
          {filtered.length > 0 && filtered.map(name => (
            <div key={name} className="vendor-dd-item" onClick={() => handleSelect(name)}>
              {name}
            </div>
          ))}
          {filtered.length === 0 && search && (
            <div className="vendor-dd-empty">No matching vendors</div>
          )}
          <div className="vendor-dd-item vendor-dd-add" onClick={() => { onChange(value || search); setOpen(false); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {search ? `Add "${search}" as new vendor` : 'Type a new vendor name'}
          </div>
        </div>
      )}
    </div>
  );
};
