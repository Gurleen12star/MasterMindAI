import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
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

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    document.title = 'EchoVerse - AI-Powered Learning Hub';
    
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
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
      case '/dashboard':
        return isSignedIn ? (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
          </div>
        ) : (
          window.location.href = '/login'
        );
      default:
        return (
          <>
            <Header />
            <main>
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
      <div className="min-h-screen bg-background antialiased overflow-x-hidden">
        {renderContent()}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;