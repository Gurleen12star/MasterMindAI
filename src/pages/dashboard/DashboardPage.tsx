import { useUser } from '@clerk/clerk-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewStats from '@/components/dashboard/OverviewStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';

export default function DashboardPage() {
  const { user } = useUser();
  const path = window.location.pathname;

  const renderContent = () => {
    switch (path) {
      case '/dashboard/roadmap-generator':
        return <RoadmapGeneratorPage />;
      case '/dashboard/discovery':
        return <ContentDiscoveryPage />;
      default:
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-muted-foreground">
                  Here's what's happening with your learning journey today.
                </p>
              </div>
            </div>
            
            <OverviewStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-background/50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}