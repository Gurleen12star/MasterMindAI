import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0); // Smoothed X position of the cursor
  const cursorY = useRef(0); // Smoothed Y position of the cursor
  const currentAngle = useRef(90); // Store current angle, initial pointing up (adjust as needed for your SVG)
  
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  const smoothingFactor = 0.15; // Adjust for different smoothing levels (e.g., 0.1 for very smooth, 0.3 for quicker)

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initialize cursor and mouse positions to avoid jump on first render
    mouseX.current = window.innerWidth / 2;
    mouseY.current = window.innerHeight / 2;
    cursorX.current = mouseX.current;
    cursorY.current = mouseY.current;
    // Apply initial transform. The angle might need adjustment based on your SVG's default orientation.
    cursor.style.transform = `translate(${cursorX.current.toFixed(2)}px, ${cursorY.current.toFixed(2)}px) rotate(${currentAngle.current.toFixed(2)}deg)`;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    let prevSmoothX = cursorX.current;
    let prevSmoothY = cursorY.current;

    const animateCursor = () => {
      // Interpolate cursor position towards mouse position
      const dx = mouseX.current - cursorX.current;
      const dy = mouseY.current - cursorY.current;

      cursorX.current += dx * smoothingFactor;
      cursorY.current += dy * smoothingFactor;

      // Calculate delta of the *smoothed* cursor movement for rotation
      const smoothDeltaX = cursorX.current - prevSmoothX;
      const smoothDeltaY = cursorY.current - prevSmoothY;

      // Update angle only if there's noticeable movement to prevent spinning when static
      if (Math.abs(smoothDeltaX) > 0.01 || Math.abs(smoothDeltaY) > 0.01) {
        currentAngle.current = Math.atan2(smoothDeltaY, smoothDeltaX) * (180 / Math.PI) + 90; // +90 assumes arrow points 'up' in SVG
      }
      
      cursor.style.transform = `translate(${cursorX.current.toFixed(2)}px, ${cursorY.current.toFixed(2)}px) rotate(${currentAngle.current.toFixed(2)}deg)`;

      prevSmoothX = cursorX.current;
      prevSmoothY = cursorY.current;

      animationFrameId.current = requestAnimationFrame(animateCursor);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('role') === 'link' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHoveringClickable(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('role') === 'link' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHoveringClickable(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    animationFrameId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`curzr-arrow-pointer ${isHoveringClickable ? 'hovering-clickable' : ''}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path className="inner" d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" />
        <path className="outer" d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3" />
      </svg>
    </div>
  );
}