import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Search,
  Bell,
  Plus,
  MoreVertical,
  Home,
  PieChart,
  Calendar,
  Settings,
  MessageCircle,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">EchoVerse</p>
          <div className="search-wrapper">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="app-header-right">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mode-switch"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            <Moon className="h-5 w-5" />
          </Button>
          
          <Button size="icon" className="add-btn">
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="notification-btn">
            <Bell className="h-5 w-5" />
          </Button>
          
          <button className="profile-btn">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{user?.firstName}</span>
          </button>
        </div>
        
        <Button 
          variant="ghost"
          className="messages-btn"
          onClick={() => setShowMessages(true)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="app-content">
        {/* Sidebar */}
        <div className="app-sidebar">
          <a href="#" className="app-sidebar-link active">
            <Home className="h-5 w-5" />
          </a>
          <a href="#" className="app-sidebar-link">
            <PieChart className="h-5 w-5" />
          </a>
          <a href="#" className="app-sidebar-link">
            <Calendar className="h-5 w-5" />
          </a>
          <a href="#" className="app-sidebar-link">
            <Settings className="h-5 w-5" />
          </a>
        </div>
        
        {/* Main Content */}
        <div className="projects-section">
          <div className="projects-section-header">
            <p>Projects</p>
            <p className="time">December, 12</p>
          </div>
          
          <div className="projects-section-line">
            <div className="projects-status">
              <div className="item-status">
                <span className="status-number">45</span>
                <span className="status-type">In Progress</span>
              </div>
              <div className="item-status">
                <span className="status-number">24</span>
                <span className="status-type">Upcoming</span>
              </div>
              <div className="item-status">
                <span className="status-number">62</span>
                <span className="status-type">Total Projects</span>
              </div>
            </div>
            
            <div className="view-actions">
              <Button
                variant="ghost"
                size="icon"
                className={cn("view-btn list-view", viewMode === 'list' && "active")}
                onClick={() => setViewMode('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("view-btn grid-view", viewMode === 'grid' && "active")}
                onClick={() => setViewMode('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </Button>
            </div>
          </div>
          
          <div className={cn("project-boxes", viewMode === 'grid' ? 'jsGridView' : 'jsListView')}>
            {/* Project Boxes */}
            {[
              { color: '#fee4cb', progress: 60, title: 'Web Designing' },
              { color: '#e9e7fd', progress: 50, title: 'Testing' },
              { color: '#dbf6fd', progress: 80, title: 'UI Development' },
              { color: '#ffd3e2', progress: 20, title: 'Data Analysis' },
            ].map((project, index) => (
              <div key={index} className="project-box-wrapper">
                <div className="project-box" style={{ backgroundColor: project.color }}>
                  <div className="project-box-header">
                    <span>December 10, 2023</span>
                    <Button variant="ghost" size="icon" className="project-btn-more">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="project-box-content-header">
                    <p className="box-content-header">{project.title}</p>
                    <p className="box-content-subheader">Prototyping</p>
                  </div>
                  <div className="box-progress-wrapper">
                    <p className="box-progress-header">Progress</p>
                    <div className="box-progress-bar">
                      <span 
                        className="box-progress" 
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: project.color.replace('0.1', '1')
                        }}
                      ></span>
                    </div>
                    <p className="box-progress-percentage">{project.progress}%</p>
                  </div>
                  <div className="project-box-footer">
                    <div className="participants">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 -ml-3">
                        <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="add-participant h-8 w-8 -ml-3"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="days-left">2 Days Left</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Messages Section */}
        <div className={cn("messages-section", showMessages && "show")}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="messages-close"
            onClick={() => setShowMessages(false)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <div className="projects-section-header">
            <p>Client Messages</p>
          </div>
          
          <div className="messages">
            {/* Message boxes */}
          </div>
        </div>
      </div>
    </div>
  );
}