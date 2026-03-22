const SERVICE_TYPE_MAP = { hotel: 'hotel', transport: 'cabTransport', activity: 'activities', admission: 'admission', visa: 'visa', insurance: 'insurance', meals: 'fooding', flight: 'flight', train: 'train', bus: 'bus' };
const parseAmt = (s) => parseInt((s || '0').replace(/[₹,]/g, ''), 10) || 0;
const parseIndianDate = (str) => {
  if (!str || str === 'N/A') return '';
  const months = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
  const parts = str.split(' ');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${months[parts[1]] || '01'}-${parts[0].padStart(2,'0')}`;
};

export const buildEditFormData = (detail, quoteId, extra = {}) => {
  const destType = (detail.destType || 'domestic').toLowerCase();
  const paxNum = parseInt(detail.travelers || '1') || 1;
  const services = {};
  const serviceCosts = {};
  (detail.services || []).forEach(svc => {
    const key = SERVICE_TYPE_MAP[svc.type] || svc.type;
    services[key] = true;
    const cost = parseAmt(svc.cost);
    if (cost) serviceCosts[key] = String(cost);
  });
  const depDate = parseIndianDate(detail.departure !== 'N/A' ? detail.departure : detail.tripDate);
  const retDate = parseIndianDate(detail.returnDate !== 'N/A' ? detail.returnDate : '');
  // Convert detail.itinerary → Step 6 itDays format
  const itDays = (detail.itinerary || []).map(d => {
    const actItems = d.items.filter(it => it.type === 'activity' || it.type === 'admission');
    const hotelItem = d.items.find(it => it.type === 'hotel');
    return {
      title: `Day ${d.day}`,
      highlight: d.items[0]?.name || '',
      date: d.date || '',
      activities: actItems.length > 0 ? actItems.map(it => it.name) : [''],
      hotel: hotelItem?.name || '',
      meals: hotelItem?.meals || '',
    };
  });
  if (itDays.length === 0) itDays.push({ title: '', highlight: '', date: '', activities: [''], hotel: '', meals: '' });
  return {
    _editQuoteId: quoteId,
    newCustomerName: detail.customerName || '',
    newCustomerPhone: (detail.customerPhone || '').replace(/^\+91\s*/, ''),
    newCustomerEmail: detail.customerEmail || '',
    destType,
    country: '',
    state: '',
    placeOfTravel: detail.destination || '',
    destination: detail.destination || '',
    departureDate: depDate,
    returnDate: retDate,
    startDate: depDate,
    endDate: retDate,
    adults: paxNum, children: 0, infants: 0,
    numTravelers: paxNum,
    duration: detail.duration || '',
    travelerDetails: Array.from({ length: paxNum }, () => ({ name: '', passportId: '' })),
    services, serviceCosts,
    costOfServices: String(parseAmt(detail.fin?.costOfServices)),
    hiddenMarkup: String(parseAmt(detail.fin?.hiddenMarkup)),
    processingCharge: String(parseAmt(detail.fin?.processingCharge)),
    totalQuoteAmount: String(parseAmt(detail.fin?.totalPayable)),
    gstMode: detail.fin?.billingModel === 'pure_agent' ? 'pure-agent' : 'principal',
    tcsMode: 'na',
    inclusions: detail.inclusions || [],
    exclusions: detail.exclusions || [],
    itDays,
    ...extra,
  };
};
