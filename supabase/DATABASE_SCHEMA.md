# Database Schema Documentation

## Entity Relationship Diagram

```
┌─────────────────────────────────┐
│          EMPLOYEES              │
├─────────────────────────────────┤
│ PK  id          TEXT            │
│     name        TEXT            │
│ UK  slug        TEXT            │
│     email       TEXT?           │
│     phone       TEXT?           │
│     is_active   BOOLEAN         │
│     hire_date   DATE?           │
│     created_at  TIMESTAMPTZ     │
│     updated_at  TIMESTAMPTZ     │
└─────────────────────────────────┘
          │
          │ employee_id
          │
          ▼
┌─────────────────────────────────┐
│           ORDERS                │
├─────────────────────────────────┤
│ PK  id                TEXT      │
│ FK  employee_id       TEXT      │
│     employee_name     TEXT      │
│     customer_type     TEXT      │
│     items             JSONB     │
│     total_amount      DECIMAL   │
│     total_commission  DECIMAL   │
│     ledger_amount     DECIMAL   │
│     timestamp         TEXT      │
│     created_at        TIMESTAMPTZ│
│     updated_at        TIMESTAMPTZ│
└─────────────────────────────────┘
          │                    ▲
          │ reference_order_id │
          ▼                    │
┌─────────────────────────────────┐
│   INVENTORY_TRANSACTIONS        │
├─────────────────────────────────┤
│ PK  id               UUID       │
│ FK  product_id       TEXT       │
│     transaction_type TEXT       │
│     quantity         INTEGER    │
│     unit_cost        DECIMAL?   │
│     total_cost       DECIMAL?   │
│ FK  reference_order_id TEXT?    │
│     notes            TEXT?      │
│     transaction_date TIMESTAMPTZ│
│     created_by       TEXT?      │
│     created_at       TIMESTAMPTZ│
└─────────────────────────────────┘
          ▲
          │ product_id
          │
┌─────────────────────────────────┐
│          PRODUCTS               │
├─────────────────────────────────┤
│ PK  id             TEXT         │
│     name           TEXT         │
│     price          DECIMAL      │
│     category       TEXT         │
│     description    TEXT?        │
│     stock_quantity INTEGER      │
│     is_active      BOOLEAN      │
│     is_special     BOOLEAN      │
│     created_at     TIMESTAMPTZ  │
│     updated_at     TIMESTAMPTZ  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│    PRODUCT_STOCK_LEVELS (VIEW)  │
├─────────────────────────────────┤
│     id              TEXT        │
│     name            TEXT        │
│     category        TEXT        │
│     price           DECIMAL     │
│     recorded_stock  INTEGER     │
│     calculated_stock INTEGER    │
│     is_active       BOOLEAN     │
└─────────────────────────────────┘
```

## Tables Overview

### 1. ORDERS (Core Transaction Table)
**Purpose:** Stores all completed sales transactions with detailed financial breakdown.

**Key Features:**
- Real-time synchronization enabled
- Tracks employee performance (commissions)
- Stores customer type for discount calculations
- JSONB items field for flexible order structure

**Indexes:**
- `idx_orders_employee_id` - Fast employee-specific queries
- `idx_orders_timestamp` - Date-based reporting

**Sample Data Structure:**
```json
{
  "id": "order_123",
  "employee_id": "emp_1",
  "employee_name": "Cat",
  "customer_type": "standard",
  "items": [
    {
      "productId": "pi_1",
      "name": "Colt 1911",
      "unitPrice": 450.00,
      "quantity": 1,
      "discountedPrice": 450.00,
      "totalPrice": 450.00,
      "commission": 112.50
    }
  ],
  "total_amount": 450.00,
  "total_commission": 112.50,
  "ledger_amount": 337.50,
  "timestamp": "2026-02-10T22:30:00.000Z"
}
```

### 2. PRODUCTS (Inventory Catalog)
**Purpose:** Manages the complete catalog of firearms, ammunition, and accessories.

**Key Features:**
- 48 pre-loaded products across 7 categories
- Stock quantity tracking
- Active/inactive product management
- Special item flagging

**Categories:**
- Pistols (6 items)
- Revolvers (8 items)
- Rifles (10 items)
- Shotguns (7 items)
- Repeaters (5 items)
- Consumables (5 items)
- Specials (2 items)

**Indexes:**
- `idx_products_category` - Fast category filtering
- `idx_products_active` - Quick active product queries

**Sample Record:**
```sql
id: 'pi_1'
name: 'Colt 1911'
price: 450.00
category: 'Pistols'
stock_quantity: 0
is_active: true
is_special: false
```

### 3. EMPLOYEES (Staff Management)
**Purpose:** Stores minimal employee information for sales tracking and routing.

**Key Features:**
- Simplified structure with only essential fields
- Unique slug for URL routing (e.g., /employee/cat)
- Sales tracking handled in orders table
- 5 pre-loaded employees

**Fields:**
- `id` - Unique employee identifier
- `name` - Employee name for display
- `slug` - URL-friendly identifier for routing

**Indexes:**
- `idx_employees_slug` - Fast URL slug lookups

**Pre-loaded Employees:**
- Cat (emp_1, slug: cat)
- Tom (emp_2, slug: tom)
- Rob (emp_3, slug: rob)
- Morris (emp_4, slug: morris)
- Extra (emp_5, slug: extra)

**Note:** Employee sales are tracked in the `orders` table with `employee_id` and `employee_name` fields. The orders table provides complete sales history including items, amounts, commissions, and timestamps.

### 4. INVENTORY_TRANSACTIONS (Stock Tracking)
**Purpose:** Optional advanced inventory tracking for stock movements.

