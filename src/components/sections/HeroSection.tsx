import { useEffect } from 'react';

export default function HeroSection() {
  useEffect(() => {
    const resetPosition = () => {
      document.documentElement.style.setProperty("--x", "0");
      document.documentElement.style.setProperty("--y", "0");
    };

    const UPDATE = ({ x, y }: { x: number; y: number }) => {
      const xNorm = (x / window.innerWidth - 0.5) * 2;
      const yNorm = (y / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--x", String(xNorm));
      document.documentElement.style.setProperty("--y", String(yNorm));
    };
    
    const heroCard = document.querySelector('.hero-card');
    window.addEventListener("mousemove", UPDATE as any);
    heroCard?.addEventListener("mouseleave", resetPosition);
    
    return () => {
      window.removeEventListener("mousemove", UPDATE as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card">
          <div className="hero-assets">
            <h3 className="hero-title">ECHOVERSE</h3>
            <img 
              src="robot.png"
              alt="Floating Icon"
              className="foreground transition-transform duration-300"
              style={{ width: "800px", height: "675px" }}
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