import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PersonalizedLearningProvider } from '@/contexts/PersonalizedLearningContext';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
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
  const { user } = useAuth();
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
          <Routes>
            {/* Profile setup route without ProfileGuard */}
            <Route path="profile-setup" element={<ProfileSetupPage />} />
            
            {/* Protected routes with ProfileGuard */}
            <Route path="roadmap-generator" element={
              <ProfileGuard>
                <RoadmapGeneratorPage />
              </ProfileGuard>
            } />
            <Route path="paths" element={
              <ProfileGuard>
                <LearningPathsPage />
              </ProfileGuard>
            } />
            <Route path="explore" element={
              <ProfileGuard>
                <ExploreHubPage />
              </ProfileGuard>
            } />
            <Route path="summaries" element={
              <ProfileGuard>
                <QuickSummariesPage />
              </ProfileGuard>
            } />
            <Route path="research" element={
              <ProfileGuard>
                <DeepResearchPage />
              </ProfileGuard>
            } />
            <Route path="profile" element={
              <ProfileGuard>
                <ProfilePage />
              </ProfileGuard>
            } />
            <Route path="animation-studio" element={
              <ProfileGuard>
                <AnimationStudioPage />
              </ProfileGuard>
            } />
            <Route path="convo-ai" element={
              <ProfileGuard>
                <TavusConversationPage />
              </ProfileGuard>
            } />
            <Route path="personalized-learning" element={
              <ProfileGuard>
                <PersonalizedLearningPage />
              </ProfileGuard>
            } />
            <Route path="personalized-learning-history" element={
              <ProfileGuard>
                <PersonalizedLearningHistoryPage />
              </ProfileGuard>
            } />

            {/* Admin Routes */}
            <Route path="admin/*" element={
              <AdminRoutes />
            } />
            
            {/* Default redirect to explore */}
            <Route path="" element={
              <ProfileGuard>
                <ExploreHubPage />
              </ProfileGuard>
            } />
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