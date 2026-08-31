import { useAuth } from '@clerk/clerk-react';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  History,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { signOut } = useAuth();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses' },
    { icon: History, label: 'Learning History', href: '/dashboard/history' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          EchoVerse
        </h2>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
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