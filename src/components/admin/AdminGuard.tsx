import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdmin();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Checking admin privileges...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access</p>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <CardDescription>You do not have administrator privileges</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-6 text-muted-foreground">
              This area is restricted to administrators only. If you believe this is an error, please contact support.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is an admin, allow access
  return <>{children}</>;
}