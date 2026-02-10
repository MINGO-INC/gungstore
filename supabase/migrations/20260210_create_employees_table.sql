-- Create employees table for staff management
-- Simplified to only store essential employee information
-- Sales tracking is handled in the orders table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Create index on slug for faster lookup
CREATE INDEX IF NOT EXISTS idx_employees_slug ON employees(slug);

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
INSERT INTO employees (id, name, slug) VALUES
  ('emp_1', 'Cat', 'cat'),
  ('emp_2', 'Tom', 'tom'),
  ('emp_3', 'Rob', 'rob'),
  ('emp_4', 'Morris', 'morris'),
  ('emp_5', 'Extra', 'extra')
ON CONFLICT (id) DO NOTHING;
