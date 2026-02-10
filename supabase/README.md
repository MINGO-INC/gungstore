# Supabase Setup for TLCA Gun Register

## Overview
This application uses Supabase for persistent order history storage with **real-time synchronization** across multiple users.

### Key Features
- **Real-time Multi-user Sync**: When one user adds an order, all other users see it instantly
- **Persistent Cloud Storage**: Orders are saved permanently in PostgreSQL database
- **Cross-device Access**: Access the same order history from any device or browser
- **Offline Fallback**: App continues working when offline, syncs when connection is restored

## Database Schema

The gun store uses the following database tables:

### 1. **orders** - Order History
Stores all completed transactions with customer information, items purchased, and financial details.
- Real-time sync enabled for multi-user POS systems
- Tracks employee commissions and ledger amounts

### 2. **products** - Product Catalog
Manages the complete inventory of firearms, ammunition, and accessories.
- Categories: Pistols, Revolvers, Rifles, Shotguns, Repeaters, Consumables, Specials
- Includes pricing, descriptions, and stock quantities
- Pre-populated with initial product data

### 3. **employees** - Staff Management
Tracks all store employees who can process sales.
- Unique slug for employee-specific sales pages
- Active/inactive status for staff management
- Pre-populated with initial employee data

### 4. **inventory_transactions** (Optional)
Advanced inventory tracking for stock movements.
- Tracks purchases, sales, adjustments, and returns
- Links to orders for automatic inventory updates
- Includes a `product_stock_levels` view for current inventory

## Setup Instructions

### Option 1: Quick Setup via Supabase Dashboard (Recommended)

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Environment Variables**
   Create a `.env` file in the root of the project:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Run Database Migrations**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **New Query**
   - Copy and paste **ONE** of the following options:

   **Option A: All Tables (Recommended)**
   ```sql
   -- Run all migrations to create complete database
   -- Copy the contents of each file in order:
   -- 1. supabase/migrations/20260210_create_orders_table.sql
   -- 2. supabase/migrations/20260210_create_products_table.sql
   -- 3. supabase/migrations/20260210_create_employees_table.sql
   -- 4. supabase/migrations/20260210_create_inventory_table.sql
   ```
   Then paste and run each migration file one at a time.

   **Option B: Minimum Required (Just Orders)**
   ```sql
   -- Copy the contents of:
   -- supabase/migrations/20260210_create_orders_table.sql
   ```

4. **Verify Setup**
   - In Supabase dashboard, go to **Table Editor**
   - You should see the tables: `orders`, `products`, `employees`, and `inventory_transactions`
   - Products and employees tables should have initial data

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run All Migrations**
   ```bash
   supabase db push
   ```

   This will automatically run all migration files in the `supabase/migrations` folder.

## Migration Files

Located in `supabase/migrations/`:

1. **20260210_create_orders_table.sql** - Core order tracking system
2. **20260210_create_products_table.sql** - Product catalog with initial inventory
3. **20260210_create_employees_table.sql** - Employee management with initial staff
4. **20260210_create_inventory_table.sql** - Advanced inventory tracking (optional)
5. **00_run_all_migrations.sql** - Helper script to run all migrations (CLI only)

## What Gets Created

After running the migrations, your database will have:

### Tables Created
- ✅ `orders` - Order history with real-time sync
- ✅ `products` - 48 pre-loaded products across 7 categories
- ✅ `employees` - 5 pre-loaded employees (Cat, Tom, Rob, Morris, Extra)
- ✅ `inventory_transactions` - Stock movement tracking

### Initial Data
- **48 Products** including pistols, revolvers, rifles, shotguns, repeaters, consumables, and specials
- **5 Employees** ready to process sales
- **Real-time subscriptions** enabled on all tables
- **Row Level Security (RLS)** enabled with development-friendly policies

### Real-time Synchronization

The application uses Supabase real-time subscriptions to synchronize data across multiple users:

- **INSERT events**: When a new order is added, all users see it instantly
- **DELETE events**: When an order is deleted, it's removed from all users' views
- **UPDATE events**: When data is modified, all users see the changes immediately

This enables multiple employees to use the system simultaneously while seeing the same up-to-date information.

**How it works:**
1. User A adds a new order → saved to Supabase database
2. Supabase broadcasts the INSERT event to all subscribed clients
3. User B, C, and D instantly see the new order appear in their history tab
4. No page refresh required!

## Security Considerations

⚠️ **IMPORTANT: Development vs Production**

The default migrations use permissive RLS policies for easy development:
```sql
CREATE POLICY "Allow all operations" ON table_name
  FOR ALL USING (true) WITH CHECK (true);
```

**Before deploying to production, you MUST:**

1. Implement user authentication (Supabase Auth)
2. Replace permissive policies with role-based policies
3. Restrict write access to authorized users only

**Example production policies:**
```sql
-- Read-only access for customers
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Only admins can modify products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Employees can only see their own orders
CREATE POLICY "Employees view own orders" ON orders
  FOR SELECT USING (auth.uid()::text = employee_id);
```

## Offline Support

The application includes fallback to localStorage when Supabase is unavailable, ensuring the POS system works even without internet connectivity. When connection is restored, data syncs automatically.

## Troubleshooting

### Migration fails with "already exists" error
The migrations use `IF NOT EXISTS` clauses, so they're safe to run multiple times. If you see this error, the table is already created - this is normal.

### Products/Employees not showing in app
The app currently uses hardcoded data from `/src/lib/index.ts`. To use database data, you'll need to update the app to fetch from Supabase instead of using the constants.

### Real-time not working
1. Verify your Supabase URL and anon key are correct in `.env`
2. Check that real-time is enabled on your tables in Supabase dashboard
3. Ensure you're on a Supabase plan that supports real-time (free tier includes it)

### Can't connect to Supabase
1. Check your `.env` file has correct credentials
2. Verify your Supabase project is running
3. Check browser console for connection errors

## Next Steps

After setting up the database:

1. ✅ Start the development server: `npm run dev`
2. ✅ Test order creation - check if orders appear in Supabase Table Editor
3. ✅ Open app in multiple browser tabs to test real-time sync
4. 🔄 Consider updating the app to fetch products/employees from database
5. 🔒 Before production, implement authentication and proper RLS policies
