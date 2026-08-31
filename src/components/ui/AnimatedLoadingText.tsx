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
    <div className={`animated-loading-text flex items-center justify-center ${className}`}>
      {displayMessage.split('').map((char, index) => (
        <span key={`${char}-${index}`} style={{ animationDelay: `${0.09 * index}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}