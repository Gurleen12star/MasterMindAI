import { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    document.title = 'EchoVerse - AI-Powered Learning Hub';
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="echoverse-theme">
      <div className="min-h-screen bg-background antialiased overflow-x-hidden">
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
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;