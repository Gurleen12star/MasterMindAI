import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
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
    
    const heroCard = document.querySelector('.hero-card');
    heroCard?.addEventListener("mousemove", handleMouseMove as any);
    heroCard?.addEventListener("mouseleave", resetPosition);
    
    return () => {
      heroCard?.removeEventListener("mousemove", handleMouseMove as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card">
          <div className="relative flex items-center justify-center min-h-[500px] rounded-[40px] bg-gradient-to-b from-background/50 via-background to-background/90 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-grid [mask-image:radial-gradient(white,transparent_85%)]" />
            
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                EchoVerse
              </span>
            </div>
            
            <div className="relative">
              <svg viewBox="0 0 300 180" className="w-[600px] fill-white/5 stroke-white/20 transition-transform duration-500">
                <defs>
                  <path id="curve" d="M 50 100 A 100 100 0 0 1 250 100" fill="none" />
                </defs>
                <text className="text-[36px] uppercase">
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    Img
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}