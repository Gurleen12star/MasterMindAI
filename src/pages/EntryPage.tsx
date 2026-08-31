/**
 * EntryPage — "Are you already accelerating?"
 *
 * Uses the REAL MasterMindLogo SVG component (from /components/ui/MasterMindLogo)
 * Uses semantic CSS tokens — works in BOTH light and dark mode
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MasterMindLogo from '@/components/ui/MasterMindLogo';

export default function EntryPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 bg-background">
      {/* Subtle grid — scoped, does not use hero CSS class */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Real MasterMindLogo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-12">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150" />
            <MasterMindLogo className="h-20 w-20 text-primary relative z-10" />
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              MasterMindAI
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Are you already accelerating?
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Pick up where you left off, or let MasterMindAI understand you first.
            </p>
          </div>
        </motion.div>

        {/* Two choice cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* YES — Dashboard */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="relative overflow-hidden cursor-pointer h-full bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group p-8"
              onClick={() => navigate('/dashboard')}
              id="entry-yes-btn"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-auto">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Yes — Continue My Journey
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I already have my MasterMindAI profile. Take me to my dashboard.
                  </p>
                </div>
                <Button
                  className="mt-6 w-full"
                  id="entry-go-dashboard"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* NO — Onboarding */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="relative overflow-hidden cursor-pointer h-full bg-card border border-border hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group p-8"
              onClick={() => navigate('/onboarding/intro')}
              id="entry-no-btn"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-auto">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    No — Build My Learning DNA
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Let MasterMindAI understand where I am and where I want to go.
                  </p>
                </div>
                <Button
                  className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  id="entry-start-onboarding"
                >
                  <span>Build My Learning DNA</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Back link */}
        <motion.div variants={itemVariants} className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            id="entry-back-home"
          >
            ← Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
