import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';
import LearningPathsPage from './LearningPathsPage';
import ExploreHubPage from './ExploreHubPage';
import QuickSummariesPage from './QuickSummariesPage';
import DeepResearchPage from './DeepResearchPage';

export default function DashboardPage() {
  const { user } = useUser();
  const path = window.location.pathname;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[300px]">
          <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DashboardHeader>
        <main className="flex-1 overflow-y-auto px-4 md:px-6">
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
              default:
                return <ExploreHubPage />;
            }
          })()}
        </main>
      </div>
    </div>
  );
}