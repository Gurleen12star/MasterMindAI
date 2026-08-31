import { ArrowLeft } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
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
              "Join our community of learners and unlock your full potential with AI-powered personalized learning."
            </p>
            <footer className="text-sm">The EchoVerse Team</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <AuthForm mode="signup" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}