# Supabase Setup for TLCA Gun Register

## Overview
This application uses Supabase for persistent order history storage with **real-time synchronization** across multiple users.

### Key Features
- **Real-time Multi-user Sync**: When one user adds an order, all other users see it instantly
- **Persistent Cloud Storage**: Orders are saved permanently in PostgreSQL database
- **Cross-device Access**: Access the same order history from any device or browser
- **Offline Fallback**: App continues working when offline, syncs when connection is restored

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

The table is configured with **real-time replication** enabled, allowing instant synchronization of order data across all connected users.

### 5. Real-time Synchronization

The application uses Supabase real-time subscriptions to synchronize order history across multiple users:

- **INSERT events**: When a new order is added, all users see it instantly
- **DELETE events**: When an order is deleted, it's removed from all users' views
- **UPDATE events**: When an order is modified, all users see the changes immediately

This enables multiple employees to use the system simultaneously while seeing the same up-to-date order history.

**How it works:**
1. User A adds a new order → saved to Supabase database
2. Supabase broadcasts the INSERT event to all subscribed clients
3. User B, C, and D instantly see the new order appear in their history tab
4. No page refresh required!

### 6. Security
The default migration enables Row Level Security (RLS) with a permissive policy. For production use, you should:
- Implement user authentication
- Create proper RLS policies based on user roles
- Restrict access appropriately

## Offline Support
The application includes fallback to localStorage when Supabase is unavailable, ensuring the POS system works even without internet connectivity.
