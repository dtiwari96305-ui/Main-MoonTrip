import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

/* ── Icons ── */
const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const PlaneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);
const TrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 2v9"/><path d="M8 18l-2 4"/><path d="M16 18l2 4"/>
  </svg>
);
const UploadCloudIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const BotIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
    <rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 2v9"/><path d="M8 18l-2 4"/><path d="M16 18l2 4"/><circle cx="8" cy="7" r="1.5" fill="#94a3b8"/><circle cx="16" cy="7" r="1.5" fill="#94a3b8"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const TABS = [
  { key: 'upload', label: 'Upload Document', icon: DocIcon },
  { key: 'pnr', label: 'Airline / PNR', icon: PlaneIcon },
  { key: 'railway', label: 'Railway / NTES', icon: TrainIcon },
];

/* ========== TAB 1 — Upload Document ========== */
const UploadTab = ({ onFileUploaded, uploadedFiles, onRemoveFile, mode, triggerDemoPopup }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);
  const docRef = useRef(null);
  const imgRef = useRef(null);

  const processFiles = useCallback((files) => {
    if (mode === 'demo') { triggerDemoPopup?.(); return; }
    const fileList = Array.from(files);
    fileList.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { alert('File too large. Max 10MB.'); return; }
      setUploading(true);
      setUploadProgress(0);
      const reader = new FileReader();
      reader.onprogress = (e) => { if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100)); };
      reader.onload = () => {
        onFileUploaded({
          id: Date.now() + Math.random(),
          name: file.name, type: file.type, size: file.size,
          sourceType: 'upload', data: reader.result, uploadDate: new Date().toISOString()
        });
        setUploading(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    });
  }, [mode, triggerDemoPopup, onFileUploaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const fmtSize = (b) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const fileIcon = (type) => {
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('image')) return '🖼️';
    if (type?.includes('sheet') || type?.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="idm-upload-tab">
      <div className="idm-upload-topbar">
        <span className="idm-upload-hint">Paste airline PNR, flight ticket, email, WhatsApp, or booking text</span>
        <div className="idm-upload-btns">
          <button type="button" className="idm-outline-btn" onClick={() => { if (mode === 'demo') { triggerDemoPopup?.(); return; } docRef.current?.click(); }}>
            <DocIcon /> Upload Document
          </button>
          <button type="button" className="idm-outline-btn" onClick={() => { if (mode === 'demo') { triggerDemoPopup?.(); return; } imgRef.current?.click(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Upload Image
          </button>
        </div>
        <input ref={docRef} type="file" accept=".pdf,.xlsx,.xls,.doc,.docx" style={{ display: 'none' }} onChange={e => processFiles(e.target.files)} />
        <input ref={imgRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => processFiles(e.target.files)} />
      </div>

      <div
        className={`idm-dropzone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => { if (mode === 'demo') { triggerDemoPopup?.(); return; } fileRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="idm-upload-progress">
            <div className="idm-progress-bar"><div className="idm-progress-fill" style={{ width: `${uploadProgress}%` }} /></div>
            <span className="idm-progress-text">Uploading... {uploadProgress}%</span>
          </div>
        ) : (
          <>
            <div className="idm-dropzone-icon"><UploadCloudIcon /></div>
            <p className="idm-dropzone-title">Upload any document or data dump</p>
            <p className="idm-dropzone-sub">Vendor quotes, flight tickets, hotel vouchers, train tickets, booking confirmations, emails</p>
            <p className="idm-dropzone-hint">PDF, JPG, PNG, Excel — Max 10MB — AI extracts flights, hotels, trains, costs & itinerary</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" multiple style={{ display: 'none' }} onChange={e => processFiles(e.target.files)} />

      {uploadedFiles.length > 0 && (
        <div className="idm-file-list">
          {uploadedFiles.filter(f => f.sourceType === 'upload').map(f => (
            <div key={f.id} className="idm-file-item">
              <span className="idm-file-icon">{fileIcon(f.type)}</span>
              <div className="idm-file-info">
                <span className="idm-file-name">{f.name}</span>
                <span className="idm-file-meta">{fmtSize(f.size)} • {new Date(f.uploadDate).toLocaleDateString()}</span>
              </div>
              <button type="button" className="idm-file-remove" onClick={e => { e.stopPropagation(); onRemoveFile(f.id); }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========== TAB 2 — Airline / PNR ========== */
const PNRTab = ({ onParsed, mode, triggerDemoPopup }) => {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const docRef = useRef(null);
  const imgRef = useRef(null);

  const handleParse = () => {
    if (!text.trim()) return;
    if (mode === 'demo') { triggerDemoPopup?.(); return; }
    setParsing(true);
    // Simple client-side PNR parsing
    setTimeout(() => {
      const result = parsePNRText(text);
      setParsed(result);
      setParsing(false);
    }, 600);
  };

  const handleAddToQuote = (item) => {
    onParsed(item);
  };

  const handleFileRead = (file) => {
    if (mode === 'demo') { triggerDemoPopup?.(); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setText(prev => prev + (prev ? '\n\n' : '') + `[File: ${file.name}]`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="idm-pnr-tab">
      <div className="idm-pnr-topbar">
        <span className="idm-pnr-label">Paste airline PNR, flight ticket, email, WhatsApp, or booking text</span>
        <div className="idm-upload-btns">
          <button type="button" className="idm-outline-btn" onClick={() => { if (mode === 'demo') { triggerDemoPopup?.(); return; } docRef.current?.click(); }}>
            <DocIcon /> Upload Document
          </button>
          <button type="button" className="idm-outline-btn" onClick={() => { if (mode === 'demo') { triggerDemoPopup?.(); return; } imgRef.current?.click(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Upload Image
          </button>
        </div>
        <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileRead(e.target.files[0])} />
        <input ref={imgRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileRead(e.target.files[0])} />
      </div>

      <textarea
        className="idm-pnr-textarea"
        rows={8}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={`Paste anything here:\n• GDS PNR (Amadeus/Sabre/Galileo)\n• Flight ticket or booking confirmation\n• Vendor quote email or WhatsApp message\n• Any travel booking text`}
      />

      <button
        type="button"
        className={`idm-parse-btn ${text.trim() ? 'active' : ''}`}
        onClick={handleParse}
        disabled={!text.trim() || parsing}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        {parsing ? 'Parsing...' : 'Parse'}
      </button>

      {parsed && parsed.length > 0 && (
        <div className="idm-parsed-results">
          {parsed.map((item, i) => (
            <div key={i} className="idm-parsed-card">
              <div className="idm-parsed-icon">
                <PlaneIcon />
              </div>
              <div className="idm-parsed-info">
                <span className="idm-parsed-title">{item.flightNumber || 'Flight'} — {item.sector || 'Unknown route'}</span>
                <span className="idm-parsed-sub">{item.date || ''} {item.depTime ? `• Dep ${item.depTime}` : ''} {item.arrTime ? `• Arr ${item.arrTime}` : ''}</span>
                {item.passenger && <span className="idm-parsed-sub">Passenger: {item.passenger}</span>}
              </div>
              <button type="button" className="idm-add-btn" onClick={() => handleAddToQuote(item)}>Add to Quote</button>
            </div>
          ))}
        </div>
      )}
      {parsed && parsed.length === 0 && (
        <div className="idm-parsed-empty">No flight details could be extracted. Try pasting a clearer PNR or ticket text.</div>
      )}
    </div>
  );
};

/* ========== TAB 3 — Railway / NTES ========== */
const RailwayTab = ({ mode, triggerDemoPopup, onRailAdded }) => {
  const [trainNo, setTrainNo] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [liveStation, setLiveStation] = useState('');
  const [timeWindow, setTimeWindow] = useState('2h');
  const [trainResult, setTrainResult] = useState(null);
  const [routeResults, setRouteResults] = useState(null);
  const [liveResults, setLiveResults] = useState(null);
  const [loading, setLoading] = useState('');

  const demoGuard = () => { if (mode === 'demo') { triggerDemoPopup?.(); return true; } return false; };

  const searchTrain = () => {
    if (!trainNo.trim() || demoGuard()) return;
    setLoading('train');
    // Placeholder — real API integration would go here
    setTimeout(() => {
      setTrainResult({ trainNo: trainNo.trim(), name: `Train ${trainNo.trim()}`, message: 'Railway API integration required. Train details will appear here.' });
      setLoading('');
    }, 800);
  };

  const findTrains = () => {
    if ((!fromStation.trim() || !toStation.trim()) || demoGuard()) return;
    setLoading('route');
    setTimeout(() => {
      setRouteResults({ from: fromStation, to: toStation, message: 'Railway API integration required. Route results will appear here.' });
      setLoading('');
    }, 800);
  };

  const searchLive = () => {
    if (!liveStation.trim() || demoGuard()) return;
    setLoading('live');
    setTimeout(() => {
      setLiveResults({ station: liveStation, window: timeWindow, message: 'Railway API integration required. Live board will appear here.' });
      setLoading('');
    }, 800);
  };

  const hasAnyResult = trainResult || routeResults || liveResults;

  return (
    <div className="idm-rail-tab">
      {/* Section 1 — Search by train number */}
      <div className="idm-rail-section">
        <label className="idm-rail-label">SEARCH BY TRAIN NUMBER</label>
        <div className="idm-rail-row">
          <input type="text" className="idm-rail-input" placeholder="5-digit train number (e.g. 12301)" value={trainNo} onChange={e => setTrainNo(e.target.value.replace(/\D/g, '').slice(0, 5))} />
          <button type="button" className="idm-rail-search-btn orange" onClick={searchTrain} disabled={loading === 'train'}>
            <SearchIcon /> {loading === 'train' ? 'Searching...' : 'Search'}
          </button>
        </div>
        {trainResult && (
          <div className="idm-rail-result-card">
            <p className="idm-rail-result-msg">{trainResult.message}</p>
          </div>
        )}
      </div>

      <div className="idm-rail-divider"><span>OR SEARCH BY ROUTE</span></div>

      {/* Section 2 — Find trains between stations */}
      <div className="idm-rail-section">
        <label className="idm-rail-label">FIND TRAINS BETWEEN STATIONS</label>
        <div className="idm-rail-row">
          <input type="text" className="idm-rail-input" placeholder="From station" value={fromStation} onChange={e => setFromStation(e.target.value)} />
          <span className="idm-rail-arrow"><ArrowIcon /></span>
          <input type="text" className="idm-rail-input" placeholder="To station" value={toStation} onChange={e => setToStation(e.target.value)} />
          <button type="button" className="idm-rail-search-btn blue" onClick={findTrains} disabled={loading === 'route'}>
            <SearchIcon /> {loading === 'route' ? 'Finding...' : 'Find'}
          </button>
        </div>
        {routeResults && (
          <div className="idm-rail-result-card">
            <p className="idm-rail-result-msg">{routeResults.message}</p>
          </div>
        )}
      </div>

      <div className="idm-rail-divider"><span>LIVE STATION BOARD</span></div>

      {/* Section 3 — Real-time arrivals & departures */}
      <div className="idm-rail-section">
        <label className="idm-rail-label">REAL-TIME ARRIVALS & DEPARTURES</label>
        <div className="idm-rail-row">
          <input type="text" className="idm-rail-input idm-rail-input-wide" placeholder="Search any station..." value={liveStation} onChange={e => setLiveStation(e.target.value)} />
          <div className="idm-time-pills">
            {['2h', '4h', '8h'].map(t => (
              <button key={t} type="button" className={`idm-time-pill ${timeWindow === t ? 'active' : ''}`} onClick={() => setTimeWindow(t)}>{t}</button>
            ))}
          </div>
          <button type="button" className="idm-rail-search-btn green" onClick={searchLive} disabled={loading === 'live'}>
            <SearchIcon /> {loading === 'live' ? 'Loading...' : 'Live'}
          </button>
        </div>
        {liveResults && (
          <div className="idm-rail-result-card">
            <p className="idm-rail-result-msg">{liveResults.message}</p>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!hasAnyResult && (
        <div className="idm-rail-empty">
          <BotIcon />
          <p className="idm-rail-empty-title">Search Indian Railways live data</p>
          <p className="idm-rail-empty-sub">Train number → full schedule with station selection. Route → all trains between stations. Station → live arrivals/departures.</p>
        </div>
      )}
    </div>
  );
};

/* ── PNR parser (simple client-side) ── */
function parsePNRText(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const legs = [];
  let passengerName = '';

  const nameMatch = text.match(/(?:NAME|PAX|PASSENGER)[:\s]+([A-Z][A-Z\s/]+)/i)
    || text.match(/([A-Z]{2,}\/[A-Z]{2,})/);
  if (nameMatch) passengerName = nameMatch[1].trim();

  // Pattern: FlightNo Date Sector Times
  const p1 = /([A-Z]{2}\s?\d{1,4})\s+(\d{1,2}[A-Z]{3}(?:\d{2,4})?)\s+([A-Z]{3})[\/\-]([A-Z]{3})\s+(\d{3,4})\s+(\d{3,4})/g;
  let m;
  while ((m = p1.exec(text)) !== null) {
    legs.push({ flightNumber: m[1].replace(/\s/g, ''), date: m[2], sector: `${m[3]}/${m[4]}`, depTime: m[5], arrTime: m[6], passenger: passengerName });
  }

  // Pattern: airline code + number + date
  if (legs.length === 0) {
    const p2 = /([A-Z]{2})\s*(\d{1,4})\s.*?(\d{1,2}\s*[A-Z]{3})/g;
    while ((m = p2.exec(text)) !== null) {
      legs.push({ flightNumber: `${m[1]}${m[2]}`, date: m[3].trim(), sector: '', depTime: '', arrTime: '', passenger: passengerName });
    }
  }

  return legs;
}

/* ========== Main Modal ========== */
export const ImportDataModal = ({ initialTab = 'upload', onClose, onFileUploaded, uploadedFiles = [], onRemoveFile, onPNRParsed, onRailAdded, mode = 'real', triggerDemoPopup }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const content = (
    <div className="idm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="idm-modal">
        {/* Header */}
        <div className="idm-header">
          <div>
            <h2 className="idm-title">Import Data</h2>
            <p className="idm-subtitle">Upload documents, paste airline PNR, or look up Indian Railways — flights, hotels, trains, activities, costs & itinerary auto-extracted</p>
          </div>
          <button type="button" className="idm-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Tabs */}
        <div className="idm-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                className={`idm-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="idm-body">
          {activeTab === 'upload' && (
            <UploadTab
              onFileUploaded={onFileUploaded}
              uploadedFiles={uploadedFiles}
              onRemoveFile={onRemoveFile}
              mode={mode}
              triggerDemoPopup={triggerDemoPopup}
            />
          )}
          {activeTab === 'pnr' && (
            <PNRTab
              onParsed={onPNRParsed}
              mode={mode}
              triggerDemoPopup={triggerDemoPopup}
            />
          )}
          {activeTab === 'railway' && (
            <RailwayTab
              mode={mode}
              triggerDemoPopup={triggerDemoPopup}
              onRailAdded={onRailAdded}
            />
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
