-- Create employees table for staff management
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookup
CREATE INDEX IF NOT EXISTS idx_employees_slug ON employees(slug);

-- Create index on active status for filtering
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- ⚠️ WARNING: INSECURE DEFAULT POLICY - FOR DEVELOPMENT ONLY ⚠️
-- This policy allows unrestricted access to all employee data.
-- BEFORE DEPLOYING TO PRODUCTION, you MUST:
--   1. Implement proper user authentication (e.g., Supabase Auth)
--   2. Replace this policy with authentication-based policies
--   3. Restrict access based on user roles and permissions
-- Example production policy:
--   CREATE POLICY "Only admins can modify employees" ON employees
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow all operations on employees" ON employees
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable real-time replication for the employees table
-- This allows employee updates to sync in real-time across all users
ALTER PUBLICATION supabase_realtime ADD TABLE employees;

-- Insert initial employees data
INSERT INTO employees (id, name, slug, is_active) VALUES
  ('emp_1', 'Cat', 'cat', true),
  ('emp_2', 'Tom', 'tom', true),
  ('emp_3', 'Rob', 'rob', true),
  ('emp_4', 'Morris', 'morris', true),
  ('emp_5', 'Extra', 'extra', true)
ON CONFLICT (id) DO NOTHING;
