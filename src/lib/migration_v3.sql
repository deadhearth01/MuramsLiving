-- ============================================================
-- MuramsLiving Migration v3
-- Run this entire script in Supabase → SQL Editor → New Query
-- ============================================================

-- ── 1. site_settings (key-value store for site-wide config) ──

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('booking_preference', '"student"'),
  ('admin_notification_email', '"muramslivng@gmail.com"')
ON CONFLICT (key) DO NOTHING;

-- ── 2. admin_roles (custom roles with page access) ──────────

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  pages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_roles (name, pages) VALUES
  ('admin', '["dashboard","bookings","availability","students","payments","expenses","workers","enquiries","contact-info","users","activity-log","pricing"]'),
  ('staff', '["dashboard","bookings","availability","students","payments"]')
ON CONFLICT (name) DO NOTHING;

-- ── 3. activity_logs ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100),
  user_name VARCHAR(100),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  page VARCHAR(100),
  details TEXT,
  ip VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_page ON activity_logs(page);

-- ── 4. pricing_config ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pricing_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL CHECK (category IN ('student', 'public')),
  item_name VARCHAR(200) NOT NULL,
  amount NUMERIC(10,2) DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default student pricing
INSERT INTO pricing_config (category, item_name, amount, display_order) VALUES
  ('student', '2-Sharing Room', 8000, 1),
  ('student', '3-Sharing Room', 6500, 2),
  ('student', '4-Sharing Room', 5500, 3),
  ('public', 'Single Occupancy', 1200, 1),
  ('public', 'Double Occupancy', 900, 2),
  ('public', 'Food (per day)', 300, 3);

-- ── 5. Column additions to bookings ──────────────────────────

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_id VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'student';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);

-- ── 6. Column additions to students ──────────────────────────

ALTER TABLE students ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Expand status constraint to include 'archived'
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check
  CHECK (status IN ('active', 'inactive', 'left', 'archived'));

-- ── 7. Column additions to admin_users ───────────────────────

-- password_hash may already exist from original schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN password_hash VARCHAR(255);
  END IF;
END$$;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL;

-- ── 8. RLS policies (open — app-level security via middleware) ──

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_all" ON site_settings;
CREATE POLICY "site_settings_all" ON site_settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_roles_all" ON admin_roles;
CREATE POLICY "admin_roles_all" ON admin_roles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_logs_all" ON activity_logs;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pricing_config_all" ON pricing_config;
CREATE POLICY "pricing_config_all" ON pricing_config FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- DONE — Verify tables exist in Supabase Table Editor
-- ============================================================
