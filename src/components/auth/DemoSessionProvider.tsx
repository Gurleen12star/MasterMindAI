import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';

const DEMO_USER: User = {
  id: 'demo-user-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@mastermind.ai',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {
    first_name: 'Demo',
    last_name: 'Learner',
    avatar_url: ''
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'demo-refresh-token',
  user: DEMO_USER,
};

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setSession(DEMO_SESSION);
      setUser(DEMO_USER);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signOut = async () => {
    // In demo mode, sign out just clears the local state and refreshes the page
    sessionStorage.clear();
    window.location.href = '/';
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    isDemoMode: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
