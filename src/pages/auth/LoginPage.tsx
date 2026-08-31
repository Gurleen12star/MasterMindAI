import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import AuthForm from '@/components/auth/AuthForm';
import EchoVerseLogo from '@/components/ui/EchoVerseLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function LoginPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setMounted(true);
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex bg-[#111]">
      {/* Left side: Login form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8">
            <Link to="/">
              <EchoVerseLogo className="h-10 w-auto text-primary" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-6">Log in</h1>
          
          <AuthForm mode="login" />

          <p className="text-sm text-gray-400 mt-6 text-center">
            <a href="#" className="font-medium text-white hover:underline">
              Continue with SSO
            </a>
          </p>
        </div>
      </div>

      {/* Right side: Gradient panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#1E1E1E] items-center justify-center p-8 rounded-l-2xl">
        <div className="w-full max-w-md">
          <div className="relative">
            <Input
              placeholder="Ask EchoVerse to build your..."
              className="w-full h-14 bg-[#1E1E1E] backdrop-blur-sm text-foreground placeholder:text-muted-foreground border-border/20 rounded-full px-6 pr-16"
            />
            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}