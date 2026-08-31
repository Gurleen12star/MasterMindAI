import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import './mermaid.css';

interface MermaidDiagramProps {
  definition: string;
  className?: string;
}

// Initialize mermaid once at module level with startOnLoad: false
mermaid.initialize({
  startOnLoad: false, // Prevent automatic scanning, use manual rendering
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: {
    curve: 'basis',
    useMaxWidth: true,
    htmlLabels: true,
    rankSpacing: 100,
    nodeSpacing: 80,
  },
  themeVariables: {
    primaryColor: 'hsl(252, 87%, 73%)',
    primaryTextColor: 'hsl(0, 0%, 3.9%)',
    primaryBorderColor: 'hsl(240, 5.9%, 90%)',
    lineColor: 'hsl(0, 0%, 45.1%)',
    secondaryColor: 'hsl(145, 63%, 49%)',
    tertiaryColor: 'hsl(45, 100%, 51%)',
    background: 'hsl(0, 0%, 100%)',
    mainBkg: 'hsl(0, 0%, 96.1%)',
    secondBkg: 'hsl(145, 63%, 49%)',
    tertiaryBkg: 'hsl(45, 100%, 51%)',
  },
  htmlLabels: true,
} as any);

console.log('Mermaid initialized with enhanced settings');

export function MermaidDiagram({ definition, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  // Handle zoom changes
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPosition({ x: position.x, y: position.y });
    setStartDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    const dx = e.clientX - startDrag.x;
    const dy = e.clientY - startDrag.y;
    
    setPosition({
      x: startPosition.x + dx,
      y: startPosition.y + dy
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      setError(null);

      if (!definition.trim()) {
        setError("Empty diagram definition");
        return;
      }

      // Process the definition to ensure it's valid
      let processedDef = definition.trim();
      
      // Ensure it starts with flowchart
      if (!processedDef.toLowerCase().startsWith('flowchart') && 
          !processedDef.toLowerCase().startsWith('graph')) {
        processedDef = 'flowchart LR\n' + processedDef;
      }
      
      console.log('Rendering diagram with definition length:', processedDef.length);
      
      // Create a div with mermaid class for rendering
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.style.width = '100%';
      mermaidDiv.style.height = '100%'; // Use full height instead of minHeight
      mermaidDiv.textContent = processedDef;
      
      // Add to DOM
      containerRef.current.appendChild(mermaidDiv);
      
      // Force rendering immediately after DOM insertion
      console.log('Initializing mermaid render');
      try {
        mermaid.init(undefined, mermaidDiv);
        
        // Add observer to check if SVG was rendered and add zoom-fit if needed
        setTimeout(() => {
          const svg = containerRef.current?.querySelector('svg');
          if (svg) {
            console.log('SVG found and rendered with dimensions:', 
              svg.getAttribute('width'), 'x', svg.getAttribute('height'));
            
            // Ensure SVG has proper dimensions
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.minHeight = '400px';
          } else {
            console.warn('No SVG found after rendering');
          }
        }, 200);
      } catch (initError) {
        console.error('Error in mermaid initialization:', initError);
        setError(`Initialization Error: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
      }
      
    } catch (err) {
      console.error('Error rendering Mermaid diagram:', err);
      setError(`Rendering Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Fallback to show raw code
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const pre = document.createElement('pre');
        pre.className = 'p-2 bg-muted rounded overflow-auto text-xs text-red-700';
        pre.textContent = definition;
        containerRef.current.appendChild(pre);
      }
    }
  }, [definition]);

  // Add parseError handler for better error catching
  useEffect(() => {
    const handleParseError = (error: any) => {
      console.error('Mermaid parse error:', error);
      setError(`Parse Error: ${error.message || 'Invalid diagram syntax'}`);
    };

    mermaid.parseError = handleParseError;

    return () => {
      // Clean up the error handler
      mermaid.parseError = undefined;
    };
  }, []);

  return (
    <div className={`mermaid-diagram-wrapper ${className}`}>
      {error && (
        <div className="p-2 my-2 text-sm text-red-600 bg-red-100 rounded border border-red-300">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3 p-2 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 bg-background rounded-md hover:bg-accent transition-colors shadow-sm border border-border/30"
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <span className="text-xs font-mono px-2 py-1 bg-background rounded border border-border/30 min-w-[45px] text-center">
            {(zoom * 100).toFixed(0)}%
          </span>
          
          <button 
            onClick={handleZoomIn}
            className="p-1.5 bg-background rounded-md hover:bg-accent transition-colors shadow-sm border border-border/30"
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <button 
            onClick={handleZoomReset}
            className="p-1.5 bg-background rounded-md hover:bg-accent transition-colors shadow-sm border border-border/30 ml-1"
            aria-label="Reset zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
              <path d="M17 12H7"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          <span>Drag to pan</span>
        </div>
      </div>
      
      <div 
        className="diagram-container border border-border rounded-lg overflow-hidden bg-background"
        style={{ 
          cursor: dragging ? 'grabbing' : 'grab',
          position: 'relative',
          height: '460px',
          backgroundColor: 'hsl(var(--background))'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={containerRef} 
          className="mermaid-render-area" 
          style={{ 
            width: '100%', 
            height: '100%',
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center center',
            transition: dragging ? 'none' : 'transform 0.1s ease-out',
            backgroundColor: 'hsl(var(--background))'
          }} 
        />
      </div>
    </div>
  );
}