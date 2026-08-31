import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import './mermaid.css';

interface MermaidDiagramProps {
  definition: string;
  className?: string;
}

// Initialize mermaid once at module level
mermaid.initialize({
  startOnLoad: true, 
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: {
    curve: 'basis',
    useMaxWidth: true,
    htmlLabels: true,
    rankSpacing: 100,
    nodeSpacing: 80,
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
      
      // Create a div with mermaid class for auto-rendering
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.style.width = '100%';
      mermaidDiv.style.minHeight = '450px';
      mermaidDiv.textContent = processedDef;
      
      // Add to DOM
      containerRef.current.appendChild(mermaidDiv);
      
      // Force rendering with a slight delay to ensure DOM is ready
      setTimeout(() => {
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
              svg.style.minHeight = '400px';
            } else {
              console.warn('No SVG found after rendering');
            }
          }, 200);
        } catch (initError) {
          console.error('Error in mermaid initialization:', initError);
          setError(`Initialization Error: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
        }
      }, 100);
      
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

  return (
    <div className={`mermaid-diagram-wrapper ${className}`}>
      {error && (
        <div className="p-2 my-2 text-sm text-red-600 bg-red-100 rounded border border-red-300">
          {error}
        </div>
      )}
      
      <div className="zoom-controls flex items-center gap-2 mb-2">
        <button 
          onClick={handleZoomOut}
          className="p-1 bg-muted rounded hover:bg-accent"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        
        <span className="text-xs font-mono">{(zoom * 100).toFixed(0)}%</span>
        
        <button 
          onClick={handleZoomIn}
          className="p-1 bg-muted rounded hover:bg-accent"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        
        <button 
          onClick={handleZoomReset}
          className="p-1 bg-muted rounded hover:bg-accent ml-2"
          aria-label="Reset zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
            <path d="M17 12H7"></path>
          </svg>
        </button>
        
        <span className="text-xs text-muted-foreground ml-auto">Drag to pan</span>
      </div>
      
      <div 
        className="diagram-container border rounded overflow-hidden"
        style={{ 
          cursor: dragging ? 'grabbing' : 'grab',
          position: 'relative',
          height: '500px'
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
            transition: dragging ? 'none' : 'transform 0.1s ease-out'
          }} 
        />
      </div>
    </div>
  );
} 