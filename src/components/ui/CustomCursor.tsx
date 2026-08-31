import { useEffect, useRef, useState } from 'react';
import { useCursor } from '@/contexts/CursorContext';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const { cursorType, cursorText } = useCursor();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position immediately
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = target?.tagName === 'BUTTON' ||
                         target?.tagName === 'A' ||
                         target?.closest('button, a, [role="button"], [role="link"]') !== null ||
                         window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHoveringClickable(isClickable);
    };

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Don't render if custom cursor is disabled
  if (!document.documentElement.classList.contains('custom-cursor-enabled')) {
    return null;
  }

  const isTextCursor = cursorType === 'text';

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-[9999999] transition-transform duration-100 ease-out ${
        isHoveringClickable && !isTextCursor ? 'scale-110' : 'scale-100'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {isTextCursor ? (
        <div className="text-white font-bold text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          {cursorText}
        </div>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M5.5 3.21V20.79L12.5 13.79L18.5 15.79L5.5 3.21Z"
            fill={isHoveringClickable ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M7.5 5.21V16.79L12.5 11.79L16.5 13.29L7.5 5.21Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
}