import { useEffect, useRef, useState } from 'react';
import robotImage from '../../assets/robott.png';

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
    
    return () => {
      heroCard?.removeEventListener("mousemove", handleMouseMove as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div 
          className="hero-card backdrop-blur-md bg-background/20 border border-white/20"
          ref={heroCardRef}
        >
          
          {/* Modern Overlay Effect */}
          <div className="hero-overlay-effect backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-primary/5"></div>
          
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
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">Your Universe of Knowledge, Reimagined by AI.</p>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md">From deep research to dynamic content, master any subject your way.</p>
          </div>
        </div>
      </div>
    </section>
  );
}