import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { useState, useEffect } from 'react';
import EchoVerseLogo from '@/components/ui/EchoVerseLogo';
import {
  Home,
  Compass,
  BookOpen,
  Search,
  Network,
  Wand2,
  Folder,
  Plus,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isProject?: boolean;
}

const NavLink = ({ href, icon: Icon, label, isActive, isProject = false }: NavLinkProps) => (
  <a
    href={href}
    className={`flex items-center text-sm font-medium rounded-md transition-all duration-200 ease-in-out relative ${
      isProject ? 'pl-8 pr-4 py-2' : 'px-4 py-2'
    } ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-green-400 rounded-r-full"></div>}
    <Icon className={`mr-3 h-5 w-5 ${isProject ? 'h-4 w-4' : ''}`} />
    <span>{label}</span>
    {!isProject && <ChevronRight className="ml-auto h-4 w-4 text-gray-500" />}
  </a>
);

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { signOut } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePathChange);
    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  const mainMenu = [
    { href: '/dashboard', icon: Home, label: 'Overview' },
    { href: '/dashboard/explore', icon: Compass, label: 'Explore Hub' },
    { href: '/dashboard/paths', icon: BookOpen, label: 'Learning Paths' },
    { href: '/dashboard/research', icon: Search, label: 'Deep Research' },
    { href: '/dashboard/roadmap-generator', icon: Network, label: 'Roadmap Generator' },
    { href: '/dashboard/summaries', icon: Wand2, label: 'Quick Summaries' },
  ];

  const projects = [
    { href: '#', icon: Folder, label: 'All Projects' },
    { href: '#', icon: Folder, label: 'Testing' },
    { href: '#', icon: Folder, label: 'Final Projects' },
    { href: '#', icon: Folder, label: 'Favs' },
  ];

  return (
    <div className={`w-64 h-screen bg-[#111111] text-white flex-col border-r border-white/10 ${className}`}>
      <div className="p-5 border-b border-white/10">
        <a href="/dashboard" className="flex items-center gap-3">
          <EchoVerseLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold">EchoVerse</span>
        </a>
      </div>
      
      <div className="flex-1 p-3 space-y-4">
        <div>
          <h3 className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Main Menu
          </h3>
          <div className="space-y-1">
            {mainMenu.map((item) => (
              <NavLink key={item.href} {...item} isActive={currentPath === item.href} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Projects
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {projects.map((item) => (
              <NavLink key={item.label} {...item} isActive={false} isProject />
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/10">
        <nav className="space-y-1">
           <NavLink href="/dashboard/settings" icon={Settings} label="Settings" isActive={currentPath === '/dashboard/settings'} />
           <button onClick={signOut} className="w-full">
            <NavLink href="#" icon={LogOut} label="Log Out" isActive={false} />
           </button>
        </nav>
      </div>
    </div>
  );
}