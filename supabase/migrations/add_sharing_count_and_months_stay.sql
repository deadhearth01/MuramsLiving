-- Add sharing_count to pricing_config (maps sharing bed items to bed count 2/3/4)
ALTER TABLE pricing_config
  ADD COLUMN IF NOT EXISTS sharing_count INTEGER CHECK (sharing_count IN (2, 3, 4));

-- Add months_stay to bookings (for student long-term stays)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS months_stay INTEGER;
