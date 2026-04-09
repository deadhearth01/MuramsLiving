-- ============================================================
-- MuramsLiving Database Schema
-- Run this entire script in Supabase → SQL Editor → New Query
-- ============================================================

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_no VARCHAR(20) NOT NULL,
  building VARCHAR(10) NOT NULL CHECK (building IN ('gold', 'silver')),
  floor_name VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building VARCHAR(10) NOT NULL CHECK (building IN ('gold', 'silver')),
  room_no VARCHAR(20),
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  join_date DATE,
  no_of_months INTEGER,
  aadhar_no VARCHAR(20),
  institution_name VARCHAR(200),
  branch VARCHAR(100),
  year_of_study VARCHAR(20),
  parent_name VARCHAR(100),
  parent_contact VARCHAR(20),
  address TEXT,
  reference VARCHAR(200),
  advance NUMERIC(10,2) DEFAULT 0,
  monthly_rent NUMERIC(10,2) DEFAULT 0,
  new_rent NUMERIC(10,2) DEFAULT 0,
  comment TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student payments table
CREATE TABLE IF NOT EXISTS student_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  building VARCHAR(10),
  room_no VARCHAR(20),
  student_name VARCHAR(100),
  month VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  payment_date DATE,
  payment_mode VARCHAR(50) DEFAULT 'cash',
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily expenses table
CREATE TABLE IF NOT EXISTS daily_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_date DATE NOT NULL,
  food_exp_name VARCHAR(200),
  food_exp_amount NUMERIC(10,2) DEFAULT 0,
  other_exp_name VARCHAR(200),
  other_exp_amount NUMERIC(10,2) DEFAULT 0,
  total_expense NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workers table (salary + contact)
