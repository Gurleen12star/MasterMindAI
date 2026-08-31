import { useEffect, useRef } from 'react';
import { logoPaths, shuffle, type LogoPath } from '@/utils/logoPaths';

interface MarqueeConfig {
  theme: 'dark' | 'light';
  items: number;
  x: number;
  y: number;
  blur: number;
  explode: boolean;
  duration: number;
  step: number;
  transition: number;
  underlap: number;
  stagger: number;
}

export default function LogoMarquee() {
  const mainRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLStyleElement>(null);
  const pathsRef = useRef<LogoPath[]>(shuffle([...logoPaths]));

  // Default configuration matching the provided image
  const config: MarqueeConfig = {
    theme: 'dark',
    items: 4,
    x: -100,
    y: 0,
    blur: 2,
    explode: false,
    duration: 20,
    step: 2,
    transition: 1,
    underlap: 2,
    stagger: 0.6,
  };

  const generateList = () => {
    if (!mainRef.current) return;
    
    pathsRef.current = shuffle([...logoPaths]);
    const lists = mainRef.current.querySelectorAll('ul');
    
    lists.forEach((list, l) => {
      list.style.setProperty('--index', l.toString());
      list.style.setProperty('--items', config.items.toString());
      
      const items = Array.from({ length: config.items }, (_, index) => {
        const pathIndex = (l * config.items + index) % pathsRef.current.length;
        const { title, path } = pathsRef.current[pathIndex];
        
        return `
          <li data-logo style="--i: ${index + 1};">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>${title}</title>
              <defs>
                <path id="path-${pathIndex}-${l}" d="${path}" />
              </defs>
              <use fill="red" style="--u: 0;" href="#path-${pathIndex}-${l}" />
              <use fill="yellow" style="--u: 1;" href="#path-${pathIndex}-${l}" />
              <use fill="#1061ff" style="--u: 2;" href="#path-${pathIndex}-${l}" />
              <use fill="currentColor" style="--u: 3;" href="#path-${pathIndex}-${l}" />
            </svg>
          </li>
          ${l === 0 ? `<li data-marker style="--i: ${index + 1};"></li>` : ''}
        `;
      }).join('');
      
      list.innerHTML = items;
    });
  };

  const generateKeyframes = () => {
    if (!sheetRef.current) return;
    
    const base = parseFloat((100 - 100 / config.items).toFixed(2));
    const first = base - config.underlap;
    const mid = base + config.transition;
    const end = 100 - config.underlap - config.transition;
    
    const keyframes = `
      @keyframes appear {
        0%, ${first}% {
          animation-timing-function: ease-out;
          filter: blur(calc(var(--blur, 0) * 1px));
          opacity: var(--opacity, 0);
          translate:
            calc((var(--movement-x, 0) + (var(--u, 0) * var(--movement-step, 0))) * -1px)
            calc((var(--movement-y, 0) + (var(--u, 0) * var(--movement-step, 0))) * 1px);
        }
        ${mid}%, ${end}% {
          animation-timing-function: ease-in;
          filter: blur(0px);
          opacity: 1;
          translate: 0 0;
          z-index: 2;
        }
        100% {
          filter: blur(calc(var(--blur, 0) * 1px));
          opacity: var(--opacity, 0);
          translate:
            calc((var(--movement-x, 0) + (var(--u, 0) * var(--movement-step, 0))) * 1px)
            calc((var(--movement-y, 0) + (var(--u, 0) * var(--movement-step, 0))) * -1px);
        }
      }
    `;
    
    sheetRef.current.innerHTML = keyframes;
  };

  const applyConfig = () => {
    const root = document.documentElement;
    root.dataset.theme = config.theme;
    root.dataset.explode = config.explode.toString();
    root.style.setProperty('--duration', config.duration.toString());
    root.style.setProperty('--stagger', config.stagger.toString());
    root.style.setProperty('--movement-x', config.x.toString());
    root.style.setProperty('--movement-y', config.y.toString());
    root.style.setProperty('--movement-step', config.step.toString());
    root.style.setProperty('--blur', config.blur.toString());
    
    if (mainRef.current) {
      const lists = mainRef.current.querySelectorAll('ul');
      mainRef.current.style.setProperty('--lists', lists.length.toString());
    }
  };

  useEffect(() => {
    applyConfig();
    generateList();
    generateKeyframes();
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <style ref={sheetRef} type="text/css" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of companies already using our platform to accelerate their learning and development
          </p>
        </div>
        
        <main ref={mainRef} className="logo-marquee-main">
          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
        </main>
      </div>
    </section>
  );
}