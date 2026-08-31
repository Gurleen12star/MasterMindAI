import React from 'react';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/personalized-learning/utilFunctions';
import Introduction from '@/components/personalized-learning/Introduction';
import IntroductionLoading from '@/components/personalized-learning/IntroductionLoading';
import StudyPlatform from '@/components/personalized-learning/StudyPlatform';

export default function PersonalizedLearningPage() {
  const { introduction, studyPlatform } = useAppContext();

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Personalized Learning</h1>
        <p className="text-muted-foreground">Create customized learning experiences powered by AI</p>
      </div>

      <div className="relative w-full">
      <AnimatePresence mode='popLayout'>
        {introduction.show && (
          <motion.div
            key="introduction"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants(2)}
            transition={pageTransition(1.5)}
            className="w-full h-full"
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
            className="w-full h-full"
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
          className={`w-full h-full ${studyPlatform.show ? "visible" : "invisible h-0 max-h-0 overflow-hidden"}`}
        >
          <StudyPlatform />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}