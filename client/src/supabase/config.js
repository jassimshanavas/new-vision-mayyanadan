// Supabase configuration
// Replace these values with your Supabase project credentials
// You can find these in Supabase Dashboard > Project Settings > API

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "your-project-url";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key";

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

