import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  BookOpen,
  History,
  Settings,
  LogOut,
  Rocket,
  Users,
  Video,
  MessageSquare,
  LineChart,
  GitBranch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: GitBranch, label: 'Roadmap Generator', href: '/dashboard/roadmap-generator' },
        { icon: BookOpen, label: 'Content Discovery', href: '/dashboard/discovery', badge: 'New' },
        { icon: Video, label: 'Content Transformation', href: '/dashboard/transform' },
        { icon: Users, label: 'Community', href: '/dashboard/community' },
        { icon: LineChart, label: 'Progress & Analytics', href: '/dashboard/analytics' }
      ]
    },
    {
      section: 'Preferences',
      items: [
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
      ]
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-card/50 backdrop-blur-sm border-r border-border/40 flex flex-col relative transition-all duration-300`}>
      <Button
        variant="ghost" 
        className="absolute -right-6 top-20 h-12 w-12 rounded-full bg-gradient-to-r from-primary/90 to-primary shadow-lg hover:shadow-primary/25 hover:scale-110 transition-all duration-300 group overflow-hidden z-[60]"
        onClick={toggleSidebar}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex items-center justify-center">
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:-translate-x-0.5" />
          )}
        </div>
      </Button>
      
      <div className={`p-6 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center group relative">
          <div className="relative flex items-center">
            <img
              src="/src/assets/logo.png"
              alt="EchoVerse Logo" 
              className={`object-contain transition-none ${
                isCollapsed ? 'h-12 w-12' : 'h-16 w-16'
              } cursor-default`} 
            />
          </div>
        </div>
      </div>
      
      <ScrollArea className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <nav className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              <h4 className={`px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                isCollapsed ? 'sr-only' : ''
              }`}>
                {section.section}
              </h4>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50 transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                      } hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <item.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                        {!isCollapsed && item.label}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.badge === 'New'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Separator className="my-4 opacity-50" />
            </div>
          ))}
        </nav>
      </ScrollArea>
      
      <div className={`p-4 border-t border-border ${isCollapsed ? 'px-2' : ''}`}>
        <Button
          variant="ghost"
          className={`w-full text-muted-foreground hover:text-destructive ${
            isCollapsed ? 'justify-center' : 'justify-start gap-2'
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