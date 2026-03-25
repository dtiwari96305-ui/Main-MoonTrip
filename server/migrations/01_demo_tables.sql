-- ================================================================
-- MIGRATION 01: DEMO TABLES
-- All demo_ tables have public read/write access (no auth required)
-- Auto-delete trigger keeps max 10 non-seed rows per tracked table
-- ================================================================

-- ── demo_customers ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_customers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code    text UNIQUE,
  full_name        text NOT NULL,
  phone            text,
  alternate_phone  text,
  email            text,
  date_of_birth    date,
  address          text,
  city             text,
  state            text,
  pincode          text,
  country          text DEFAULT 'India',
  customer_type    text DEFAULT 'individual' CHECK (customer_type IN ('individual','corporate')),
  pan_number       text,
  gstin            text,
  company_name     text,
  tags             jsonb DEFAULT '[]',
  notes            text,
  avatar_color     text,
  is_seed_data     boolean DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE demo_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_customers_public_select" ON demo_customers;
DROP POLICY IF EXISTS "demo_customers_public_insert" ON demo_customers;
DROP POLICY IF EXISTS "demo_customers_public_update" ON demo_customers;
CREATE POLICY "demo_customers_public_select" ON demo_customers FOR SELECT USING (true);
CREATE POLICY "demo_customers_public_insert" ON demo_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_customers_public_update" ON demo_customers FOR UPDATE USING (true);

-- ── demo_quotes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_quotes (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number               text UNIQUE,
  customer_id                uuid REFERENCES demo_customers(id) ON DELETE SET NULL,
  destination                text,
  destination_type           text DEFAULT 'domestic',
  state_of_travel            text,
  departure_date             date,
  return_date                date,
  travelers_count            int DEFAULT 1,
  traveler_details           jsonb DEFAULT '[]',
  services                   jsonb DEFAULT '[]',
  billing_model              text DEFAULT 'pure_agent',
  margin                     numeric DEFAULT 0,
  commission                 numeric DEFAULT 0,
  processing_charge          numeric DEFAULT 0,
  display_processing_charge  numeric DEFAULT 0,
  place_of_supply            text,
  pricing_mode               text DEFAULT 'margin',
  total_cost                 numeric DEFAULT 0,
  package_price              numeric DEFAULT 0,
  gst_amount                 numeric DEFAULT 0,
  cgst                       numeric DEFAULT 0,
  sgst                       numeric DEFAULT 0,
  igst                       numeric DEFAULT 0,
  tcs_amount                 numeric DEFAULT 0,
  invoice_value              numeric DEFAULT 0,
  total_payable              numeric DEFAULT 0,
  total_profit               numeric DEFAULT 0,
  status                     text DEFAULT 'draft' CHECK (status IN ('draft','sent','approved','rejected','converted')),
  inclusions                 text[] DEFAULT '{}',
  exclusions                 text[] DEFAULT '{}',
  notes                      text,
  internal_notes             text,
  itinerary                  jsonb DEFAULT '{}',
  is_seed_data               boolean DEFAULT false,
  created_at                 timestamptz DEFAULT now(),
  updated_at                 timestamptz DEFAULT now()
);

ALTER TABLE demo_quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_quotes_public_select" ON demo_quotes;
DROP POLICY IF EXISTS "demo_quotes_public_insert" ON demo_quotes;
DROP POLICY IF EXISTS "demo_quotes_public_update" ON demo_quotes;
CREATE POLICY "demo_quotes_public_select" ON demo_quotes FOR SELECT USING (true);
CREATE POLICY "demo_quotes_public_insert" ON demo_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_quotes_public_update" ON demo_quotes FOR UPDATE USING (true);

-- ── demo_bookings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number      text UNIQUE,
  quote_id            uuid REFERENCES demo_quotes(id) ON DELETE SET NULL,
  customer_id         uuid REFERENCES demo_customers(id) ON DELETE SET NULL,
  destination         text,
  destination_type    text DEFAULT 'domestic',
  departure_date      date,
  return_date         date,
  travelers_count     int DEFAULT 1,
  services            jsonb DEFAULT '[]',
  billing_model       text DEFAULT 'pure_agent',
  total_cost          numeric DEFAULT 0,
  total_profit        numeric DEFAULT 0,
  margin              numeric DEFAULT 0,
  total_payable       numeric DEFAULT 0,
  amount_paid         numeric DEFAULT 0,
  amount_pending      numeric DEFAULT 0,
  payment_status      text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid','overpaid')),
  booking_status      text DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed','in_progress','completed','cancelled')),
  booked_at           timestamptz DEFAULT now(),
  cancellation_reason text,
  cancellation_note   jsonb DEFAULT '{}',
  is_seed_data        boolean DEFAULT false,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_bookings_public_select" ON demo_bookings;
DROP POLICY IF EXISTS "demo_bookings_public_insert" ON demo_bookings;
DROP POLICY IF EXISTS "demo_bookings_public_update" ON demo_bookings;
CREATE POLICY "demo_bookings_public_select" ON demo_bookings FOR SELECT USING (true);
CREATE POLICY "demo_bookings_public_insert" ON demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_bookings_public_update" ON demo_bookings FOR UPDATE USING (true);

-- ── demo_payments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number        text UNIQUE,
  customer_id           uuid REFERENCES demo_customers(id) ON DELETE SET NULL,
  booking_id            uuid REFERENCES demo_bookings(id) ON DELETE SET NULL,
  total_amount          numeric DEFAULT 0,
  payment_mode          text DEFAULT 'cash',
  payment_type          text DEFAULT 'regular' CHECK (payment_type IN ('advance','regular')),
  transaction_reference text,
  bank_name             text,
  notes                 text,
  payment_date          date DEFAULT CURRENT_DATE,
  allocations           jsonb DEFAULT '[]',
  is_seed_data          boolean DEFAULT false,
  created_at            timestamptz DEFAULT now()
);

