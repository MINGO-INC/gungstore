-- Create products table for gun inventory management
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('Pistols', 'Revolvers', 'Rifles', 'Shotguns', 'Repeaters', 'Consumables', 'Specials')),
  description TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on active status for filtering
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ⚠️ WARNING: INSECURE DEFAULT POLICY - FOR DEVELOPMENT ONLY ⚠️
-- This policy allows unrestricted access to all product data.
-- BEFORE DEPLOYING TO PRODUCTION, you MUST:
--   1. Implement proper user authentication (e.g., Supabase Auth)
--   2. Replace this policy with authentication-based policies
--   3. Restrict write access to admin users only
-- Example production policies:
--   CREATE POLICY "Anyone can view active products" ON products
--     FOR SELECT USING (is_active = true);
--   CREATE POLICY "Only admins can modify products" ON products
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable real-time replication for the products table
-- This allows product inventory updates to sync in real-time across all users
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Insert initial products data
INSERT INTO products (id, name, price, category, is_special) VALUES
  -- Pistols
  ('pi_1', 'Colt 1911', 450.00, 'Pistols', false),
  ('pi_2', 'Mauser', 35.00, 'Pistols', false),
  ('pi_3', 'Semi-Auto', 35.00, 'Pistols', false),
  ('pi_4', 'Volcanic', 35.00, 'Pistols', false),
  ('pi_5', 'Luger', 350.00, 'Pistols', false),
  ('pi_6', '1899', 450.00, 'Pistols', false),
  
  -- Revolvers
  ('rv_1', 'Schofield', 10.00, 'Revolvers', false),
  ('rv_2', 'Double Action', 25.00, 'Revolvers', false),
  ('rv_3', 'Navy', 35.00, 'Revolvers', false),
  ('rv_4', 'LeMat', 35.00, 'Revolvers', false),
  ('rv_5', '44 Model 1875', 330.00, 'Revolvers', false),
  ('rv_6', 'Gambler''s', 370.00, 'Revolvers', false),
  ('rv_7', 'Webley', 370.00, 'Revolvers', false),
  ('rv_8', 'Walker', 450.00, 'Revolvers', false),
  
  -- Rifles
  ('rf_1', 'Springfield', 70.00, 'Rifles', false),
  ('rf_2', 'Tranquilizer', 75.00, 'Rifles', false),
  ('rf_3', 'Bolt-Action', 75.00, 'Rifles', false),
  ('rf_4', 'Sharps / Martini', 350.00, 'Rifles', false),
  ('rf_5', 'Gewehr 98', 400.00, 'Rifles', false),
  ('rf_6', 'Lee-Enfield', 400.00, 'Rifles', false),
  ('rf_7', 'Mosin', 400.00, 'Rifles', false),
  ('rf_8', 'Elephant Rifle', 500.00, 'Rifles', false),
  ('rf_9', 'Rolling Block', 1000.00, 'Rifles', false),
  ('rf_10', 'Carcano', 1000.00, 'Rifles', false),
  
  -- Shotguns
  ('sg_1', 'Sawn-Off', 35.00, 'Shotguns', false),
  ('sg_2', 'Double Barrel', 45.00, 'Shotguns', false),
  ('sg_3', 'Semi-Auto', 55.00, 'Shotguns', false),
  ('sg_4', 'Repeating', 70.00, 'Shotguns', false),
  ('sg_5', 'Pump-Action', 75.00, 'Shotguns', false),
  ('sg_6', 'Coach Gun', 300.00, 'Shotguns', false),
  ('sg_7', 'Exotic Double', 400.00, 'Shotguns', false),
  
  -- Repeaters
  ('rp_1', 'Evans', 25.00, 'Repeaters', false),
  ('rp_2', 'Carbine', 55.00, 'Repeaters', false),
  ('rp_3', 'Winchester', 55.00, 'Repeaters', false),
  ('rp_4', 'Mare''s Leg', 350.00, 'Repeaters', false),
  ('rp_5', 'Henry', 370.00, 'Repeaters', false),
  
  -- Consumables
  ('co_1', 'Gun Oil', 0.50, 'Consumables', false),
  ('co_2', 'Pistol Ammo', 3.00, 'Consumables', false),
  ('co_3', 'Gunpowder', 1.00, 'Consumables', false),
  ('co_4', 'Shell Casting', 0.30, 'Consumables', false),
  ('co_5', 'Engraving Plate', 20.00, 'Consumables', false),
  
  -- Specials
  ('sp_1', 'Exotic Double (Master Crafted)', 1200.00, 'Specials', true),
  ('sp_2', 'Engraved Rolling Block Rifle', 2500.00, 'Specials', true)
ON CONFLICT (id) DO NOTHING;

-- Update descriptions for special items
UPDATE products SET description = 'Limited custom-built shotgun.' WHERE id = 'sp_1';
UPDATE products SET description = 'Finely engraved long-range rifle.' WHERE id = 'sp_2';
