-- ============================================================
-- Run this in Supabase → SQL Editor → New Query → Run
-- This unblocks all data access for the admin panel
-- ============================================================

ALTER TABLE rooms               DISABLE ROW LEVEL SECURITY;
ALTER TABLE students            DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_payments    DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_expenses      DISABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items       DISABLE ROW LEVEL SECURITY;
ALTER TABLE workers             DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings            DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info        DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_menu           DISABLE ROW LEVEL SECURITY;
