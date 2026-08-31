import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion'; // <-- 1. IMPORTED Framer Motion
import robotImage from '../../assets/robott.png';

// Add type declaration for UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init: (options?: { hideWatermark?: boolean }) => void;
    };
  }
}

export default function HeroSection() {
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse move effect for the card
    const handleMouseMove = (e: MouseEvent) => {
      const heroCard = e.currentTarget as HTMLElement;
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xNorm = (x / rect.width - 0.5) * 2;
      const yNorm = (y / rect.height - 0.5) * 2;
      document.documentElement.style.setProperty('--x', String(xNorm));
      document.documentElement.style.setProperty('--y', String(yNorm));
    };

    const resetPosition = () => {
      document.documentElement.style.setProperty('--x', '0');
      document.documentElement.style.setProperty('--y', '0');
    };

    const heroCard = heroCardRef.current;
    heroCard?.addEventListener('mousemove', handleMouseMove as any);
    heroCard?.addEventListener('mouseleave', resetPosition);

    // --- Unicorn Studio & Watermark Removal Logic ---
    const initializeUnicornStudio = () => {
      if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
        const originalInit = window.UnicornStudio.init;
        window.UnicornStudio.init = function(options) {
          return originalInit.call(this, { ...options, hideWatermark: true });
        };
        window.UnicornStudio.init({ hideWatermark: true });
      }
    };

    if (window.UnicornStudio) {
      initializeUnicornStudio();
    } else {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
      script.onload = initializeUnicornStudio;
      document.head.appendChild(script);
    }

    const removeWatermark = () => {
      const selectors = [
        '[id*="us-watermark"]', '[class*="us-watermark"]', '[data-us-watermark]',
        '.unicorn-studio-bg div[style*="position: fixed"]',
      ];
      document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
    };

    removeWatermark();
    const interval = setInterval(removeWatermark, 500);
    setTimeout(() => clearInterval(interval), 5000);

    // Cleanup function
    return () => {
      heroCard?.removeEventListener('mousemove', handleMouseMove as any);
      heroCard?.removeEventListener('mouseleave', resetPosition);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        {/* 2. CORRECTED JSX: Wrapped content in a properly closed motion.div */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="container mx-auto max-w-7xl">
            <div
              className="hero-card"
              ref={heroCardRef}
            >
              <div
                data-us-project="1gY80LcIkYtWkoIA4cVK"
                className="unicorn-studio-bg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  overflow: 'hidden',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              ></div>

              <div className="hero-overlay-effect"></div>

              <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/10 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `float-particle ${10 + Math.random() * 10}s infinite`,
                      animationDelay: `${-Math.random() * 10}s`,
                    }}
                  />
                ))}
              </div>
              <div className="hero-assets" style={{ zIndex: 2 }}>
                <h3 className="hero-title">ECHOVERSE</h3>
                <img
                  src={robotImage}
                  alt="EchoVerse AI Assistant"
                  loading="eager"
                  width="800"
                  height="675"
                  className="foreground"
                />
              </div>
              <div className="hero-content" style={{ zIndex: 3 }}>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold">AI-Powered Learning Hub</p>
                <p className="text-lg md:text-xl lg:text-2xl opacity-100">Transform Your Learning Journey</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}