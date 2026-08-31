import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import logo from '@/assets/logo.svg';
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
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
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
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-gradient-to-b from-card/80 via-card/60 to-card/40 backdrop-blur-xl border-r border-border/20 flex flex-col relative transition-all duration-300 overflow-hidden shadow-xl`}>
      {/* Toggle Button */}
      <Button
        variant="ghost" 
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-background border border-border/40 hover:bg-accent hover:scale-110 transition-all duration-300 group overflow-hidden z-20 hidden md:flex shadow-lg"
        onClick={toggleSidebar}
      >
        <div className="relative z-10 flex items-center justify-center">
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          )}
        </div>
      </Button>
      
      {/* Logo Section */}
      <div className={`p-4 ${isCollapsed ? 'px-2' : ''} border-b border-border/10`}>
        <div className="flex items-center group relative">
          <div className="relative flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <img 
                  src={logo}
                  alt="EchoVerse Logo" 
                  className="object-contain transition-all duration-300 h-8 w-8" 
                />
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {!isCollapsed && (
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300">
                  EchoVerse
                </h1>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className={`flex-1 ${isCollapsed ? 'px-1' : 'px-3'} py-4`}>
        <nav className="space-y-1">
          {isCollapsed ? (
            // Collapsed view - show only section icons with active states
            <div className="space-y-2">
              {menuItems.map((section) => {
                const isActive = isSectionActive(section);
                return (
                  <div key={section.section} className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-10 w-10 rounded-xl transition-all duration-300 relative group ${
                        isActive 
                          ? 'bg-primary/15 text-primary shadow-lg shadow-primary/20 border border-primary/20' 
                          : 'hover:bg-accent/60 text-muted-foreground hover:text-foreground'
                      }`}
                      title={section.section}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                      )}
                      <section.sectionIcon className={`h-5 w-5 transition-all duration-300 relative z-10 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`} />
                      {isActive && (
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            // Expanded view - show accordion with active states
            <Accordion type="single" collapsible className="w-full space-y-1">
              {menuItems.map((section, index) => {
                const isActive = isSectionActive(section);
                return (
                  <AccordionItem 
                    key={section.section} 
                    value={`section-${index}`}
                    className={`border rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10' 
                        : 'border-border/20 bg-card/30 hover:bg-card/50'
                    } backdrop-blur-sm`}
                  >
                    <AccordionTrigger className="px-3 py-2.5 hover:no-underline group">
                      <div className="flex items-center gap-3">
                        <div className={`relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary/20 shadow-md shadow-primary/20' 
                            : 'bg-primary/10 group-hover:bg-primary/15'
                        }`}>
                          <section.sectionIcon className={`h-4 w-4 transition-all duration-300 ${
                            isActive 
                              ? 'text-primary scale-110' 
                              : 'text-primary group-hover:scale-105'
                          }`} />
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          isActive 
                            ? 'text-primary' 
                            : 'text-foreground group-hover:text-primary'
                        }`}>
                          {section.section}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <ul className="space-y-0.5 pl-3">
                        {section.items.map((item) => {
                          const itemIsActive = isItemActive(item.href);
                          return (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                className={`group flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-300 relative overflow-hidden ${
                                  itemIsActive
                                    ? 'bg-primary/15 text-primary font-semibold shadow-md shadow-primary/10 border border-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                                }`}
                                onClick={() => {
                                  setCurrentPath(item.href);
                                  onNavigate?.();
                                }}
                              >
                                {itemIsActive && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                                )}
                                <div className="flex items-center gap-3 relative z-10">
                                  <item.icon className={`h-4 w-4 transition-all duration-300 ${
                                    itemIsActive 
                                      ? 'scale-110' 
                                      : 'group-hover:scale-105'
                                  }`} />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 relative z-10 ${
                                    item.badge === 'New'
                                      ? itemIsActive 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                      : item.badge === 'Featured'
                                      ? itemIsActive
                                        ? 'bg-gradient-to-r from-primary/20 to-primary/30 text-primary'
                                        : 'bg-gradient-to-r from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30'
                                      : itemIsActive
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                                {itemIsActive && (
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />
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
      <div className={`p-3 border-t border-border/10 ${isCollapsed ? 'px-1' : ''}`}>
        <Button
          variant="ghost"
          className={`w-full text-muted-foreground hover:text-destructive transition-all duration-300 hover:bg-destructive/10 rounded-xl ${
            isCollapsed ? 'justify-center h-10 w-10' : 'justify-start gap-2 h-10'
          }`}
          onClick={() => signOut()}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && 'Sign Out'}
        </Button>
      </div>
    </div>
  );
}