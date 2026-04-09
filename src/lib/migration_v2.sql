-- ============================================================
-- Migration v2 — Run in Supabase → SQL Editor → New Query
-- Adds room hierarchy, expense_items table, RLS policies
-- ============================================================

-- 1. Add columns to rooms table (idempotent — safe to run multiple times)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER TABLE rooms ADD COLUMN room_group VARCHAR(20)';
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER TABLE rooms ADD COLUMN floor_order INTEGER DEFAULT 0';
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
END $$;

-- 2. Set room_group for Gold Building (strip trailing -N or -NA)
UPDATE rooms SET
  room_group = REGEXP_REPLACE(room_no, '-[0-9]+[A-Z]?$', ''),
  floor_order = CASE floor_name
    WHEN '1st Floor' THEN 1
    WHEN '2nd Floor' THEN 2
    WHEN '3rd Floor' THEN 3
    WHEN '4th Floor' THEN 4
    ELSE 99 END
WHERE building = 'gold';

-- 3. Set room_group for Silver Building (strip trailing digit)
UPDATE rooms SET
  room_group = REGEXP_REPLACE(room_no, '[0-9]$', ''),
  floor_order = CASE floor_name
    WHEN 'Ground Floor 1' THEN 1
    WHEN 'Ground Floor 2' THEN 2
    WHEN 'First Floor 1'  THEN 3
    WHEN 'First Floor 2'  THEN 4
    WHEN 'Second Floor 1' THEN 5
    WHEN 'Second Floor 2' THEN 6
    ELSE 99 END
WHERE building = 'silver';

-- 4. Insert missing Gold 3rd Floor rooms
INSERT INTO rooms (room_no, building, floor_name, floor_order, room_group, status) VALUES
  ('31-1', 'gold', '3rd Floor', 3, '31', 'available'),
  ('31-2', 'gold', '3rd Floor', 3, '31', 'available'),
  ('32-1', 'gold', '3rd Floor', 3, '32', 'available'),
  ('32-2', 'gold', '3rd Floor', 3, '32', 'available'),
  ('32-3', 'gold', '3rd Floor', 3, '32', 'available'),
  ('33-1', 'gold', '3rd Floor', 3, '33', 'available'),
  ('33-2', 'gold', '3rd Floor', 3, '33', 'available'),
  ('33-3', 'gold', '3rd Floor', 3, '33', 'available'),
  ('33-4', 'gold', '3rd Floor', 3, '33', 'available'),
  ('34-1', 'gold', '3rd Floor', 3, '34', 'available'),
  ('34-2', 'gold', '3rd Floor', 3, '34', 'available'),
  ('34-3', 'gold', '3rd Floor', 3, '34', 'available'),
  ('35-1', 'gold', '3rd Floor', 3, '35', 'available'),
  ('35-2', 'gold', '3rd Floor', 3, '35', 'available'),
  ('35-3', 'gold', '3rd Floor', 3, '35', 'available')
ON CONFLICT DO NOTHING;

-- 5. Insert missing Gold 4th Floor rooms
INSERT INTO rooms (room_no, building, floor_name, floor_order, room_group, status) VALUES
  ('41-1A', 'gold', '4th Floor', 4, '41', 'available'),
  ('41-2A', 'gold', '4th Floor', 4, '41', 'available'),
  ('42-1A', 'gold', '4th Floor', 4, '42', 'available'),
  ('42-2A', 'gold', '4th Floor', 4, '42', 'available'),
  ('42-3A', 'gold', '4th Floor', 4, '42', 'available'),
  ('43-1A', 'gold', '4th Floor', 4, '43', 'available'),
  ('43-2A', 'gold', '4th Floor', 4, '43', 'available'),
  ('43-3A', 'gold', '4th Floor', 4, '43', 'available'),
  ('43-4A', 'gold', '4th Floor', 4, '43', 'available'),
  ('44-1A', 'gold', '4th Floor', 4, '44', 'available'),
  ('44-2A', 'gold', '4th Floor', 4, '44', 'available'),
  ('44-3A', 'gold', '4th Floor', 4, '44', 'available'),
  ('44-4A', 'gold', '4th Floor', 4, '44', 'available'),
  ('44-5A', 'gold', '4th Floor', 4, '44', 'available'),
  ('44-6A', 'gold', '4th Floor', 4, '44', 'available')
