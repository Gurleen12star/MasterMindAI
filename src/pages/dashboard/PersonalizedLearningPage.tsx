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

  // Debug logging
  console.log('PersonalizedLearningPage render:', {
    'introduction.show': introduction.show,
    'introduction.isLoading': introduction.isLoading,
    'studyPlatform.show': studyPlatform.show,
    'introduction.actPage': introduction.actPage
  });

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

          <div className="relative min-h-[400px]">
            {/* Show Introduction Loading */}
            {introduction.isLoading && !studyPlatform.show && (
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

            {/* Show Introduction */}
            {introduction.show && !introduction.isLoading && !studyPlatform.show && (
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

            {/* Show Study Platform */}
            {studyPlatform.show && (
              <motion.div
                key="study-platform"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants(2)}
                transition={pageTransition(1.5)}
                className="w-full"
              >
                <StudyPlatform />
              </motion.div>
            )}

            {/* Debug/Fallback content - only show if nothing else is showing */}
            {!introduction.show && !introduction.isLoading && !studyPlatform.show && (
              <div className="w-full p-8 text-center">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Loading Personalized Learning...
                </h3>
                <p className="text-sm text-muted-foreground">
                  If this persists, please refresh the page.
                </p>
                <div className="mt-4 text-xs text-muted-foreground bg-muted p-4 rounded-lg">
                  Debug: introduction.show={String(introduction.show)}, 
                  introduction.isLoading={String(introduction.isLoading)}, 
                  studyPlatform.show={String(studyPlatform.show)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}