import { cn } from '@/lib/utils';
import * as React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-0.5 hover:shadow-2xl',
        'dark:bg-white/5 dark:border-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 