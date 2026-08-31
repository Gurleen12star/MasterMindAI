import { useEffect, useRef, useState } from 'react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const heroCard = e.currentTarget as HTMLElement;
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xNorm = (x / rect.width - 0.5) * 2;
      const yNorm = (y / rect.height - 0.5) * 2;
      document.documentElement.style.setProperty("--x", String(xNorm));
      document.documentElement.style.setProperty("--y", String(yNorm));
    };

    const resetPosition = () => {
      document.documentElement.style.setProperty("--x", "0");
      document.documentElement.style.setProperty("--y", "0");
    };
    
    const heroCard = heroCardRef.current;
    heroCard?.addEventListener("mousemove", handleMouseMove as any);
    heroCard?.addEventListener("mouseleave", resetPosition);
    
    // Initialize UnicornStudio if it's available
    if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
      window.UnicornStudio.init();
    } else {
      // If UnicornStudio is not available, create and load the script
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
          window.UnicornStudio.init();
        }
      };
      document.head.appendChild(script);
    }
    
    return () => {
      heroCard?.removeEventListener("mousemove", handleMouseMove as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
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
          
          {/* Modern Overlay Effect */}
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
    </section>
  );
}