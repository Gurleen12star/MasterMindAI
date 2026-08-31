import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Community', href: '#' }
    ]
  },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (item: string) => {
    setHoveredItem(item);
    if (navItems.find(nav => nav.label === item)?.children) {
      setOpenDropdown(item);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setOpenDropdown(null);
  };
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
        <div className="relative mx-auto flex items-center justify-between w-full max-w-6xl rounded-2xl bg-background/60 backdrop-blur-lg shadow-lg border border-border/5 px-6 py-4">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:scale-150 transition-transform duration-500" />
          </div>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent hover:scale-105 transition-transform">
            EchoVerse
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href={item.href}
                className={cn(
                  "relative z-10 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1",
                  hoveredItem === item.label 
                    ? "text-foreground bg-muted/50" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openDropdown === item.label && "rotate-180"
                    )} />
                  )}
                </a>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 py-2 rounded-lg bg-background/80 backdrop-blur-lg shadow-lg border border-border/10">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex hover:bg-muted/30 transition-all duration-200"
          >
            Log in
          </Button>
          <Button 
            size="sm" 
            className="hidden md:flex bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
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
                <Button variant="ghost" size="sm" className="justify-start px-0">
                  Log in
                </Button>
                <Button size="sm">Get Started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  );
}