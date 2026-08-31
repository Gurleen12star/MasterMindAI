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

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();

  useEffect(() => {
    document.title = 'EchoVerse - AI-Powered Learning Hub';
    
    // Enable custom cursor by default and ensure it's always visible
    const enableCustomCursor = () => {
      document.documentElement.classList.add('custom-cursor-enabled');
      // Force cursor visibility
      document.documentElement.style.setProperty('--cursor-visibility', 'visible');
    };
    
    enableCustomCursor();
    
    // Add keyboard shortcut (Escape) to toggle custom cursor for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isEnabled = document.documentElement.classList.contains('custom-cursor-enabled');
        if (isEnabled) {
          document.documentElement.classList.remove('custom-cursor-enabled');
        } else {
          enableCustomCursor();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Ensure cursor remains visible when navigating between pages/components
    const ensureCursorVisibility = () => {
      if (document.documentElement.classList.contains('custom-cursor-enabled')) {
        const cursor = document.querySelector('.curzr-arrow-pointer') as HTMLElement;
        if (cursor) {
          cursor.style.opacity = '1';
          cursor.style.visibility = 'visible';
          cursor.style.display = 'block';
        }
      }
    };
    
    // Run visibility check periodically
    const visibilityInterval = setInterval(ensureCursorVisibility, 1000);
    
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
      // Ensure cursor visibility after navigation
      setTimeout(ensureCursorVisibility, 100);
    };

    window.addEventListener('popstate', handlePathChange);
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(visibilityInterval);
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