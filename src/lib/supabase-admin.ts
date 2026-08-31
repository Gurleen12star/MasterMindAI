import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// SECURITY: Service role key should not be used in client-side code
// const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Log configuration for debugging (without showing full keys)
console.log('Supabase URL configured:', !!supabaseUrl);
console.log('Supabase Anon Key configured:', !!supabaseAnonKey);
// console.log('Supabase Service Key configured:', !!supabaseServiceKey);

interface ClientOptions {
  auth?: {
    autoRefreshToken?: boolean;
    persistSession?: boolean;
  };
}

// Create a standard supabase client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'roadmap-generator'
    }
  }
});

// Export the client as supabaseAdmin for backward compatibility
// This will prevent breaking changes in components
export const supabaseAdmin = supabaseClient;

// Add event listener for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.DEV) {
    console.log('Supabase auth event:', event);
    console.log('Session exists:', !!session);
  }
});

// Helper function to get user ID from clerk to use with Supabase
export function getUserIdForSupabase(clerkUserId: string): string {
  return clerkUserId;
} 