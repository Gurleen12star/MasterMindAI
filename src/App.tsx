import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LogoMarquee from '@/components/sections/LogoMarquee';
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
import ScrollReveal from '@/components/ui/ScrollReveal';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // Let the HTML preloader handle loading
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Homepage Component
function Homepage() {
  return (
    <>
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <HeroSection />
      </main>
      <LogoMarquee />
      <ScrollReveal><FeaturesGrid /></ScrollReveal>
      <ScrollReveal><DemoSection /></ScrollReveal>
      <ScrollReveal><TestimonialsSection /></ScrollReveal>
      <ScrollReveal><PricingSection /></ScrollReveal>
      <ScrollReveal><EarlyAdopterSection /></ScrollReveal>
      <ScrollReveal><FAQSection /></ScrollReveal>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = 'EchoVerse - AI-Powered Learning Hub';
    
    // Enable custom cursor after preloader disappears
    setTimeout(() => {
      document.documentElement.classList.add('custom-cursor-enabled');
      console.log('App: Added custom-cursor-enabled class');
      console.log('App: Class present?', document.documentElement.classList.contains('custom-cursor-enabled'));
    }, 500); // Wait for preloader to fully disappear (100ms delay + 300ms fade + 100ms buffer)
    
    // Add keyboard shortcut (Escape) to toggle custom cursor for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.documentElement.classList.toggle('custom-cursor-enabled');
        console.log('App: Toggled custom cursor, enabled?', document.documentElement.classList.contains('custom-cursor-enabled'));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="echoverse-theme">
      <Router>
        <div className="min-h-screen relative bg-transparent antialiased overflow-x-hidden">
          <CustomCursor />
          
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
          
          <Toaster />
          
          {/* Powered by Bolt Badge - Floating in bottom right */}
          <div className="fixed bottom-4 right-4 z-[60]">
            <a
              href="https://bolt.new/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block transition-transform duration-300 hover:scale-105"
              title="Powered by Bolt"
            >
              <div className="relative">
                <img
                  src="/black_circle_360x360.svg"
                  alt="Powered by Bolt"
                  className="transition-all duration-300 rounded-full shadow-lg w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 group-hover:shadow-xl group-hover:shadow-primary/25 backdrop-blur-sm"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;