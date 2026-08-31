import { cn } from '@/lib/utils';
import * as React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/10 bg-[#1E1E1E]/90 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-0.5 hover:shadow-2xl',
        'dark:bg-[#1E1E1E]/90 dark:border-border/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 