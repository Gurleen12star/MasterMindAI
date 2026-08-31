import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EchoVerseLogo from '@/components/ui/EchoVerseLogo';
import {
  Compass,
  BookOpen,
  Search,
  Network,
  Newspaper,
  Wand2,
  MessageSquare,
  Video,
  Headphones,
  PenTool,
  Users,
  MessageCircle,
  MapPin,
  FileText,
  ListMusic,
  LineChart,
  AlertTriangle,
  Bell,
  Trophy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  UserCheck,
  BarChart3,
  Sparkles,
  Star
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  // Update current path when navigation occurs
  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    
    // Also listen for manual navigation
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    });
    
    observer.observe(document, { subtree: true, childList: true });
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      observer.disconnect();
    };
  }, [currentPath]);
  
  const menuItems = [
    {
      section: 'Content Discovery & Learning',
      sectionIcon: Layers,
      color: 'from-primary to-primary/80',
      bgGradient: 'from-primary/10 via-primary/5 to-transparent',
      glowColor: 'primary',
      items: [
        { icon: Compass, label: 'Explore Hub', href: '/dashboard/explore' },
        { icon: BookOpen, label: 'Learning Paths', href: '/dashboard/paths' },
        { icon: Search, label: 'Smart Search', href: '/dashboard/search' },
        { icon: Network, label: 'Knowledge Map', href: '/dashboard/knowledge-map' },
        { icon: Newspaper, label: 'Daily Digest', href: '/dashboard/digest', badge: 'New' }
      ]
    },
    {
      section: 'Content Transformation Tools',
      sectionIcon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
      glowColor: 'blue-500',
      items: [
        { icon: Wand2, label: 'Quick Summaries', href: '/dashboard/summaries' },
        { icon: MessageSquare, label: 'Chat with Content', href: '/dashboard/chat' },
        { icon: Headphones, label: 'Listen Mode', href: '/dashboard/listen' },
        { icon: Video, label: 'Video Explainer', href: '/dashboard/video' },
        { icon: PenTool, label: 'Remix Studio', href: '/dashboard/remix' },
        { icon: MapPin, label: 'Roadmap Generator', href: '/dashboard/roadmap-generator', badge: 'Featured' }
      ]
    },
    {
      section: 'Community & Collaboration',
      sectionIcon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
      glowColor: 'green-500',
      items: [
        { icon: Users, label: 'Study Groups', href: '/dashboard/groups' },
        { icon: MessageCircle, label: 'Ask Experts', href: '/dashboard/experts' },
        { icon: FileText, label: 'Shared Notes', href: '/dashboard/notes' },
        { icon: ListMusic, label: 'Playlists', href: '/dashboard/playlists' }
      ]
    },
    {
      section: 'Progress & Analytics',
      sectionIcon: BarChart3,
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 via-red-500/5 to-transparent',
      glowColor: 'orange-500',
      items: [
        { icon: LineChart, label: 'My Insights', href: '/dashboard/insights' },
        { icon: AlertTriangle, label: 'Knowledge Gaps', href: '/dashboard/gaps' },
        { icon: Bell, label: 'Study Reminders', href: '/dashboard/reminders' },
        { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements', badge: '3' }
      ]
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if a section contains the active path
  const isSectionActive = (section: typeof menuItems[0]) => {
    return section.items.some(item => item.href === currentPath);
  };

  // Check if an item is active
  const isItemActive = (href: string) => {
    return currentPath === href;
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} h-screen relative transition-all duration-500 ease-in-out overflow-hidden`}>
      {/* Animated Background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Subtle animated orbs */}
        <div className="absolute top-20 left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>
      
      {/* Main sidebar content */}
      <div className="relative z-10 h-full bg-background/95 backdrop-blur-xl border-r border-border/30 flex flex-col shadow-2xl">
        
        {/* Toggle Button */}
        <Button
          variant="ghost" 
          className="absolute -right-4 top-20 h-8 w-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 group overflow-hidden z-20 hidden md:flex shadow-xl hover:shadow-primary/25 rounded-full border border-border/20"
          onClick={toggleSidebar}
        >
          <div className="relative z-10 flex items-center justify-center">
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
        
        {/* Logo Section */}
        <div className={`p-6 ${isCollapsed ? 'px-3' : ''} border-b border-border/30`}>
          <div className="flex items-center group relative">
            <div className="relative flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <EchoVerseLogo 
                    className="relative object-contain transition-all duration-300 h-10 w-10 shadow-lg rounded-xl text-primary p-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20" 
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300">
                      EchoVerse
                    </h1>
                    <span className="text-xs text-muted-foreground font-medium">AI Learning Platform</span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <ScrollArea className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6`}>
          <nav className="space-y-2">
            {isCollapsed ? (
              // Collapsed view - show only section icons with enhanced visual effects
              <div className="space-y-3">
                {menuItems.map((section) => {
                  const isActive = isSectionActive(section);
                  return (
                    <div key={section.section} className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-12 w-12 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                          isActive 
                            ? `bg-gradient-to-r ${section.color} shadow-xl shadow-${section.glowColor}/20 border border-primary/30 scale-105 text-primary-foreground` 
                            : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:scale-105 border border-border/20 hover:border-primary/30'
                        }`}
                        title={section.section}
                        onMouseEnter={() => setHoveredSection(section.section)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        {isActive && (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-r ${section.bgGradient} rounded-2xl`} />
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse" />
                          </>
                        )}
                        <section.sectionIcon className={`h-6 w-6 transition-all duration-300 relative z-10 ${
                          isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'
                        }`} />
                        {isActive && (
                          <>
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-lg" />
                            <Star className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-ping" />
                          </>
                        )}
                        {hoveredSection === section.section && !isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl animate-pulse" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Expanded view - enhanced accordion with stunning visual effects
              <Accordion type="single" collapsible className="w-full space-y-3">
                {menuItems.map((section, index) => {
                  const isActive = isSectionActive(section);
                  return (
                    <AccordionItem 
                      key={section.section} 
                      value={`section-${index}`}
                      className={`border-2 rounded-2xl transition-all duration-500 backdrop-blur-sm overflow-hidden ${
                        isActive 
                          ? `border-primary/40 bg-gradient-to-r ${section.bgGradient} shadow-xl shadow-primary/10` 
                          : 'border-border/30 bg-card/50 hover:bg-card/70 hover:border-primary/20'
                      }`}
                      onMouseEnter={() => setHoveredSection(section.section)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <AccordionTrigger className="px-4 py-4 hover:no-underline group">
                        <div className="flex items-center gap-4">
                          <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-r ${section.color} shadow-xl shadow-${section.glowColor}/20` 
                              : 'bg-primary/10 group-hover:bg-primary/20 backdrop-blur-sm border border-primary/20'
                          }`}>
                            {isActive && <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />}
                            <section.sectionIcon className={`h-5 w-5 transition-all duration-300 relative z-10 ${
                              isActive 
                                ? 'text-primary-foreground scale-110 drop-shadow-md' 
                                : 'text-primary group-hover:scale-105'
                            }`} />
                            {isActive && <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-sm font-semibold transition-colors duration-300 ${
                              isActive 
                                ? 'text-foreground' 
                                : 'text-foreground group-hover:text-primary'
                            }`}>
                              {section.section}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {section.items.length} tools
                            </span>
                          </div>
                        </div>
                        {hoveredSection === section.section && !isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${section.bgGradient} opacity-30 rounded-2xl`} />
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <ul className="space-y-1 pl-4 pr-2">
                          {section.items.map((item) => {
                            const itemIsActive = isItemActive(item.href);
                            return (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className={`group flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-300 relative overflow-hidden ${
                                    itemIsActive
                                      ? `bg-gradient-to-r ${section.color} text-primary-foreground font-semibold shadow-xl shadow-${section.glowColor}/20 border border-primary/30`
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 backdrop-blur-sm border border-transparent hover:border-primary/20'
                                  }`}
                                  onClick={() => {
                                    setCurrentPath(item.href);
                                    onNavigate?.();
                                  }}
                                >
                                  {itemIsActive && (
                                    <>
                                      <div className={`absolute inset-0 bg-gradient-to-r ${section.bgGradient}`} />
                                      <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
                                    </>
                                  )}
                                  <div className="flex items-center gap-3 relative z-10">
                                    <item.icon className={`h-4 w-4 transition-all duration-300 ${
                                      itemIsActive 
                                        ? 'scale-110 drop-shadow-md' 
                                        : 'group-hover:scale-105'
                                    }`} />
                                    <span className="font-medium">{item.label}</span>
                                  </div>
                                  {item.badge && (
                                    <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 relative z-10 font-semibold border ${
                                      item.badge === 'New'
                                        ? itemIsActive 
                                          ? 'bg-emerald-500/20 text-emerald-600 border-emerald-400/30 shadow-lg shadow-emerald-500/20' 
                                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-400/20 group-hover:bg-emerald-500/20'
                                        : item.badge === 'Featured'
                                        ? itemIsActive
                                          ? 'bg-yellow-500/20 text-yellow-600 border-yellow-400/30 shadow-lg shadow-yellow-500/20'
                                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-400/20 group-hover:bg-yellow-500/20'
                                        : itemIsActive
                                        ? 'bg-primary/20 text-primary border-primary/30'
                                        : 'bg-muted text-muted-foreground border-border/20 group-hover:bg-muted/80'
                                    }`}>
                                      {item.badge}
                                      {item.badge === 'New' && <Sparkles className="inline ml-1 h-2 w-2" />}
                                      {item.badge === 'Featured' && <Star className="inline ml-1 h-2 w-2" />}
                                    </span>
                                  )}
                                  {itemIsActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full shadow-lg" />
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </nav>
        </ScrollArea>
        
        {/* Sign Out Button */}
        <div className={`p-4 border-t border-border/30 ${isCollapsed ? 'px-2' : ''}`}>
          <Button
            variant="ghost"
            className={`w-full text-muted-foreground hover:text-destructive transition-all duration-300 hover:bg-destructive/10 rounded-xl font-semibold border border-transparent hover:border-destructive/30 ${
              isCollapsed ? 'justify-center h-12 w-12 rounded-xl' : 'justify-start gap-3 h-12'
            } group relative overflow-hidden`}
            onClick={() => signOut()}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <LogOut className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            {!isCollapsed && <span className="relative z-10">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}