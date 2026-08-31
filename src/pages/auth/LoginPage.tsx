import { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import AuthForm from '@/components/auth/AuthForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      window.location.href = '/dashboard';
    }
  }, [isSignedIn]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        onClick={() => window.location.href = '/'}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/0" />
          <div className="absolute bottom-0 left-0 right-0 p-20">
            <blockquote className="space-y-6">
              <p className="text-3xl font-light text-foreground/80">
                "EchoVerse has revolutionized my learning journey. The AI-powered recommendations are incredibly accurate and personalized."
              </p>
              <footer className="text-lg">
                <cite className="font-medium text-foreground">Sarah Chen</cite>
                <p className="mt-1 text-muted-foreground">Software Engineer at Google</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
      
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              EchoVerse
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue learning
            </p>
          </div>
          
          <AuthForm mode="login" />
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}