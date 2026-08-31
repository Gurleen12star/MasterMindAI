import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import AuthForm from '@/components/auth/AuthForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
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
    <div className="relative min-h-screen flex">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/0" />
          <div className="absolute bottom-0 left-0 right-0 p-20">
            <blockquote className="space-y-6">
              <p className="text-3xl font-light text-foreground/80">
                "Join thousands of learners who have transformed their education journey with our AI-powered platform."
              </p>
              <footer className="text-lg">
                <cite className="font-medium text-foreground">The EchoVerse Team</cite>
                <p className="mt-1 text-muted-foreground">Empowering learners worldwide</p>
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
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Start your personalized learning journey today
            </p>
          </div>
          
          <AuthForm mode="signup" />
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}