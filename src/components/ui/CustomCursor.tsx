import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const isMoving = useRef(false);
  const rafId = useRef<number>();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursor = () => {
      if (!isMoving.current) {
        // Smoothly return to 0 rotation when not moving
        currentRotation.current += (0 - currentRotation.current) * 0.1;
      } else {
        // Smoothly interpolate to target rotation
        currentRotation.current += (targetRotation.current - currentRotation.current) * 0.2;
      }

      cursor.style.transform = `translate3d(${lastX.current}px, ${lastY.current}px, 0) rotate(${currentRotation.current}deg)`;
      rafId.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursor) return;

      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        isMoving.current = true;
        // Calculate angle based on movement direction
        targetRotation.current = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      lastX.current = e.clientX;
      lastY.current = e.clientY;

      // Reset moving flag after a short delay
      clearTimeout(cursor.dataset.timeout as any);
      cursor.dataset.timeout = setTimeout(() => {
        isMoving.current = false;
      }, 100) as any;
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(updateCursor);

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (cursor.dataset.timeout) clearTimeout(cursor.dataset.timeout as any);
    };
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