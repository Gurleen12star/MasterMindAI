import React from 'react';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { useSidebar } from '@/components/dashboard/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/personalized-learning/utilFunctions';
import Introduction from '@/components/personalized-learning/Introduction';
import IntroductionLoading from '@/components/personalized-learning/IntroductionLoading';
import StudyPlatform from '@/components/personalized-learning/StudyPlatform';
import LearningModulesSidebar from '@/components/personalized-learning/LearningModulesSidebar';

export default function PersonalizedLearningPage() {
  const { introduction, studyPlatform } = useAppContext();
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-full">
      {/* Learning Modules Sidebar - only show when study platform is active */}
      {studyPlatform.show && (
        <LearningModulesSidebar className="flex-shrink-0" />
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Personalized Learning</h1>
            <p className="text-muted-foreground">Create customized learning experiences powered by AI</p>
          </div>

          <div className="relative">
            <AnimatePresence mode='popLayout'>
              {introduction.show && (
                <motion.div
                  key="introduction"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants(2)}
                  transition={pageTransition(1.5)}
                  className="w-full"
                >
                  <Introduction />
                </motion.div>
              )}

              {introduction.isLoading && (
                <motion.div
                  key="introduction-loading"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants(2)}
                  transition={pageTransition(1.5)}
                  className="w-full"
                >
                  <IntroductionLoading />
                </motion.div>
              )}

              <motion.div
                key="study-platform"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants(2)}
                transition={pageTransition(1.5)}
                className={`w-full ${studyPlatform.show ? "visible" : "invisible h-0 max-h-0 overflow-hidden"}`}
              >
                <StudyPlatform />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}