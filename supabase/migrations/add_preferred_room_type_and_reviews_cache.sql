-- Migration: Add preferred_room_type to bookings table
-- Also creates the google_reviews_cache table for the edge function
-- Run this in your Supabase SQL Editor

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Add preferred_room_type column to bookings table
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS preferred_room_type TEXT
    CHECK (preferred_room_type IN ('ac', 'non-ac'));

COMMENT ON COLUMN bookings.preferred_room_type IS
  'Preferred room type chosen by the user during booking: ac or non-ac';

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. Create google_reviews_cache table (used by the get-google-reviews edge fn)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS google_reviews_cache (
  id          INTEGER PRIMARY KEY DEFAULT 1,  -- single-row cache
  data        JSONB NOT NULL,                  -- full response from Google Places API
  fetched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one row ever exists (upsert by id = 1)
COMMENT ON TABLE google_reviews_cache IS
  'Single-row cache for Google Places reviews. Refreshed by get-google-reviews edge function every 6 hours.';

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. Row Level Security
-- ──────────────────────────────────────────────────────────────────────────────

-- google_reviews_cache: allow public read (needed by frontend), no public write
ALTER TABLE google_reviews_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of reviews cache"
  ON google_reviews_cache FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role to upsert reviews cache"
  ON google_reviews_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
