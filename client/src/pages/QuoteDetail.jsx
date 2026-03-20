import React, { useState } from 'react';
import { customers } from '../components/CustomersTable';
import { openCustomerProfile } from '../utils/customerNav';

// ─── Demo Modal ────────────────────────────────────────────────────────────────
const DemoModal = ({ onClose }) => (
  <div className="demo-modal-overlay" onClick={onClose}>
    <div className="demo-modal" onClick={e => e.stopPropagation()}>
      <div className="demo-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h3>Demo Account</h3>
      <p>This is a demo account. Changes cannot be made.</p>
      <button className="demo-modal-btn" onClick={onClose}>OK, Got it</button>
    </div>
  </div>
);

// ─── Service Icons ──────────────────────────────────────────────────────────
const HotelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"/>
  </svg>
);
const TransportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const ActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const AdmissionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
  </svg>
);

const SERVICE_CFG = {
  hotel:     { color: '#16a34a', bg: '#f0fdf4', icon: <HotelIcon /> },
  transport: { color: '#ea580c', bg: '#fff7ed', icon: <TransportIcon /> },
  activity:  { color: '#7c3aed', bg: '#faf5ff', icon: <ActivityIcon /> },
  admission: { color: '#e11d48', bg: '#fff1f2', icon: <AdmissionIcon /> },
};

