/**
 * OnboardingIntroPage — MasterMindAI "Let us understand you" animation
 *
 * Runs for ~4 seconds with sequential messages, then transitions to /onboarding
 * Uses real MasterMindLogo. Semantic tokens — works in both light + dark mode.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MasterMindLogo from '@/components/ui/MasterMindLogo';

const INTRO_MESSAGES = [
  "Let's understand where you are.",
  "Where you're going.",
  "What you already know.",
  "What you're still missing.",
  "How you learn best.",
  "How much time you actually have.",
  "Then we'll build your path.",
];

export default function OnboardingIntroPage() {
  const navigate = useNavigate();
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => {
        if (prev >= INTRO_MESSAGES.length - 1) {
          clearInterval(interval);
          setDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate('/onboarding'), 700);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pulsing logo */}
        <motion.div
          className="relative mb-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150" />
          <MasterMindLogo className="h-24 w-24 text-primary relative z-10" />
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.4, 1.8], opacity: [0.5, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
          />
        </motion.div>

        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
          MasterMindAI
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Building your intelligence profile
        </h2>

        {/* Cycling message */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-muted-foreground text-base"
            >
              {INTRO_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {INTRO_MESSAGES.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-primary/20 transition-all duration-300"
              animate={{
                width: i <= msgIndex ? '24px' : '8px',
                backgroundColor: i <= msgIndex ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.2)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
