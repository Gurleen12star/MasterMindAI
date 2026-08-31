import { createContext, useContext, useEffect, useState } from "react";
import { useSession, useAuth } from "@clerk/clerk-react";
import { setSupabaseToken } from "@/lib/supabase-admin";

interface SupabaseAuthContextType {
  isSupabaseReady: boolean;
  error?: string;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function ClerkSupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const { isSignedIn } = useAuth();
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const initSupabaseAuth = async () => {
      // Reset state on session change
      setIsSupabaseReady(false);
      setError(undefined);
      
      try {
        if (session && isSignedIn) {
          // Get the Supabase JWT token from Clerk
          const token = await session.getToken({ template: "supabase" });
          
          if (token) {
            await setSupabaseToken(token);
            setIsSupabaseReady(true);
            
            if (import.meta.env.DEV) {
              console.log('Clerk-Supabase integration: Ready');
            }
          } else {
            console.warn('Failed to get Supabase token from Clerk');
            setError('Failed to get authentication token');
            // Still allow the app to continue without database access
            setIsSupabaseReady(true);
          }
        } else {
          // Clear token when user is not signed in
          await setSupabaseToken(null);
          setIsSupabaseReady(true); // Ready for unauthenticated state
          
          if (import.meta.env.DEV) {
            console.log('Clerk-Supabase integration: Cleared (user not signed in)');
          }
        }
      } catch (error) {
        console.error("Error setting up Supabase auth:", error);
        setError(error instanceof Error ? error.message : 'Authentication setup failed');
        
        try {
          // Fallback: clear the token and continue
          await setSupabaseToken(null);
        } catch (clearError) {
          console.error("Failed to clear Supabase token:", clearError);
        }
        
        // Still mark as ready to prevent infinite loading
        setIsSupabaseReady(true);
      }
    };

    initSupabaseAuth();
  }, [session, isSignedIn]);

  // Automatically refresh token periodically if signed in
  useEffect(() => {
    if (!session || !isSignedIn) return;

    const refreshInterval = setInterval(async () => {
      try {
        const token = await session.getToken({ template: "supabase" });
        if (token) {
          await setSupabaseToken(token);
          if (import.meta.env.DEV) {
            console.log('Clerk-Supabase token refreshed');
          }
        }
      } catch (error) {
        console.error("Error refreshing Supabase token:", error);
      }
    }, 50000); // Refresh every 50 seconds (tokens typically expire in 60 seconds)

    return () => clearInterval(refreshInterval);
  }, [session, isSignedIn]);

  return (
    <SupabaseAuthContext.Provider value={{ isSupabaseReady, error }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a ClerkSupabaseProvider");
  }
  return context;
}; 