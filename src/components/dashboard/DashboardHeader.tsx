import { useUser } from '@clerk/clerk-react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardHeader() {
  const { user } = useUser();
  
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}