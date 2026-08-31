import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/dashboard';
    }
  }, [isSignedIn]);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
            EchoVerse
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "EchoVerse has completely transformed how I learn and grow. The personalized AI recommendations are incredibly accurate!"
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[400px]">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}