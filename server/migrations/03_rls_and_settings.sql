-- ================================================================
-- MIGRATION 03: RLS + SETTINGS + SEQUENTIAL DOCUMENT NUMBERS
-- Run this in Supabase SQL Editor
-- ================================================================

-- ── 1. CREATE real_settings TABLE ─────────────────────────────────

CREATE TABLE IF NOT EXISTS real_settings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Company
  company_name         text DEFAULT 'My Agency',
  company_subtitle     text DEFAULT 'Travel & Tourism',
  slug                 text DEFAULT '',
  gstin                text DEFAULT '',
  pan                  text DEFAULT '',
  company_phone        text DEFAULT '',
  company_email        text DEFAULT '',
  street_address       text DEFAULT '',
  city                 text DEFAULT '',
  state                text DEFAULT 'Maharashtra',
  pincode              text DEFAULT '',
  -- Bank
  account_number       text DEFAULT '',
  ifsc_code            text DEFAULT '',
  bank_name            text DEFAULT '',
  branch               text DEFAULT '',
  account_holder_name  text DEFAULT '',
  upi_id               text DEFAULT '',
  -- Misc
  invoice_terms        text DEFAULT '',
  gst_enabled          boolean DEFAULT true,
  pdf_theme            text DEFAULT 'classic',
  -- Document numbering
  quote_prefix         text DEFAULT 'WL-Q-',
  quote_next_number    int  DEFAULT 1,
  quote_suffix         text DEFAULT '',
  invoice_prefix       text DEFAULT 'WL-B-',
  invoice_next_number  int  DEFAULT 1,
  invoice_suffix       text DEFAULT '',
  receipt_prefix       text DEFAULT 'REC-',
  receipt_next_number  int  DEFAULT 1,
  receipt_suffix       text DEFAULT '',
  vendor_bill_prefix   text DEFAULT 'VB-',
  vendor_bill_next     int  DEFAULT 1,
  vendor_pay_prefix    text DEFAULT 'VP-',
  vendor_pay_next      int  DEFAULT 1,
  gen_entry_prefix     text DEFAULT 'GE-',
  gen_entry_next       int  DEFAULT 1,
  -- Profile
  user_name            text DEFAULT 'Admin',
  user_role            text DEFAULT 'admin',
  email                text DEFAULT '',
  phone                text DEFAULT '',
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE real_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "real_settings_select" ON real_settings;
DROP POLICY IF EXISTS "real_settings_insert" ON real_settings;
DROP POLICY IF EXISTS "real_settings_update" ON real_settings;
CREATE POLICY "real_settings_select" ON real_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "real_settings_insert" ON real_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "real_settings_update" ON real_settings FOR UPDATE USING (user_id = auth.uid());

-- ── 2. CREATE real_team_members TABLE ─────────────────────────────

CREATE TABLE IF NOT EXISTS real_team_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  email      text DEFAULT '',
  phone      text DEFAULT '',
  role       text DEFAULT 'agent' CHECK (role IN ('admin','manager','agent','accountant')),
  status     text DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE real_team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "real_team_select" ON real_team_members;
DROP POLICY IF EXISTS "real_team_insert" ON real_team_members;
DROP POLICY IF EXISTS "real_team_update" ON real_team_members;
DROP POLICY IF EXISTS "real_team_delete" ON real_team_members;
CREATE POLICY "real_team_select" ON real_team_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "real_team_insert" ON real_team_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "real_team_update" ON real_team_members FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "real_team_delete" ON real_team_members FOR DELETE USING (user_id = auth.uid());

-- ── 3. CREATE real_advance_ledger IF MISSING ──────────────────────

CREATE TABLE IF NOT EXISTS real_advance_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id   uuid,
  entry_type    text DEFAULT 'credit' CHECK (entry_type IN ('credit','debit')),
  amount        numeric DEFAULT 0,
  description   text,
  payment_id    uuid,
  booking_id    uuid,
  balance_after numeric DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- ── 4. ADD user_id TO EXISTING real_ TABLES ───────────────────────

ALTER TABLE real_customers       ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_quotes           ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_bookings         ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_payments         ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_sales_invoices   ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_activity_log     ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_vendors          ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_vendor_bills     ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_vendor_payments  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_bank_accounts    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_general_entries  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_journal_entries  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_journal_lines    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_chart_of_accounts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE real_advance_ledger   ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- ── 4. AUTO-SET user_id TRIGGER ────────────────────────────────────

