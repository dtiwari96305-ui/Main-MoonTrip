-- ================================================================
-- MIGRATION 02: REAL TABLES
-- All tables have strict RLS: user_id = auth.uid() on every op
-- ================================================================

-- ── profiles (1-to-1 with auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name       text,
  last_name        text,
  phone            text,
  email            text,
  company_name     text DEFAULT 'My Agency',
  company_subtitle text DEFAULT 'Travel & Tourism',
  gstin            text,
  pan              text,
  state            text,
  address          text,
  avatar_color     text,
  plan             text DEFAULT 'free',
  booking_prefix   text DEFAULT 'B',
  booking_suffix   text DEFAULT '',
  booking_start    int  DEFAULT 1,
  invoice_prefix   text DEFAULT 'INV',
  invoice_suffix   text DEFAULT '',
  invoice_start    int  DEFAULT 1,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "profiles_self_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
CREATE POLICY "profiles_self_select" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_self_insert" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (id = auth.uid());

-- ── customers ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_code    text,
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
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_select" ON customers;
DROP POLICY IF EXISTS "customers_insert" ON customers;
DROP POLICY IF EXISTS "customers_update" ON customers;
DROP POLICY IF EXISTS "customers_delete" ON customers;
CREATE POLICY "customers_select" ON customers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (user_id = auth.uid());

-- ── quotes ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number               text,
  customer_id                uuid REFERENCES customers(id) ON DELETE SET NULL,
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
  created_at                 timestamptz DEFAULT now(),
  updated_at                 timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "quotes_select" ON quotes;
DROP POLICY IF EXISTS "quotes_insert" ON quotes;
DROP POLICY IF EXISTS "quotes_update" ON quotes;
DROP POLICY IF EXISTS "quotes_delete" ON quotes;
CREATE POLICY "quotes_select" ON quotes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "quotes_insert" ON quotes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "quotes_update" ON quotes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "quotes_delete" ON quotes FOR DELETE USING (user_id = auth.uid());

-- ── bookings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_number      text,
  quote_id            uuid REFERENCES quotes(id) ON DELETE SET NULL,
  customer_id         uuid REFERENCES customers(id) ON DELETE SET NULL,
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
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bookings_select" ON bookings;
DROP POLICY IF EXISTS "bookings_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_update" ON bookings;
DROP POLICY IF EXISTS "bookings_delete" ON bookings;
CREATE POLICY "bookings_select" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "bookings_insert" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookings_update" ON bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "bookings_delete" ON bookings FOR DELETE USING (user_id = auth.uid());

-- ── payments ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_number        text,
  customer_id           uuid REFERENCES customers(id) ON DELETE SET NULL,
  booking_id            uuid REFERENCES bookings(id) ON DELETE SET NULL,
  total_amount          numeric DEFAULT 0,
  payment_mode          text DEFAULT 'cash',
  payment_type          text DEFAULT 'regular' CHECK (payment_type IN ('advance','regular')),
  transaction_reference text,
  bank_name             text,
  notes                 text,
  payment_date          date DEFAULT CURRENT_DATE,
  allocations           jsonb DEFAULT '[]',
  created_at            timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_select" ON payments;
DROP POLICY IF EXISTS "payments_insert" ON payments;
DROP POLICY IF EXISTS "payments_update" ON payments;
DROP POLICY IF EXISTS "payments_delete" ON payments;
CREATE POLICY "payments_select" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "payments_insert" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "payments_update" ON payments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "payments_delete" ON payments FOR DELETE USING (user_id = auth.uid());

-- ── sales_invoices ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_invoices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text,
  booking_id     uuid REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id    uuid REFERENCES customers(id) ON DELETE SET NULL,
  total_amount   numeric DEFAULT 0,
  tax            numeric DEFAULT 0,
  status         text DEFAULT 'unpaid' CHECK (status IN ('unpaid','paid','cancelled','void')),
  invoice_date   date DEFAULT CURRENT_DATE,
  invoice_type   text DEFAULT 'tax_invoice',
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invoices_select" ON sales_invoices;
DROP POLICY IF EXISTS "invoices_insert" ON sales_invoices;
DROP POLICY IF EXISTS "invoices_update" ON sales_invoices;
DROP POLICY IF EXISTS "invoices_delete" ON sales_invoices;
CREATE POLICY "invoices_select" ON sales_invoices FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "invoices_insert" ON sales_invoices FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "invoices_update" ON sales_invoices FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "invoices_delete" ON sales_invoices FOR DELETE USING (user_id = auth.uid());

-- ── advance_ledger ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS advance_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id   uuid REFERENCES customers(id) ON DELETE SET NULL,
  entry_type    text DEFAULT 'credit' CHECK (entry_type IN ('credit','debit')),
  amount        numeric DEFAULT 0,
  description   text,
  payment_id    uuid,
  booking_id    uuid,
  balance_after numeric DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE advance_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ledger_select" ON advance_ledger;
DROP POLICY IF EXISTS "ledger_insert" ON advance_ledger;
DROP POLICY IF EXISTS "ledger_update" ON advance_ledger;
DROP POLICY IF EXISTS "ledger_delete" ON advance_ledger;
CREATE POLICY "ledger_select" ON advance_ledger FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ledger_insert" ON advance_ledger FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "ledger_update" ON advance_ledger FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "ledger_delete" ON advance_ledger FOR DELETE USING (user_id = auth.uid());

-- ── activity_log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type    text NOT NULL,
  title          text,
  description    text,
  reference_type text,
  reference_id   uuid,
  is_read        boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_select" ON activity_log;
DROP POLICY IF EXISTS "activity_insert" ON activity_log;
DROP POLICY IF EXISTS "activity_update" ON activity_log;
DROP POLICY IF EXISTS "activity_delete" ON activity_log;
CREATE POLICY "activity_select" ON activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_insert" ON activity_log FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity_update" ON activity_log FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "activity_delete" ON activity_log FOR DELETE USING (user_id = auth.uid());

-- ── document_numbering ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_numbering (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_prefix         text DEFAULT 'Q',
  quote_suffix         text DEFAULT '',
  quote_next_number    int  DEFAULT 1,
  booking_prefix       text DEFAULT 'B',
  booking_suffix       text DEFAULT '',
  booking_next_number  int  DEFAULT 1,
  invoice_prefix       text DEFAULT 'INV',
  invoice_suffix       text DEFAULT '',
  invoice_next_number  int  DEFAULT 1,
  receipt_prefix       text DEFAULT 'REC',
  receipt_suffix       text DEFAULT '',
  receipt_next_number  int  DEFAULT 1,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE document_numbering ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "numbering_select" ON document_numbering;
DROP POLICY IF EXISTS "numbering_insert" ON document_numbering;
DROP POLICY IF EXISTS "numbering_update" ON document_numbering;
DROP POLICY IF EXISTS "numbering_delete" ON document_numbering;
CREATE POLICY "numbering_select" ON document_numbering FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "numbering_insert" ON document_numbering FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "numbering_update" ON document_numbering FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "numbering_delete" ON document_numbering FOR DELETE USING (user_id = auth.uid());

-- ── Auto-create profile + numbering row on new user signup ───────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Agency')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO document_numbering (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
