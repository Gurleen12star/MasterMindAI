import { useState, useEffect } from 'react';
import { MermaidDiagram } from '@/components/ui/mermaid-diagram';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateLearningPath, generateLearningPathMermaid } from '@/lib/gemini';
import { supabaseClient } from '@/lib/supabase-admin';
import { useToast } from '@/hooks/use-toast';
import { Map, Loader2, FileText, BarChart as FlowChart, Maximize2, History, Clock } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseAuth } from '@/components/auth/ClerkSupabaseProvider';
import { getUserIdForSupabase } from '@/lib/supabase-admin';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface LearningPath {
  id: string;
  topic: string;
  mermaid_code: string;
  markdown_content: string;
  level: DifficultyLevel;
  created_at: string;
}

export default function LearningPathsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { isSupabaseReady } = useSupabaseAuth();
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<DifficultyLevel>('intermediate');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<string | null>(null);
  const [mermaidDiagram, setMermaidDiagram] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [learningPathHistory, setLearningPathHistory] = useState<LearningPath[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<LearningPath | null>(null);

  const fetchLearningPathHistory = async () => {
    if (!user?.id) return;
    
    setIsLoadingHistory(true);
    try {
      const supabaseUserId = getUserIdForSupabase(user.id);
      const { data, error } = await supabaseClient
        .from('learning_paths')
        .select('*')
        .eq('user_id', supabaseUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLearningPathHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load learning path history',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadHistoryItem = (item: LearningPath) => {
    setSelectedHistoryItem(item);
    setGeneratedPath(item.markdown_content);
    setMermaidDiagram(item.mermaid_code);
    setShowHistoryDialog(false);
  };

  useEffect(() => {
    const body = document.body;
    if (isFullscreen) {
      body.classList.add('fullscreen-dialog-open');
    } else {
      body.classList.remove('fullscreen-dialog-open');
    }
    return () => {
      body.classList.remove('fullscreen-dialog-open');
    };
  }, [isFullscreen]);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic for your learning path',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate both text and visual representations concurrently
      const [path, diagram] = await Promise.all([
        generateLearningPath(topic, level, additionalInfo),
        generateLearningPathMermaid(topic, level, additionalInfo)
      ]);
      
      if (!path || !diagram) {
        throw new Error('Failed to generate learning path content');
      }
      
      setGeneratedPath(path);
      setMermaidDiagram(diagram);

      // Save to database if user is authenticated
      if (user?.id) {
        try {
          const supabaseUserId = getUserIdForSupabase(user.id);
          const { error } = await supabaseClient
            .from('learning_paths')
            .insert([{
              topic,
              mermaid_code: diagram,
              markdown_content: path,
              level,
              user_id: supabaseUserId
            }]);

          if (error) throw error;
        } catch (error) {
          console.error('Error saving to database:', error);
          toast({
            title: 'Warning',
            description: 'Generated successfully but failed to save to history',
            variant: 'destructive',
          });
        }
      }
      
      toast({
        title: 'Learning Path Generated',
        description: 'Your personalized learning path is ready!',
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error && error.message.includes('overloaded')
        ? 'The AI model is currently overloaded. Please wait a moment and try again.'
        : 'Failed to generate learning path. Please try again.';
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Map className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground">
            Generate personalized learning paths tailored to your goals
          </p>
          {user && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                fetchLearningPathHistory();
                setShowHistoryDialog(true);
              }}
            >
              <History className="mr-2 h-4 w-4" />
              View History
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What would you like to learn?</h3>
              <Input
                placeholder="e.g., Machine Learning, Web Development, Data Science"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Choose your level</h3>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
                  <Button
                    key={l}
                    variant={level === l ? 'default' : 'outline'}
                    onClick={() => setLevel(l)}
                    className="flex-1 capitalize"
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <Textarea
                placeholder="Any specific goals, time constraints, or preferences? (optional)"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !topic || !isSupabaseReady}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : !isSupabaseReady ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing Secure Connection...
                </>
              ) : (
                'Generate Learning Path'
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Text View</span>
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <FlowChart className="h-4 w-4" />
                <span>Visual View</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <ScrollArea className="h-[600px] pr-4">
                {generatedPath ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedPath}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Generating your learning path...</p>
                      </div>
                    ) : (
                      <p>Your learning path will appear here</p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="visual">
              <ScrollArea className="h-[600px] px-4">
                {mermaidDiagram ? (
                  <>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => setIsFullscreen(true)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <div className="mermaid-diagram-wrapper transform hover:scale-[1.02] transition-transform duration-300">
                        <MermaidDiagram 
                          definition={mermaidDiagram} 
                          className="w-full min-h-[400px] flex items-center justify-center" 
                        />
                      </div>
                    </div>
                    
                    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] p-6 custom-cursor-enabled">
                        <DialogTitle>Learning Path Visualization</DialogTitle>
                        <div className="mermaid-diagram-wrapper h-full w-full flex items-center justify-center bg-gradient-to-br from-background to-background/95">
                          <MermaidDiagram 
                            definition={mermaidDiagram}
                            className="w-full h-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="animate-pulse">Creating your visual learning journey...</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <FlowChart className="h-12 w-12 mx-auto text-muted-foreground/50" />
                        <p>Your visual learning path will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Learning Path History</DialogTitle>
          <DialogDescription>
            Your previously generated learning paths
          </DialogDescription>
          
          <ScrollArea className="h-[400px] pr-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : learningPathHistory.length > 0 ? (
              <div className="space-y-4">
                {learningPathHistory.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          Level: {item.level}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No learning paths in history</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}