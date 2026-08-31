import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import EchoVerseLogo from '@/components/ui/EchoVerseLogo';
import {
  Home,
  Shield,
  Compass,
  BookOpen,
  Search,
  Network,
  Wand2,
  Film,
  Folder,
  Plus,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isProject?: boolean;
  isCollapsed?: boolean;
}

const NavLink = ({ to, icon: Icon, label, isActive, isProject = false, isCollapsed = false }: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center text-sm font-medium rounded-md transition-all duration-200 ease-in-out relative group ${
      isProject ? (isCollapsed ? 'px-2 py-2' : 'pl-8 pr-4 py-2') : (isCollapsed ? 'px-2 py-2' : 'px-4 py-2')
    } ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
    title={isCollapsed ? label : ''}
  >
    {isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        {/* Main light source */}
        <div className="h-5 w-1 bg-green-400 rounded-r-full relative">
          {/* Inner bright core */}
          <div className="absolute inset-0 bg-green-300 rounded-r-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          
          {/* Medium glow layer */}
          <div className="absolute -inset-1 bg-green-400/40 rounded-full blur-sm"></div>
          
          {/* Outer glow layer */}
          <div className="absolute -inset-2 bg-green-400/20 rounded-full blur-md"></div>
          
          {/* Far spreading light effect */}
          <div className="absolute -inset-3 bg-green-400/10 rounded-full blur-lg"></div>
          

        </div>
      </div>
    )}
    <Icon className={`${isCollapsed ? 'h-5 w-5' : `mr-3 h-5 w-5 ${isProject ? 'h-4 w-4' : ''}`}`} />
    {!isCollapsed && (
      <>
    <span>{label}</span>
    {!isProject && <ChevronRight className="ml-auto h-4 w-4 text-gray-500" />}
      </>
    )}
    
    {/* Tooltip for collapsed state */}
    {isCollapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    )}
  </Link>
);

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { isAdmin } = useAdmin();
  
  const mainMenu = [
    { to: '/dashboard', icon: Home, label: 'Overview' },
    { to: '/dashboard/explore', icon: Compass, label: 'Explore Hub' },
    { to: '/dashboard/paths', icon: BookOpen, label: 'Learning Paths' },
    { to: '/dashboard/research', icon: Search, label: 'Deep Research' },
    { to: '/dashboard/roadmap-generator', icon: Network, label: 'Roadmap Generator' },
    { to: '/dashboard/summaries', icon: Wand2, label: 'Quick Summaries' },
    { to: '/dashboard/animation-studio', icon: Film, label: 'Animation Studio' },
    { to: '/dashboard/personalized-learning', icon: GraduationCap, label: 'Personalized Learning' },
  ];

  const adminMenu = [
    { to: '/dashboard/admin', icon: Shield, label: 'Admin Dashboard' },
    { to: '/dashboard/admin/users', icon: User, label: 'User Management' },
    { to: '/dashboard/admin/settings', icon: Settings, label: 'System Settings' },
  ];


  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-[#111111] text-white flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out ${className}`}>
      <div className={`${isCollapsed ? 'p-3' : 'p-5'} border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
        {/* Brand / Logo */}
        <Link to="/dashboard" className={`${isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3'}`}>
          <EchoVerseLogo className="h-8 w-8 text-primary" />
          {!isCollapsed && <span className="text-lg font-bold">EchoVerse</span>}
        </Link>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`h-8 w-8 text-gray-400 hover:text-white transition-colors duration-200 ${isCollapsed ? 'absolute right-2 top-1/2 -translate-y-1/2' : 'ml-auto'}`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 p-3 space-y-4">
        <div>
          {!isCollapsed && (
          <h3 className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Main Menu
          </h3>
          )}
          <div className="space-y-1">
            {mainMenu.map((item) => (
              <NavLink 
                key={item.to} 
                {...item} 
                isActive={location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/dashboard')} 
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
        {!isCollapsed && (
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
                <NavLink key={item.label} {...item} isActive={false} isProject isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Admin Menu Section - Only shown to admin users */}
      {isAdmin && !isCollapsed && (
      <div>
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Admin
          </h3>
        </div>
        <div className="space-y-1">
          {adminMenu.map((item) => (
            <NavLink
              key={item.to}
              {...item}
              isActive={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
      )}

      <div className="p-3 border-t border-white/10">
        <nav className="space-y-1">
           <NavLink to="/dashboard/profile" icon={User} label="Profile Settings" isActive={location.pathname === '/dashboard/profile'} isCollapsed={isCollapsed} />
           <button onClick={signOut} className="w-full">
            <NavLink to="#" icon={LogOut} label="Log Out" isActive={false} isCollapsed={isCollapsed} />
           </button>
        </nav>
      </div>
    </div>
  );
}