import { useEffect, useRef, useState } from 'react';
import robotImage from '../../assets/robott.png';
import brainDumbelImage from '../../assets/brain-dumbel.png';
import brainHandImage from '../../assets/Brain-hand.png';
import bulbBrainHandImage from '../../assets/bulb-brain-hand.png';
import graduateBrainImage from '../../assets/draduate-brain.png';
import laptopBrainImage from '../../assets/laptop-brain.png';
import skullAiImage from '../../assets/skull-ai.png';
import aiBrainImage from '../../assets/ai-brain.png';

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
          
          {/* Floating particle animation */}
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

          {/* Floating Brain Images */}
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
            {/* Brain with Dumbbell - Top Left */}
            <img 
              src={brainDumbelImage}
              alt="Brain Training" 
              className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain opacity-80 hover:opacity-100 transition-all duration-300"
              style={{
                left: '2%',
                top: '40%',
                animation: 'float-brain-1 8s ease-in-out infinite',
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))',
              }}
            />

            {/* Brain in Hand - Top Right */}
            <img 
              src={brainHandImage}
              alt="Brain Knowledge" 
              className="absolute w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 object-contain opacity-75 hover:opacity-100 transition-all duration-300"
              style={{
                right: '10%',
                top: '10%',
                animation: 'float-brain-2 10s ease-in-out infinite',
                animationDelay: '-2s',
                filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))',
              }}
            />

            {/* Lightbulb Brain - Left Side */}
            <img 
              src={bulbBrainHandImage}
              alt="Innovation Ideas" 
              className="absolute w-18 h-18 md:w-22 md:h-22 lg:w-28 lg:h-28 object-contain opacity-70 hover:opacity-100 transition-all duration-300"
              style={{
                left: '10%',
                top: '9%',
                animation: 'float-brain-3 12s ease-in-out infinite',
                animationDelay: '-4s',
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25))',
              }}
            />

            {/* Graduate Brain - Right Side */}
            <img 
              src={graduateBrainImage}
              alt="Learning Achievement" 
              className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain opacity-85 hover:opacity-100 transition-all duration-300"
              style={{
                right: '2%',
                top: '40%',
                animation: 'float-brain-4 9s ease-in-out infinite',
                animationDelay: '-1s',
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))',
              }}
            />

            {/* Laptop Brain - Bottom Left */}
            <img 
              src={laptopBrainImage}
              alt="Digital Learning" 
              className="absolute w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain opacity-75 hover:opacity-100 transition-all duration-300"
              style={{
                left: '10%',
                bottom: '20%',
                animation: 'float-brain-5 11s ease-in-out infinite',
                animationDelay: '-3s',
                filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))',
              }}
            />

            {/* AI Brain - Lower Center */}
            <img 
              // src={aiBrainImage}
              alt="AI Intelligence Brain" 
              className="absolute w-18 h-18 md:w-22 md:h-22 lg:w-26 lg:h-26 object-contain opacity-85 hover:opacity-100 transition-all duration-300"
              style={{
                left: '50%',
                top: '150%',
                transform: 'translate(-50%, -50%)',
                animation: 'float-brain-7 9s ease-in-out infinite',
                animationDelay: '-6s',
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25))',
              }}
            />

            {/* Skull AI - Bottom Right */}
            <img 
              src={skullAiImage}
              alt="AI Intelligence" 
              className="absolute w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-80 hover:opacity-100 transition-all duration-300"
              style={{
                right: '10%',
                bottom: '20%',
                animation: 'float-brain-6 7s ease-in-out infinite',
                animationDelay: '-5s',
                filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))',
              }}
            />
          </div>

          <div className="hero-assets" style={{ zIndex: 2 }}>
            <h3 className="hero-title">ECHOVERSE</h3>
            <img 
              src={robotImage}
              alt="EchoVerse AI Assistant" 
              loading="eager"
              width="500"
              height="675"
              className="foreground"
            />
          </div>
          <div className="hero-content" style={{ zIndex: 3 }}>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">Your Universe of Knowledge, Reimagined by AI.</p>
            <p className="text-sm md:text-base lg:text-lg text-white/90 drop-shadow-md">From deep research to dynamic content, master any subject your way.</p>
          </div>
        </div>
      </div>
    </section>
  );
}