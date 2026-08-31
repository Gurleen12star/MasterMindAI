import React, { useEffect } from 'react';
import { PersonalizedLearningProvider, useAppContext } from '@/contexts/PersonalizedLearningContext';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/personalized-learning/utilFunctions';
import Introduction from '@/components/personalized-learning/Introduction';
import IntroductionLoading from '@/components/personalized-learning/IntroductionLoading';
import StudyPlatform from '@/components/personalized-learning/StudyPlatform';

function PersonalizedLearningContent() {
  const { introduction, studyPlatform, setSidebar } = useAppContext();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) { // Equivalent to lg breakpoint
        setSidebar({ expanded: false });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebar]);

  return (
    <div className="relative w-full h-full">
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
  );
}

export default function PersonalizedLearningPage() {
  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Personalized Learning</h1>
        <p className="text-muted-foreground">Create customized learning experiences powered by AI</p>
      </div>

      <PersonalizedLearningProvider>
        <PersonalizedLearningContent />
      </PersonalizedLearningProvider>
    </div>
  );
}