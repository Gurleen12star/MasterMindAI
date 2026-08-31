import { useUser } from '@clerk/clerk-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';
import ExploreHubPage from './ExploreHubPage';

export default function DashboardPage() {
  const { user } = useUser();
  const path = window.location.pathname;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {(() => {
            switch (path) {
              case '/dashboard/roadmap-generator':
                return <RoadmapGeneratorPage />;
              case '/dashboard/explore':
                return <ExploreHubPage />;
              default:
                return <ExploreHubPage />;
            }
          })()}
        </main>
      </div>
    </div>
  );
}