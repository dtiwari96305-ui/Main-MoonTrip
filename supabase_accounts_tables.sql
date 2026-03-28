-- ═══════════════════════════════════════════════════════════════════════
-- ACCOUNTS MODULE — Supabase Table Definitions
-- Run this in your Supabase SQL editor (after vendor tables)
-- ═══════════════════════════════════════════════════════════════════════

-- ── DEMO CHART OF ACCOUNTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset','liability','equity','revenue','expense')),
  sub_type TEXT DEFAULT '',
  parent_id UUID REFERENCES demo_chart_of_accounts(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT false,
  balance NUMERIC(12,2) DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS demo_coa_code_idx ON demo_chart_of_accounts(code);

-- ── DEMO JOURNAL ENTRIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  narration TEXT DEFAULT '',
  ref_type TEXT DEFAULT '',
  ref_id UUID,
  entry_type TEXT DEFAULT 'manual' CHECK (entry_type IN ('auto','manual','adjustment')),
  posted BOOLEAN DEFAULT true,
  total_debit NUMERIC(12,2) DEFAULT 0,
  total_credit NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEMO JOURNAL LINES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES demo_journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES demo_chart_of_accounts(id) ON DELETE SET NULL,
  account_code TEXT DEFAULT '',
  account_name TEXT DEFAULT '',
  debit NUMERIC(12,2) DEFAULT 0,
  credit NUMERIC(12,2) DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEMO BANK ACCOUNTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT DEFAULT '',
  ifsc_code TEXT DEFAULT '',
  account_holder TEXT DEFAULT '',
  account_type TEXT DEFAULT 'current' CHECK (account_type IN ('current','savings','overdraft')),
  opening_balance NUMERIC(12,2) DEFAULT 0,
  current_balance NUMERIC(12,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEMO GENERAL ENTRIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_general_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('income','expense','transfer','other')),
  amount NUMERIC(12,2) DEFAULT 0,
  payment_mode TEXT DEFAULT 'bank_transfer',
  reference TEXT DEFAULT '',
  bank_account_id UUID REFERENCES demo_bank_accounts(id) ON DELETE SET NULL,
  ref_type TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL CHART OF ACCOUNTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset','liability','equity','revenue','expense')),
  sub_type TEXT DEFAULT '',
  parent_id UUID REFERENCES real_chart_of_accounts(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT false,
  balance NUMERIC(12,2) DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS real_coa_code_idx ON real_chart_of_accounts(code);

-- ── REAL JOURNAL ENTRIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  narration TEXT DEFAULT '',
  ref_type TEXT DEFAULT '',
  ref_id UUID,
  entry_type TEXT DEFAULT 'manual' CHECK (entry_type IN ('auto','manual','adjustment')),
  posted BOOLEAN DEFAULT true,
  total_debit NUMERIC(12,2) DEFAULT 0,
  total_credit NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL JOURNAL LINES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES real_journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES real_chart_of_accounts(id) ON DELETE SET NULL,
  account_code TEXT DEFAULT '',
  account_name TEXT DEFAULT '',
  debit NUMERIC(12,2) DEFAULT 0,
  credit NUMERIC(12,2) DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL BANK ACCOUNTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT DEFAULT '',
  ifsc_code TEXT DEFAULT '',
  account_holder TEXT DEFAULT '',
  account_type TEXT DEFAULT 'current' CHECK (account_type IN ('current','savings','overdraft')),
  opening_balance NUMERIC(12,2) DEFAULT 0,
  current_balance NUMERIC(12,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REAL GENERAL ENTRIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_general_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('income','expense','transfer','other')),
  amount NUMERIC(12,2) DEFAULT 0,
  payment_mode TEXT DEFAULT 'bank_transfer',
  reference TEXT DEFAULT '',
  bank_account_id UUID REFERENCES real_bank_accounts(id) ON DELETE SET NULL,
  ref_type TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════
-- DEMO SEED DATA — Chart of Accounts
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO demo_chart_of_accounts (id, code, name, type, sub_type, is_system, description) VALUES
  -- Assets
  ('ca000001-0000-0000-0000-000000000001', '1001', 'Cash in Hand',          'asset', 'current_asset', true,  'Physical cash held at office'),
  ('ca000001-0000-0000-0000-000000000002', '1002', 'HDFC Bank Current A/C', 'asset', 'bank',          true,  'Primary operating bank account'),
  ('ca000001-0000-0000-0000-000000000003', '1003', 'ICICI Bank Savings',    'asset', 'bank',          false, 'Secondary savings account'),
  ('ca000001-0000-0000-0000-000000000004', '1004', 'Accounts Receivable',   'asset', 'current_asset', true,  'Outstanding customer invoices'),
  ('ca000001-0000-0000-0000-000000000005', '1005', 'Advance to Vendors',    'asset', 'current_asset', true,  'Advances paid to travel vendors'),
  ('ca000001-0000-0000-0000-000000000006', '1006', 'TDS Receivable',        'asset', 'current_asset', true,  'TDS deducted by vendors'),
  ('ca000001-0000-0000-0000-000000000007', '1007', 'GST Input Credit',      'asset', 'current_asset', true,  'Input GST credit available'),
  -- Liabilities
  ('ca000002-0000-0000-0000-000000000001', '2001', 'Accounts Payable',      'liability', 'current_liability', true,  'Outstanding vendor bills'),
  ('ca000002-0000-0000-0000-000000000002', '2002', 'GST Payable (Output)',  'liability', 'current_liability', true,  'Output GST collected from customers'),
  ('ca000002-0000-0000-0000-000000000003', '2003', 'Advance from Customers','liability', 'current_liability', true,  'Customer advance payments received'),
  ('ca000002-0000-0000-0000-000000000004', '2004', 'TDS Payable',           'liability', 'current_liability', true,  'TDS to be deposited with government'),
  -- Equity
  ('ca000003-0000-0000-0000-000000000001', '3001', 'Owner''s Capital',      'equity', '', true,  'Proprietor capital account'),
  ('ca000003-0000-0000-0000-000000000002', '3002', 'Retained Earnings',     'equity', '', true,  'Accumulated profit retained in business'),
  -- Revenue
  ('ca000004-0000-0000-0000-000000000001', '4001', 'Service Revenue',       'revenue', '', true,  'Commission and service fee income'),
  ('ca000004-0000-0000-0000-000000000002', '4002', 'Processing Fee Income', 'revenue', '', true,  'Processing charges collected'),
  ('ca000004-0000-0000-0000-000000000003', '4003', 'Hidden Markup Income',  'revenue', '', true,  'Markup earned on travel packages'),
  ('ca000004-0000-0000-0000-000000000004', '4004', 'Interest Income',       'revenue', '', false, 'Bank interest and other interest income'),
  -- Expenses
  ('ca000005-0000-0000-0000-000000000001', '5001', 'Cost of Services',      'expense', '', true,  'Direct vendor costs for travel services'),
  ('ca000005-0000-0000-0000-000000000002', '5002', 'Bank Charges',          'expense', '', true,  'Banking fees and transaction charges'),
  ('ca000005-0000-0000-0000-000000000003', '5003', 'Office Expenses',       'expense', '', false, 'General office running expenses'),
  ('ca000005-0000-0000-0000-000000000004', '5004', 'Salary & Wages',        'expense', '', false, 'Staff salaries and wages'),
  ('ca000005-0000-0000-0000-000000000005', '5005', 'Marketing Expenses',    'expense', '', false, 'Advertising and marketing costs'),
  ('ca000005-0000-0000-0000-000000000006', '5006', 'TDS Deducted (Expense)','expense', '', true,  'TDS deducted on our income')
ON CONFLICT (id) DO NOTHING;

-- ── DEMO BANK ACCOUNTS SEED ───────────────────────────────────────────
INSERT INTO demo_bank_accounts (id, bank_name, account_number, ifsc_code, account_holder, account_type, opening_balance, current_balance, is_default) VALUES
  ('ba000001-0000-0000-0000-000000000001', 'HDFC Bank', '50200012345678', 'HDFC0000001', 'Touridoo Travel Pvt Ltd', 'current', 500000, 347850, true),
  ('ba000001-0000-0000-0000-000000000002', 'ICICI Bank', '627301234567',  'ICIC0000627', 'Touridoo Travel Pvt Ltd', 'savings', 200000, 218450, false)
ON CONFLICT (id) DO NOTHING;

-- ── DEMO GENERAL ENTRIES SEED ─────────────────────────────────────────
INSERT INTO demo_general_entries (entry_number, date, description, category, amount, payment_mode, reference, notes) VALUES
  ('GE-2026-001', '2026-03-01', 'Office rent payment - March 2026',       'expense',  25000, 'bank_transfer', 'NEFT/2026/03/0001', 'Monthly rent'),
  ('GE-2026-002', '2026-03-03', 'Staff salaries disbursement',            'expense',  85000, 'bank_transfer', 'NEFT/2026/03/0002', 'March salaries'),
  ('GE-2026-003', '2026-03-05', 'Google Ads payment',                     'expense',  12000, 'upi',           'UPI/2026/03/0001',  'Digital marketing'),
  ('GE-2026-004', '2026-03-10', 'Bank interest received - HDFC Current',  'income',    1850, 'bank_transfer', 'INT/2026/03/HDFC',  'Monthly interest'),
  ('GE-2026-005', '2026-03-15', 'Office supplies purchase',               'expense',   4200, 'cash',          '',                  'Stationery and printer ink'),
  ('GE-2026-006', '2026-03-20', 'HDFC Bank charges - March',              'expense',    750, 'bank_transfer', 'CHRG/2026/03/HDFC', 'Monthly bank maintenance'),
  ('GE-2026-007', '2026-03-22', 'Transfer to ICICI savings',              'transfer', 50000, 'bank_transfer', 'IMPS/2026/03/0010', 'Fund transfer between accounts')
ON CONFLICT (entry_number) DO NOTHING;

-- ── DEMO JOURNAL ENTRIES SEED ─────────────────────────────────────────
INSERT INTO demo_journal_entries (entry_number, date, narration, ref_type, entry_type, total_debit, total_credit) VALUES
  ('JE-2026-001', '2026-03-20', 'Payment received from Vikram Iyer - Goa booking', 'payment', 'auto', 75000, 75000),
  ('JE-2026-002', '2026-03-22', 'Vendor bill payment - Royal Cabs Mumbai',          'vendor_payment', 'auto', 19000, 19000),
  ('JE-2026-003', '2026-03-25', 'Sales invoice raised - Rahul Sharma Bali trip',   'invoice', 'auto', 125000, 125000),
  ('JE-2026-004', '2026-03-28', 'Advance received - New Kashmir booking',           'payment', 'auto', 40000, 40000)
ON CONFLICT (entry_number) DO NOTHING;

-- ── ROW LEVEL SECURITY (optional) ────────────────────────────────────
-- ALTER TABLE demo_chart_of_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_journal_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_journal_lines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_bank_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demo_general_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_chart_of_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_journal_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_journal_lines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_bank_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE real_general_entries ENABLE ROW LEVEL SECURITY;
