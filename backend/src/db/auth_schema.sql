-- =========================================================================
-- THREAD & BLOOM LUXURY LIVING: AUTH & SECURITY SCHEMA MIGRATION
-- Supabase Project: https://supabase.com/dashboard/project/gharubakdmrduabsodyc/sql/new
-- =========================================================================

-- 1. Add authentication & password reset columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reset_code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reset_code_expires_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- 2. Fast composite index on email and phone for O(1) login & OTP lookups
CREATE INDEX IF NOT EXISTS idx_users_email_phone_auth 
  ON public.users (email, phone);

-- 3. Notify schema cache update
COMMENT ON COLUMN public.users.password_hash IS 'Salted scrypt hash for patron authentication';
COMMENT ON COLUMN public.users.reset_code IS '6-digit OTP code for WhatsApp password reset';
COMMENT ON COLUMN public.users.locked_until IS 'Timestamp until which account is locked after repeated failed logins';

-- 4. Re-analyze users table
ANALYZE public.users;
