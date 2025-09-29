-- Migration: Add phone verification to sessions table
-- Run this in Supabase SQL Editor

-- Add phone verification columns to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS phone_number TEXT UNIQUE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_verification_attempt TIMESTAMPTZ;

-- Create verification_codes table
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_phone_number ON sessions(phone_number);

-- Add comment
COMMENT ON TABLE verification_codes IS 'Stores SMS verification codes with expiration and attempt tracking';