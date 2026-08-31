import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { PersistenceProvider } from '@/lib/persistence/PersistenceProvider';
import { LearningPath } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';

export function useRoadmaps() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchRoadmaps();
    }
  }, [user?.id]);

  const fetchRoadmaps = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await PersistenceProvider.getInstance().fetchRoadmaps(user.id);
      setRoadmaps(data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast({
        title: 'Error',
        description: 'Failed to load learning path history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoadmap = async (roadmap: any) => {
    if (!user?.id) return null;

    try {
      const saved = await PersistenceProvider.getInstance().saveRoadmap(user.id, roadmap);
      toast({
        title: 'Roadmap Saved',
        description: 'Your learning path has been successfully saved.',
      });
      fetchRoadmaps(); // refresh
      return saved;
    } catch (error) {
      console.error('Error saving roadmap:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save roadmap. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    roadmaps,
    isLoading,
    fetchRoadmaps,
    saveRoadmap,
  };
}
