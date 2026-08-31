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

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();

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
    
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderContent = () => {
    if (!isLoaded) {
      // Return null while loading, let the HTML preloader handle the loading state
      return null;
    }
    
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
      {/* Main Animated Background */}
      <div className="gradient-background__wrapper">
        <div className="gradient-background">
          <div className="gradient-background__shape gradient-background__shape--1"></div>
          <div className="gradient-background__shape gradient-background__shape--2"></div>
        </div>
        <div className="gradient-background__noise"></div>
      </div>

      <div className="min-h-screen relative bg-transparent antialiased overflow-x-hidden">
        <div className="gradient-line"></div>
        
        <div className="relative z-10">
          <CustomCursor />
          {renderContent()}
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
          
          {/* SF Rings Animation */}
          <div className="fixed pointer-events-none overflow-hidden pt-75 s:pt-250 will-change-transform h-[250px] top-0 left-0 w-full z-0"> 
            <div className="absolute left-0 w-full z-2">
              <div className="sf-rings relative pt-[100%] media-fit z-2">
                <div className="sf-ring__wrap --1 absolute inset-0 z-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2828.43 2720.74" className="sf-ring --1">
                    <path fill="none" stroke="#f203ff" strokeWidth="2" d="M578.43 43.87c208.56-130.32 533 78.36 764.29 75.45 235.3-3 511.78-147.66 720.83-31.07 200 111.49 358 337.06 489.06 546.74s261.74 450.84 274.27 679.47c13.12 239-197.48 443.12-303.29 653.36-104 206.65-122.25 529.71-330.8 660s-507.56-50-738.86-47.08c-235.31 3-545.63 221.33-754.69 104.75-199.99-111.47-171.6-493.4-302.6-703.08S14.8 1625.09 2.25 1396.48c-13.11-239.05 78.79-484.87 184.61-695.1 104-206.66 182.96-527.18 391.57-657.51Z"></path>
                  </svg>
                </div> 
                <div className="sf-ring__wrap --2 absolute inset-0 z-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2758.36 2922.53" className="sf-ring --2">
                    <path fill="none" stroke="#f945a2" strokeWidth="2" d="M314.52 474.72c162.24-180.3 571.22-10.93 786.48-80.62 222.06-71.89 434.12-344.59 662.52-296.16 221.38 46.95 435.48 232.82 615.73 395.28s384.25 357.06 454.05 572.47c72 222.23-121.6 471.77-169.85 700.27-46.78 221.48 67.3 559.25-94.94 739.55s-531.15 36.39-746.38 106.09c-222.07 71.9-447.35 445.25-675.75 396.83-221.39-46.94-266.76-485.84-447.06-648.3s-496.24-202.2-566-417.6c-72-222.23-35.42-484.38 12.83-712.88 46.75-221.49 6.13-574.65 168.37-754.93Z" opacity=".25" transform="translate(-91.81 -91.22)"></path>
                  </svg>
                </div> 
                <div className="sf-ring__wrap --3 absolute inset-0 z-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2723.79 2841.29" className="sf-ring --3">
                    <path fill="none" stroke="#a64eff" strokeWidth="2" d="M2688.5 580.86c128.59 205.78-146.74 552.37-139 778.62 8 233.4 211.6 512.62 102.2 718.91-106 200-343.54 354.54-549.25 483.08s-448.83 271-675 278.64c-233.34 7.92-419.81-247.17-626.07-356.64-199.88-106.12-555.88-89.65-684.43-295.44s111.23-520.87 103.55-747.1c-8-233.46-304.71-553.13-195.32-759.46 106-200 540.21-122.45 745.93-251s330.86-421.43 557-429.09c233.39-7.91 475.17 99.68 681.39 209.15 200 106.11 550.43 164.54 679 370.33Z"></path>
                  </svg>
                </div> 
                <div className="sf-ring__wrap --4 absolute inset-0 z-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2700.65 3034.3" className="sf-ring --4">
                    <path fill="none" stroke="#ff00fe" strokeWidth="2" d="M1274.29 1.13c242.4-8.42 404.87 403.5 604.59 510 206 109.89 549.5 73.17 673.42 271.17 120.12 191.92 135.26 475 143.77 717.55s10.33 524.43-96.05 724.21c-109.74 206.11-423.73 240-621.57 364-191.75 120.1-355.33 436.71-597.73 445.13s-395.34-357-595.05-463.49c-206-109.89-631.07-12.81-755-210.79C-89.46 2167 194.59 1829.6 186.08 1587.05s-199.52-497.5-93.14-697.28C202.68 683.66 416.61 528 614.44 404.08 806.19 284 1031.88 9.55 1274.29 1.13Z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;