import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastAngle = useRef(0);
  const isMoving = useRef(false);
  const animationFrame = useRef<number>();

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
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Adjust angle based on quadrant to match cursor direction
        if (deltaX < 0 && deltaY < 0) angle += 180; // Top-left
        else if (deltaX < 0) angle += 180; // Bottom-left
        else if (deltaY < 0) angle += 360; // Top-right
        
        // Add 90 degrees to point the cursor in the movement direction
        angle += 90;
        
        // Smooth angle transition
        const angleDiff = angle - lastAngle.current;
        lastAngle.current += angleDiff * 0.5;
        
        isMoving.current = true;
      } else {
        isMoving.current = false;
      }

      // Update cursor position
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${lastAngle.current}deg)`;
      
      lastX.current = currentX;
      lastY.current = currentY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(() => updateCursor(e));
    };

    window.addEventListener('mousemove', onMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div className="curzr-arrow-pointer" ref={cursorRef}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path className="inner" d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" />
        <path className="outer" d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3" />
      </svg>
    </div>
  );
}