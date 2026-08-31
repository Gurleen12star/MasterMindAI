import { useUser } from '@clerk/clerk-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewStats from '@/components/dashboard/OverviewStats';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';
import ContentDiscoveryPage from './ContentDiscoveryPage';

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
              case '/dashboard/discovery':
                return <ContentDiscoveryPage />;
              default:
                return <RoadmapGeneratorPage />;
            }
          })()}
        </main>
      </div>
    </div>
  );
}