// Supabase configuration
// Replace these values with your Supabase project credentials
// You can find these in Supabase Dashboard > Project Settings > API

import { createClient } from '@supabase/supabase-js';

// Next.js uses NEXT_PUBLIC_ prefix for client-side environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are provided
let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-project-url' && supabaseAnonKey !== 'your-anon-key') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    supabase = null;
  }
}

export { supabase };
export default supabase;
