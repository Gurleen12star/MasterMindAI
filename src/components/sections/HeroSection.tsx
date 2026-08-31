import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCursor } from '@/contexts/CursorContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import robotImage from '../../assets/Brain-hand.png';

export default function HeroSection() {
  const heroCardRef = useRef<HTMLDivElement>(null);
  const { setCursorType, setCursorText } = useCursor();
  const navigate = useNavigate();

  useEffect(() => {
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
    heroCard?.addEventListener('mousemove', handleMouseMove);
    heroCard?.addEventListener('mouseleave', resetPosition);

    return () => {
      heroCard?.removeEventListener('mousemove', handleMouseMove);
      heroCard?.removeEventListener('mouseleave', resetPosition);
    };
  }, []);

  const handleMouseEnter = () => {
    setCursorText('MASTERMIND');
    setCursorType('text');
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorText('');
  };

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
                  left: `${(i * 17 + 3) % 100}%`,
                  top: `${(i * 23 + 7) % 100}%`,
                  animation: `float-particle ${10 + (i % 5) * 2}s infinite`,
                  animationDelay: `${-(i % 8)}s`,
                }}
              />
            ))}
          </div>

          <div className="hero-assets" style={{ zIndex: 2 }}>
            <h3 className="hero-title">MASTERMIND</h3>
            <img
              src={robotImage}
              alt="MasterMindAI AI Assistant"
              loading="eager"
              width="500"
              height="675"
              className="foreground blur-sm opacity-80"
            />
          </div>

          <div className="hero-content" style={{ zIndex: 3 }}>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              Your Journey. Your Roadmap. Your Success.
            </p>
            <p className="text-sm md:text-base lg:text-lg text-white/90 drop-shadow-md max-w-2xl">
              MasterMindAI understands your career goals, current skills, preferred technologies,
              learning preferences, available time, and target industry — then builds a personalized
              path to close the gaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                id="hero-cta-build"
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/entry')}
              >
                <Sparkles className="w-4 h-4" />
                Build My Career Path
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                id="hero-cta-learn"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
                onClick={() => navigate('/#features')}
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}