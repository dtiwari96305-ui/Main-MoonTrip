import React from 'react';

/* ── Individual service type sub-forms ─────────────────────────────── */

const EMPTY_LEG = () => ({
  id: Date.now() + Math.random(),
  passengerName: '', ticketNo: '',
  flightNo: '', date: '', legSector: '',
  baseFare: '', taxes: '',
});

export const FlightDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  const legs = (data.legs && data.legs.length > 0) ? data.legs : [EMPTY_LEG()];

  const updateLeg = (idx, key, val) => {
    const newLegs = legs.map((leg, i) => i === idx ? { ...leg, [key]: val } : leg);
    s('legs', newLegs);
  };
  const addLeg = () => s('legs', [...legs, EMPTY_LEG()]);
  const removeLeg = (idx) => s('legs', legs.filter((_, i) => i !== idx));

  const legTotal = (leg) => (Number(leg.baseFare) || 0) + (Number(leg.taxes) || 0);
  const subtotal = legs.reduce((sum, leg) => sum + legTotal(leg), 0) + (Number(data.k3Amount) || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Airline / Sector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Airline</label>
          <input className="form-input" value={data.airline || ''} onChange={e => s('airline', e.target.value)} placeholder="IndiGo" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sector</label>
          <input className="form-input" value={data.sector || ''} onChange={e => s('sector', e.target.value)} placeholder="BOM-DXB" />
        </div>
      </div>

      {/* Flight Legs header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Flight Legs
        </span>
        <button
          type="button"
          onClick={addLeg}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Leg
        </button>
      </div>

      {/* Legs */}
      {legs.map((leg, idx) => (
        <div key={leg.id} className="cvb-leg-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>Leg {idx + 1}</span>
            {legs.length > 1 && (
              <button
                type="button"
                onClick={() => removeLeg(idx)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
              >✕</button>
            )}
          </div>

          {/* Passenger / Ticket # */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Passenger Name</label>
              <input className="form-input" value={leg.passengerName} onChange={e => updateLeg(idx, 'passengerName', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ticket #</label>
              <input className="form-input" value={leg.ticketNo} onChange={e => updateLeg(idx, 'ticketNo', e.target.value)} placeholder="098-1234567890" />
            </div>
          </div>

          {/* Flight # / Date / Sector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Flight #</label>
              <input className="form-input" value={leg.flightNo} onChange={e => updateLeg(idx, 'flightNo', e.target.value)} placeholder="6E 203" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={leg.date} onChange={e => updateLeg(idx, 'date', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sector</label>
              <input className="form-input" value={leg.legSector} onChange={e => updateLeg(idx, 'legSector', e.target.value)} placeholder="BOM-DXB" />
            </div>
          </div>

          {/* Base Fare / Taxes / Leg Total */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Base Fare (₹)</label>
              <input className="form-input" type="number" step="0.01" value={leg.baseFare} onChange={e => updateLeg(idx, 'baseFare', e.target.value)} placeholder="0" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Taxes (₹)</label>
              <input className="form-input" type="number" step="0.01" value={leg.taxes} onChange={e => updateLeg(idx, 'taxes', e.target.value)} placeholder="0" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Leg Total (₹)</label>
              <input className="form-input disable-bg" readOnly value={legTotal(leg).toLocaleString('en-IN')} />
            </div>
          </div>
        </div>
      ))}

      {/* K3 / Subtotal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">K3 Tax (₹)</label>
          <input className="form-input" type="number" step="0.01" value={data.k3Amount || ''} onChange={e => s('k3Amount', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Subtotal (₹)</label>
          <input className="form-input disable-bg" readOnly value={subtotal.toLocaleString('en-IN')} />
        </div>
      </div>
    </div>
  );
};

export const HotelDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Hotel Name</label><input className="form-input" value={data.hotelName || ''} onChange={e => s('hotelName', e.target.value)} placeholder="Grand Hyatt" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">City</label><input className="form-input" value={data.city || ''} onChange={e => s('city', e.target.value)} placeholder="Mumbai" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Check-In</label><input className="form-input" type="date" value={data.checkIn || ''} onChange={e => s('checkIn', e.target.value)} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Check-Out</label><input className="form-input" type="date" value={data.checkOut || ''} onChange={e => s('checkOut', e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Room Type</label><input className="form-input" value={data.roomType || ''} onChange={e => s('roomType', e.target.value)} placeholder="Deluxe Room" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Nights</label><input className="form-input" type="number" min="1" value={data.nights || 1} onChange={e => s('nights', Number(e.target.value))} /></div>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Guests</label><input className="form-input" type="number" min="1" value={data.guests || 1} onChange={e => s('guests', Number(e.target.value))} style={{ maxWidth: 160 }} /></div>
    </div>
  );
};

export const CabDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Route</label><input className="form-input" value={data.route || ''} onChange={e => s('route', e.target.value)} placeholder="Airport → Hotel → Sightseeing" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Cab Type</label><input className="form-input" value={data.cabType || ''} onChange={e => s('cabType', e.target.value)} placeholder="Innova Crysta" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Driver</label><input className="form-input" value={data.driver || ''} onChange={e => s('driver', e.target.value)} placeholder="Driver name" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Pickup Time</label><input className="form-input" type="datetime-local" value={data.pickupTime || ''} onChange={e => s('pickupTime', e.target.value)} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Drop Time</label><input className="form-input" type="datetime-local" value={data.dropTime || ''} onChange={e => s('dropTime', e.target.value)} /></div>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Distance (km)</label><input className="form-input" type="number" value={data.distance || ''} onChange={e => s('distance', e.target.value)} placeholder="150" style={{ maxWidth: 160 }} /></div>
    </div>
  );
};

export const BusDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Operator</label><input className="form-input" value={data.operator || ''} onChange={e => s('operator', e.target.value)} placeholder="RedBus / MSRTC" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Route</label><input className="form-input" value={data.route || ''} onChange={e => s('route', e.target.value)} placeholder="Mumbai → Pune" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Departure</label><input className="form-input" type="datetime-local" value={data.departure || ''} onChange={e => s('departure', e.target.value)} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Seats</label><input className="form-input" type="number" min="1" value={data.seats || 1} onChange={e => s('seats', Number(e.target.value))} /></div>
      </div>
    </div>
  );
};

export const TrainDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Train Name</label><input className="form-input" value={data.trainName || ''} onChange={e => s('trainName', e.target.value)} placeholder="Rajdhani Express" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Train Number</label><input className="form-input" value={data.trainNumber || ''} onChange={e => s('trainNumber', e.target.value)} placeholder="12951" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Route</label><input className="form-input" value={data.route || ''} onChange={e => s('route', e.target.value)} placeholder="NDLS → MMCT" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Class</label>
          <select className="form-input" value={data.class || '3A'} onChange={e => s('class', e.target.value)}>
            <option value="1A">1A — First AC</option>
            <option value="2A">2A — Second AC</option>
            <option value="3A">3A — Third AC</option>
            <option value="SL">SL — Sleeper</option>
            <option value="CC">CC — Chair Car</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Departure</label><input className="form-input" type="datetime-local" value={data.departure || ''} onChange={e => s('departure', e.target.value)} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Berths</label><input className="form-input" type="number" min="1" value={data.berths || 1} onChange={e => s('berths', Number(e.target.value))} /></div>
      </div>
    </div>
  );
};

export const VisaDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Country</label><input className="form-input" value={data.country || ''} onChange={e => s('country', e.target.value)} placeholder="UAE" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Visa Type</label><input className="form-input" value={data.visaType || ''} onChange={e => s('visaType', e.target.value)} placeholder="Tourist / Business" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Applicants</label><input className="form-input" type="number" min="1" value={data.applicants || 1} onChange={e => s('applicants', Number(e.target.value))} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Submission Date</label><input className="form-input" type="date" value={data.submissionDate || ''} onChange={e => s('submissionDate', e.target.value)} /></div>
      </div>
    </div>
  );
};

export const InsuranceDetailsForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Provider</label><input className="form-input" value={data.provider || ''} onChange={e => s('provider', e.target.value)} placeholder="ICICI Lombard" /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Plan</label><input className="form-input" value={data.plan || ''} onChange={e => s('plan', e.target.value)} placeholder="Travel Shield Platinum" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Pax Count</label><input className="form-input" type="number" min="1" value={data.paxCount || 1} onChange={e => s('paxCount', Number(e.target.value))} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Coverage (₹)</label><input className="form-input" value={data.coverage || ''} onChange={e => s('coverage', e.target.value)} placeholder="25,00,000" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Start Date</label><input className="form-input" type="date" value={data.startDate || ''} onChange={e => s('startDate', e.target.value)} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">End Date</label><input className="form-input" type="date" value={data.endDate || ''} onChange={e => s('endDate', e.target.value)} /></div>
      </div>
    </div>
  );
};

export const OtherServiceForm = ({ data, onChange }) => {
  const s = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Service Name</label><input className="form-input" value={data.serviceName || ''} onChange={e => s('serviceName', e.target.value)} placeholder="e.g. Jungle Safari, Sightseeing" /></div>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Description</label><textarea className="form-input" rows={2} value={data.description || ''} onChange={e => s('description', e.target.value)} placeholder="Details about the service" /></div>
      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Quantity / Pax</label><input className="form-input" type="number" min="1" value={data.quantity || 1} onChange={e => s('quantity', Number(e.target.value))} style={{ maxWidth: 160 }} /></div>
    </div>
  );
};

/* ── Service Type Toggle ───────────────────────────────────────────── */
const SERVICE_TYPES = [
  { id: 'flight', label: 'Flight' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'cab', label: 'Cab / Transfer' },
  { id: 'visa', label: 'Visa' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'bus', label: 'Activities' },
  { id: 'train', label: 'Land Package' },
  { id: 'other', label: 'Other' },
];

export const ServiceTypeToggle = ({ value, onChange }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {SERVICE_TYPES.map(t => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={`cvb-service-btn${value === t.id ? ' active' : ''}`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export const SERVICE_TYPE_LABELS = Object.fromEntries(SERVICE_TYPES.map(t => [t.id, t.label]));

export const ServiceDetailForm = ({ serviceType, data, onChange }) => {
  switch (serviceType) {
    case 'flight': return <FlightDetailsForm data={data} onChange={onChange} />;
    case 'hotel': return <HotelDetailsForm data={data} onChange={onChange} />;
    case 'cab': return <CabDetailsForm data={data} onChange={onChange} />;
    case 'bus': return <BusDetailsForm data={data} onChange={onChange} />;
    case 'train': return <TrainDetailsForm data={data} onChange={onChange} />;
    case 'visa': return <VisaDetailsForm data={data} onChange={onChange} />;
    case 'insurance': return <InsuranceDetailsForm data={data} onChange={onChange} />;
    default: return <OtherServiceForm data={data} onChange={onChange} />;
  }
};
