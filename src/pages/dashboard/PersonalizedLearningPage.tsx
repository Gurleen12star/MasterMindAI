import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { useSidebar } from '@/components/dashboard/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/personalized-learning/utilFunctions';
import Introduction from '@/components/personalized-learning/Introduction';
import IntroductionLoading from '@/components/personalized-learning/IntroductionLoading';
import StudyPlatform from '@/components/personalized-learning/StudyPlatform';
import LearningModulesSidebar from '@/components/personalized-learning/LearningModulesSidebar';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase';
import { PersonalizedLearningProvider } from '@/contexts/PersonalizedLearningContext';
import { addHistoryChat } from '@/lib/personalized-learning/utilFunctions';
import interactionGemini from '@/lib/personalized-learning/geminiClient';
import { Brain, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface LearningSession {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

function PersonalizedLearningContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    introduction,
    studyPlatform,
    sidebar,
    currentSessionId,
    loadSession,
    initialConvoMessage,
    setInitialConvoMessage,
    generationHistory,
    setGenerationHistory,
    personality
  } = useAppContext();
  
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);

  // Handle initial conversation message from Deep Research
  useEffect(() => {
    if (initialConvoMessage && !studyPlatform.show) {
      handleInitialConvoMessage();
    }
  }, [initialConvoMessage, studyPlatform.show]);

  const handleInitialConvoMessage = async () => {
    if (!initialConvoMessage) return;

    try {
      // Add user message to history
      const userMessage = `Please explain this research finding in detail: "${initialConvoMessage}"`;
      addHistoryChat(generationHistory, setGenerationHistory, 'user', userMessage);

      // Get AI response
      const response = await interactionGemini(userMessage, personality, generationHistory);
      const aiResponse = response.text();

      // Add AI response to history
      addHistoryChat(generationHistory, setGenerationHistory, 'model', aiResponse);

      toast({
        title: 'Research Discussion Started',
        description: 'Your selected text has been sent to the conversation AI.',
      });

    } catch (error) {
      console.error('Error starting conversation with research text:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation with selected text.',
        variant: 'destructive',
      });
    } finally {
      // Reset the initial message
      setInitialConvoMessage(null);
    }
  };

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('personalized_learning_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };
}

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
            <p className="text-muted-foreground">Experience interactive AI-powered learning journeys tailored just for you</p>
          </div>

          <Card className="relative overflow-hidden border-primary/10 shadow-md p-6 backdrop-blur-sm bg-card/80">
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
          </Card>
        </div>
      </div>
    </div>
  );
}