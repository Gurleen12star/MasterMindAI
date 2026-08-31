import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
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

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-[250px]'} h-screen sidebar-gradient-bg text-white flex flex-col relative transition-all duration-300 overflow-hidden rounded-tr-80 pl-5`}>
      <Button
        variant="ghost" 
        className="absolute -right-6 top-20 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-300 group overflow-hidden z-10 hidden md:flex"
        onClick={toggleSidebar}
      >
        <div className="relative z-10 flex items-center justify-center">
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-x-0.5" />
          )}
        </div>
      </Button>
      
      <div className={`p-6 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center group relative">
          <div className="relative flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src={logo}
                alt="EchoVerse Logo" 
                className="object-contain transition-all duration-300 h-10" 
              />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-white">
                  EchoVerse
                </h1>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      <ScrollArea className={`flex-1 ${isCollapsed ? 'px-2' : 'px-0'}`}>
        <nav className="space-y-2">
          {isCollapsed ? (
            // Collapsed view - show only section icons
            <div className="space-y-4">
              {menuItems.map((section) => (
                <div key={section.section} className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg hover:bg-white/20 transition-colors text-white"
                    title={section.section}
                  >
                    <section.sectionIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            // Expanded view - show accordion
            <Accordion type="single" collapsible className="w-full space-y-2">
              {menuItems.map((section, index) => (
                <AccordionItem 
                  key={section.section} 
                  value={`section-${index}`}
                  className="border border-white/10 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group text-white">
                    <div className="flex items-center gap-3">
                      <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 transition-all duration-200">
                        <section.sectionIcon className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {section.section}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="sidebar-nav-link group flex items-center justify-between"
                            onClick={onNavigate}
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${
                                item.badge === 'New'
                                  ? 'bg-white/20 text-white'
                                  : item.badge === 'Featured'
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/20 text-white'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </nav>
      </ScrollArea>
      
      <div className={`p-4 border-t border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
        <Button
          variant="ghost"
          className={`w-full text-white/80 hover:text-white transition-all duration-200 hover:bg-white/20 ${
            isCollapsed ? 'justify-center' : 'justify-start gap-2'
          }`}
          onClick={() => signOut()}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && 'Sign Out'}
        </Button>
      </div>
    </aside>
  );
}