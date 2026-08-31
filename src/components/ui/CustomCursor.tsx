import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'select' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.hasAttribute('role') ||
        target.classList.contains('interactive')
      );

      cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      
      if (isClickable) {
        cursor.classList.add('clickable');
      } else {
        cursor.classList.remove('clickable');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div ref={cursorRef} className="curzr-arrow-pointer">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path
          className="outer"
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
        />
        <circle className="inner" cx="12" cy="12" r="6" />
      </svg>
    </div>
  );
}