import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'translate-y-0' 
          : 'translate-y-4'
      )}
    >
      <div className="container flex h-20 items-center justify-center px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto flex items-center justify-between w-full max-w-6xl rounded-2xl bg-background/60 backdrop-blur-md shadow-lg border border-border/5 px-6 py-4">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <img src={logo} alt="EchoVerse Logo" className="h-12 w-12 object-contain" />
          </div>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent hover:scale-105 transition-transform">
            {/* EchoVerse*/}
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block relative">
          <div className="flex items-center justify-center rounded-xl bg-muted/30 p-1 relative min-w-[400px]">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setActiveItem(item.label)}
                onMouseLeave={() => setActiveItem(null)}
                className={cn(
                  "relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200 flex-1 text-center",
                  activeItem === item.label ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
            <div
              className={cn(
                "absolute inset-y-1 rounded-lg bg-background/80 shadow-sm transition-all duration-300 ease-out",
                activeItem ? "opacity-100" : "opacity-0"
              )}
              style={{
                width: "calc(100% / 4)",
                left: activeItem 
                  ? `calc(${navItems.findIndex(item => item.label === activeItem)} * (100% / 4))` 
                  : "0",
              }}
            />
          </div>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex hover:bg-primary/10 transition-all duration-300 relative"
            onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/login'}
          >
            {isSignedIn ? 'Dashboard' : 'Log in'}
            <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 rounded-md transition-opacity duration-300" />
          </Button>
          <Button 
            size="sm" 
            className="hidden md:flex bg-primary/90 hover:bg-primary transition-all duration-200 shadow-lg hover:shadow-primary/25 relative overflow-hidden group"
            onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/signup'}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
          </Button>
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-base font-medium text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start px-0"
                  onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/login'}
                >
                  {isSignedIn ? 'Dashboard' : 'Log in'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/signup'}
                >
                  {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  );
}