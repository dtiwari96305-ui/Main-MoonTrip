/**
 * Centralized demo data — single source of truth for all hardcoded data
 * used by the demo dashboard. This file extracts data that was previously
 * scattered across component and page files.
 */

export const demoCustomers = [
  { id: 'WL-C-0001', name: 'Rahul Sharma', phone: '+91 99876 54321', email: 'rahul@example.com', location: 'Mumbai', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', initials: 'RS' },
  { id: 'WL-C-0002', name: 'Priya Mehta', phone: '+91 98765 12345', email: 'priya@example.com', location: 'Delhi', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', initials: 'PM' },
  { id: 'WL-C-0003', name: 'Vikram Iyer', phone: '+91 98456 78901', email: 'vikram@example.com', location: 'Bangalore', type: 'Corporate', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', initials: 'VI' },
  { id: 'WL-C-0004', name: 'Ananya Reddy', phone: '+91 87654 32109', email: 'ananya@example.com', location: 'Hyderabad', type: 'Individual', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', initials: 'AR' },
  { id: 'WL-C-0005', name: 'Rajesh Patel', phone: '+91 97654 32100', email: 'rajesh@example.com', location: 'Ahmedabad', type: 'Corporate', joined: '09 Mar 2026', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', initials: 'RP' },
  { id: 'WL-C-0006', name: 'Arjun Singh', phone: '+91 91234 56789', email: 'arjun@example.com', location: 'Jaipur', type: 'Individual', joined: '10 Mar 2026', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', initials: 'AS' },
];

export const demoQuotes = [
  { id: 'WL-Q-0001', quoteType: 'detailed', customerName: 'Rahul Sharma', customerPhone: '+91 99876 54321', destName: 'Bali, Indonesia', destType: 'international', amount: '₹1,40,952', profit: '₹18,000', status: 'converted', tripDate: '15 Apr 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0002', quoteType: 'quick', customerName: 'Priya Mehta', customerPhone: '+91 98765 12345', destName: 'Jaipur - Udaipur - Jodhpur', destType: 'domestic', amount: '₹1,10,520', profit: '₹14,000', status: 'sent', tripDate: '01 May 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0003', quoteType: 'detailed', customerName: 'Vikram Iyer', customerPhone: '+91 98456 78901', destName: 'Goa', destType: 'domestic', amount: '₹4,69,900', profit: '₹55,000', status: 'converted', tripDate: '20 Mar 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0004', quoteType: 'detailed', customerName: 'Ananya Reddy', customerPhone: '+91 87654 32109', destName: 'Paris - Switzerland - Rome', destType: 'international', amount: '₹8,92,400', profit: '₹1,05,000', status: 'draft', tripDate: '10 Jun 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0005', quoteType: 'quick', customerName: 'Rajesh Patel', customerPhone: '+91 97654 32100', destName: 'Srinagar - Gulmarg - Pahalgam', destType: 'domestic', amount: '₹1,56,880', profit: '₹16,000', status: 'converted', tripDate: '05 Apr 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0006', quoteType: 'quick', customerName: 'Arjun Singh', customerPhone: '+91 91234 56789', destName: 'Leh - Ladakh', destType: 'domestic', amount: '₹78,500', profit: '₹9,500', status: 'approved', tripDate: '22 May 2026', createdDate: '10 Mar 2026', createdTime: '02:45 pm' },
  { id: 'WL-Q-0007', quoteType: 'detailed', customerName: 'Kavita Sharma', customerPhone: '+91 99988 77766', destName: 'Dubai', destType: 'international', amount: '₹2,45,000', profit: '₹22,000', status: 'rejected', tripDate: '10 Apr 2026', createdDate: '08 Mar 2026', createdTime: '11:30 am' }
];

export const demoBookings = [
  { id: 'WL-B-0002', customerName: 'Rahul Sharma', destination: 'Bali, Indonesia', amount: '₹1,40,952', profit: '₹18,000', paymentStatus: 'paid', paymentText: '₹1,40,952 / ₹1,40,952', remaining: '—', status: 'confirmed', date: '09 Mar 2026' },
  { id: 'WL-B-0001', customerName: 'Vikram Iyer', destination: 'Goa', amount: '₹4,69,900', profit: '₹55,000', paymentStatus: 'partial', paymentText: '₹2,35,000 / ₹4,69,900', remaining: '₹2,34,900', status: 'confirmed', date: '09 Mar 2026' },
  { id: 'WL-B-0003', customerName: 'Rajesh Patel', destination: 'Srinagar - Gulmarg - Pahalgam', amount: '₹1,56,880', profit: '₹16,000', paymentStatus: 'paid', paymentText: '₹1,56,880 / ₹1,56,880', remaining: '—', status: 'completed', date: '01 Mar 2026' }
];

export const demoPayments = [
  {
    id: 'REC-0001', against: 'WL-B-0001', customerName: 'Vikram Iyer',
    amount: '₹2,35,000', amountNum: 235000, modeType: 'bank', modeLabel: 'Bank Transfer',
    ref: 'NEFT/2026/03/HDFC123456', bankName: 'HDFC Bank',
    remarks: '50% advance — GlobalTech corporate group trip',
    date: '10 Mar 2026', againstType: 'normal', badge: 'Advance', createdDate: '10 Mar 2026',
  },
  {
    id: 'REC-0002', against: 'WL-B-0002', customerName: 'Rahul Sharma',
    amount: '₹1,40,952', amountNum: 140952, modeType: 'upi', modeLabel: 'UPI',
    ref: 'UPI/326598741258', bankName: '',
    remarks: 'Full payment — Bali honeymoon package',
    date: '06 Mar 2026', againstType: 'normal', badge: 'Full', createdDate: '06 Mar 2026',
  },
  {
    id: 'REC-0003', against: 'WL-B-0003', customerName: 'Rajesh Patel',
    amount: '₹80,000', amountNum: 80000, modeType: 'bank', modeLabel: 'Bank Transfer',
    ref: 'IMPS/2026/SBIN789012', bankName: 'SBI',
    remarks: 'Advance — Kashmir family trip',
    date: '01 Mar 2026', againstType: 'normal', badge: 'Advance', createdDate: '01 Mar 2026',
  },
  {
    id: 'REC-0004', against: 'WL-B-0003', customerName: 'Rajesh Patel',
    amount: '₹76,880', amountNum: 76880, modeType: 'cheque', modeLabel: 'Cheque',
    ref: '—', bankName: '',
    remarks: 'Balance payment — Kashmir family trip',
    date: '08 Mar 2026', againstType: 'normal', badge: 'Balance', createdDate: '08 Mar 2026',
  },
  {
    id: 'REC-0005', against: 'Advance', customerName: 'Priya Mehta',
    amount: '₹25,000', amountNum: 25000, modeType: 'upi', modeLabel: 'UPI',
    ref: 'UPI/326541239876', bankName: '',
    remarks: 'Advance deposit — Rajasthan itinerary',
    date: '07 Mar 2026', againstType: 'advance', badge: 'Advance', createdDate: '07 Mar 2026',
  },
];

export const getDemoPaymentById = (id) => demoPayments.find(p => p.id === id) || null;

export const demoProfileData = {
  'WL-C-0001': {
    city: 'Mumbai', state: 'Maharashtra', country: 'India',
    emailOverride: 'rahul.sharma@email.com',
    tags: ['international', 'solo'],
    pan: '', gstin: '', company: '',
    ledger: [
      { id: 'REC-0001', date: '09 Mar 2026', desc: 'Cash(Advance) - INV-101', credit: 140952, balance: 140952 },
    ],
    payments: [
      { id: 'REC-0001', badge: 'Advance', date: '09 Mar 2026', method: 'cash', amount: 140952 },
    ],
  },
  'WL-C-0002': {
    city: 'New Delhi', state: 'Delhi', country: 'India',
    emailOverride: 'priya.mehta@email.com',
    tags: ['domestic', 'family'],
    pan: '', gstin: '', company: '',
    ledger: [
      { id: 'REC-0005', date: '07 Mar 2026', desc: 'upi(Advance) - UPI/326541239876', credit: 25000, balance: 25000 },
    ],
    payments: [
      { id: 'REC-0005', badge: 'Advance', date: '07 Mar 2026', method: 'upi', amount: 25000 },
    ],
  },
  'WL-C-0003': {
    city: 'Bangalore', state: 'Karnataka', country: 'India',
    emailOverride: 'vikram.iyer@email.com',
    tags: ['domestic', 'corporate', 'group'],
    pan: 'AABCV1234D', gstin: '29AABCV1234D1Z5', company: 'Iyer Enterprises Pvt. Ltd.',
    ledger: [
      { id: 'REC-0002', date: '09 Mar 2026', desc: 'Bank Transfer(Advance) - REF/449827312', credit: 469900, balance: 469900 },
    ],
    payments: [
      { id: 'REC-0002', badge: 'Advance', date: '09 Mar 2026', method: 'bank', amount: 469900 },
    ],
  },
  'WL-C-0004': {
    city: 'Hyderabad', state: 'Telangana', country: 'India',
    emailOverride: 'ananya.reddy@email.com',
    tags: ['international', 'honeymoon'],
    pan: '', gstin: '', company: '',
    ledger: [],
    payments: [],
  },
  'WL-C-0005': {
    city: 'Ahmedabad', state: 'Gujarat', country: 'India',
    emailOverride: 'rajesh.patel@email.com',
    tags: ['domestic', 'corporate', 'family'],
    pan: 'ABCPR9876F', gstin: '24ABCPR9876F1ZP', company: 'Patel Group of Companies',
    ledger: [
      { id: 'REC-0003', date: '01 Mar 2026', desc: 'Card(Full Payment) - TXID/889234100', credit: 156880, balance: 156880 },
    ],
    payments: [
      { id: 'REC-0003', badge: 'Full', date: '01 Mar 2026', method: 'card', amount: 156880 },
    ],
  },
  'WL-C-0006': {
    city: 'Jaipur', state: 'Rajasthan', country: 'India',
    emailOverride: 'arjun.singh@email.com',
    tags: ['domestic', 'adventure'],
    pan: '', gstin: '', company: '',
    ledger: [],
    payments: [],
  },
};

export const demoActivities = [
  { id: 'WL-Q-0001', type: 'quotes', amount: '₹1,40,952', status: 'converted', statusLabel: 'Converted', date: '09 Mar 2026', customer: 'Rahul Sharma', colorClass: 'ai-purple' },
  { id: 'WL-Q-0002', type: 'quotes', amount: '₹1,10,520', status: 'sent', statusLabel: 'Sent', date: '09 Mar 2026', customer: 'Priya Mehta', colorClass: 'ai-blue' },
  { id: 'WL-Q-0003', type: 'quotes', amount: '₹4,69,900', status: 'converted', statusLabel: 'Converted', date: '09 Mar 2026', customer: 'Vikram Iyer', colorClass: 'ai-purple' },
  { id: 'WL-Q-0004', type: 'quotes', amount: '₹2,34,900', status: 'draft', statusLabel: 'Draft', date: '08 Mar 2026', customer: 'Ankit Verma', colorClass: 'ai-orange' },
  { id: 'WL-B-0089', type: 'bookings', amount: '₹1,56,880', status: 'converted', statusLabel: 'Completed', date: '07 Mar 2026', customer: 'Rajesh Patel', colorClass: 'ai-green' },
  { id: 'WL-Q-0005', type: 'quotes', amount: '₹85,000', status: 'sent', statusLabel: 'Sent', date: '06 Mar 2026', customer: 'Sneha Kapoor', colorClass: 'ai-blue' },
  { id: 'WL-B-0088', type: 'bookings', amount: '₹6,10,852', status: 'converted', statusLabel: 'Active', date: '05 Mar 2026', customer: 'Rahul Sharma', colorClass: 'ai-green' },
];

export const demoTopCustomers = [
  { rank: 1, initials: 'VI', name: 'Vikram Iyer', id: 'WL-C-0003', bookings: 1, revenue: '₹4,69,900', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { rank: 2, initials: 'RP', name: 'Rajesh Patel', id: 'WL-C-0003', bookings: 1, revenue: '₹1,56,880', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { rank: 3, initials: 'RS', name: 'Rahul Sharma', id: 'WL-C-0001', bookings: 1, revenue: '₹1,40,952', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
];

export const demoQuoteDetailData = {
  'WL-Q-0001': {
    customerName: 'Rahul Sharma', customerId: 'WL-C-0001',
    customerPhone: '+91 99876 54321', customerEmail: 'rahul.sharma@email.com',
    destination: 'Bali, Indonesia', destType: 'International',
    tripDate: '15 Apr 2026', duration: '6 Nights / 7 Days',
    departure: 'N/A', returnDate: 'N/A', travelers: '2 Pax',
    createdDate: '09 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Seminyak Beach Resort — Bali', vendor: 'Bali Stays', cost: '₹72,000' },
      { type: 'transport', name: 'Airport Transfers (Round)', vendor: 'Bali Cabs',  cost: '₹18,000' },
      { type: 'activity',  name: 'Ubud Full Day Tour', vendor: 'Bali Tours', cost: '₹8,000' },
      { type: 'admission', name: 'Tanah Lot Temple', vendor: 'Bali Temples', cost: '₹2,000' },
    ],
    totalServiceCost: '₹1,00,000',
    fin: {
      costOfServices: '₹1,00,000', hiddenMarkup: '₹0', processingCharge: '₹18,000',
      costOfTravel: '₹1,00,000', processingCustomer: '₹18,000',
      gstRate: '18.00%', gstAmount: '₹3,240', cgst: '₹1,620', sgst: '₹1,620',
      invoiceValue: '₹1,21,240',
      profitProcessing: '₹18,000', profitTotal: '₹1,60,000', profitPct: '160.0%',
      packagePrice: '₹1,18,000',
      custCgst: '₹1,620', custSgst: '₹1,620', custInvoice: '₹1,21,240',
      totalPayable: '₹1,21,240',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '09 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '15 Apr 2026', items: [
        { type: 'transport', name: 'Ngurah Rai Airport → Seminyak', vehicle: 'Toyota Innova', from: '15 Apr 2026', to: '21 Apr 2026', cost: '₹18,000' },
        { type: 'hotel', name: 'Seminyak Beach Resort — Bali', rating: '5 Star', room: 'Ocean View', checkIn: '15 Apr 2026', checkOut: '21 Apr 2026', meals: 'EP', cost: '₹72,000' },
      ]},
      { day: 3, date: '17 Apr 2026', items: [
        { type: 'activity', name: 'Ubud Full Day Tour — Monkey Forest & Rice Terraces', location: 'Ubud', duration: 'Full Day', date: '17 Apr 2026', cost: '₹8,000' },
      ]},
      { day: 4, date: '18 Apr 2026', items: [
        { type: 'admission', name: 'Tanah Lot Temple', location: 'Bali', tickets: 2, date: '18 Apr 2026', cost: '₹2,000' },
      ]},
    ],
    inclusions: ['6 nights in beachside resort', 'All airport transfers', 'Ubud full day guided tour', 'Daily breakfast (EP)', 'Travel insurance'],
    exclusions: ['International airfare', 'Lunch & dinner', 'Personal expenses', 'Visa on arrival fees', 'Camera fees at temples'],
  },

  'WL-Q-0002': {
    customerName: 'Priya Mehta', customerId: 'WL-C-0002',
    customerPhone: '+91 98765 12345', customerEmail: 'priya.mehta@email.com',
    destination: 'Jaipur - Udaipur - Jodhpur', destType: 'Domestic',
    tripDate: '01 May 2026', duration: '7 Nights / 8 Days',
    departure: 'N/A', returnDate: 'N/A', travelers: '4 Pax',
    createdDate: '09 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Heritage Hotels (3 properties)', vendor: 'Various Heritage Hotels', cost: '₹56,000' },
      { type: 'transport', name: 'Cab / Transport (Full Trip)', vendor: 'Rajasthan Cabs', cost: '₹22,000' },
      { type: 'activity',  name: 'Activities (3 experiences)', vendor: 'Royal Tours', cost: '₹12,000' },
      { type: 'admission', name: 'Monument Entry Tickets (4 sites)', vendor: 'Monument tickets', cost: '₹4,000' },
    ],
    totalServiceCost: '₹94,000',
    fin: {
      costOfServices: '₹94,000', hiddenMarkup: '₹0', processingCharge: '₹14,000',
      costOfTravel: '₹94,000', processingCustomer: '₹14,000',
      gstRate: '18.00%', gstAmount: '₹2,520', cgst: '₹1,260', sgst: '₹1,260',
      invoiceValue: '₹1,10,520',
      profitProcessing: '₹14,000', profitTotal: '₹1,40,000', profitPct: '148.9%',
      packagePrice: '₹1,08,000',
      custCgst: '₹1,260', custSgst: '₹1,260', custInvoice: '₹1,10,520',
      totalPayable: '₹1,10,520',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '09 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '01 May 2026', items: [
        { type: 'transport', name: 'Jaipur Airport → Jodhpur Airport', vehicle: 'Innova', from: '01 May 2026', to: '08 May 2026', cost: '₹22,000' },
        { type: 'hotel', name: 'Nahargarh Haveli — Jaipur', rating: '4 Star', room: 'Double', checkIn: '01 May 2026', checkOut: '03 May 2026', meals: 'CP', cost: '₹18,000' },
        { type: 'admission', name: 'Amber Fort', location: 'Jaipur', tickets: 4, date: '01 May 2026', cost: '₹1,200' },
      ]},
      { day: 2, date: '02 May 2026', items: [
        { type: 'activity', name: 'Rajasthani Cooking Class', location: 'Jaipur', duration: '3 hrs', date: '02 May 2026', cost: '₹4,000' },
        { type: 'admission', name: 'Hawa Mahal', location: 'Jaipur', tickets: 4, date: '02 May 2026', cost: '₹800' },
      ]},
      { day: 3, date: '03 May 2026', items: [
        { type: 'hotel', name: 'Udai Kothi — Udaipur', rating: '4 Star', room: 'Deluxe', checkIn: '03 May 2026', checkOut: '06 May 2026', meals: 'CP', cost: '₹22,000' },
      ]},
      { day: 4, date: '04 May 2026', items: [
        { type: 'activity', name: 'Boat Ride Lake Pichola', location: 'Udaipur', duration: '2 hrs', date: '04 May 2026', cost: '₹3,000' },
        { type: 'admission', name: 'City Palace', location: 'Udaipur', tickets: 4, date: '04 May 2026', cost: '₹1,000' },
      ]},
      { day: 6, date: '06 May 2026', items: [
        { type: 'hotel', name: 'Raas Jodhpur — Jodhpur', rating: '5 Star', room: 'Suite', checkIn: '06 May 2026', checkOut: '08 May 2026', meals: 'CP', cost: '₹16,000' },
        { type: 'admission', name: 'Mehrangarh Fort', location: 'Jodhpur', tickets: 4, date: '06 May 2026', cost: '₹1,000' },
      ]},
      { day: 7, date: '07 May 2026', items: [
        { type: 'activity', name: 'Desert Safari & Camping', location: 'Jodhpur', duration: 'Full Day', date: '07 May 2026', cost: '₹5,000' },
      ]},
    ],
    inclusions: ['7 nights accommodation in heritage hotels', 'All transfers by AC Innova', 'Sightseeing as per itinerary', 'Monument entry tickets', 'Daily breakfast'],
    exclusions: ['Airfare / Train tickets', 'Lunch & dinner', 'Personal expenses', 'Camera fees at monuments'],
  },

  'WL-Q-0003': {
    customerName: 'Vikram Iyer', customerId: 'WL-C-0003',
    customerPhone: '+91 98456 78901', customerEmail: 'vikram.iyer@email.com',
    destination: 'Goa', destType: 'Domestic',
    tripDate: '20 Mar 2026', duration: '4 Nights / 5 Days',
    departure: '20 Mar 2026', returnDate: '25 Mar 2026', travelers: '12 Pax',
    createdDate: '09 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Taj Exotica Resort & Spa — Goa', vendor: 'Taj Hotels', cost: '₹2,88,000' },
      { type: 'transport', name: 'Fleet Transport (Full Trip)', vendor: 'Goa Cabs Network', cost: '₹65,000' },
      { type: 'activity',  name: 'Water Sports & Beach Activities', vendor: 'Goa Adventures', cost: '₹60,000' },
      { type: 'admission', name: 'Old Goa Churches & Spice Farm', vendor: 'Heritage Tours', cost: '₹12,000' },
    ],
    totalServiceCost: '₹4,25,000',
    fin: {
      costOfServices: '₹4,25,000', hiddenMarkup: '₹0', processingCharge: '₹30,000',
      costOfTravel: '₹4,25,000', processingCustomer: '₹30,000',
      gstRate: '18.00%', gstAmount: '₹5,400', cgst: '₹2,700', sgst: '₹2,700',
      invoiceValue: '₹4,60,400',
      profitProcessing: '₹30,000', profitTotal: '₹4,25,000', profitPct: '100.0%',
      packagePrice: '₹4,55,000',
      custCgst: '₹2,700', custSgst: '₹2,700', custInvoice: '₹4,60,400',
      totalPayable: '₹4,60,400',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '09 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '20 Mar 2026', items: [
        { type: 'transport', name: 'Goa Airport → Resort', vehicle: 'Tempo Traveller x 2', from: '20 Mar 2026', to: '25 Mar 2026', cost: '₹65,000' },
        { type: 'hotel', name: 'Taj Exotica Resort & Spa — Goa', rating: '5 Star', room: 'Deluxe Garden', checkIn: '20 Mar 2026', checkOut: '25 Mar 2026', meals: 'BB', cost: '₹2,88,000' },
      ]},
      { day: 2, date: '21 Mar 2026', items: [
        { type: 'activity', name: 'Water Sports Package — Calangute Beach', location: 'North Goa', duration: 'Full Day', date: '21 Mar 2026', cost: '₹48,000' },
      ]},
      { day: 3, date: '22 Mar 2026', items: [
        { type: 'admission', name: 'Old Goa Churches & Spice Farm Tour', location: 'Old Goa', tickets: 12, date: '22 Mar 2026', cost: '₹12,000' },
        { type: 'activity', name: 'Sunset Cruise — Mandovi River', location: 'Panaji', duration: '3 hrs', date: '22 Mar 2026', cost: '₹12,000' },
      ]},
    ],
    inclusions: ['4 nights in 5-star resort', 'All transfers by Tempo Traveller', 'Water sports package', 'Spice farm & heritage tour', 'Daily breakfast', 'Sunset river cruise'],
    exclusions: ['Airfare / Train tickets', 'Lunch & dinner', 'Personal shopping', 'Additional activities not listed'],
  },

  'WL-Q-0004': {
    customerName: 'Ananya Reddy', customerId: 'WL-C-0004',
    customerPhone: '+91 87654 32109', customerEmail: 'ananya.reddy@email.com',
    destination: 'Paris - Switzerland - Rome', destType: 'International',
    tripDate: '10 Jun 2026', duration: '10 Nights / 11 Days',
    departure: 'N/A', returnDate: 'N/A', travelers: '2 Pax',
    createdDate: '09 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Premium Hotels (3 cities)', vendor: 'European Hotels Collection', cost: '₹5,80,000' },
      { type: 'transport', name: 'Rail Pass + Transfers', vendor: 'EuroRail & Local Cabs', cost: '₹1,20,000' },
      { type: 'activity',  name: 'City Tours & Experiences', vendor: 'Europe Discovery Tours', cost: '₹80,000' },
      { type: 'admission', name: 'Museum & Attraction Passes', vendor: 'Heritage Sites Europe', cost: '₹12,000' },
    ],
    totalServiceCost: '₹7,92,000',
    fin: {
      costOfServices: '₹7,92,000', hiddenMarkup: '₹0', processingCharge: '₹60,000',
      costOfTravel: '₹7,92,000', processingCustomer: '₹60,000',
      gstRate: '18.00%', gstAmount: '₹10,800', cgst: '₹5,400', sgst: '₹5,400',
      invoiceValue: '₹8,62,800',
      profitProcessing: '₹60,000', profitTotal: '₹7,92,000', profitPct: '100.0%',
      packagePrice: '₹8,52,000',
      custCgst: '₹5,400', custSgst: '₹5,400', custInvoice: '₹8,62,800',
      totalPayable: '₹8,62,800',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '09 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '10 Jun 2026', items: [
        { type: 'transport', name: 'CDG Airport → Paris Hotel', vehicle: 'Private Car', from: '10 Jun 2026', to: '21 Jun 2026', cost: '₹1,20,000' },
        { type: 'hotel', name: 'Hotel Le Marais — Paris', rating: '4 Star', room: 'Superior Double', checkIn: '10 Jun 2026', checkOut: '14 Jun 2026', meals: 'BB', cost: '₹2,20,000' },
      ]},
      { day: 2, date: '11 Jun 2026', items: [
        { type: 'activity', name: 'Paris City Tour with Eiffel Tower', location: 'Paris', duration: 'Full Day', date: '11 Jun 2026', cost: '₹40,000' },
        { type: 'admission', name: 'Louvre Museum & Versailles Palace', location: 'Paris', tickets: 2, date: '12 Jun 2026', cost: '₹6,000' },
      ]},
      { day: 5, date: '14 Jun 2026', items: [
        { type: 'hotel', name: 'Hotel Schweizerhof — Interlaken', rating: '5 Star', room: 'Mountain View', checkIn: '14 Jun 2026', checkOut: '18 Jun 2026', meals: 'BB', cost: '₹2,80,000' },
        { type: 'activity', name: 'Jungfrau & Swiss Alps Day Tour', location: 'Interlaken', duration: 'Full Day', date: '15 Jun 2026', cost: '₹24,000' },
      ]},
      { day: 9, date: '18 Jun 2026', items: [
        { type: 'hotel', name: 'Hotel Hassler — Rome', rating: '5 Star', room: 'Deluxe', checkIn: '18 Jun 2026', checkOut: '21 Jun 2026', meals: 'BB', cost: '₹80,000' },
        { type: 'admission', name: 'Vatican Museums & Colosseum', location: 'Rome', tickets: 2, date: '19 Jun 2026', cost: '₹6,000' },
        { type: 'activity', name: 'Rome Food & History Walking Tour', location: 'Rome', duration: '4 hrs', date: '20 Jun 2026', cost: '₹16,000' },
      ]},
    ],
    inclusions: ['10 nights in premium hotels', 'All inter-city rail travel', 'Airport transfers', 'Daily breakfast', 'Guided city tours', 'Museum & attraction passes'],
    exclusions: ['International airfare', 'Lunch & dinner', 'Personal shopping', 'Travel insurance', 'Visa fees'],
  },

  'WL-Q-0005': {
    customerName: 'Rajesh Patel', customerId: 'WL-C-0005',
    customerPhone: '+91 97654 32100', customerEmail: 'rajesh.patel@email.com',
    destination: 'Srinagar - Gulmarg - Pahalgam', destType: 'Domestic',
    tripDate: '05 Apr 2026', duration: '5 Nights / 6 Days',
    departure: '05 Apr 2026', returnDate: '10 Apr 2026', travelers: '6 Pax',
    createdDate: '09 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Houseboat & Resorts (3 stays)', vendor: 'Kashmir Heritage Stays', cost: '₹95,000' },
      { type: 'transport', name: 'Cab & Pony Rides', vendor: 'Kashmir Cabs', cost: '₹28,000' },
      { type: 'activity',  name: 'Shikara Ride & Adventure Sports', vendor: 'Dal Lake Tours', cost: '₹18,000' },
      { type: 'admission', name: 'Mughal Gardens Entry Tickets', vendor: 'ASI Tickets', cost: '₹3,000' },
    ],
    totalServiceCost: '₹1,44,000',
    fin: {
      costOfServices: '₹1,44,000', hiddenMarkup: '₹0', processingCharge: '₹8,000',
      costOfTravel: '₹1,44,000', processingCustomer: '₹8,000',
      gstRate: '18.00%', gstAmount: '₹1,440', cgst: '₹720', sgst: '₹720',
      invoiceValue: '₹1,53,440',
      profitProcessing: '₹8,000', profitTotal: '₹1,44,000', profitPct: '100.0%',
      packagePrice: '₹1,52,000',
      custCgst: '₹720', custSgst: '₹720', custInvoice: '₹1,53,440',
      totalPayable: '₹1,53,440',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '09 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '05 Apr 2026', items: [
        { type: 'transport', name: 'Srinagar Airport → Dal Lake Houseboat', vehicle: 'Innova Crysta', from: '05 Apr 2026', to: '10 Apr 2026', cost: '₹28,000' },
        { type: 'hotel', name: 'Deluxe Houseboat — Dal Lake', rating: '4 Star', room: 'Deluxe Suite', checkIn: '05 Apr 2026', checkOut: '07 Apr 2026', meals: 'CP', cost: '₹32,000' },
        { type: 'activity', name: 'Shikara Ride — Dal Lake', location: 'Srinagar', duration: '2 hrs', date: '05 Apr 2026', cost: '₹6,000' },
      ]},
      { day: 3, date: '07 Apr 2026', items: [
        { type: 'hotel', name: 'Highlands Park Hotel — Gulmarg', rating: '4 Star', room: 'Standard', checkIn: '07 Apr 2026', checkOut: '09 Apr 2026', meals: 'CP', cost: '₹38,000' },
        { type: 'activity', name: 'Gondola Ride — Gulmarg', location: 'Gulmarg', duration: 'Half Day', date: '07 Apr 2026', cost: '₹12,000' },
        { type: 'admission', name: 'Mughal Gardens (Shalimar, Nishat)', location: 'Srinagar', tickets: 6, date: '08 Apr 2026', cost: '₹3,000' },
      ]},
      { day: 5, date: '09 Apr 2026', items: [
        { type: 'hotel', name: 'Pahalgam Hotel — Pahalgam', rating: '3 Star', room: 'Standard', checkIn: '09 Apr 2026', checkOut: '10 Apr 2026', meals: 'CP', cost: '₹25,000' },
      ]},
    ],
    inclusions: ['5 nights accommodation (houseboat + resorts)', 'All cab transfers & pony rides', 'Shikara ride on Dal Lake', 'Gondola ride in Gulmarg', 'Mughal Gardens entry', 'Daily breakfast'],
    exclusions: ['Airfare / Train tickets', 'Lunch & dinner', 'Personal expenses', 'Horse rides in Pahalgam (optional extra)'],
  },

  'WL-Q-0006': {
    customerName: 'Arjun Singh', customerId: 'WL-C-0006',
    customerPhone: '+91 91234 56789', customerEmail: 'arjun.singh@email.com',
    destination: 'Leh - Ladakh', destType: 'Domestic',
    tripDate: '22 May 2026', duration: '6 Nights / 7 Days',
    departure: '22 May 2026', returnDate: '28 May 2026', travelers: '4 Pax',
    createdDate: '10 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Boutique Camps & Guesthouses', vendor: 'Ladakh Stays', cost: '₹42,000' },
      { type: 'transport', name: 'SUV Transfers & Bike Rentals', vendor: 'Ladakh Rides', cost: '₹20,000' },
      { type: 'activity',  name: 'Trekking & River Rafting', vendor: 'Adventure Ladakh', cost: '₹12,000' },
      { type: 'admission', name: 'Monasteries & Permits', vendor: 'Leh Tourism', cost: '₹3,000' },
    ],
    totalServiceCost: '₹77,000',
    fin: {
      costOfServices: '₹77,000', hiddenMarkup: '₹0', processingCharge: '₹0',
      costOfTravel: '₹77,000', processingCustomer: '₹0',
      gstRate: '18.00%', gstAmount: '₹0', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹77,000',
      profitProcessing: '₹0', profitTotal: '₹77,000', profitPct: '100.0%',
      packagePrice: '₹77,000',
      custCgst: '₹0', custSgst: '₹0', custInvoice: '₹77,000',
      totalPayable: '₹77,000',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '10 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '22 May 2026', items: [
        { type: 'transport', name: 'Leh Airport → Hotel', vehicle: 'Innova', from: '22 May 2026', to: '28 May 2026', cost: '₹20,000' },
        { type: 'hotel', name: 'The Grand Dragon — Leh', rating: '4 Star', room: 'Deluxe', checkIn: '22 May 2026', checkOut: '25 May 2026', meals: 'CP', cost: '₹28,000' },
      ]},
      { day: 2, date: '23 May 2026', items: [
        { type: 'admission', name: 'Thiksey & Hemis Monastery', location: 'Leh', tickets: 4, date: '23 May 2026', cost: '₹1,200' },
        { type: 'activity', name: 'River Rafting — Zanskar River', location: 'Leh', duration: '3 hrs', date: '24 May 2026', cost: '₹8,000' },
      ]},
      { day: 4, date: '25 May 2026', items: [
        { type: 'hotel', name: 'Pangong Lake Camp — Spangmik', rating: '3 Star', room: 'Luxury Tent', checkIn: '25 May 2026', checkOut: '27 May 2026', meals: 'CP', cost: '₹14,000' },
        { type: 'admission', name: 'Pangong Lake Entry Permits', location: 'Ladakh', tickets: 4, date: '25 May 2026', cost: '₹1,800' },
        { type: 'activity', name: 'Nubra Valley & Dunes Trek', location: 'Nubra', duration: 'Full Day', date: '26 May 2026', cost: '₹4,000' },
      ]},
    ],
    inclusions: ['6 nights accommodation (hotel + camp)', 'All SUV transfers', 'River rafting session', 'Nubra Valley trek', 'Monastery entry fees', 'Daily breakfast'],
    exclusions: ['Airfare / Train tickets', 'Lunch & dinner', 'Inner Line Permits (extra)', 'Personal equipment'],
  },

  'WL-Q-0007': {
    customerName: 'Kavita Sharma', customerId: null,
    customerPhone: '+91 99988 77766', customerEmail: 'kavita.sharma@email.com',
    destination: 'Dubai', destType: 'International',
    tripDate: '10 Apr 2026', duration: '4 Nights / 5 Days',
    departure: 'N/A', returnDate: 'N/A', travelers: '3 Pax',
    createdDate: '08 Mar 2026',
    services: [
      { type: 'hotel',     name: 'Jumeirah Beach Hotel — Dubai', vendor: 'Jumeirah Group', cost: '₹1,50,000' },
      { type: 'transport', name: 'Airport & City Transfers', vendor: 'Dubai Cabs', cost: '₹30,000' },
      { type: 'activity',  name: 'Desert Safari & Burj Khalifa', vendor: 'Dubai Tourism', cost: '₹40,000' },
      { type: 'admission', name: 'Attraction Passes', vendor: 'Dubai Parks', cost: '₹15,000' },
    ],
    totalServiceCost: '₹2,35,000',
    fin: {
      costOfServices: '₹2,35,000', hiddenMarkup: '₹0', processingCharge: '₹0',
      costOfTravel: '₹2,35,000', processingCustomer: '₹0',
      gstRate: '18.00%', gstAmount: '₹0', cgst: '₹0', sgst: '₹0',
      invoiceValue: '₹2,35,000',
      profitProcessing: '₹0', profitTotal: '₹2,35,000', profitPct: '100.0%',
      packagePrice: '₹2,35,000',
      custCgst: '₹0', custSgst: '₹0', custInvoice: '₹2,35,000',
      totalPayable: '₹2,35,000',
      inputMode: 'Margin', billingModel: 'pure_agent', quoteDate: '08 Mar 2026',
    },
    itinerary: [
      { day: 1, date: '10 Apr 2026', items: [
        { type: 'transport', name: 'DXB Airport → Jumeirah Beach Hotel', vehicle: 'Business Sedan', from: '10 Apr 2026', to: '15 Apr 2026', cost: '₹30,000' },
        { type: 'hotel', name: 'Jumeirah Beach Hotel — Dubai', rating: '5 Star', room: 'Sea View', checkIn: '10 Apr 2026', checkOut: '15 Apr 2026', meals: 'BB', cost: '₹1,50,000' },
      ]},
      { day: 2, date: '11 Apr 2026', items: [
        { type: 'activity', name: 'Burj Khalifa At The Top Experience', location: 'Downtown Dubai', duration: '3 hrs', date: '11 Apr 2026', cost: '₹18,000' },
        { type: 'admission', name: 'Dubai Mall & Dubai Fountain Show', location: 'Dubai', tickets: 3, date: '11 Apr 2026', cost: '₹6,000' },
      ]},
      { day: 3, date: '12 Apr 2026', items: [
        { type: 'activity', name: 'Desert Safari with BBQ Dinner', location: 'Dubai Desert', duration: 'Full Day', date: '12 Apr 2026', cost: '₹22,000' },
        { type: 'admission', name: 'Dubai Frame & Old Souk', location: 'Dubai', tickets: 3, date: '13 Apr 2026', cost: '₹9,000' },
      ]},
    ],
    inclusions: ['4 nights in 5-star beachfront resort', 'All transfers', 'Desert safari with BBQ', 'Burj Khalifa tickets', 'Attraction passes', 'Daily breakfast'],
    exclusions: ['International airfare', 'Lunch & dinner', 'Personal shopping', 'Visa on arrival fees'],
  },
};

