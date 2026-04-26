-- migration_v6.sql
-- Run in Supabase → SQL Editor

-- Add room_type to pricing_config for AC/Non-AC specific pricing
ALTER TABLE pricing_config
  ADD COLUMN IF NOT EXISTS room_type VARCHAR(10) CHECK (room_type IN ('ac', 'non-ac'));

-- Add check_out_date to bookings (replaces check_in_time in booking form)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS check_out_date DATE;

-- Existing pricing rows get room_type = NULL (applies to all room types)
-- Existing bookings get check_out_date = NULL (not collected previously)