**Key Features:**
- Tracks all stock changes (purchases, sales, adjustments, returns)
- Links to orders for automatic inventory updates
- Transaction-level cost tracking
- Audit trail with timestamps

**Transaction Types:**
- `purchase` - Stock received from suppliers
- `sale` - Stock sold to customers
- `adjustment` - Manual stock corrections
- `return` - Customer returns

**Indexes:**
- `idx_inventory_product` - Product-specific transaction history
- `idx_inventory_date` - Date-based reporting
- `idx_inventory_type` - Filter by transaction type

### 5. PRODUCT_STOCK_LEVELS (View)
**Purpose:** Provides real-time calculated stock levels based on transactions.

**Features:**
- Compares recorded vs. calculated stock
- Identifies inventory discrepancies
- Read-only view for reporting

## Real-time Features

All tables have real-time replication enabled via Supabase:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE table_name;
```

**Benefits:**
- Multi-user synchronization
- Instant updates across all connected clients
- No manual refresh required
- Live inventory tracking

## Security Model

### Row Level Security (RLS)
All tables have RLS enabled with development-friendly policies:

```sql
-- Development Policy (⚠️ INSECURE - FOR DEV ONLY)
CREATE POLICY "Allow all operations" ON table_name
  FOR ALL USING (true) WITH CHECK (true);
```

### Production Security Checklist
Before deploying to production:

- [ ] Implement Supabase Auth
- [ ] Create role-based RLS policies
- [ ] Restrict admin operations
- [ ] Add user authentication checks
- [ ] Implement audit logging

**Example Production Policies:**
```sql
-- Read-only for regular users
CREATE POLICY "View active products" ON products
  FOR SELECT USING (is_active = true);

-- Admin-only modifications
CREATE POLICY "Admin can modify products" ON products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Employees see own orders
CREATE POLICY "View own orders" ON orders
  FOR SELECT USING (
    auth.uid()::text = employee_id
  );
```

## Data Relationships

### Primary Relationships
1. **EMPLOYEES → ORDERS**: One-to-Many
   - Each employee can have multiple orders
   - `orders.employee_id` references `employees.id`

2. **PRODUCTS → INVENTORY_TRANSACTIONS**: One-to-Many
   - Each product can have multiple transactions
   - `inventory_transactions.product_id` references `products.id`

3. **ORDERS → INVENTORY_TRANSACTIONS**: One-to-Many (Optional)
   - Each order can create multiple inventory transactions
   - `inventory_transactions.reference_order_id` references `orders.id`

### Data Integrity
- Foreign key constraints with CASCADE/SET NULL behavior
- Check constraints on numeric fields (price >= 0, stock >= 0)
- Enum constraints on category and transaction_type fields
- Unique constraints on critical fields (employee.slug)

## Performance Optimizations

### Indexes
All tables have strategic indexes:
- Primary keys (automatic B-tree indexes)
- Foreign keys for join performance
- Category/type fields for filtering
- Timestamp fields for date-range queries

### JSONB Usage
The `orders.items` field uses JSONB for:
- Flexible order item structure
- Fast queries with GIN indexes (if needed)
- Preserves historical data even if products change

## Migration Strategy

### Initial Setup
Run migrations in order:
1. `20260210_create_orders_table.sql`
2. `20260210_create_products_table.sql`
3. `20260210_create_employees_table.sql`
4. `20260210_create_inventory_table.sql`

### Idempotent Design
All migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`:
- Safe to run multiple times
- No data loss on re-run
- Easy rollback strategy

### CLI vs Manual
**Option 1: Supabase CLI**
```bash
supabase db push
```

**Option 2: SQL Editor**
Copy/paste each migration file into Supabase SQL Editor and run.

## Sample Queries

### Get employee sales summary
```sql
SELECT 
  e.name,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_sales,
  SUM(o.total_commission) as total_commission
FROM employees e
LEFT JOIN orders o ON e.id = o.employee_id
GROUP BY e.id, e.name
ORDER BY total_sales DESC;
```

### Get product inventory status
```sql
SELECT *
FROM product_stock_levels
WHERE is_active = true
ORDER BY category, name;
```

### Get today's sales
```sql
SELECT *
FROM orders
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Top selling products
```sql
SELECT 
  jsonb_array_elements(items) ->> 'name' as product_name,
  SUM((jsonb_array_elements(items) ->> 'quantity')::int) as total_sold,
  SUM((jsonb_array_elements(items) ->> 'totalPrice')::decimal) as total_revenue
FROM orders
GROUP BY product_name
ORDER BY total_sold DESC
LIMIT 10;
```

## Future Enhancements

Potential additions to the schema:

### 1. Customer Management
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  customer_type TEXT,
  total_purchases DECIMAL,
  created_at TIMESTAMPTZ
);
```

### 2. Suppliers
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  name TEXT,
  contact_info JSONB,
  products TEXT[],
  created_at TIMESTAMPTZ
);
```

### 3. Purchase Orders
```sql
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id),
  items JSONB,
  status TEXT,
  total_amount DECIMAL,
  created_at TIMESTAMPTZ
);
```

### 4. User Accounts (with Supabase Auth)
```sql
-- Extends Supabase auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  employee_id TEXT REFERENCES employees(id),
  role TEXT,
  permissions JSONB,
  created_at TIMESTAMPTZ
);
```

## Maintenance

### Regular Tasks
- Monitor table sizes and index performance
- Archive old orders (older than 1 year)
- Reconcile inventory transactions
- Update RLS policies as requirements change
- Review and optimize slow queries

### Backup Strategy
- Supabase provides automatic daily backups
- Consider point-in-time recovery for production
- Export critical data periodically
- Test restore procedures

---

**Documentation Version:** 1.0  
**Last Updated:** February 10, 2026  
**Schema Version:** 1.0.0
