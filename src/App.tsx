import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CursorProvider } from '@/contexts/CursorContext';
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
import AboutPage from '@/pages/AboutPage';
import BlogPage from '@/pages/BlogPage';
import CareersPage from '@/pages/CareersPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import DocsPage from '@/pages/DocsPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import EntryPage from '@/pages/EntryPage';
import OnboardingIntroPage from '@/pages/OnboardingIntroPage';
import OnboardingPage from '@/pages/OnboardingPage';
import AnalyzingPage from '@/pages/AnalyzingPage';
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
    <div className="relative">
      {/* Enhanced Lined/Grid Background */}
      <div className="fixed inset-0 bg-grid-enhanced pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90 pointer-events-none" />
      
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
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = 'MasterMindAI - AI-Powered Learning Hub';
    
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
    <ThemeProvider defaultTheme="dark" storageKey="mastermind-theme">
      <CursorProvider>
        <Router>
          <div className="min-h-screen relative bg-transparent antialiased overflow-x-hidden">
            {/* Custom cursor removed */}
            
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/docs" element={<DocsPage />} />
              {/* Phase 2A: public routes — no auth required (works in demo mode) */}
              <Route path="/entry" element={<EntryPage />} />
              <Route path="/onboarding/intro" element={<OnboardingIntroPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding/analyzing" element={<AnalyzingPage />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
            
            <Toaster />
          </div>
        </Router>
      </CursorProvider>
    </ThemeProvider>
  );
}

export default App;