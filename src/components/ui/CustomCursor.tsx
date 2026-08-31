import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Smooth cursor movement
    const updateCursorPosition = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Ensure cursor is visible when moving
      setIsVisible(true);
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('role') && ['button', 'link'].includes(target.getAttribute('role') || '') ||
        target.closest('button, a, input, select, textarea, [role="button"], [role="link"]') ||
        getComputedStyle(target).cursor === 'pointer'
      );
      
      setIsHoveringClickable(isClickable);
    };

    // Mouse enter/leave handlers
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Start animation loop
    updateCursorPosition();

    // Add event listeners to document (works for all elements including modals)
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Ensure cursor is always visible in custom cursor mode
    const ensureVisibility = () => {
      if (document.documentElement.classList.contains('custom-cursor-enabled')) {
        if (cursor) {
          cursor.style.opacity = '1';
          cursor.style.visibility = 'visible';
          cursor.style.display = 'block';
          cursor.style.pointerEvents = 'none';
          cursor.style.zIndex = '9999999';
        }
      }
    };

    // Run visibility check immediately and periodically
    ensureVisibility();
    const visibilityInterval = setInterval(ensureVisibility, 500);

    // Observer to watch for DOM changes (like modals opening)
    const observer = new MutationObserver(() => {
      ensureVisibility();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(visibilityInterval);
      observer.disconnect();
    };
  }, []);

  // Don't render if custom cursor is disabled
  if (!document.documentElement.classList.contains('custom-cursor-enabled')) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`curzr-arrow-pointer ${isHoveringClickable ? 'hovering-clickable' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '24px',
        height: '24px',
        pointerEvents: 'none',
        zIndex: 9999999,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease',
        willChange: 'transform',
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
          d="M5.5 3.21V20.79L12.5 13.79L18.5 15.79L5.5 3.21Z"
          fill="currentColor"
        />
        <path
          className="inner"
          d="M7.5 5.21V16.79L12.5 11.79L16.5 13.29L7.5 5.21Z"
          fill="white"
        />
      </svg>
    </div>
  );
}