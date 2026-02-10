# Supabase Setup for TLCA Gun Register

## Overview
This application uses Supabase for persistent order history storage.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Environment Variables
Create a `.env` file in the root of the project with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migration
Apply the migration to create the orders table:

1. Install Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run the migration:
   ```bash
   supabase db push
   ```

Alternatively, you can manually run the SQL from `supabase/migrations/20260210_create_orders_table.sql` in the Supabase SQL editor.

### 4. Database Schema

The `orders` table includes:
- `id`: Unique order identifier
- `employee_id`: Employee who processed the order
- `employee_name`: Name of the employee
- `customer_type`: Type of customer (standard, law_doc, employee)
- `items`: JSONB array of order items
- `total_amount`: Total order amount
- `total_commission`: Commission for the employee
- `ledger_amount`: Amount going to the business ledger
- `timestamp`: Order timestamp
- `created_at`: Database creation timestamp
- `updated_at`: Last update timestamp

### 5. Security
The default migration enables Row Level Security (RLS) with a permissive policy. For production use, you should:
- Implement user authentication
- Create proper RLS policies based on user roles
- Restrict access appropriately

## Offline Support
The application includes fallback to localStorage when Supabase is unavailable, ensuring the POS system works even without internet connectivity.
