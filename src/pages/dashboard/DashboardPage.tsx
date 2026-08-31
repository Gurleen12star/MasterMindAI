import { useUser } from '@clerk/clerk-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewStats from '@/components/dashboard/OverviewStats';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
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
            
            <div className="space-y-6">
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Learning Goals</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Complete Python Course</p>
                        <p className="text-sm text-muted-foreground">Due in 5 days</p>
                      </div>
                      <div className="h-2 w-24 rounded-full bg-primary/20">
                        <div className="h-full w-3/4 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Master React Hooks</p>
                        <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                      </div>
                      <div className="h-2 w-24 rounded-full bg-primary/20">
                        <div className="h-full w-1/2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Build Portfolio Project</p>
                        <p className="text-sm text-muted-foreground">Due in 3 weeks</p>
                      </div>
                      <div className="h-2 w-24 rounded-full bg-primary/20">
                        <div className="h-full w-1/4 rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">15</span>
                      </div>
                      <div>
                        <p className="font-medium">Advanced JavaScript Concepts</p>
                        <p className="text-sm text-muted-foreground">Today at 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">16</span>
                      </div>
                      <div>
                        <p className="font-medium">Database Design Workshop</p>
                        <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}