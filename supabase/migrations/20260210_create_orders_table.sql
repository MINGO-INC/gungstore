-- Create orders table for persistent order history
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  total_commission DECIMAL(10, 2) NOT NULL,
  ledger_amount DECIMAL(10, 2) NOT NULL,
  timestamp TEXT NOT NULL, -- ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ) for correct chronological sorting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on employee_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_employee_id ON orders(employee_id);

-- Create index on timestamp for faster date-based queries (ISO 8601 TEXT sorts chronologically)
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ⚠️ WARNING: INSECURE DEFAULT POLICY - FOR DEVELOPMENT ONLY ⚠️
-- This policy allows unrestricted access to all order data.
-- BEFORE DEPLOYING TO PRODUCTION, you MUST:
--   1. Implement proper user authentication (e.g., Supabase Auth)
--   2. Replace this policy with authentication-based policies
--   3. Restrict access based on user roles and permissions
-- Example production policy (after implementing auth):
--   CREATE POLICY "Users can only view their own orders" ON orders
--     FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
