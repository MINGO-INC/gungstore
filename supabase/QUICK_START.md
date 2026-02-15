# Quick Database Setup Guide

This guide will help you create all the necessary database tables for your gun store in Supabase.

## Prerequisites
- A Supabase account and project created at [supabase.com](https://supabase.com)
- Your Supabase URL and anon key configured in `.env` file

## 5-Minute Setup

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Each Migration

Copy and paste the content of each migration file below into the SQL Editor and click **Run**:

#### Migration 1: Orders Table (REQUIRED)
```
File: supabase/migrations/20260210_create_orders_table.sql
```
This creates the core orders table for tracking all sales transactions.

#### Migration 2: Products Table (RECOMMENDED)
```
File: supabase/migrations/20260210_create_products_table.sql
```
This creates the products table and populates it with 48 firearms and accessories.

#### Migration 3: Employees Table (RECOMMENDED)
```
File: supabase/migrations/20260210_create_employees_table.sql
```
This creates the employees table and populates it with 5 initial staff members.

#### Migration 4: Inventory Tracking (OPTIONAL)
```
File: supabase/migrations/20260210_create_inventory_table.sql
```
This creates advanced inventory tracking for stock management.

### Step 3: Verify Setup

After running the migrations:

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `orders`
   - `products` (with 48 items)
   - `employees` (with 5 people)
   - `inventory_transactions` (if you ran migration 4)

3. Click on `products` table to verify it has data
4. Click on `employees` table to verify it has data

### Step 4: Test the App

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Go to an employee's sales page (e.g., `/employee/cat`)

4. Add some items and complete a sale

5. Go to the **Order History** page (`/history`)

6. Verify your sale appears in the order history

7. Open the Supabase **Table Editor** -> `orders` table to see the order in the database

8. (Optional) Open the app in another browser tab - add an order in one tab and watch it appear in real-time in the other tab!

## What You Just Created

### Database Tables
- **orders** - Stores all completed sales transactions with employee tracking
- **products** - Complete catalog of firearms and accessories
- **employees** - Minimal employee data (id, name, slug) for routing and sales
- **inventory_transactions** - Track stock movements (optional)

### Pre-loaded Data
- **48 Products** across 7 categories:
  - 6 Pistols (Colt 1911, Mauser, Semi-Auto, Volcanic, Luger, 1899)
  - 8 Revolvers (Schofield, Double Action, Navy, LeMat, 44 Model 1875, Gambler's, Webley, Walker)
  - 10 Rifles (Springfield, Tranquilizer, Bolt-Action, Sharps/Martini, Gewehr 98, Lee-Enfield, Mosin, Elephant Rifle, Rolling Block, Carcano)
  - 7 Shotguns (Sawn-Off, Double Barrel, Semi-Auto, Repeating, Pump-Action, Coach Gun, Exotic Double)
  - 5 Repeaters (Evans, Carbine, Winchester, Mare's Leg, Henry)
  - 5 Consumables (Gun Oil, Pistol Ammo, Gunpowder, Shell Casting, Engraving Plate)
  - 2 Specials (Exotic Double Master Crafted, Engraved Rolling Block Rifle)

- **5 Employees**: Cat, Tom, Rob, Morris, Extra

### Features Enabled
- Real-time synchronization across multiple users
- Persistent cloud storage
- Row Level Security (development mode)
- Automatic timestamps
- Database indexes for fast queries

## Troubleshooting

**"relation already exists" error**
- This is normal! It means the table was already created. You can safely ignore this.

**Products/Employees not showing in the app**
- The app currently uses hardcoded data from the source code
- To use database data, you'll need to modify the app code to fetch from Supabase
- The database is ready - it's just not being used by the app yet

**Orders not saving to database**
- Check your `.env` file has the correct Supabase URL and anon key
- Make sure you ran the orders migration (Migration 1)
- Check browser console for errors

**Real-time sync not working**
- Ensure all migrations ran successfully
- Verify Supabase project is on a plan that supports real-time (free tier works!)
- Check browser console for connection errors

## Next Steps

- Database is set up and ready.
- Test creating orders and view them in real-time.
- Consider updating the app to fetch products from database instead of hardcoded data.
- Before going to production, implement proper authentication and security policies.

## Need Help?

- Full documentation: `supabase/README.md`
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

**That's it! Your gun store database is ready to use.**
