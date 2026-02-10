import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Common placeholder values that indicate Supabase is not configured
const placeholderUrl = 'https://your-project-ref.supabase.co';
const placeholderKey = 'your-anon-key-here';

// Check if Supabase is properly configured
// Reject empty values and common placeholders
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== '' && supabaseAnonKey !== '' &&
  supabaseUrl !== placeholderUrl && supabaseAnonKey !== placeholderKey;

// Create Supabase client only if credentials are available
// When credentials are missing, export null - the app will use localStorage fallback
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Export configuration status for debugging
export const isSupabaseAvailable = isSupabaseConfigured;