// ─── Full Quote Detail Data ────────────────────────────────────────────────────
const quoteDetailData = {
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

// ─── ItineraryItem Renderer ────────────────────────────────────────────────────
const ItinItem = ({ item }) => {
  const cfg = SERVICE_CFG[item.type] || SERVICE_CFG.activity;
  return (
    <div className="qd-itin-item" style={{ background: cfg.bg }}>
      <div className="qd-itin-title" style={{ color: cfg.color }}>
        <span className="qd-itin-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
        {item.name}
      </div>
      <div className="qd-itin-fields">
        {item.type === 'hotel' && (<>
          <div className="qd-itin-field"><span className="qd-itin-fl">Rating</span><span className="qd-itin-fv">{item.rating}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Room</span><span className="qd-itin-fv">{item.room}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Check-in</span><span className="qd-itin-fv">{item.checkIn}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Check-out</span><span className="qd-itin-fv">{item.checkOut}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Meals</span><span className="qd-itin-fv">{item.meals}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Cost</span><span className="qd-itin-fv">{item.cost}</span></div>
        </>)}
        {item.type === 'transport' && (<>
          <div className="qd-itin-field"><span className="qd-itin-fl">Vehicle</span><span className="qd-itin-fv">{item.vehicle}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">From</span><span className="qd-itin-fv">{item.from}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">To</span><span className="qd-itin-fv">{item.to}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Cost</span><span className="qd-itin-fv">{item.cost}</span></div>
        </>)}
        {item.type === 'activity' && (<>
          <div className="qd-itin-field"><span className="qd-itin-fl">Location</span><span className="qd-itin-fv">{item.location}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Duration</span><span className="qd-itin-fv">{item.duration}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Date</span><span className="qd-itin-fv">{item.date}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Cost</span><span className="qd-itin-fv">{item.cost}</span></div>
        </>)}
        {item.type === 'admission' && (<>
          <div className="qd-itin-field"><span className="qd-itin-fl">Location</span><span className="qd-itin-fv">{item.location}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Tickets</span><span className="qd-itin-fv">{item.tickets}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Date</span><span className="qd-itin-fv">{item.date}</span></div>
          <div className="qd-itin-field"><span className="qd-itin-fl">Cost</span><span className="qd-itin-fv">{item.cost}</span></div>
        </>)}
      </div>
    </div>
  );
};

// ─── Main QuoteDetail Component ───────────────────────────────────────────────
export const QuoteDetail = ({ quoteId, fromView, onBack }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const demo = () => setShowDemoModal(true);

  const detail = quoteDetailData[quoteId];
  if (!detail) return null;

  const customer = customers.find(c => c.name === detail.customerName);
  const fin = detail.fin;

  const statusColors = {
    draft:     'status-draft',
    sent:      'status-sent',
    approved:  'status-approved',
    converted: 'status-converted',
    rejected:  'status-rejected',
  };

  // Determine quote status from the global quotes data
  const initialQuotes = [
    { id: 'WL-Q-0001', status: 'converted' },
    { id: 'WL-Q-0002', status: 'sent' },
    { id: 'WL-Q-0003', status: 'converted' },
    { id: 'WL-Q-0004', status: 'draft' },
    { id: 'WL-Q-0005', status: 'converted' },
    { id: 'WL-Q-0006', status: 'approved' },
    { id: 'WL-Q-0007', status: 'rejected' },
  ];
  const quoteStatus = initialQuotes.find(q => q.id === quoteId)?.status || 'draft';

  return (
    <div id="view-quote-detail" className="fade-in">

      {/* ── Page Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">{quoteId}</h1>
            <p className="page-subtitle">Created on {detail.createdDate}</p>
          </div>
          <div className="dash-header-right">
            <button className="cp-back-btn" onClick={onBack}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <button className="icon-btn" onClick={demo} title="Export">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </button>
            <div className="header-user">
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qd-body">

        {/* ── Quote Summary Card ── */}
        <div className="qd-summary-card">
          <div className="qd-summary-top">
            <div className="qd-summary-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="qd-summary-info">
              <div className="qd-summary-id-row">
                <span className="qd-summary-id">{quoteId}</span>
                <span className={`status-pill ${statusColors[quoteStatus] || 'status-draft'}`}>
                  {quoteStatus.charAt(0).toUpperCase() + quoteStatus.slice(1)}
                </span>
              </div>
              <p className="qd-summary-sub">{detail.destType} · {detail.destination}</p>
            </div>
          </div>

          <div className="qd-action-bar">
            <button className="qd-btn qd-btn-approve" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Approve
            </button>
            <button className="qd-btn qd-btn-reject" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Reject
            </button>
            <button className="qd-btn qd-btn-edit" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              Edit Quote
            </button>
            <button className="qd-btn qd-btn-pdf" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Agent PDF
            </button>
            <button className="qd-btn qd-btn-pdf" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Customer PDF
            </button>
            <button className="qd-btn qd-btn-cost" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              Cost breakdown
            </button>
            <div className="qd-btn-itin-group">
              <button className="qd-btn qd-btn-itin" onClick={demo}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Itinerary
              </button>
              <button className="qd-btn qd-btn-itin qd-btn-itin-caret" onClick={demo}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
            <button className="qd-btn qd-btn-share" onClick={demo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>

        {/* ── Customer + Travel Details ── */}
        <div className="qd-two-col">
          {/* Customer Card */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              CUSTOMER
            </div>
            <div className="qd-customer-hero">
              <div className="qd-customer-avatar" style={{ background: customer?.gradient || 'linear-gradient(135deg,#F47D5B,#e05c38)' }}>
                {customer?.initials || detail.customerName.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <p className="qd-customer-name">{detail.customerName}</p>
                {customer && (
                  <span className="qd-view-profile" onClick={() => openCustomerProfile(customer.id, 'quote-detail')}>
                    View Profile
                  </span>
                )}
              </div>
            </div>
            <div className="qd-contact-rows">
              <div className="qd-contact-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {detail.customerPhone}
              </div>
              <div className="qd-contact-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {detail.customerEmail}
              </div>
            </div>
          </div>

          {/* Travel Details Card */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              TRAVEL DETAILS
            </div>
            <div className="qd-travel-grid">
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div><span className="qd-tf-label">DESTINATION</span><span className="qd-tf-value">{detail.destination}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/></svg>
                <div><span className="qd-tf-label">TYPE</span><span className="qd-tf-value">{detail.destType}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">TRAVEL DATE</span><span className="qd-tf-value">{detail.tripDate}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div><span className="qd-tf-label">DURATION</span><span className="qd-tf-value">{detail.duration}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">DEPARTURE</span><span className="qd-tf-value">{detail.departure}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div><span className="qd-tf-label">RETURN</span><span className="qd-tf-value">{detail.returnDate}</span></div>
              </div>
              <div className="qd-travel-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <div><span className="qd-tf-label">TRAVELERS</span><span className="qd-tf-value">{detail.travelers}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Services & Costs + Financial Summary ── */}
        <div className="qd-two-col-6-4">
          {/* Services & Costs */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              SERVICES &amp; COSTS
            </div>
            <div className="qd-service-list">
              {detail.services.map((svc, i) => {
                const cfg = SERVICE_CFG[svc.type] || SERVICE_CFG.activity;
                return (
                  <div key={i} className="qd-service-item">
                    <div className="qd-service-icon" style={{ background: cfg.bg, color: cfg.color }}>{cfg.icon}</div>
                    <div className="qd-service-info">
                      <span className="qd-service-name">{svc.name}</span>
                      <span className="qd-service-vendor">Vendor: {svc.vendor}</span>
                    </div>
                    <span className="qd-service-cost">{svc.cost}</span>
                  </div>
                );
              })}
              <div className="qd-service-total">
                <span>Total Service Cost</span>
                <span>{detail.totalServiceCost}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="qd-card">
            <div className="qd-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              FINANCIAL SUMMARY
            </div>

            {/* Agent View */}
            <div className="qd-fin-agent-label">
              ACTUAL (AGENT VIEW)
              <span className="info-btn" title="Agent view shows full cost breakdown">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
            </div>
            <div className="qd-fin-rows">
              <div className="qd-fin-row">
                <span>Cost of Services <span className="info-btn" title=""><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></span>
                <span>{fin.costOfServices}</span>
              </div>
              <div className="qd-fin-row">
                <span>Hidden Markup</span><span>{fin.hiddenMarkup}</span>
              </div>
              <div className="qd-fin-row">
                <span>Processing Charge (excl GST)</span><span>{fin.processingCharge}</span>
              </div>
              <div className="qd-fin-divider" />
              <div className="qd-fin-row">
                <span>Cost of Travel (customer sees)</span><span>{fin.costOfTravel}</span>
              </div>
              <div className="qd-fin-row">
                <span>Processing Charge (customer sees)</span><span>{fin.processingCustomer}</span>
              </div>
              <div className="qd-fin-row">
                <span>GST @{fin.gstRate} (on full value)</span><span>{fin.gstAmount}</span>
              </div>
              <div className="qd-fin-row qd-fin-row-sub">
                <span>CGST @9%</span><span>{fin.cgst}</span>
              </div>
              <div className="qd-fin-row qd-fin-row-sub">
                <span>SGST @9%</span><span>{fin.sgst}</span>
              </div>
              <div className="qd-fin-row qd-fin-row-bold">
                <span>Invoice Value</span><span>{fin.invoiceValue}</span>
              </div>
            </div>

            {/* Profit Box */}
            <div className="qd-profit-box">
              <div className="qd-profit-header">
                <span>Your Profit <span className="info-btn" title=""><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <div className="qd-fin-row" style={{paddingLeft:0, paddingRight:0}}>
                <span>Processing Charge</span><span>{fin.profitProcessing}</span>
              </div>
              <div className="qd-profit-total">
                <span>Total Profit ({fin.profitPct})</span>
                <span className="qd-profit-amount">{fin.profitTotal}</span>
              </div>
            </div>

            {/* Customer Invoice */}
            <div className="qd-fin-agent-label" style={{marginTop:16}}>CUSTOMER INVOICE</div>
            <div className="qd-fin-rows">
              <div className="qd-fin-row">
                <span>Package Price</span><span>{fin.packagePrice}</span>
              </div>
              <div className="qd-fin-row">
                <span>CGST @9%</span><span>{fin.custCgst}</span>
              </div>
              <div className="qd-fin-row">
                <span>SGST @9%</span><span>{fin.custSgst}</span>
              </div>
              <div className="qd-fin-row qd-fin-row-bold">
                <span>Invoice Value</span><span>{fin.custInvoice}</span>
              </div>
              <div className="qd-fin-payable">
                <span>Total Payable</span><span>{fin.totalPayable}</span>
              </div>
              <div className="qd-fin-divider" />
              <div className="qd-fin-meta">
                <span className="qd-fin-meta-label">Input Mode <span className="info-btn" title=""><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span></span>
                <span className="qd-fin-meta-val">{fin.inputMode}</span>
              </div>
              <div className="qd-fin-meta">
                <span className="qd-fin-meta-label">Billing Model</span>
                <span className="qd-fin-meta-val">{fin.billingModel}</span>
              </div>
              <div className="qd-fin-meta">
                <span className="qd-fin-meta-label">Quote Date</span>
                <span className="qd-fin-meta-val">{fin.quoteDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Itinerary ── */}
        {detail.itinerary && detail.itinerary.length > 0 && (
          <div className="qd-card">
            <div className="qd-card-title" style={{color:'var(--accent)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              ITINERARY
            </div>
            <div className="qd-itin-list">
              {detail.itinerary.map((dayGroup, di) => (
                <div key={di} className="qd-day-group">
                  <div className="qd-day-header">
                    <div className="qd-day-badge">{dayGroup.day}</div>
                    <span className="qd-day-date">{dayGroup.date.toUpperCase()}</span>
                  </div>
                  <div className="qd-day-items">
                    {dayGroup.items.map((item, ii) => (
                      <ItinItem key={ii} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Inclusions + Exclusions ── */}
        <div className="qd-incl-excl-grid">
          <div className="qd-incl-card">
            <div className="qd-incl-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              INCLUSIONS
            </div>
            <div className="qd-incl-list">
              {detail.inclusions.map((item, i) => (
                <p key={i} className="qd-list-item">- {item}</p>
              ))}
            </div>
          </div>
          <div className="qd-excl-card">
            <div className="qd-excl-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              EXCLUSIONS
            </div>
            <div className="qd-incl-list">
              {detail.exclusions.map((item, i) => (
                <p key={i} className="qd-list-item">- {item}</p>
              ))}
            </div>
          </div>
        </div>

      </div>

      {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
    </div>
  );
};

export default QuoteDetail;
