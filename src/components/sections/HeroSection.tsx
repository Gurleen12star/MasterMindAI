import { useEffect, useRef } from 'react';
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
    const handleMouseMove = (e: MouseEvent) => {
      const heroCard = e.currentTarget as HTMLElement;
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate center of the card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate angle from center to mouse position
      const angle = Math.atan2(y - centerY, x - centerX);
      const angleDegrees = (angle * 180 / Math.PI + 360) % 360;
      
      // Set CSS variables for both parallax and shine effect
      const xNorm = (x / rect.width - 0.5) * 2;
      const yNorm = (y / rect.height - 0.5) * 2;
      document.documentElement.style.setProperty("--x", String(xNorm));
      document.documentElement.style.setProperty("--y", String(yNorm));
      document.documentElement.style.setProperty("--shine-angle", `${angleDegrees}deg`);
    };

    const resetPosition = () => {
      document.documentElement.style.setProperty("--x", "0");
      document.documentElement.style.setProperty("--y", "0");
      document.documentElement.style.setProperty("--shine-angle", "0deg");
    };
    
    const heroCard = heroCardRef.current;
    heroCard?.addEventListener("mousemove", handleMouseMove as any);
    heroCard?.addEventListener("mouseleave", resetPosition);
    
    // Try to modify UnicornStudio to disable watermark
    if (window.UnicornStudio) {
      // Try to patch UnicornStudio's init method to hide the watermark
      const originalInit = window.UnicornStudio.init;
      window.UnicornStudio.init = function(options) {
        return originalInit.call(this, { ...options, hideWatermark: true });
      };
    }
    
    // Initialize UnicornStudio if it's available
    if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
      window.UnicornStudio.init({ hideWatermark: true });
    } else {
      // If UnicornStudio is not available, create and load the script
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
          // Try to patch UnicornStudio's init method to hide the watermark
          const originalInit = window.UnicornStudio.init;
          window.UnicornStudio.init = function(options) {
            return originalInit.call(this, { ...options, hideWatermark: true });
          };
          
          window.UnicornStudio.init({ hideWatermark: true });
        }
      };
      document.head.appendChild(script);
    }
    
    // Hide UnicornStudio watermark
    const removeWatermark = () => {
      // Select potential watermark elements
      const watermarks = document.querySelectorAll([
        '[id*="us-watermark"]',
        '[class*="us-watermark"]',
        '[data-us-watermark]',
        '.unicorn-studio-bg div[style*="position: fixed"]',
        '.unicorn-studio-bg div[style*="bottom: 0"]',
        '.unicorn-studio-bg div[style*="right: 0"]'
      ].join(','));
      
      // Remove each watermark element
      watermarks.forEach(el => el.remove());
      
      // Also try to find watermarks in iframes
      const iframes = document.querySelectorAll('.unicorn-studio-bg iframe');
      iframes.forEach(iframe => {
        try {
          const iframeDoc = (iframe as HTMLIFrameElement).contentDocument || 
                           (iframe as HTMLIFrameElement).contentWindow?.document;
          if (iframeDoc) {
            const iframeWatermarks = iframeDoc.querySelectorAll([
              '[id*="watermark"]',
              '[class*="watermark"]',
              'div[style*="position: fixed"]',
              'div[style*="bottom: 0"]',
              'div[style*="right: 0"]'
            ].join(','));
            
            iframeWatermarks.forEach(el => el.remove());
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      });
    };
    
    // Run immediately and then every second for a short period to catch late-rendered watermarks
    removeWatermark();
    const interval = setInterval(removeWatermark, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => {
      heroCard?.removeEventListener("mousemove", handleMouseMove as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-48 md:pt-32 md:pb-64 bg-gradient-to-b from-background via-background/95 to-transparent">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card" ref={heroCardRef}>
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
        </article>
      </div>
    </section>
  );
}