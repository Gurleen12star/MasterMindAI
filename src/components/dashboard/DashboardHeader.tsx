import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {children}
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-[300px] pl-9 bg-muted/30 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all duration-300 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-[10px] font-medium flex items-center justify-center text-primary-foreground shadow-lg">
                  3
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 backdrop-blur-xl bg-background/95 border-border/40 shadow-xl rounded-xl">
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
                      className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/20"
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
                <Avatar className="h-8 w-8 ring-2 ring-border/30 hover:ring-primary/40 transition-all duration-300">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 backdrop-blur-xl bg-background/95 border-border/40 shadow-xl rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-10 w-10 ring-2 ring-border/30">
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
                <div className="border-t border-border/30" />
                <Button variant="ghost" className="w-full justify-start text-sm hover:bg-primary/10 rounded-lg">
                  View Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm hover:bg-primary/10 rounded-lg">
                  Settings
                </Button>
                <div className="border-t border-border/30" />
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