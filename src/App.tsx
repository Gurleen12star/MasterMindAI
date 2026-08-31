import { useEffect, useState } from 'react';
import { useAuth, useSession } from '@clerk/clerk-react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesGrid from '@/components/sections/FeaturesGrid';
import DemoSection from '@/components/sections/DemoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';
import EarlyAdopterSection from '@/components/sections/EarlyAdopterSection';
import FAQSection from '@/components/sections/FAQSection';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import RoadmapGeneratorPage from '@/pages/dashboard/RoadmapGeneratorPage';
import { setSupabaseToken } from '@/lib/supabase-admin';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();

  // Set up Supabase authentication with Clerk token
  useEffect(() => {
    const setupSupabase = async () => {
      if (session) {
        const token = await session.getToken({ template: 'supabase' });
        await setSupabaseToken(token);
      } else {
        await setSupabaseToken(null);
      }
    };
    setupSupabase();
  }, [session]);

  useEffect(() => {
    document.title = 'EchoVerse - AI-Powered Learning Hub';
    
    // Enable custom cursor by default
    document.documentElement.classList.add('custom-cursor-enabled');
    
    // Add keyboard shortcut (Escape) to toggle custom cursor for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.documentElement.classList.toggle('custom-cursor-enabled');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/login':
        return <LoginPage />;
      case '/signup':
        return <SignupPage />;
      default:
        if (currentPath.startsWith('/dashboard')) {
          if (!isSignedIn) {
            window.location.href = '/login';
            return null;
          }
          return <DashboardPage />;
        }
        // If not /login, /signup, or /dashboard/*, render homepage content
        return (
          <>
            <Header />
            <main className="relative z-10">
              <HeroSection />
              <FeaturesGrid />
              <DemoSection />
              <TestimonialsSection />
              <PricingSection />
              <EarlyAdopterSection />
              <FAQSection />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="echoverse-theme">
      <div className="min-h-screen relative bg-transparent antialiased overflow-x-hidden">
        <CustomCursor />
        {renderContent()}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;