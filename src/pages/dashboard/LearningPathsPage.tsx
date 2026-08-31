import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateLearningPath, generateLearningPathMermaid } from '@/lib/gemini';
import { MermaidDiagram } from '@/components/ui/mermaid-diagram';
import { useToast } from '@/hooks/use-toast';
import { Map, Loader2, FileText, BarChart as FlowChart, Maximize2 } from 'lucide-react';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export default function LearningPathsPage() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<DifficultyLevel>('intermediate');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<string | null>(null);
  const [mermaidDiagram, setMermaidDiagram] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      
      setGeneratedPath(path);
      setMermaidDiagram(diagram);
      
      toast({
        title: 'Learning Path Generated',
        description: 'Your personalized learning path is ready!',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate learning path. Please try again.',
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
              disabled={isGenerating || !topic}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
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
                      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] p-6">
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
    </div>
  );
}