import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import { useProfile } from '@/hooks/useProfile';
import { calculateSkillGaps } from '@/lib/gap-engine';
import { generateIntelligenceTrace } from '@/lib/explanations';
import IntelligenceTrace from '@/components/personalized-learning/IntelligenceTrace';
import { SkillGap, MasterMindProfile } from '@/types/mastermind';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import CustomRoadmapView from '@/components/roadmap/CustomRoadmapView';

type Roadmap = {
  id: string;
  topic: string;
  mermaid_code: string;
  created_at: string;
  user_id: string;
  intelligence_trace?: any;
  structured_data?: any;
  learner_snapshot?: any;
};

// Default mermaid code for fallback
// removed unused code

export default function RoadmapGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Understanding your career goal...",
    "Analyzing your current capabilities...",
    "Finding your highest-impact skill gaps...",
    "Matching recommendations to your goals...",
    "Building your personalized career path...",
    "Optimizing your learning workload..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);
  
  const { roadmaps: userRoadmaps, fetchRoadmaps: fetchUserRoadmaps, saveRoadmap, isLoading: isLoadingRoadmaps } = useRoadmaps();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserRoadmaps();
    }
  }, [user?.id]);

  useEffect(() => {
    if (userRoadmaps && userRoadmaps.length > 0 && !selectedRoadmap) {
      // Auto-select the most recently created roadmap
      const sorted = [...userRoadmaps].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
      setSelectedRoadmap(sorted[0] as Roadmap);
    }
  }, [userRoadmaps, selectedRoadmap]);

  // fetchUserRoadmaps logic is inside useRoadmaps

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: 'Please enter a topic',
        description: 'A topic is required to generate a roadmap',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to generate and save roadmaps',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    
    try {
      // 1. Generate structured roadmap with Edge Function
      let roadmapData = null;
      let mermaidCode = '';
      let gaps: SkillGap[] = [];
      let traceData = null;
      
      try {
        const { generateRoadmap } = await import('@/lib/gemini');
        const { convertLearningPathToMermaid } = await import('@/lib/mermaid-adapter');

        if (profile) {
          gaps = calculateSkillGaps(profile as unknown as MasterMindProfile);
          traceData = generateIntelligenceTrace(gaps, (profile as unknown as MasterMindProfile).careerIntent, []);
        }
        
        roadmapData = await generateRoadmap(topic, profile, gaps);
        
        // 2. Convert to Mermaid for visualization (adapter handles fallback safely)
        mermaidCode = convertLearningPathToMermaid(roadmapData);
      } catch (aiError: any) {
        console.error('AI error:', aiError);
        toast({
          title: 'AI Generation Error',
          description: aiError.message || 'Failed to generate roadmap',
          variant: 'destructive',
        });
        
        // Use fallback so the UI doesn't crash completely, but don't save this to DB
        
        setIsGenerating(false);
        return; 
      }
      
      

      // Create a new roadmap object matching the updated database schema
      const newRoadmap: Partial<Roadmap> & { structured_data?: any } = {
        topic,
        mermaid_code: mermaidCode,
        structured_data: roadmapData,
        intelligence_trace: traceData,
        learner_snapshot: profile,
        user_id: user.id
      };

      // Save using useRoadmaps
      try {
        const saved = await saveRoadmap(newRoadmap);

        if (saved) {
          setSelectedRoadmap(saved);
        }
      } catch (dbError: any) {
        console.error('Database error:', dbError);
      }

      toast({
        title: 'Roadmap generated!',
        description: 'Your personalized learning path has been created successfully.',
      });
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const viewRoadmap = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Build Your Career Path</h2>
        <p className="text-muted-foreground">
          Generate personalized career paths powered by MasterMindAI.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main content area - Form and Selected Roadmap */}
        <div className={`flex-1 space-y-6 ${isSidebarCollapsed ? 'xl:pr-14' : ''}`}>
          {/* Generation Form */}
          <Card className="p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Build Your Path</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What would you like to learn?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Machine Learning, Web Development"
                    className="flex-1 px-4 py-2 rounded-md border bg-background"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <AnimatedLoadingText message={loadingMessages[loadingMessageIndex]} />
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Roadmap Display */}
          {selectedRoadmap && (
            <Card className="p-4 md:p-6 flex-1 rounded-2xl overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 className="font-semibold text-lg">{selectedRoadmap.topic}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(selectedRoadmap.created_at)}
                  </p>
                </div>
              </div>
              <div className="border rounded-xl p-3 md:p-6 bg-background shadow-inner overflow-x-hidden min-h-[600px]">
                <CustomRoadmapView 
                  dna={(selectedRoadmap.learner_snapshot || profile || {}) as unknown as MasterMindProfile}
                  skillGaps={selectedRoadmap.intelligence_trace?.identifiedGaps || ((selectedRoadmap.learner_snapshot || profile) ? calculateSkillGaps((selectedRoadmap.learner_snapshot || profile) as unknown as MasterMindProfile) : [])}
                  milestones={selectedRoadmap.structured_data?.milestones || []}
                />
              </div>

              {selectedRoadmap.intelligence_trace && (
                <div className="mt-8 pt-6 border-t">
                  <IntelligenceTrace 
                    profile={(selectedRoadmap.learner_snapshot || profile || {}) as unknown as MasterMindProfile} 
                    gaps={selectedRoadmap.intelligence_trace.identifiedGaps || []} 
                  />
                </div>
              )}
            </Card>
          )}

          {/* Empty state when no roadmap is selected */}
          {!selectedRoadmap && (
            <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
              <p className="mb-2">No roadmap selected</p>
              <p className="text-sm">Generate a new roadmap or select one from your history</p>
            </div>
          )}
        </div>

        {/* Right sidebar - Roadmap History */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'xl:w-12' : 'xl:w-80 2xl:w-96'} hidden xl:block`}>
          {/* Sidebar toggle button - visible only on larger screens */}
          <button 
            className="hidden xl:flex absolute z-10 items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground -ml-4 shadow-md hover:bg-primary/90"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ transform: 'translateY(20px)' }}
          >
            {isSidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            )}
          </button>

          {/* Sidebar content - can be collapsed */}
          <Card className={`sticky top-6 shadow-md transition-all duration-300 rounded-2xl ${isSidebarCollapsed ? 'w-10 overflow-hidden' : 'w-full'}`}>
            <div className={`p-4 border-b bg-muted/50 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
              {!isSidebarCollapsed ? (
                <h3 className="font-semibold text-lg">Your Roadmaps</h3>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              )}
            </div>

            {!isSidebarCollapsed && (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-3 space-y-3">
                  {isLoadingRoadmaps ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg border">
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : userRoadmaps.length > 0 ? (
                    <div className="space-y-3">
                      {userRoadmaps.map((roadmap) => (
                        <div 
                          key={roadmap.id} 
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedRoadmap?.id === roadmap.id ? 'bg-accent border-primary' : 'bg-card hover:bg-accent/50'
                          }`}
                          onClick={() => viewRoadmap(roadmap)}
                        >
                          <div className="flex-1">
                            <p className="font-medium truncate">{roadmap.topic}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(roadmap.created_at)}
                            </p>
                          </div>
                          <Button 
                            variant={selectedRoadmap?.id === roadmap.id ? "secondary" : "ghost"} 
                            size="sm"
                            className="ml-auto"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No roadmaps yet. Generate your first one!
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}