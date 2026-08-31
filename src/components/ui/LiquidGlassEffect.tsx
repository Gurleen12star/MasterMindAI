import { useEffect, useRef, useState } from 'react';

interface LiquidGlassConfig {
  scale: number;
  radius: number;
  border: number;
  lightness: number;
  blend: string;
  x: string;
  y: string;
  alpha: number;
  blur: number;
  width: number;
  height: number;
  displace: number;
  frost: number;
}

const defaultConfig: LiquidGlassConfig = {
  scale: -180,
  radius: 16,
  border: 0.07,
  lightness: 50,
  blend: 'difference',
  x: 'R',
  y: 'B',
  alpha: 0.93,
  blur: 11,
  width: 800,
  height: 64,
  displace: 10,
  frost: 0.05,
};

export function LiquidGlassEffect({ 
  config = defaultConfig,
  className = "",
  children 
}: { 
  config?: Partial<LiquidGlassConfig>;
  className?: string;
  children: React.ReactNode;
}) {
  const effectRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  const finalConfig = { ...defaultConfig, ...config };

  const buildDisplacementImage = () => {
    const border = Math.min(finalConfig.width, finalConfig.height) * (finalConfig.border * 0.5);
    
    const svgContent = `
      <svg viewBox="0 0 ${finalConfig.width} ${finalConfig.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="red-gradient" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${finalConfig.width}" height="${finalConfig.height}" fill="black"></rect>
        <rect x="0" y="0" width="${finalConfig.width}" height="${finalConfig.height}" rx="${finalConfig.radius}" fill="url(#red-gradient)" />
        <rect x="0" y="0" width="${finalConfig.width}" height="${finalConfig.height}" rx="${finalConfig.radius}" fill="url(#blue-gradient)" style="mix-blend-mode: ${finalConfig.blend}" />
        <rect x="${border}" y="${border}" width="${finalConfig.width - border * 2}" height="${finalConfig.height - border * 2}" rx="${finalConfig.radius}" fill="hsl(0 0% ${finalConfig.lightness}% / ${finalConfig.alpha})" style="filter:blur(${finalConfig.blur}px)" />
      </svg>
    `;

    const encoded = encodeURIComponent(svgContent);
    const dataUri = `data:image/svg+xml,${encoded}`;

    // Update the filter
    const feImage = document.querySelector('#liquid-glass-filter feImage');
    const feDisplacementMap = document.querySelector('#liquid-glass-filter feDisplacementMap');
    
    if (feImage && feDisplacementMap) {
      feImage.setAttribute('href', dataUri);
      feDisplacementMap.setAttribute('xChannelSelector', finalConfig.x);
      feDisplacementMap.setAttribute('yChannelSelector', finalConfig.y);
      feDisplacementMap.setAttribute('scale', finalConfig.scale.toString());
    }
  };

  useEffect(() => {
    // Ensure the SVG filter exists in the DOM
    let filterSvg = document.querySelector('#liquid-glass-svg');
    if (!filterSvg) {
      filterSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      filterSvg.setAttribute('id', 'liquid-glass-svg');
      filterSvg.setAttribute('class', 'liquid-glass-filter');
      filterSvg.innerHTML = `
        <defs>
          <filter id="liquid-glass-filter" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" width="100%" height="100%" result="map"></feImage>
            <feDisplacementMap in2="map" in="SourceGraphic" />
          </filter>
        </defs>
      `;
      document.body.appendChild(filterSvg);
    }

    buildDisplacementImage();
    setIsReady(true);

    // Update CSS custom properties
    document.documentElement.style.setProperty('--liquid-width', finalConfig.width.toString());
    document.documentElement.style.setProperty('--liquid-height', finalConfig.height.toString());
    document.documentElement.style.setProperty('--liquid-radius', finalConfig.radius.toString());
    document.documentElement.style.setProperty('--liquid-frost', finalConfig.frost.toString());
    document.documentElement.style.setProperty('--liquid-blur', finalConfig.displace.toString());

    return () => {
      // Cleanup if needed
    };
  }, [finalConfig]);

  return (
    <div 
      ref={effectRef}
      className={`liquid-glass-effect ${className} ${isReady ? 'liquid-glass-ready' : ''}`}
      style={{
        backdropFilter: isReady ? `url(#liquid-glass-filter) blur(${finalConfig.displace * 0.1}px) brightness(1.1) saturate(1.5)` : undefined,
        background: `hsl(0 0% 100% / ${finalConfig.frost})`,
        borderRadius: `${finalConfig.radius}px`,
      }}
    >
      {children}
    </div>
  );
}