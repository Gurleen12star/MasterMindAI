import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-admin';
import { generateRoadmapMermaid } from '@/lib/gemini';
import { MermaidDiagram } from '@/components/ui/mermaid-diagram';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Roadmap = {
  id: string;
  topic: string;
  mermaid_code: string;
  created_at: string;
  user_id: string;
};

// Default mermaid code for fallback
const DEFAULT_MERMAID_CODE = `flowchart TD
  A[Start] --> B[Fundamentals]
  B --> C[Intermediate Concepts]
  C --> D[Advanced Topics]
  D --> E[Projects & Practice]
  E --> F[Mastery]`;

export default function RoadmapGeneratorPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState<string | null>(null);
  const [userRoadmaps, setUserRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserRoadmaps();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchUserRoadmaps = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Use the standard client with user_id filter for RLS
      const { data, error } = await supabaseClient
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching roadmaps:', error);
        console.error('Error details:', error.message);
        toast({
          title: 'Error loading roadmaps',
          description: 'Could not load your saved roadmaps. Please try again later.',
          variant: 'destructive',
        });
        setUserRoadmaps([]);
      } else {
        console.log(`Successfully loaded ${data?.length || 0} roadmaps for user ${user.id}`);
        setUserRoadmaps(data || []);
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast({
        title: 'Error loading roadmaps',
        description: 'Something went wrong while loading your roadmaps.',
        variant: 'destructive',
      });
      setUserRoadmaps([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    setCurrentRoadmap(null);
    
    try {
      // Generate roadmap with Gemini
      let mermaidCode = '';
      try {
        mermaidCode = await generateRoadmapMermaid(topic);
        
        // Basic validation of mermaid code
        if (!mermaidCode || !mermaidCode.trim().startsWith('flow') && !mermaidCode.trim().startsWith('graph')) {
          console.warn('Invalid mermaid code received, using default instead');
          mermaidCode = DEFAULT_MERMAID_CODE;
        }
      } catch (aiError) {
        console.error('AI error:', aiError);
        toast({
          title: 'AI Generation Error',
          description: 'Using a default roadmap template instead',
          variant: 'destructive',
        });
        mermaidCode = DEFAULT_MERMAID_CODE;
      }
      
      setCurrentRoadmap(mermaidCode);

      // Create a new roadmap object
      const newRoadmap: Omit<Roadmap, 'id' | 'created_at'> = {
        topic,
        mermaid_code: mermaidCode,
        user_id: user.id
      };

      // Save to local state as a temporary solution
      const tempRoadmap = {
        ...newRoadmap,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      } as Roadmap;

      setSelectedRoadmap(tempRoadmap);
      setUserRoadmaps(prev => [tempRoadmap, ...prev]);

      // Save to Supabase database
      try {
        console.log("Attempting to save roadmap to Supabase for user:", user.id);
        
        // First, check if we can connect to the database
        const { error: pingError } = await supabaseClient
          .from('roadmaps')
          .select('id')
          .limit(1);
          
        if (pingError) {
          console.error('Supabase connection test failed:', pingError);
          throw new Error(`Database connection failed: ${pingError.message}`);
        }
        
        // Then try the actual insert
        const { data, error } = await supabaseClient
          .from('roadmaps')
          .insert([newRoadmap])
          .select();

        if (error) {
          console.error('Supabase insert error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          
          toast({
            title: 'Warning',
            description: `Could not save to database: ${error.message}`,
            variant: 'destructive',
          });
        } else if (data && data.length > 0) {
          // Update the temporary roadmap with the real one from the database
          setSelectedRoadmap(data[0]);
          setUserRoadmaps(prev => 
            prev.map(r => r.id === tempRoadmap.id ? data[0] : r)
          );
          console.log("Successfully saved roadmap to Supabase with ID:", data[0].id);
          
          // Refresh the roadmaps list to ensure we have the latest data
          fetchUserRoadmaps();
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: 'Database Error',
          description: `Failed to save to database: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
          variant: 'destructive',
        });
        // Continue with the local fallback data
      }

      toast({
        title: 'Roadmap generated!',
        description: 'Your learning roadmap has been created successfully.',
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate roadmap. Please try again.',
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Roadmap Generator</h2>
        <p className="text-muted-foreground">
          Generate personalized learning roadmaps powered by AI.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main content area - Form and Selected Roadmap */}
        <div className={`flex-1 space-y-6 ${isSidebarCollapsed ? 'xl:pr-14' : ''}`}>
          {/* Generation Form */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Generate New Roadmap</h3>
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
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Roadmap Display */}
          {selectedRoadmap && (
            <Card className="p-6 flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{selectedRoadmap.topic}</h3>
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(selectedRoadmap.created_at)}
                </p>
              </div>
              <div className="border rounded-md p-6 bg-background overflow-visible">
                <div className="mb-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Roadmap:</span> {selectedRoadmap.topic} ({selectedRoadmap.mermaid_code.length} chars)
                </div>
                <div className="mermaid-container" style={{ minHeight: '500px', width: '100%' }}>
                  <MermaidDiagram definition={selectedRoadmap.mermaid_code} className="w-full h-full" />
                </div>
              </div>
              <div className="mt-4">
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">View Raw Mermaid Code</summary>
                  <pre className="mt-2 p-2 bg-muted rounded-md overflow-auto whitespace-pre-wrap">
                    {selectedRoadmap.mermaid_code}
                  </pre>
                </details>
              </div>
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
              <svg xmlns="http://www.w3.org/2000/svg\" width="16\" height="16\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </button>

          {/* Sidebar content - can be collapsed */}
          <Card className={`sticky top-6 shadow-md transition-all duration-300 ${isSidebarCollapsed ? 'w-10 overflow-hidden' : 'w-full'}`}>
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
                  {isLoading ? (
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