import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconBubbleProps {
  icon: LucideIcon;
  size?: number; // diameter in px
  className?: string;
  fromColor?: string; // tailwind color classes (e.g., 'from-primary')
  toColor?: string;   // tailwind color classes (e.g., 'to-purple-500')
}

export default function IconBubble({
  icon: Icon,
  size = 44,
  className,
  fromColor = 'from-primary',
  toColor = 'to-purple-500',
}: IconBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shadow-lg',
        `bg-gradient-to-br ${fromColor} ${toColor} text-white`,
        className
      )}
      style={{ width: size, height: size }}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
} 