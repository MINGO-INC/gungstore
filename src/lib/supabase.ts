import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== '' && supabaseAnonKey !== '';

// Create Supabase client (will be invalid if credentials are missing, but hook handles this gracefully)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export configuration status for debugging
export const isSupabaseAvailable = isSupabaseConfigured;
