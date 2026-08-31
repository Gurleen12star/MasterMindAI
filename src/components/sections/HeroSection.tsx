import { useEffect } from 'react';
import robotImage from '../../assets/robott.png';

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
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48 bg-gradient-to-b from-background via-background/95 to-transparent">
      <div className="absolute inset-0 overflow-hidden">
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
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card">
          <div className="hero-assets">
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
          <div className="hero-content">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">AI-Powered Learning Hub</p>
            <p className="text-lg md:text-xl lg:text-2xl opacity-100">Transform Your Learning Journey</p>
          </div>
        </article>
      </div>
    </section>
  );
}