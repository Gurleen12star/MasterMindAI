import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { ClerkSupabaseProvider } from './components/auth/ClerkSupabaseProvider.tsx';

// Add console logs for debugging
console.log('Starting application...');
console.log('Environment variables loaded:', {
  hasClerkKey: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

// Get the root element
const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="color:red; padding: 20px;">Error: Root element not found</div>';
  throw new Error('Root element not found');
}

try {
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    console.error('Missing Clerk Publishable Key');
    rootElement.innerHTML = '<div style="color:red; padding: 20px;">Error: Missing Clerk Publishable Key</div>';
    throw new Error('Missing Clerk Publishable Key');
  }

  console.log('Rendering application...');
  
  createRoot(rootElement).render(
    <StrictMode>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <ClerkSupabaseProvider>
          <App />
        </ClerkSupabaseProvider>
      </ClerkProvider>
    </StrictMode>
  );
  
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to render application:', error);
  rootElement.innerHTML = `<div style="color:red; padding: 20px;">
    <h2>Error Rendering Application</h2>
    <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
  </div>`;
}
