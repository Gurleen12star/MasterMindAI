import { useEffect } from 'react';

export default function HeroSection() {
  useEffect(() => {
    const UPDATE = ({ x, y }: { x: number; y: number }) => {
      const xNorm = (x / window.innerWidth - 0.5) * 2;
      const yNorm = (y / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--x", String(xNorm));
      document.documentElement.style.setProperty("--y", String(yNorm));
    };

    window.addEventListener("mousemove", UPDATE as any);
    return () => window.removeEventListener("mousemove", UPDATE as any);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card">
          <div className="hero-assets">
            <h3 className="hero-title">ECHOVERSE</h3>
            <img 
              src="http://mattcannon.games/codepen/sweet-treats/cup-cake.png"
              alt="Floating Icon"
              className="foreground"
              style={{ width: "800px", height: "675px" }}
            />
          </div>
          <div className="hero-blur">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="layer" style={{ '--index': index } as any} />
            ))}
          </div>
          <div className="hero-content">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">AI-Powered Learning Hub</p>
            <p className="text-lg md:text-xl lg:text-2xl opacity-80">Transform Your Learning Journey</p>
          </div>
        </article>
      </div>
    </section>
  );
}