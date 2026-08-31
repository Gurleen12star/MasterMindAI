import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  History,
  Calendar,
  User,
  Eye,
  Trash2,
  BookOpen,
  Loader2,
  Brain,
  Plus
} from 'lucide-react';

interface LearningSession {
  id: string;
  topic: string;
  personality: string;
  modules_data: any[];
  generation_history: any[];
  created_at: string;
  updated_at: string;
}

export default function PersonalizedLearningHistoryPage() {
  const { user } = useAuth();
  const { loadSession } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSessions();
    }
  }, [user?.id]);

  const fetchSessions = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('personalized_learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Group sessions by topic and keep only the most recent one for each topic
      const groupedSessions = (data || []).reduce((acc: LearningSession[], session: LearningSession) => {
        const existingIndex = acc.findIndex(s => s.topic.toLowerCase() === session.topic.toLowerCase());
        if (existingIndex === -1) {
          acc.push(session);
        } else {
          // Keep the most recent session (assuming data is already ordered by created_at desc)
          if (new Date(session.created_at) > new Date(acc[existingIndex].created_at)) {
            acc[existingIndex] = session;
          }
        }
        return acc;
      }, []);
      
      setSessions(groupedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load learning history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = (session: LearningSession) => {
    loadSession(session);
    navigate('/dashboard/personalized-learning');
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!user?.id) return;

    try {
      setDeletingId(sessionId);
      const { error } = await supabase
        .from('personalized_learning_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSessions(sessions.filter(session => session.id !== sessionId));
      toast({
        title: 'Success',
        description: 'Learning session deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete learning session',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getPersonalityColor = (personality: string) => {
    switch (personality) {
      case 'Formal':
        return 'bg-blue-100 text-blue-800';
      case 'Informal':
        return 'bg-green-100 text-green-800';
      case 'Engraçado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sério':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'Formal':
        return '🎓';
      case 'Informal':
        return '😊';
      case 'Engraçado':
        return '😄';
      case 'Sério':
        return '🧠';
      default:
        return '⚖️';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Learning History</h1>
            <p className="text-muted-foreground">
              View and continue your personalized learning sessions
            </p>
          </div>
        </div>
        
        <Button onClick={() => navigate('/dashboard/personalized-learning')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Learning Sessions Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your first personalized learning session to see your history here.
          </p>
          <Button onClick={() => navigate('/dashboard/personalized-learning')} className="gap-2">
            <Plus className="h-4 w-4" />
            Start Learning
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {session.topic}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-lg">
                      {getPersonalityIcon(session.personality)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={getPersonalityColor(session.personality)}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        {session.personality}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {session.modules_data?.length || 0} modules
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewSession(session)}
                        className="flex-1 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Continue
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                        disabled={deletingId === session.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {deletingId === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}