import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSidebar } from './SidebarContext';

export default function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  
  return (
    <header className={`fixed top-0 z-50 transition-all duration-300 ${isCollapsed ? 'left-16' : 'left-64'} right-0 px-4 py-4 bg-transparent`}>
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 rounded-full bg-[#1F2129]/80 px-4 py-2 shadow-lg backdrop-blur-sm border border-white/10">
          {children}
          <h1 className="hidden md:block text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-full md:w-[300px] pl-9 bg-black/20 border-0 focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-[#1F2129]/80 px-3 py-2 shadow-lg backdrop-blur-sm border border-white/10">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all duration-300 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-[10px] font-medium flex items-center justify-center text-primary-foreground shadow-lg">
                  3
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 backdrop-blur-xl bg-[#2A2B32]/80 border-white/10 shadow-xl rounded-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-foreground">Notifications</h4>
                  <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 rounded-lg">
                    Mark all as read
                  </Button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New course recommendation</p>
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-primary/10 transition-all duration-300 rounded-xl">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 backdrop-blur-xl bg-[#2A2B32]/80 border-white/10 shadow-xl rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user?.user_metadata?.full_name || user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="border-t border-white/10" />
                <Button variant="ghost" className="w-full justify-start text-sm hover:bg-primary/10 rounded-lg">
                  View Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm hover:bg-primary/10 rounded-lg">
                  Settings
                </Button>
                <div className="border-t border-white/10" />
                <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:bg-destructive/10 rounded-lg">
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}