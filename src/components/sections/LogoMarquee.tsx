import { useEffect, useState } from 'react';
import { logoPaths, type LogoPath } from '@/utils/logoPaths';

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
  const [config] = useState({
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
  });

  const [keyframes, setKeyframes] = useState('');
  const [lists, setLists] = useState<string[]>([]);

  useEffect(() => {
    generateKeyframes();
    generateLists();
  }, []);

  const generateKeyframes = () => {
    const base = parseFloat((100 - 100 / config.items).toFixed(2));
    const first = base - config.underlap;
    const mid = base + config.transition;
    const end = 100 - config.underlap - config.transition;
    const keyframesCSS = `
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
    setKeyframes(keyframesCSS);
  };

  const shuffle = (array: LogoPath[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateLists = () => {
    const shuffledPaths = shuffle(logoPaths);
    const newLists = [];
    
    for (let l = 0; l < 4; l++) {
      const listItems = [];
      for (let index = 0; index < config.items; index++) {
        const pathIndex = (l * config.items + index) % shuffledPaths.length;
        const { title, path } = shuffledPaths[pathIndex];
        listItems.push(`
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
        `);
      }
      newLists.push(listItems.join(''));
    }
    setLists(newLists);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">      
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      
      <div 
        className="logo-marquee-main"
        style={{
          '--duration': config.duration,
          '--stagger': config.stagger,
          '--movement-x': config.x,
          '--movement-y': config.y,
          '--movement-step': config.step,
          '--blur': config.blur,
          '--lists': 4,
        } as React.CSSProperties}
        data-theme={config.theme}
        data-explode={config.explode}
      >
        {lists.map((listContent, index) => (
          <ul
            key={index}
            style={{
              '--index': index,
              '--items': config.items,
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: listContent }}
          />
        ))}
      </div>
    </section>
  );
}