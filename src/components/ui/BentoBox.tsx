import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BentoBoxProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  gradient?: 'purple' | 'blue' | 'teal' | 'green' | 'orange' | 'none';
}

export function BentoBox({
  children,
  className,
  hoverEffect = true,
  size = 'md',
  gradient = 'none',
}: BentoBoxProps) {
  const sizeClasses = {
    sm: 'col-span-1 row-span-1',
    md: 'col-span-1 row-span-2',
    lg: 'col-span-2 row-span-1',
    xl: 'col-span-2 row-span-2',
    auto: '',
  };

  const gradientClasses = {
    purple: 'bg-gradient-to-br from-purple-900/20 to-transparent',
    blue: 'bg-gradient-to-br from-blue-900/20 to-transparent',
    teal: 'bg-gradient-to-br from-teal-900/20 to-transparent',
    green: 'bg-gradient-to-br from-green-900/20 to-transparent',
    orange: 'bg-gradient-to-br from-orange-900/20 to-transparent',
    none: '',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm',
        hoverEffect &&
          'transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5',
        "relative overflow-hidden rounded-3xl p-8 transition-all duration-300 shadow-inner-modern bento-modern",
        gradientClasses[gradient],
        className
      )}
    >
      {children}
    </div>
  );
}