-- ═══════════════════════════════════════════════════════════════════════
-- VENDOR MODULE — Supabase Table Definitions
-- Run this in your Supabase SQL editor
-- ═══════════════════════════════════════════════════════════════════════

-- ── DEMO VENDORS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  vendor_code TEXT DEFAULT '',
  city TEXT DEFAULT '',
  contact_person TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  gst_number TEXT DEFAULT '',
  pan_number TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  bank_account TEXT DEFAULT '',
  ifsc_code TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEMO VENDOR BILLS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_vendor_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES demo_vendors(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES demo_bookings(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL DEFAULT 'other',
  service_date DATE,
  gross_amount NUMERIC(12,2) DEFAULT 0,
  commission_amount NUMERIC(12,2) DEFAULT 0,
  tds_receivable NUMERIC(12,2) DEFAULT 0,
  processing_fee NUMERIC(12,2) DEFAULT 0,
  vendor_gst_cgst NUMERIC(12,2) DEFAULT 0,
  vendor_gst_sgst NUMERIC(12,2) DEFAULT 0,
  round_off NUMERIC(12,2) DEFAULT 0,
  net_payable NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  service_details JSONB DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEMO VENDOR PAYMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES demo_vendors(id) ON DELETE SET NULL,
  bill_id UUID REFERENCES demo_vendor_bills(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) DEFAULT 0,
  payment_mode TEXT DEFAULT 'bank_transfer',
  payment_date DATE DEFAULT CURRENT_DATE,
  reference TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL VENDORS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  vendor_code TEXT DEFAULT '',
  city TEXT DEFAULT '',
  contact_person TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  gst_number TEXT DEFAULT '',
  pan_number TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  bank_account TEXT DEFAULT '',
  ifsc_code TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL VENDOR BILLS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_vendor_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES real_vendors(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES real_bookings(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL DEFAULT 'other',
  service_date DATE,
  gross_amount NUMERIC(12,2) DEFAULT 0,
  commission_amount NUMERIC(12,2) DEFAULT 0,
  tds_receivable NUMERIC(12,2) DEFAULT 0,
  processing_fee NUMERIC(12,2) DEFAULT 0,
  vendor_gst_cgst NUMERIC(12,2) DEFAULT 0,
  vendor_gst_sgst NUMERIC(12,2) DEFAULT 0,
  round_off NUMERIC(12,2) DEFAULT 0,
  net_payable NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  service_details JSONB DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL VENDOR PAYMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES real_vendors(id) ON DELETE SET NULL,
  bill_id UUID REFERENCES real_vendor_bills(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) DEFAULT 0,
  payment_mode TEXT DEFAULT 'bank_transfer',
  payment_date DATE DEFAULT CURRENT_DATE,
  reference TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════
-- DEMO SEED DATA
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO demo_vendors (id, name, vendor_code, city, contact_person, phone, email, gst_number, pan_number, bank_name, bank_account, ifsc_code, notes) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'IndiGo Airlines', 'VND-0001', 'New Delhi', 'Ravi Kumar', '+91 98800 11111', 'ravi@indigo.in', '07AABCI1234A1ZX', 'AABCI1234A', 'HDFC Bank', '50200012345678', 'HDFC0000001', 'Main flight vendor'),
  ('a1000000-0000-0000-0000-000000000002', 'Goa Beach Resort', 'VND-0002', 'Goa', 'Sunita Rao', '+91 98200 22222', 'sunita@goabeach.com', '30AABCG5678B1ZY', 'AABCG5678B', 'ICICI Bank', '627301234567', 'ICIC0000627', 'Premium beach property'),
  ('a1000000-0000-0000-0000-000000000003', 'Royal Cabs Mumbai', 'VND-0003', 'Mumbai', 'Ajay Thakur', '+91 99000 33333', 'ajay@royalcabs.com', '27AABCR9012C1ZZ', 'AABCR9012C', 'SBI', '30127890123', 'SBIN0001234', 'Airport transfers + city tours'),
  ('a1000000-0000-0000-0000-000000000004', 'Bali Holiday DMC', 'VND-0004', 'Bali', 'Wayan Sari', '+62 811 234567', 'wayan@balholiday.com', '', '', 'HDFC Bank', '50200099887766', 'HDFC0001234', 'Destination management company for Bali'),
  ('a1000000-0000-0000-0000-000000000005', 'Kashmir Valley Tours', 'VND-0005', 'Srinagar', 'Farooq Ahmed', '+91 94191 55555', 'farooq@kashmirtours.com', '01AABCK4567D1ZW', 'AABCK4567D', 'J&K Bank', '0701010012345', 'JAKA0MAHRAJ', 'Ground operator in Kashmir')
ON CONFLICT (id) DO NOTHING;

INSERT INTO demo_vendor_bills (bill_number, vendor_id, service_type, service_date, gross_amount, commission_amount, tds_receivable, processing_fee, vendor_gst_cgst, vendor_gst_sgst, round_off, net_payable, status, service_details, notes) VALUES
  ('VB-2026-001', 'a1000000-0000-0000-0000-000000000001', 'flight', '2026-04-15', 52000, 3120, 520, 0, 0, 0, 0, 48360, 'unpaid', '{"sector":"BOM-DPS","pnr":"6XYZAB","airline":"IndiGo","class":"Economy","departure":"2026-04-15 08:00","arrival":"2026-04-15 18:30","paxCount":2}', 'Bali trip flights'),
  ('VB-2026-002', 'a1000000-0000-0000-0000-000000000002', 'hotel', '2026-04-15', 85000, 8500, 850, 500, 2700, 2700, -50, 81600, 'unpaid', '{"hotelName":"Goa Beach Resort","city":"Goa","checkIn":"2026-03-20","checkOut":"2026-03-25","roomType":"Sea View Deluxe","nights":5,"guests":3}', 'Vikram Iyer group stay'),
  ('VB-2026-003', 'a1000000-0000-0000-0000-000000000003', 'cab', '2026-04-15', 18000, 0, 0, 300, 810, 810, 80, 19000, 'paid', '{"route":"Mumbai Airport → Hotel → Sightseeing → Airport","cabType":"Innova Crysta","pickupTime":"2026-03-20 06:00","dropTime":"2026-03-25 11:00","driver":"Suresh Yadav","distance":"320 km"}', 'Vikram Iyer cab transfers'),
  ('VB-2026-004', 'a1000000-0000-0000-0000-000000000004', 'hotel', '2026-04-16', 110000, 11000, 1100, 0, 0, 0, 0, 97900, 'unpaid', '{"hotelName":"Alaya Ubud","city":"Ubud, Bali","checkIn":"2026-04-15","checkOut":"2026-04-21","roomType":"Pool Villa","nights":6,"guests":2}', 'Rahul Sharma Bali villa'),
  ('VB-2026-005', 'a1000000-0000-0000-0000-000000000005', 'other', '2026-04-05', 62000, 0, 620, 0, 2790, 2790, -60, 66900, 'partial', '{"serviceName":"Kashmir Ground Package","description":"Gulmarg + Pahalgam 5N6D all inclusive - transport, guide, houseboat","quantity":1}', 'Rajesh Patel Kashmir ground'),
  ('VB-2026-006', 'a1000000-0000-0000-0000-000000000001', 'flight', '2026-05-01', 28000, 1680, 280, 0, 0, 0, 0, 26040, 'unpaid', '{"sector":"DEL-SXR-DEL","pnr":"7ABCDE","airline":"IndiGo","class":"Economy","departure":"2026-04-05 07:30","arrival":"2026-04-05 09:00","paxCount":2}', 'Kashmir flights for Rajesh')
ON CONFLICT (bill_number) DO NOTHING;

INSERT INTO demo_vendor_payments (payment_number, vendor_id, amount, payment_mode, payment_date, reference, bank_name, notes) VALUES
  ('VP-2026-001', 'a1000000-0000-0000-0000-000000000003', 19000, 'bank_transfer', '2026-03-25', 'NEFT/2026/03/HDFC987654', 'HDFC Bank', 'Full settlement for Vikram Iyer cab'),
  ('VP-2026-002', 'a1000000-0000-0000-0000-000000000005', 40000, 'bank_transfer', '2026-03-22', 'IMPS/2026/03/SBIN112233', 'SBI', '60% advance for Kashmir ground package')
ON CONFLICT (payment_number) DO NOTHING;

-- ── ROW LEVEL SECURITY (optional, enable if needed) ───────────────────
-- ALTER TABLE demo_vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_vendor_bills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_vendor_payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_vendor_bills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_vendor_payments ENABLE ROW LEVEL SECURITY;
