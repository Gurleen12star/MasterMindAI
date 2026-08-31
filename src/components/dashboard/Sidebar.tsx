import { useAuth } from '@clerk/clerk-react';
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
  Sparkles,
  Rocket,
  Users,
  MessageSquare,
  GitBranch
} from 'lucide-react';

export default function Sidebar() {
  const { signOut } = useAuth();
  
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

  return (
    <div className="w-64 h-screen bg-card/50 backdrop-blur-sm border-r border-border/40 flex flex-col">
      <div className="p-6">
        <a href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <img src="/robot.png" alt="EchoVerse Logo" className="h-24 w-24 object-contain -my-8" />
          </div>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent hover:scale-105 transition-transform">
            EchoVerse
          </span>
        </a>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              <h4 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section.section}
              </h4>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        {item.label}
                      </div>
                      {item.badge && (
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
      
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}