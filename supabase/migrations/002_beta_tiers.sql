-- XPira Database Schema
-- Migration: 002_beta_tiers
-- Created: 2025-01-XX
-- Description: Add beta tier and beta codes table

-- ============================================================================
-- UPDATE SUBSCRIPTION_TIER CONSTRAINT
-- Add 'beta' as a valid tier option
-- ============================================================================
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE profiles 
  ADD CONSTRAINT profiles_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'beta', 'pro'));

-- ============================================================================
-- BETA_CODES TABLE
-- Invite-only beta access codes
-- ============================================================================
CREATE TABLE IF NOT EXISTS beta_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  -- Who created and who claimed
  created_by UUID REFERENCES auth.users(id),
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  -- Metadata
  max_uses INTEGER DEFAULT 1,
  use_count INTEGER DEFAULT 0,
  notes TEXT, -- Internal notes for tracking
  -- Validity
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast code lookup
CREATE INDEX IF NOT EXISTS idx_beta_codes_code ON beta_codes(code) WHERE is_active = true;

-- ============================================================================
-- CLAIM BETA CODE FUNCTION
-- Validates and claims a beta code for a user
-- ============================================================================
CREATE OR REPLACE FUNCTION claim_beta_code(
  p_user_id UUID,
  p_code TEXT
)
RETURNS JSON AS $$
DECLARE
  v_code_row beta_codes%ROWTYPE;
  v_result JSON;
BEGIN
  -- Find the code
  SELECT * INTO v_code_row
  FROM beta_codes
  WHERE code = UPPER(p_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR use_count < max_uses)
  FOR UPDATE;
  
  -- Code not found or invalid
  IF v_code_row.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired beta code'
    );
  END IF;
  
  -- Increment use count
  UPDATE beta_codes 
  SET 
    use_count = use_count + 1,
    claimed_by = COALESCE(claimed_by, p_user_id),
    claimed_at = COALESCE(claimed_at, now())
  WHERE id = v_code_row.id;
  
  -- Upgrade user to beta tier
  UPDATE profiles
  SET 
    subscription_tier = 'beta',
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Beta access granted!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR BETA_CODES
-- ============================================================================
ALTER TABLE beta_codes ENABLE ROW LEVEL SECURITY;

-- Users can only see codes they created or claimed
CREATE POLICY "Users can see own codes" ON beta_codes
  FOR SELECT
  USING (
    created_by = auth.uid() OR 
    claimed_by = auth.uid()
  );

-- Only admins can create codes (through service role)
-- Users cannot insert codes directly

-- ============================================================================
-- SEED SOME INITIAL BETA CODES
-- These can be distributed to early testers
-- ============================================================================
INSERT INTO beta_codes (code, notes, max_uses) VALUES
  ('XPIRA-BETA-0001', 'Initial tester code', 10),
  ('XPIRA-ALPHA-2025', 'Alpha testers', 50),
  ('FRIENDS-AND-FAM', 'Friends and family', 25)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- HELPER VIEW: USER TIER STATUS
-- Quick lookup for frontend to check user tier
-- ============================================================================
CREATE OR REPLACE VIEW user_tier AS
SELECT 
  id,
  username,
  subscription_tier,
  CASE 
    WHEN subscription_tier = 'pro' THEN true
    WHEN subscription_tier = 'beta' THEN true
    ELSE false
  END as has_premium_features,
  CASE 
    WHEN subscription_tier = 'pro' THEN true
    ELSE false
  END as is_paying_customer
FROM profiles;
