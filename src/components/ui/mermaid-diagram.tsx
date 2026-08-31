import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import './mermaid.css';

interface MermaidDiagramProps {
  diagram: string;
  className?: string;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

// Function to safely get theme-aware colors
const getThemeColors = () => {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  if (isDark) {
    return {
      primaryColor: '#a855f7', // vibrant purple
      primaryTextColor: '#f9fafb', // near white
      primaryBorderColor: '#6b7280', // gray-500
      lineColor: '#9ca3af', // gray-400
      secondaryColor: '#10b981', // emerald-500
      tertiaryColor: '#f59e0b', // amber-500
      background: '#1f2937', // gray-800
      mainBkg: '#374151', // gray-700
      textColor: '#f9fafb',
      nodeTextColor: '#f9fafb',
    };
  } else {
    return {
      primaryColor: '#8b5cf6', // violet-500
      primaryTextColor: '#111827', // gray-900
      primaryBorderColor: '#d1d5db', // gray-300
      lineColor: '#6b7280', // gray-500
      secondaryColor: '#10b981', // emerald-500
      tertiaryColor: '#f59e0b', // amber-500
      background: '#ffffff', // white
      mainBkg: '#f9fafb', // gray-50
      textColor: '#111827',
      nodeTextColor: '#111827',
    };
  }
};

// Centralized Mermaid configuration
const configureMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    flowchart: {
      curve: 'basis',
      useMaxWidth: true,
      htmlLabels: false,
    },
    themeVariables: getThemeColors(),
  });
};

configureMermaid(); // Configure on load

// Function to clean the Mermaid definition
const cleanMermaidDefinition = (def: string): string => {
  let cleaned = def.trim();
  
  // Remove markdown fences
  cleaned = cleaned.replace(/^```mermaid\s*/i, '').replace(/```\s*$/i, '');
  
  // Remove any HTML tags that might have slipped in
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Ensure it starts with a valid graph type, default to flowchart LR
  if (!/^\s*(graph|flowchart)/i.test(cleaned)) {
    cleaned = 'flowchart LR\n' + cleaned;
  }
  
  return cleaned.trim();
};

export function MermaidDiagram({ diagram, className = '', onRegenerate, isGenerating }: MermaidDiagramProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [initialViewBox, setInitialViewBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  useEffect(() => {
    const render = async () => {
      if (!svgContainerRef.current || !diagram) {
        return;
      }
      
      setError(null);
      svgContainerRef.current.innerHTML = ''; // Clear previous render
      
      const cleanedDiagram = cleanMermaidDefinition(diagram);

      try {
        // Re-configure to ensure theme is up-to-date if it can change dynamically
        configureMermaid(); 
        
        const { svg, bindFunctions } = await mermaid.render(`mermaid-svg-${Date.now()}`, cleanedDiagram);
        svgContainerRef.current.innerHTML = svg;

        // Set initial viewBox for panning
        const svgEl = svgContainerRef.current.querySelector('svg');
        if (svgEl) {
          const bbox = svgEl.getBBox();
          const padding = 40;
          const initialVB = {
            x: bbox.x - padding,
            y: bbox.y - padding,
            width: bbox.width + padding * 2,
            height: bbox.height + padding * 2,
          };

          setInitialViewBox(initialVB);
          setViewBox(initialVB);
          svgEl.setAttribute('viewBox', `${initialVB.x} ${initialVB.y} ${initialVB.width} ${initialVB.height}`);
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
        }

        if (bindFunctions) {
          bindFunctions(svgContainerRef.current);
        }

      } catch (e: any) {
        console.error("Mermaid rendering failed:", e);
        setError(e.message || 'Failed to render diagram. The syntax may be invalid.');
      }
    };

    render();
  }, [diagram]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.3));

  const handleReset = () => {
    setZoom(1);
    setViewBox(initialViewBox);
    const svgEl = svgContainerRef.current?.querySelector('svg');
    if (svgEl) {
      svgEl.setAttribute('viewBox', `${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - startPoint.x;
    const dy = e.clientY - startPoint.y;
    const newX = viewBox.x - dx / zoom;
    const newY = viewBox.y - dy / zoom;
    
    const svgEl = svgContainerRef.current?.querySelector('svg');
    if (svgEl) {
      svgEl.setAttribute('viewBox', `${newX} ${newY} ${viewBox.width} ${viewBox.height}`);
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    const dx = e.clientX - startPoint.x;
    const dy = e.clientY - startPoint.y;
    setViewBox(vb => ({
        ...vb,
        x: vb.x - dx / zoom,
        y: vb.y - dy / zoom
    }));
  };

  return (
    <div className={`relative w-full h-full border rounded-lg overflow-hidden ${className}`}>
      <div
        ref={svgContainerRef}
        className="w-full h-full flex items-center justify-center"
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab',
          transform: `scale(${zoom})`,
          transition: 'transform 0.2s'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop panning if mouse leaves container
      />
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4">
          <p className="text-destructive font-semibold text-center">Failed to display diagram</p>
          <p className="text-muted-foreground text-xs text-center mt-2">{error}</p>
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center gap-1">
        {onRegenerate && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRegenerate}
            disabled={isGenerating}
            title="Regenerate Diagram"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} title="Reset View">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}