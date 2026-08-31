import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Search, Moon, Plus, Bell, MessageCircle, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const projects = [
  {
    name: 'Web Designing',
    type: 'Prototyping',
    progress: 60,
    color: '#fee4cb',
    accentColor: '#ff942e',
    date: 'December 10, 2023',
    participants: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg'
    ]
  },
  {
    name: 'Testing',
    type: 'Prototyping',
    progress: 50,
    color: '#e9e7fd',
    accentColor: '#4f3ff0',
    date: 'December 10, 2023',
    participants: [
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg'
    ]
  },
  {
    name: 'UI Development',
    type: 'Frontend',
    progress: 70,
    color: '#dbf6fd',
    accentColor: '#096c86',
    date: 'December 10, 2023',
    participants: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    ]
  }
];

const messages = [
  {
    user: {
      name: 'Stephanie',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    message: 'I got your first assignment. It was quite good. 🥳 We can continue with the next assignment.',
    date: 'Dec, 12',
    starred: false
  },
  {
    user: {
      name: 'Mark',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    message: 'Hey, can you tell me about progress of project? I'm waiting for your response.',
    date: 'Dec, 12',
    starred: true
  }
];

export default function DashboardPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="app-container min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">Portfolio</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            <Moon className="h-5 w-5" />
          </Button>
          
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{user?.firstName}</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-16 border-r border-border p-4">
          <nav className="flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowMessages(!showMessages)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold">45</div>
                <div className="text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-muted-foreground">Upcoming</div>
              </div>
              <div>
                <div className="text-2xl font-bold">62</div>
                <div className="text-muted-foreground">Total Projects</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGridView(false)}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGridView(true)}
              >
                <Grid className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className={`grid gap-4 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {projects.map((project, index) => (
              <div
                key={index}
                className="rounded-xl p-4"
                style={{ backgroundColor: project.color }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm opacity-70">{project.date}</span>
                  <Button variant="ghost" size="icon">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </div>
                
                <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                <p className="text-sm opacity-70 mb-4">{project.type}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.accentColor
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-black/10">
                  <div className="flex -space-x-2">
                    {project.participants.map((url, i) => (
                      <Avatar key={i} className="border-2 border-white">
                        <AvatarImage src={url} />
                      </Avatar>
                    ))}
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      style={{ color: project.accentColor }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ color: project.accentColor, backgroundColor: 'rgba(255,255,255,0.6)' }}
                  >
                    2 Days Left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Messages Section */}
        {showMessages && (
          <aside className="w-80 border-l border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold">Messages</h2>
            </div>
            
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-accent">
                  <Avatar>
                    <AvatarImage src={message.user.image} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{message.user.name}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{message.message}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">{message.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}