export const demoProfileQuotes = [
  { id: 'WL-Q-0001', customerName: 'Rahul Sharma', destName: 'Bali, Indonesia', destType: 'international', amount: '₹1,40,952', profit: '₹18,000', status: 'converted', tripDate: '15 Apr 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0002', customerName: 'Priya Mehta', destName: 'Jaipur - Udaipur - Jodhpur', destType: 'domestic', amount: '₹1,10,520', profit: '₹14,000', status: 'sent', tripDate: '01 May 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0003', customerName: 'Vikram Iyer', destName: 'Goa', destType: 'domestic', amount: '₹4,69,900', profit: '₹55,000', status: 'converted', tripDate: '20 Mar 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0004', customerName: 'Ananya Reddy', destName: 'Paris - Switzerland - Rome', destType: 'international', amount: '₹8,92,400', profit: '₹1,05,000', status: 'draft', tripDate: '10 Jun 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0005', customerName: 'Rajesh Patel', destName: 'Srinagar - Gulmarg - Pahalgam', destType: 'domestic', amount: '₹1,56,880', profit: '₹16,000', status: 'converted', tripDate: '05 Apr 2026', createdDate: '09 Mar 2026' },
  { id: 'WL-Q-0006', customerName: 'Arjun Singh', destName: 'Leh - Ladakh', destType: 'domestic', amount: '₹78,500', profit: '₹9,500', status: 'approved', tripDate: '22 May 2026', createdDate: '10 Mar 2026' },
];
