-- Create inventory_transactions table for tracking stock movements
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(10, 2),
  reference_order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  notes TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on product_id for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_transactions(product_id);

-- Create index on transaction_date for reporting
CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory_transactions(transaction_date DESC);

-- Create index on transaction_type for filtering
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory_transactions(transaction_type);

-- Enable Row Level Security
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- ⚠️ WARNING: INSECURE DEFAULT POLICY - FOR DEVELOPMENT ONLY ⚠️
CREATE POLICY "Allow all operations on inventory_transactions" ON inventory_transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable real-time replication for the inventory_transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_transactions;

-- Create a view for current product stock levels
CREATE OR REPLACE VIEW product_stock_levels AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.price,
  p.stock_quantity as recorded_stock,
  COALESCE(SUM(
    CASE 
      WHEN it.transaction_type IN ('purchase', 'return') THEN it.quantity
      WHEN it.transaction_type IN ('sale', 'adjustment') THEN -it.quantity
      ELSE 0
    END
  ), 0) as calculated_stock,
  p.is_active
FROM products p
LEFT JOIN inventory_transactions it ON p.id = it.product_id
GROUP BY p.id, p.name, p.category, p.price, p.stock_quantity, p.is_active;

-- Grant access to the view
GRANT SELECT ON product_stock_levels TO anon, authenticated;
