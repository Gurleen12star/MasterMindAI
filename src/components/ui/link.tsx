import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.history.pushState({}, '', href);
      // Dispatch a popstate event to trigger route updates
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn(className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };