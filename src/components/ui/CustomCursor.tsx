import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringClickable = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Animation loop for smooth cursor movement
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      
      requestAnimationFrame(animateCursor);
    };

    // Check if element is clickable
    const isClickableElement = (element: Element): boolean => {
      const clickableSelectors = [
        'a', 'button', 'input', 'select', 'textarea', 'label',
        '[role="button"]', '[tabindex="0"]', '[data-interactive]',
        '.cursor-pointer'
      ];
      
      return clickableSelectors.some(selector => 
        element.matches(selector) || element.closest(selector)
      );
    };

    // Mouse over handler for clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isClickableElement(target)) {
        isHoveringClickable.current = true;
        cursor?.classList.add('hovering-clickable');
      }
    };

    // Mouse out handler
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isClickableElement(target)) {
        isHoveringClickable.current = false;
        cursor?.classList.remove('hovering-clickable');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Start animation
    animateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="curzr-arrow-pointer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '24px',
        height: '24px',
        pointerEvents: 'none',
        zIndex: 9999999,
        willChange: 'transform'
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="outer"
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill="currentColor"
        />
        <path
          className="inner"
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}