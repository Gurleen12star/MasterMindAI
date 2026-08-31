import { useEffect, useState } from 'react';

interface AnimatedLoadingTextProps {
  message: string;
  className?: string;
}

export default function AnimatedLoadingText({ message, className = '' }: AnimatedLoadingTextProps) {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    setDisplayMessage(message);
  }, [message]);

  return (
    <div id="animatedText" className={`animated-loading-text ${className}`}>
      {displayMessage.split('').map((char, index) => (
        <span key={`${char}-${index}`} style={{ animationDelay: `${0.09 * index}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}