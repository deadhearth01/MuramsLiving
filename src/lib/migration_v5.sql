-- ============================================================
-- MuramsLiving Migration v5 — Public Pricing Redesign
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Add price_type column: 'per_adult', 'per_child', or 'item' (default)
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS price_type VARCHAR(20) DEFAULT 'item';

-- 2. Mark existing student rows as 'item' (they already are by default)
UPDATE pricing_config SET price_type = 'item' WHERE category = 'student';

-- 3. Delete old public occupancy rows (Single/Double Occupancy) for both buildings
DELETE FROM pricing_config
WHERE category = 'public'
  AND item_name IN ('Single Occupancy', 'Double Occupancy');

-- 4. Update remaining public items (e.g. Food) to price_type = 'item'
UPDATE pricing_config SET price_type = 'item' WHERE category = 'public' AND price_type IS NULL;

-- 5. Insert per_adult and per_child rates for Gold building
INSERT INTO pricing_config (category, building, item_name, amount, display_order, is_visible, price_type) VALUES
  ('public', 'gold', 'Per Adult (per night)', 1200, 1, true, 'per_adult'),
  ('public', 'gold', 'Per Child (per night)', 600, 2, true, 'per_child');

-- 6. Insert per_adult and per_child rates for Silver building
INSERT INTO pricing_config (category, building, item_name, amount, display_order, is_visible, price_type) VALUES
  ('public', 'silver', 'Per Adult (per night)', 1000, 1, true, 'per_adult'),
  ('public', 'silver', 'Per Child (per night)', 500, 2, true, 'per_child');

-- ============================================================
-- DONE — Verify in Table Editor: pricing_config now has price_type column
-- ============================================================