CREATE OR REPLACE FUNCTION set_real_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'real_customers','real_quotes','real_bookings','real_payments',
    'real_sales_invoices','real_activity_log','real_vendors',
    'real_vendor_bills','real_vendor_payments','real_bank_accounts',
    'real_general_entries','real_journal_entries','real_journal_lines',
    'real_chart_of_accounts','real_advance_ledger'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_user_id ON %I', tbl);
    EXECUTE format(
      'CREATE TRIGGER trg_set_user_id BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION set_real_user_id()',
      tbl
    );
  END LOOP;
END;
$$;

-- ── 5. ENABLE RLS + POLICIES ON real_ TABLES ───────────────────────

-- Helper: enable RLS + drop+create CRUD policies for a table
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'real_customers','real_quotes','real_bookings','real_payments',
    'real_sales_invoices','real_activity_log','real_vendors',
    'real_vendor_bills','real_vendor_payments','real_bank_accounts',
    'real_general_entries','real_journal_entries','real_journal_lines',
    'real_chart_of_accounts','real_advance_ledger'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete" ON %I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_select" ON %I FOR SELECT USING (user_id = auth.uid())', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_insert" ON %I FOR INSERT WITH CHECK (user_id = auth.uid())', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_update" ON %I FOR UPDATE USING (user_id = auth.uid())', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_delete" ON %I FOR DELETE USING (user_id = auth.uid())', tbl, tbl);
  END LOOP;
END;
$$;

-- ── 6. SEQUENTIAL DOCUMENT NUMBER FUNCTION ─────────────────────────
-- Call via: SELECT get_next_doc_number('quote')
-- Returns:  'WL-Q-0033'

CREATE OR REPLACE FUNCTION get_next_doc_number(p_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_row   real_settings%ROWTYPE;
  v_num   text;
BEGIN
  -- Ensure a settings row exists for this user
  INSERT INTO real_settings (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  IF p_type = 'quote' THEN
    UPDATE real_settings
       SET quote_next_number = quote_next_number + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.quote_prefix
          || LPAD((v_row.quote_next_number - 1)::text, 4, '0')
          || v_row.quote_suffix;

  ELSIF p_type = 'booking' THEN
    UPDATE real_settings
       SET invoice_next_number = invoice_next_number + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.invoice_prefix
          || LPAD((v_row.invoice_next_number - 1)::text, 4, '0')
          || v_row.invoice_suffix;

  ELSIF p_type = 'receipt' THEN
    UPDATE real_settings
       SET receipt_next_number = receipt_next_number + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.receipt_prefix
          || LPAD((v_row.receipt_next_number - 1)::text, 4, '0')
          || v_row.receipt_suffix;

  ELSIF p_type = 'vendor_bill' THEN
    UPDATE real_settings
       SET vendor_bill_next = vendor_bill_next + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.vendor_bill_prefix
          || LPAD((v_row.vendor_bill_next - 1)::text, 4, '0');

  ELSIF p_type = 'vendor_pay' THEN
    UPDATE real_settings
       SET vendor_pay_next = vendor_pay_next + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.vendor_pay_prefix
          || LPAD((v_row.vendor_pay_next - 1)::text, 4, '0');

  ELSIF p_type = 'gen_entry' THEN
    UPDATE real_settings
       SET gen_entry_next = gen_entry_next + 1, updated_at = now()
     WHERE user_id = auth.uid()
    RETURNING * INTO v_row;
    v_num := v_row.gen_entry_prefix
          || LPAD((v_row.gen_entry_next - 1)::text, 4, '0');

  ELSE
    v_num := p_type || '-' || extract(epoch from now())::bigint::text;
  END IF;

  RETURN v_num;
END;
$$;

-- ── 7. AUTO-CREATE settings ROW ON SIGNUP ─────────────────────────
-- Extend the existing handle_new_user trigger (if it exists) or create it

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- profiles (if table exists from migration 02)
  INSERT INTO profiles (id, email, first_name, last_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Agency')
  )
  ON CONFLICT (id) DO NOTHING;

  -- document_numbering (if table exists from migration 02)
  INSERT INTO document_numbering (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- real_settings
  INSERT INTO real_settings (user_id, email, user_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Admin')
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