ON CONFLICT DO NOTHING;

-- 6. Insert missing Silver SF-1 and SF-2 rooms
INSERT INTO rooms (room_no, building, floor_name, floor_order, room_group, status) VALUES
  ('SF1-R1', 'silver', 'Second Floor 1', 5, 'SF1-R', 'available'),
  ('SF1-R2', 'silver', 'Second Floor 1', 5, 'SF1-R', 'available'),
  ('SF1-R3', 'silver', 'Second Floor 1', 5, 'SF1-R', 'available'),
  ('SF1-L1', 'silver', 'Second Floor 1', 5, 'SF1-L', 'available'),
  ('SF1-L2', 'silver', 'Second Floor 1', 5, 'SF1-L', 'available'),
  ('SF1-L3', 'silver', 'Second Floor 1', 5, 'SF1-L', 'available'),
  ('SF2-R1', 'silver', 'Second Floor 2', 6, 'SF2-R', 'available'),
  ('SF2-R2', 'silver', 'Second Floor 2', 6, 'SF2-R', 'available'),
  ('SF2-R3', 'silver', 'Second Floor 2', 6, 'SF2-R', 'available'),
  ('SF2-L1', 'silver', 'Second Floor 2', 6, 'SF2-L', 'available'),
  ('SF2-L2', 'silver', 'Second Floor 2', 6, 'SF2-L', 'available'),
  ('SF2-L3', 'silver', 'Second Floor 2', 6, 'SF2-L', 'available')
ON CONFLICT DO NOTHING;

-- 7. Create expense_items table
CREATE TABLE IF NOT EXISTS expense_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_date DATE NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('food', 'maintenance', 'utility', 'other')),
  amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable RLS on all tables
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'rooms','students','student_payments','expense_items',
    'daily_expenses','workers','bookings','admin_users','contact_info','food_menu'
  ]) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- 9. Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "rooms_auth_all"         ON rooms;
DROP POLICY IF EXISTS "rooms_anon_select"      ON rooms;
DROP POLICY IF EXISTS "rooms_all"              ON rooms;
DROP POLICY IF EXISTS "bookings_auth_all"      ON bookings;
DROP POLICY IF EXISTS "bookings_anon_insert"   ON bookings;
DROP POLICY IF EXISTS "bookings_all"           ON bookings;
DROP POLICY IF EXISTS "students_auth_all"      ON students;
DROP POLICY IF EXISTS "students_all"           ON students;
DROP POLICY IF EXISTS "payments_auth_all"      ON student_payments;
DROP POLICY IF EXISTS "payments_all"           ON student_payments;
DROP POLICY IF EXISTS "expense_items_auth_all" ON expense_items;
DROP POLICY IF EXISTS "expense_items_all"      ON expense_items;
DROP POLICY IF EXISTS "daily_exp_auth_all"     ON daily_expenses;
DROP POLICY IF EXISTS "daily_exp_all"          ON daily_expenses;
DROP POLICY IF EXISTS "workers_auth_all"       ON workers;
DROP POLICY IF EXISTS "workers_all"            ON workers;
DROP POLICY IF EXISTS "admin_users_auth_all"   ON admin_users;
DROP POLICY IF EXISTS "admin_users_all"        ON admin_users;
DROP POLICY IF EXISTS "contact_info_auth_all"  ON contact_info;
DROP POLICY IF EXISTS "contact_info_all"       ON contact_info;
DROP POLICY IF EXISTS "food_menu_auth_all"     ON food_menu;
DROP POLICY IF EXISTS "food_menu_all"          ON food_menu;

-- 10. Create open RLS policies (security handled at app level via Next.js /admin middleware)
CREATE POLICY "rooms_all"          ON rooms            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "bookings_all"       ON bookings         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "students_all"       ON students         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "payments_all"       ON student_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "expense_items_all"  ON expense_items    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "daily_exp_all"      ON daily_expenses   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "workers_all"        ON workers          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_users_all"    ON admin_users      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "contact_info_all"   ON contact_info     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "food_menu_all"      ON food_menu        FOR ALL USING (true) WITH CHECK (true);