CREATE TABLE IF NOT EXISTS workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  phone VARCHAR(20),
  monthly_amount NUMERIC(10,2) DEFAULT 0,
  comment TEXT,
  is_fixed_cost BOOLEAN DEFAULT false,
  cost_category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings from website
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  check_in_date DATE,
  check_in_time TIME,
  preferred_building VARCHAR(10) CHECK (preferred_building IN ('gold', 'silver', 'any')),
  selected_room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  selected_room_no VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (roles — auth is via Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact info
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT,
  label VARCHAR(100),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food menu
CREATE TABLE IF NOT EXISTS food_menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week VARCHAR(20),
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
  items TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACCESS: RLS is disabled — all access controlled at app level
-- (Admin panel requires Supabase Auth session via middleware)
-- ============================================================

-- ============================================================
-- SEED DATA
-- ============================================================

-- Gold Building Rooms
INSERT INTO rooms (room_no, building, floor_name, status) VALUES
  ('11-1', 'gold', '1st Floor', 'occupied'),
  ('11-2', 'gold', '1st Floor', 'occupied'),
  ('12-1', 'gold', '1st Floor', 'occupied'),
  ('12-2', 'gold', '1st Floor', 'occupied'),
  ('12-3', 'gold', '1st Floor', 'occupied'),
  ('13-1', 'gold', '1st Floor', 'available'),
  ('13-2', 'gold', '1st Floor', 'available'),
  ('13-3', 'gold', '1st Floor', 'available'),
  ('14-1', 'gold', '1st Floor', 'available'),
  ('14-2', 'gold', '1st Floor', 'available'),
  ('14-3', 'gold', '1st Floor', 'available'),
  ('15-1', 'gold', '1st Floor', 'available'),
  ('15-2', 'gold', '1st Floor', 'available'),
  ('15-3', 'gold', '1st Floor', 'occupied'),
  ('21-1', 'gold', '2nd Floor', 'occupied'),
  ('21-2', 'gold', '2nd Floor', 'occupied'),
  ('21-3', 'gold', '2nd Floor', 'available'),
  ('22-1', 'gold', '2nd Floor', 'available'),
  ('22-2', 'gold', '2nd Floor', 'available'),
  ('22-3', 'gold', '2nd Floor', 'available'),
  ('23-1', 'gold', '2nd Floor', 'available'),
  ('23-2', 'gold', '2nd Floor', 'available'),
  ('23-3', 'gold', '2nd Floor', 'available'),
  ('24-1', 'gold', '2nd Floor', 'available'),
  ('24-2', 'gold', '2nd Floor', 'available'),
  ('GF1-R1', 'silver', 'Ground Floor 1', 'available'),
  ('GF1-R2', 'silver', 'Ground Floor 1', 'occupied'),
  ('GF1-R3', 'silver', 'Ground Floor 1', 'occupied'),
  ('GF1-L1', 'silver', 'Ground Floor 1', 'occupied'),
  ('GF1-L2', 'silver', 'Ground Floor 1', 'occupied'),
  ('GF1-L3', 'silver', 'Ground Floor 1', 'available'),
  ('GF1-H1', 'silver', 'Ground Floor 1', 'available'),
  ('GF1-H2', 'silver', 'Ground Floor 1', 'available'),
  ('GF2-R1', 'silver', 'Ground Floor 2', 'occupied'),
  ('GF2-R2', 'silver', 'Ground Floor 2', 'occupied'),
  ('GF2-R3', 'silver', 'Ground Floor 2', 'available'),
  ('GF2-L1', 'silver', 'Ground Floor 2', 'occupied'),
  ('GF2-L2', 'silver', 'Ground Floor 2', 'occupied'),
  ('GF2-L3', 'silver', 'Ground Floor 2', 'occupied'),
  ('GF2-H1', 'silver', 'Ground Floor 2', 'available'),
  ('GF2-H2', 'silver', 'Ground Floor 2', 'available'),
  ('FF1-R1', 'silver', 'First Floor 1', 'occupied'),
  ('FF1-R2', 'silver', 'First Floor 1', 'occupied'),
  ('FF1-R3', 'silver', 'First Floor 1', 'occupied'),
  ('FF1-L1', 'silver', 'First Floor 1', 'occupied'),
  ('FF1-L2', 'silver', 'First Floor 1', 'occupied'),
  ('FF1-H1', 'silver', 'First Floor 1', 'available'),
  ('FF1-H2', 'silver', 'First Floor 1', 'available')
;

-- Workers / Fixed Monthly Costs
INSERT INTO workers (name, role, monthly_amount, is_fixed_cost, cost_category) VALUES
  ('Murali', 'Manager', 25000, false, 'salary'),
  ('Raju', 'Cook Master', 40000, false, 'salary'),
  ('Leelavathi', 'Kitchen/Sweeper', 13500, false, 'salary'),
  ('Satyavathi', 'Kitchen/Sweeper', 13500, false, 'salary'),
  ('Bhagavathi', 'Kitchen Helper', 13500, false, 'salary'),
  ('Bhanu', 'Supervisor', 10000, false, 'salary'),
  ('Power Bill - Silver', 'Utility', 15000, true, 'utility'),
  ('Power Bill - Gold', 'Utility', 30000, true, 'utility'),
  ('Other Maintenance', 'Maintenance', 20000, true, 'maintenance'),
  ('Monthly Rent - Silver Building', 'Rent', 80000, true, 'rent'),
  ('Monthly Rent - Gold Building', 'Rent', 100000, true, 'rent')
;

-- Contact Info
INSERT INTO contact_info (key, value, label) VALUES
  ('phone_primary', '+91 78160 55655', 'Primary Phone'),
  ('phone_secondary', '', 'Secondary Phone'),
  ('email', 'muramsliving@gmail.com', 'Email'),
  ('address', 'Rushikonda, Visakhapatnam, Andhra Pradesh - 530045', 'Address'),
  ('whatsapp', '+91 78160 55655', 'WhatsApp'),
  ('google_maps', 'https://maps.app.goo.gl/4nWFLswApRBM9YB87', 'Google Maps Link'),
  ('instagram', '', 'Instagram'),
  ('facebook', '', 'Facebook');
