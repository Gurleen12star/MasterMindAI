import { SignIn, SignUp } from '@clerk/clerk-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  return (
    <div className="w-full">
      {mode === 'login' ? (
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-background border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      ) : (
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-background border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      )}
    </div>
  );
}