import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, User, AlertCircle } from 'lucide-react';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, loading } = useAuth();
  const { profile, isLoading, needsProfileSetup } = useProfile();
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !isLoading) {
      if (needsProfileSetup) {
        // Show setup prompt for 3 seconds, then redirect
        setShowSetupPrompt(true);
        const timer = setTimeout(() => {
          navigate('/dashboard/profile-setup');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [loading, user, isLoading, needsProfileSetup, navigate]);

  // Show loading while checking authentication and profile
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading your profile...</h2>
          <p className="text-muted-foreground">Please wait while we set things up</p>
        </Card>
      </div>
    );
  }

  // Show setup prompt if profile is incomplete
  if (showSetupPrompt && needsProfileSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <Card className="p-8 text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Profile Setup Required</h2>
          <p className="text-muted-foreground mb-6">
            To get the most out of EchoVerse, we need to learn a bit about you first.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Redirecting to profile setup...
            </div>
            
            <Progress value={66} className="w-full" />
            
            <Button 
              onClick={() => navigate('/dashboard/profile-setup')}
              className="w-full"
            >
              Set Up Profile Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If profile is complete, render children
  return <>{children}</>;
}