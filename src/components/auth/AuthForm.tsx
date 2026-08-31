import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  return (
    <Auth
      supabaseClient={supabase}
      view={mode === 'login' ? 'sign_in' : 'sign_up'}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--primary-foreground))',
              brandAccent: 'hsl(var(--primary-foreground) / 0.9)',
              brandButtonText: 'hsl(var(--background))',
              defaultButtonBackground: 'hsl(var(--secondary))',
              defaultButtonBackgroundHover: 'hsl(var(--secondary) / 0.9)',
              defaultButtonBorder: 'hsl(var(--border))',
              defaultButtonText: 'hsl(var(--secondary-foreground))',
              dividerBackground: 'hsl(var(--border))',
              inputBackground: 'transparent',
              inputBorder: 'hsl(var(--border))',
              inputBorderHover: 'hsl(var(--input))',
              inputBorderFocus: 'hsl(var(--ring))',
              inputText: 'hsl(var(--foreground))',
              inputLabelText: 'hsl(var(--muted-foreground))',
              inputPlaceholder: 'hsl(var(--muted-foreground))',
              messageText: 'hsl(var(--muted-foreground))',
              messageTextDanger: 'hsl(var(--destructive))',
              anchorTextColor: 'hsl(var(--foreground))',
              anchorTextHoverColor: 'hsl(var(--primary))',
            }
          }
        },
        style: {
          button: {
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '10px 16px',
          },
          input: {
            borderRadius: '6px',
            fontSize: '14px',
            padding: '10px 12px',
          },
          label: {
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px',
          },
          message: {
            fontSize: '14px',
            marginTop: '6px',
          }
        }
      }}
      providers={['google', 'github']}
      redirectTo={`${window.location.origin}/dashboard`}
    />
  )
}