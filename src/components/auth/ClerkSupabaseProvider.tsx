import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@clerk/clerk-react";
import { setSupabaseToken } from "@/lib/supabase-admin";

interface SupabaseAuthContextType {
  isSupabaseReady: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function ClerkSupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    const initSupabaseAuth = async () => {
      // Set to false initially on session change
      setIsSupabaseReady(false);
      
      if (session) {
        try {
          const token = await session.getToken({ template: "supabase" });
          await setSupabaseToken(token);
          setIsSupabaseReady(true);
        } catch (error) {
          console.error("Error setting Supabase token:", error);
          await setSupabaseToken(null);
        }
      } else {
        await setSupabaseToken(null);
      }
    };

    initSupabaseAuth();
  }, [session]);

  return (
    <SupabaseAuthContext.Provider value={{ isSupabaseReady }}>
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