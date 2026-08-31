import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.history.pushState({}, '', props.href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
      <a
        ref={ref}
        className={cn(
          'text-foreground hover:text-primary transition-colors',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };