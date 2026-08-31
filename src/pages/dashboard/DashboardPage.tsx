import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PersonalizedLearningProvider } from '@/contexts/PersonalizedLearningContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/dashboard/SidebarContext';
import ProfileGuard from '@/components/dashboard/ProfileGuard';
import RoadmapGeneratorPage from './RoadmapGeneratorPage';
import LearningPathsPage from './LearningPathsPage';
import ExploreHubPage from './ExploreHubPage';
import DashboardOverviewPage from './DashboardOverviewPage';
import QuickSummariesPage from './QuickSummariesPage';
import DeepResearchPage from './DeepResearchPage';
import ProfileSetupPage from './ProfileSetupPage';
import ProfilePage from './ProfilePage';
import AnimationStudioPage from './AnimationStudioPage';
import PersonalizedLearningPage from './PersonalizedLearningPage';
import TavusConversationPage from './TavusConversationPage';
import AdminRoutes from '../admin/AdminRoutes';
import PersonalizedLearningHistoryPage from './PersonalizedLearningHistoryPage';
import MaintenanceBanner from '@/components/admin/MaintenanceBanner';

function DashboardContent() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <PersonalizedLearningProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="hidden md:flex md:fixed" />
      
        <div className={`relative flex-1 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          <MaintenanceBanner />
          <DashboardHeader>
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-[#111111] border-r-0">
                <Sidebar className="flex" />
              </SheetContent>
            </Sheet>
          </DashboardHeader>
          <main className="flex-1 overflow-y-auto px-4 md:px-6 pt-24">
            <Routes>
              {/* Profile setup route without ProfileGuard */}
              <Route path="profile-setup" element={<ProfileSetupPage />} />
              
              {/* Protected routes without ProfileGuard for Phase 2 compatibility */}
              <Route path="roadmap-generator" element={<RoadmapGeneratorPage />} />
              <Route path="paths" element={<LearningPathsPage />} />
              <Route path="explore" element={<ExploreHubPage />} />
              <Route path="summaries" element={<QuickSummariesPage />} />
              <Route path="research" element={<DeepResearchPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="animation-studio" element={<AnimationStudioPage />} />
              <Route path="convo-ai" element={<TavusConversationPage />} />
              <Route path="personalized-learning" element={<PersonalizedLearningPage />} />
              <Route path="personalized-learning-history" element={<PersonalizedLearningHistoryPage />} />

              {/* Admin Routes */}
              <Route path="admin/*" element={
                <AdminRoutes />
              } />
              
              {/* Default redirect to overview */}
              <Route path="" element={<DashboardOverviewPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </PersonalizedLearningProvider>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}