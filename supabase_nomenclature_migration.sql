-- =====================================================
-- Nomenclature Migration: real_document_sequences table
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Create the real_document_sequences table
CREATE TABLE IF NOT EXISTS real_document_sequences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  prefix text NOT NULL DEFAULT '',
  suffix text NOT NULL DEFAULT '',
  current_number int NOT NULL DEFAULT 0,
  padding int NOT NULL DEFAULT 4,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 2. Unique constraint: one sequence per user per document type
CREATE UNIQUE INDEX IF NOT EXISTS real_doc_seq_unique
  ON real_document_sequences(user_id, document_type);

-- 3. RLS
ALTER TABLE real_document_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_own_sequences" ON real_document_sequences;
CREATE POLICY "user_own_sequences" ON real_document_sequences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Create or replace the atomic document number generation function
CREATE OR REPLACE FUNCTION get_next_doc_number(p_type text)
RETURNS text AS $$
DECLARE
  v_user_id uuid;
  v_prefix text;
  v_suffix text;
  v_padding int;
  v_next_number int;
  v_padded text;
  v_result text;
  v_default_prefix text;
BEGIN
  v_user_id := auth.uid();

  -- Determine default prefix based on type
  CASE p_type
    WHEN 'quote' THEN v_default_prefix := 'WL-Q-';
    WHEN 'booking' THEN v_default_prefix := 'WL-B-';
    WHEN 'invoice' THEN v_default_prefix := 'INV-';
    WHEN 'receipt' THEN v_default_prefix := 'REC-';
    WHEN 'cn' THEN v_default_prefix := 'CN-';
    WHEN 'vendor_bill' THEN v_default_prefix := 'VB-';
    WHEN 'vendor_pay' THEN v_default_prefix := 'VP-';
    WHEN 'hm_invoice' THEN v_default_prefix := 'HM-';
    WHEN 'gen_entry' THEN v_default_prefix := 'GE-';
    ELSE v_default_prefix := '';
  END CASE;

  -- Atomically increment and get user's sequence config
  UPDATE real_document_sequences
  SET
    current_number = current_number + 1,
    updated_at = now()
  WHERE user_id = v_user_id AND document_type = p_type
  RETURNING prefix, suffix, padding, current_number
  INTO v_prefix, v_suffix, v_padding, v_next_number;

  -- If no sequence found, create default and use 1
  IF NOT FOUND THEN
    INSERT INTO real_document_sequences (user_id, document_type, prefix, suffix, current_number, padding)
    VALUES (v_user_id, p_type, v_default_prefix, '', 1, 4)
    ON CONFLICT (user_id, document_type) DO UPDATE
      SET current_number = real_document_sequences.current_number + 1,
          updated_at = now()
    RETURNING prefix, suffix, padding, current_number
    INTO v_prefix, v_suffix, v_padding, v_next_number;
  END IF;

  -- Apply zero-padding
  v_padded := LPAD(v_next_number::text, v_padding, '0');

  -- Combine: prefix + padded number + suffix
  v_result := v_prefix || v_padded || v_suffix;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Helper function to check if user has nomenclature set up
CREATE OR REPLACE FUNCTION has_nomenclature_setup()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM real_document_sequences
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
