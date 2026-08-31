import { useEffect, useState } from 'react';
import { logoPaths, type LogoPath } from '@/utils/logoPaths';

interface MarqueeConfig {
  theme: 'dark' | 'light';
  duration: number;
}

export default function LogoMarquee() {
  const [config] = useState<MarqueeConfig>({
    theme: 'dark',
    duration: 30,
  });

  const shouldAnimate = logoPaths.length > 4;

  const renderLogo = (logo: LogoPath) => {
    if (logo.type === 'file') {
      return (
        <img 
          src={logo.file} 
          alt={logo.title}
          className="h-10 w-auto object-contain max-w-[200px]"
        />
      );
    }
    return (
      <svg
        className="h-8 w-auto text-gray-800"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={logo.path} />
      </svg>
    );
  };

  return (
    <div className="relative flex w-full items-center overflow-hidden py-8">
      {/* Container for the infinite scroll effect */}
      <div className="flex w-full">
        {/* First set of logos */}
        <div 
          className={`flex items-center gap-20 ${shouldAnimate ? 'animate-marquee' : 'justify-center w-full'}`}
          style={
            shouldAnimate 
              ? {
                  animationDuration: `${config.duration}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  paddingRight: '20px', // Ensure consistent gap between sets
                }
              : {}
          }
        >
          {logoPaths.map((logo, index) => (
            <div
              key={`${logo.title}-${index}`}
              className="flex items-center justify-center min-w-[120px]"
            >
              {renderLogo(logo)}
            </div>
          ))}
        </div>

        {/* Second set of logos for seamless loop */}
        {shouldAnimate && (
          <div 
            className="flex items-center gap-20 animate-marquee2"
            style={{
              animationDuration: `${config.duration}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              paddingRight: '20px', // Ensure consistent gap between sets
            }}
          >
            {logoPaths.map((logo, index) => (
              <div
                key={`${logo.title}-second-${index}`}
                className="flex items-center justify-center min-w-[120px]"
              >
                {renderLogo(logo)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}