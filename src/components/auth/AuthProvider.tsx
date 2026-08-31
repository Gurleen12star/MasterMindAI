import { SupabaseAuthProvider } from './SupabaseAuthProvider';
import { DemoSessionProvider } from './DemoSessionProvider';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  if (isDemoMode) {
    return <DemoSessionProvider>{children}</DemoSessionProvider>;
  }

  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

// Re-export useAuth from AuthContext for backward compatibility
export { useAuth } from './AuthContext';
