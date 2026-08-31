import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
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
  const { theme, setTheme } = useTheme();
  
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
        'fixed top-0 z-50 w-full transition-all duration-500 ease-out',
        isScrolled 
          ? 'translate-y-0' 
          : 'translate-y-4'
      )}
    >
      <div className="container flex h-20 items-center justify-center px-4 max-w-[1200px] mx-auto">
        <div className={cn(
          "relative mx-auto flex items-center justify-between w-full max-w-6xl rounded-2xl transition-all duration-500 px-6 py-4 shadow-lg",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border border-border/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" 
            : "bg-background/80 backdrop-blur-md border border-border/10 shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
        )}>
          <div className="navbar-bg-image absolute inset-0 rounded-2xl overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90 backdrop-blur-[2px] z-10" />
          </div>
          
          <a href="#" className="flex items-center gap-2 group z-20 relative">
            <div className="relative flex items-center justify-center">
              <img 
                src={logo} 
                alt="EchoVerse Logo" 
                className="h-24 w-24 object-contain -my-8 transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent hover:scale-105 transition-transform duration-300">
              {/* EchoVerse*/}
            </span>
          </a>
        
          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block z-20">
            <div className="flex items-center justify-center rounded-xl bg-muted/40 backdrop-blur-sm p-1.5 relative min-w-[400px] border border-border/20 shadow-inner">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setActiveItem(item.label)}
                  onMouseLeave={() => setActiveItem(null)}
                  className={cn(
                    "relative z-10 px-8 py-2.5 text-sm font-medium transition-all duration-300 flex-1 text-center rounded-lg",
                    activeItem === item.label 
                      ? "text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
              <div
                className={cn(
                  "absolute inset-y-1.5 rounded-lg bg-background/90 backdrop-blur-sm shadow-lg transition-all duration-300 ease-out border border-border/30",
                  activeItem ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                style={{
                  width: "calc(100% / 4)",
                  left: activeItem 
                    ? `calc(${navItems.findIndex(item => item.label === activeItem)} * (100% / 4) + 6px)` 
                    : "6px",
                }}
              />
            </div>
          </nav>
        
          <div className="flex items-center gap-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-primary/10 transition-all duration-300 rounded-xl"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex hover:bg-primary/10 transition-all duration-300 relative rounded-xl font-medium"
              onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/login'}
            >
              {isSignedIn ? 'Dashboard' : 'Log in'}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </Button>
            
            <Button 
              size="sm" 
              className="hidden md:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 relative overflow-hidden group rounded-xl font-medium"
              onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/signup'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
              </span>
            </Button>
          
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="backdrop-blur-xl bg-background/95">
                <div className="flex flex-col gap-6 pt-6">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start px-0 hover:bg-primary/10 rounded-xl"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start px-0 hover:bg-primary/10 rounded-xl"
                    onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/login'}
                  >
                    {isSignedIn ? 'Dashboard' : 'Log in'}
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl"
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