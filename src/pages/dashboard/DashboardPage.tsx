import { useState } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import ProfileGuard from '@/components/dashboard/ProfileGuard';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';
import LearningPathsPage from './LearningPathsPage';
import ExploreHubPage from './ExploreHubPage';
import QuickSummariesPage from './QuickSummariesPage';
import DeepResearchPage from './DeepResearchPage';
import ProfileSetupPage from './ProfileSetupPage';
import ProfilePage from './ProfilePage';

export default function DashboardPage() {
  const { user } = useAuth();
  const path = window.location.pathname;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle profile setup route without ProfileGuard
  if (path === '/dashboard/profile-setup') {
    return <ProfileSetupPage />;
  }

  return (
    <ProfileGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="hidden md:flex md:fixed" />
        
        <div className="flex-1 flex flex-col md:ml-64">
          <DashboardHeader>
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-[#111111] border-r-0">
                 <Sidebar className="flex" />
              </SheetContent>
            </Sheet>
          </DashboardHeader>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {(() => {
              switch (path) {
                case '/dashboard/roadmap-generator':
                  return <RoadmapGeneratorPage />;
                case '/dashboard/paths':
                  return <LearningPathsPage />;
                case '/dashboard/explore':
                  return <ExploreHubPage />;
                case '/dashboard/summaries':
                  return <QuickSummariesPage />;
                case '/dashboard/research':
                  return <DeepResearchPage />;
                case '/dashboard/profile':
                  return <ProfilePage />;
                default:
                  return <ExploreHubPage />;
              }
            })()}
          </main>
        </div>
      </div>
    </ProfileGuard>
  );
}