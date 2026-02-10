-- Complete Database Setup for Gun Store
-- Run all migrations in order to set up the complete database schema

-- This script runs all migrations in the correct order:
-- 1. Orders table (existing)
-- 2. Products table
-- 3. Employees table  
-- 4. Inventory transactions table (optional)

-- Note: Each migration file has IF NOT EXISTS clauses, so it's safe to run multiple times

\i 20260210_create_orders_table.sql
\i 20260210_create_products_table.sql
\i 20260210_create_employees_table.sql
\i 20260210_create_inventory_table.sql
