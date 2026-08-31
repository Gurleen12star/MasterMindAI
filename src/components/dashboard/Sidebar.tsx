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
  MessageSquare,
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
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses', badge: '8' },
        { icon: GitBranch, label: 'Roadmap Generator', href: '/dashboard/roadmap-generator' },
        { icon: History, label: 'Learning History', href: '/dashboard/history' },
        { icon: Rocket, label: 'Goals', href: '/dashboard/goals', badge: 'New' }
      ]
    },
    {
      section: 'Social',
      items: [
        { icon: Users, label: 'Study Groups', href: '/dashboard/groups' },
        { icon: MessageSquare, label: 'Discussions', href: '/dashboard/discussions', badge: '3' }
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
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className={`p-6 ${isCollapsed ? 'px-2' : ''}`}>
        <a href="/" className="flex items-center group relative">
          <div className="relative flex items-center">
            <img 
              src="/src/assets/logo.png" 
              alt="EchoVerse Logo" 
              className={`object-contain transition-all duration-300 ${
                isCollapsed ? 'h-12 w-12' : 'h-16 w-16'
              }`} 
            />
          </div>
        </a>
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
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
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