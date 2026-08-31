import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursor = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // Calculate movement direction
      const deltaX = currentX - lastX.current;
      const deltaY = currentY - lastY.current;
      
      // Only update angle if there's significant movement
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        // Calculate angle in degrees
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Position cursor at current mouse coordinates
        cursor.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${angle + 90}deg)`;
      } else {
        // Just update position without changing rotation
        cursor.style.transform = cursor.style.transform.replace(/translate\([^)]+\)/, `translate(${currentX}px, ${currentY}px)`);
      }

      // Update last known position
      lastX.current = currentX;
      lastY.current = currentY;
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <div ref={cursorRef} className="curzr-arrow-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path className="inner" d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" />
        <path className="outer" d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3" />
      </svg>
    </div>
  );
}