ALTER TABLE demo_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_payments_public_select" ON demo_payments;
DROP POLICY IF EXISTS "demo_payments_public_insert" ON demo_payments;
DROP POLICY IF EXISTS "demo_payments_public_update" ON demo_payments;
CREATE POLICY "demo_payments_public_select" ON demo_payments FOR SELECT USING (true);
CREATE POLICY "demo_payments_public_insert" ON demo_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_payments_public_update" ON demo_payments FOR UPDATE USING (true);

-- ── demo_sales_invoices ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_sales_invoices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE,
  booking_id     uuid REFERENCES demo_bookings(id) ON DELETE SET NULL,
  customer_id    uuid REFERENCES demo_customers(id) ON DELETE SET NULL,
  total_amount   numeric DEFAULT 0,
  tax            numeric DEFAULT 0,
  status         text DEFAULT 'unpaid' CHECK (status IN ('unpaid','paid','cancelled','void')),
  invoice_date   date DEFAULT CURRENT_DATE,
  invoice_type   text DEFAULT 'tax_invoice',
  is_seed_data   boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE demo_sales_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_invoices_public_select" ON demo_sales_invoices;
DROP POLICY IF EXISTS "demo_invoices_public_insert" ON demo_sales_invoices;
DROP POLICY IF EXISTS "demo_invoices_public_update" ON demo_sales_invoices;
CREATE POLICY "demo_invoices_public_select" ON demo_sales_invoices FOR SELECT USING (true);
CREATE POLICY "demo_invoices_public_insert" ON demo_sales_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_invoices_public_update" ON demo_sales_invoices FOR UPDATE USING (true);

-- ── demo_activity_log ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_activity_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type    text NOT NULL,
  title          text,
  description    text,
  reference_type text,
  reference_id   uuid,
  is_read        boolean DEFAULT false,
  is_seed_data   boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE demo_activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_log_public_select" ON demo_activity_log;
DROP POLICY IF EXISTS "demo_log_public_insert" ON demo_activity_log;
DROP POLICY IF EXISTS "demo_log_public_update" ON demo_activity_log;
CREATE POLICY "demo_log_public_select" ON demo_activity_log FOR SELECT USING (true);
CREATE POLICY "demo_log_public_insert" ON demo_activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_log_public_update" ON demo_activity_log FOR UPDATE USING (true);

-- ── demo_advance_ledger ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_advance_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid REFERENCES demo_customers(id) ON DELETE SET NULL,
  entry_type    text DEFAULT 'credit' CHECK (entry_type IN ('credit','debit')),
  amount        numeric DEFAULT 0,
  description   text,
  payment_id    uuid,
  booking_id    uuid,
  balance_after numeric DEFAULT 0,
  is_seed_data  boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE demo_advance_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_ledger_public_select" ON demo_advance_ledger;
DROP POLICY IF EXISTS "demo_ledger_public_insert" ON demo_advance_ledger;
DROP POLICY IF EXISTS "demo_ledger_public_update" ON demo_advance_ledger;
CREATE POLICY "demo_ledger_public_select" ON demo_advance_ledger FOR SELECT USING (true);
CREATE POLICY "demo_ledger_public_insert" ON demo_advance_ledger FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_ledger_public_update" ON demo_advance_ledger FOR UPDATE USING (true);

-- ================================================================
-- AUTO-DELETE TRIGGER: Keep max 10 non-seed rows per table
-- Fires AFTER INSERT on demo_customers, demo_quotes, demo_bookings
-- ================================================================

CREATE OR REPLACE FUNCTION demo_auto_delete_oldest()
RETURNS TRIGGER AS $$
DECLARE
  non_seed_count int;
  oldest_id uuid;
  tbl text;
BEGIN
  tbl := TG_TABLE_NAME;

  -- Count non-seed rows
  EXECUTE format('SELECT COUNT(*) FROM %I WHERE is_seed_data = false', tbl)
    INTO non_seed_count;

  -- While over limit, delete oldest non-seed row
  WHILE non_seed_count > 10 LOOP
    EXECUTE format(
      'SELECT id FROM %I WHERE is_seed_data = false ORDER BY created_at ASC LIMIT 1', tbl
    ) INTO oldest_id;

    IF oldest_id IS NOT NULL THEN
      EXECUTE format('DELETE FROM %I WHERE id = $1', tbl) USING oldest_id;
    END IF;

    non_seed_count := non_seed_count - 1;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to the three tables
DROP TRIGGER IF EXISTS demo_customers_auto_delete ON demo_customers;
CREATE TRIGGER demo_customers_auto_delete
  AFTER INSERT ON demo_customers
  FOR EACH ROW EXECUTE FUNCTION demo_auto_delete_oldest();

DROP TRIGGER IF EXISTS demo_quotes_auto_delete ON demo_quotes;
CREATE TRIGGER demo_quotes_auto_delete
  AFTER INSERT ON demo_quotes
  FOR EACH ROW EXECUTE FUNCTION demo_auto_delete_oldest();

DROP TRIGGER IF EXISTS demo_bookings_auto_delete ON demo_bookings;
CREATE TRIGGER demo_bookings_auto_delete
  AFTER INSERT ON demo_bookings
  FOR EACH ROW EXECUTE FUNCTION demo_auto_delete_oldest();
