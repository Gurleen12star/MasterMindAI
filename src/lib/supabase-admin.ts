import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Log configuration for debugging (without showing full keys)
console.log('Supabase URL configured:', !!supabaseUrl);
console.log('Supabase Anon Key configured:', !!supabaseAnonKey);
console.log('Supabase Service Key configured:', !!supabaseServiceKey);

// Create a service role client that bypasses RLS for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create a client for regular user operations (respects RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  },
  global: {
    headers: {
      'X-Client-Info': 'roadmap-generator'
    }
  }
});

// Add event listener for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session exists:', !!session);
});

// Helper function to get user ID from clerk to use with Supabase
export function getUserIdForSupabase(clerkUserId: string): string {
  return clerkUserId;
} 