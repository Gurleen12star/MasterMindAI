import { SignIn, SignUp, useSignIn, useSignUp } from '@clerk/clerk-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-border/50 shadow-xl">
      {mode === 'login' ? (
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-card/50 backdrop-blur-sm p-6",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input focus:ring-2 focus:ring-primary/30",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
              socialButtonsIconButton: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm",
              socialButtonsBlockButton: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm font-medium",
            },
          }}
        />
      ) : (
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-card/50 backdrop-blur-sm p-6",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input focus:ring-2 focus:ring-primary/30",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
              socialButtonsIconButton: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm",
              socialButtonsBlockButton: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm font-medium",
            },
          }}
        />
      )}
    </div>
  );
}