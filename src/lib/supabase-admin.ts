import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    persistSession: false, // We'll handle auth via Clerk
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'roadmap-generator'
    }
  }
});

// Function to set the auth token for the Supabase client
export const setSupabaseToken = async (token: string | null) => {
  try {
    if (token) {
      // Set the JWT token as a session for RLS policies to work
      const { data, error } = await supabaseClient.auth.setSession({
        access_token: token,
        refresh_token: '', // Clerk handles refresh tokens
      });
      
      if (error) {
        // Only log session errors in development and if they're not just "missing session" warnings
        if (import.meta.env.DEV && !error.message.includes('Auth session missing')) {
          console.error('Supabase session setting error:', error.message);
        }
        // Don't throw here, continue with the request as the token might still work for RLS
      } else {
        if (import.meta.env.DEV) {
          console.log('Supabase JWT token set successfully');
        }
      }
    } else {
      // Clear the session silently
      try {
        await supabaseClient.auth.signOut();
      } catch (signOutError) {
        // Ignore signout errors as they're not critical
        if (import.meta.env.DEV) {
          console.log('Supabase signout completed (with minor warnings)');
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('Supabase JWT token cleared');
      }
    }
  } catch (error) {
    // Only log significant errors that aren't auth session warnings
    if (error instanceof Error && !error.message.includes('Auth session missing')) {
      console.error('Error setting Supabase token:', error);
    }
    // Don't throw here to prevent breaking the app
  }
};

// Helper function to create a query builder with explicit JWT token
export const createAuthenticatedQuery = (tableName: string) => {
  const query = supabaseClient.from(tableName);
  
  // If we have a current JWT token, add it to the request headers
  if (currentJwtToken) {
    // Create a copy of the query with the Authorization header
    const originalRpc = query.rpc;
    const originalSelect = query.select;
    const originalInsert = query.insert;
    const originalUpdate = query.update;
    const originalDelete = query.delete;
    
    // Override the internal request method to include Authorization header
    // @ts-ignore - accessing private property for header injection
    const originalRequest = query.then?.bind(query);
    if (originalRequest) {
      // @ts-ignore
      query.then = function(resolve, reject) {
        // Add Authorization header to this specific request
        if (this.headers) {
          this.headers['Authorization'] = `Bearer ${currentJwtToken}`;
        } else {
          // @ts-ignore
          this.headers = { 'Authorization': `Bearer ${currentJwtToken}` };
        }
        return originalRequest.call(this, resolve, reject);
      };
    }
  }
  
  return query;
};

// Export the client as supabaseAdmin for backward compatibility
// This will prevent breaking changes in components
export const supabaseAdmin = supabaseClient;

// Add event listener for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.DEV) {
    console.log('Supabase auth event:', event);
    console.log('Session exists:', !!session);
    if (session?.user) {
      console.log('Supabase user ID:', session.user.id);
    }
  }
});

// Helper function to get user ID from clerk to use with Supabase
export function getUserIdForSupabase(clerkUserId: string): string {
  return clerkUserId;
}

// Get current JWT token (for debugging)
export const getCurrentJwtToken = () => currentJwtToken; 