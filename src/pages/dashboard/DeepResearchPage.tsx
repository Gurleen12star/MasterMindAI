import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-admin';
import { useUser } from '@clerk/clerk-react'; // We still use this for displaying user info
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import {
  Search,
  Loader2,
  Copy,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  FileText,
  Sparkles,
  Brain,
  Target,
  Zap,
  History,
  Trash2
} from 'lucide-react';

// Interfaces remain the same...
interface ResearchSource {
  url: string;
  title: string;
  description: string;
}

interface ResearchResult {
  report: string;
  sources: ResearchSource[];
  summaries: string[];
  totalFindings: number;
}

interface ResearchProgress {
  step: string;
  message: string;
  depth: number;
  currentTopic?: string;
  sourcesFound?: number;
}

interface DeepResearchHistory {
  id: string;
  topic: string;
  report: string;
  sources: ResearchSource[];
  summaries: string[];
  total_findings: number;
  max_depth: number;
  created_at: string;
}


export default function DeepResearchPage() {
  const { toast } = useToast();
  const { user } = useUser();

  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);

  const [topic, setTopic] = useState('');
  const [maxDepth, setMaxDepth] = useState(3);
  const [isResearching, setIsResearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [progress, setProgress] = useState<ResearchProgress[]>([]);
  const [activeTab, setActiveTab] = useState('report');
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [researchHistory, setResearchHistory] = useState<DeepResearchHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DeepResearchHistory | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // **THE DEFINITIVE FIX: Listen directly to Supabase's auth state**
  useEffect(() => {
    // Check for an existing session on initial component mount
    const checkInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setIsFullyAuthenticated(true);
        console.log("✅ Initial Supabase session confirmed on mount.");
      }
    };
    checkInitialSession();

    // Listen for future auth events like TOKEN_REFRESHED and SIGNED_IN
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase Auth Event: ${event}`);
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setIsFullyAuthenticated(true);
        console.log(`✅ Supabase client is ready via ${event} event.`);
      } else if (event === 'SIGNED_OUT') {
        setIsFullyAuthenticated(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const saveResearchToHistory = async (researchData: ResearchResult) => {
    if (!isFullyAuthenticated || !user) {
      toast({
        title: 'Authentication Error',
        description: 'Your session is not fully ready. Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { session: supabaseSession }, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError || !supabaseSession) {
        throw new Error(`Could not retrieve Supabase session. Please try again. Error: ${sessionError?.message || 'No active session'}`);
      }
      
      const supabaseUserId = supabaseSession.user.id;
      console.log(`Attempting to save research with Supabase UUID: ${supabaseUserId}`);
      
      const { error: saveError } = await supabaseClient.from('deep_research_history').insert([{
        user_id: supabaseUserId,
        topic: topic.trim(),
        report: researchData.report,
        sources: researchData.sources || [],
        summaries: researchData.summaries || [],
        total_findings: researchData.totalFindings || 0,
        max_depth: maxDepth
      }]);

      if (saveError) throw saveError;

      console.log('✅ Deep research saved successfully!');
      toast({
        title: 'Research Saved',
        description: 'Your research has been successfully saved to your account.',
      });
    } catch (error) {
      console.error('An unexpected error occurred during save:', error);
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred while saving.',
        variant: 'destructive',
      });
    }
  };
  
  // No changes needed below this line, but included for completeness. The `isFullyAuthenticated` state will now work correctly.

  const fetchResearchHistory = async () => {
    if (!isFullyAuthenticated) return;
    
    setIsLoadingHistory(true);
    try {
      const { data: { session: supabaseSession }, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError || !supabaseSession) throw new Error(sessionError?.message || "No active session to fetch history.");

      const { data, error } = await supabaseClient
        .from('deep_research_history')
        .select('*')
        .eq('user_id', supabaseSession.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load research history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadHistoryItem = (item: DeepResearchHistory) => {
    setSelectedHistoryItem(item);
    setResult({
      report: item.report,
      sources: item.sources,
      summaries: item.summaries,
      totalFindings: item.total_findings
    });
    setTopic(item.topic);
    setMaxDepth(item.max_depth);
    setShowHistoryDialog(false);
    setActiveTab('report');
  };

  const deleteHistoryItem = async (id: string) => {
    if (!isFullyAuthenticated) return;

    try {
      const { error } = await supabaseClient
        .from('deep_research_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResearchHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'Research history item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete history item.',
        variant: 'destructive',
      });
    }
  };

  const handleStartResearch = async () => {
    if (!isFullyAuthenticated) {
        toast({
            title: 'Authentication Required',
            description: 'Please wait for the secure connection to initialize.',
            variant: 'destructive',
        });
        return;
    }
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to research.',
        variant: 'destructive',
      });
      return;
    }

    setIsResearching(true);
    setResult(null);
    setProgress([]);
    setSelectedHistoryItem(null);
    setActiveTab('progress');

    try {
      const initialProgress: ResearchProgress = {
        step: 'starting',
        message: 'Initializing deep research agent...',
        depth: 0
      };
      setProgress([initialProgress]);

      const { data, error } = await supabaseClient.functions.invoke('deep-research-agent', {
        body: { 
          topic: topic.trim(),
          maxDepth: Math.min(Math.max(1, maxDepth), 5)
        },
      });

      if (error) throw new Error(error.message || 'Failed to start research');
      if (!data) throw new Error('No data received from research agent');
      
      const progressSteps: ResearchProgress[] = [
        { step: 'searching', message: `Searching for information about "${topic}"...`, depth: 1, currentTopic: topic },
        { step: 'extracting', message: 'Extracting content from relevant sources...', depth: 1, sourcesFound: data.sources?.length || 0 },
        { step: 'analyzing', message: 'Analyzing findings and identifying knowledge gaps...', depth: 2 },
        { step: 'synthesizing', message: 'Generating comprehensive research report...', depth: maxDepth },
        { step: 'completed', message: `Research completed! Generated ${data.totalFindings || 0} findings from ${data.sources?.length || 0} sources.`, depth: maxDepth }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(prev => [...prev, step]);
        if (progressRef.current) {
          progressRef.current.scrollTop = progressRef.current.scrollHeight;
        }
      }

      setResult(data);
      setActiveTab('report');
      toast({
        title: 'Research Complete',
        description: `Generated comprehensive report on "${topic}" with ${data.sources?.length || 0} sources.`,
      });
      
      await saveResearchToHistory(data);

    } catch (error) {
      console.error('Research error:', error);
      const errorProgress: ResearchProgress = {
        step: 'error',
        message: `Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        depth: 0
      };
      setProgress(prev => [...prev, errorProgress]);
      toast({
        title: 'Research Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsResearching(false);
    }
  };

  const handleCopyReport = async () => {
    if (!result?.report) return;
    try {
      await navigator.clipboard.writeText(result.report);
      toast({
        title: 'Copied to Clipboard',
        description: 'Research report has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadReport = () => {
    if (!result?.report) return;
    const blob = new Blob([result.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Download Started',
      description: 'Research report is being downloaded as a Markdown file.',
    });
  };

  const getStepIcon = (step: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      starting: <Zap className="h-4 w-4 text-blue-500" />,
      initialization: <Zap className="h-4 w-4 text-blue-500" />,
      searching: <Search className="h-4 w-4 text-purple-500" />,
      extracting: <Globe className="h-4 w-4 text-green-500" />,
      analyzing: <Brain className="h-4 w-4 text-orange-500" />,
      synthesizing: <FileText className="h-4 w-4 text-indigo-500" />,
      completed: <CheckCircle className="h-4 w-4 text-green-600" />,
      error: <AlertCircle className="h-4 w-4 text-red-500" />,
    };
    return iconMap[step] || <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Deep Research</h1>
          <p className="text-muted-foreground">
            AI-powered autonomous research agent that searches, analyzes, and synthesizes information
          </p>
        </div>
        {user && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              fetchResearchHistory();
              setShowHistoryDialog(true);
            }}
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Target className="h-5 w-5" />
              Research Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Research Topic</label>
                <Input
                  placeholder="e.g., Artificial Intelligence in Healthcare..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isResearching}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Research Depth</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(parseInt(e.target.value) || 3)}
                    disabled={isResearching}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">cycles (1-5)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher depth = more comprehensive but longer processing time
                </p>
              </div>
            </div>
            <Button
              onClick={handleStartResearch}
              disabled={isResearching || !topic.trim() || !isFullyAuthenticated}
              className="w-full gap-2"
              size="lg"
            >
              {isResearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AnimatedLoadingText message="Researching..." />
                </>
              ) : !isFullyAuthenticated ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initializing Session...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Start Deep Research
                </>
              )}
            </Button>
          </div>

          {result && (
            <div className="space-y-3 pt-4 border-t border-border/30">
              <h4 className="font-medium text-sm text-muted-foreground">Research Summary</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{result.sources.length}</div>
                  <div className="text-xs text-muted-foreground">Sources</div>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{result.totalFindings}</div>
                  <div className="text-xs text-muted-foreground">Findings</div>
                </div>
              </div>
              {selectedHistoryItem && (
                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/20">
                  <Clock className="inline h-3 w-3 mr-1" />
                  From history: {new Date(selectedHistoryItem.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="xl:col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="progress" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Progress
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-2" disabled={!result}>
                    <FileText className="h-4 w-4" /> Report
                  </TabsTrigger>
                  <TabsTrigger value="sources" className="flex items-center gap-2" disabled={!result}>
                    <Globe className="h-4 w-4" /> Sources
                  </TabsTrigger>
                </TabsList>
                
                {result && activeTab === 'report' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-2">
                      <Copy className="h-4 w-4" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="progress">
                <ScrollArea className="h-[500px] w-full" ref={progressRef}>
                  {progress.length > 0 ? (
                    <div className="space-y-4">
                      {progress.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-accent/30"
                        >
                          <div className="flex-shrink-0 mt-0.5">{getStepIcon(step.step)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{step.message}</span>
                              {step.depth > 0 && <Badge variant="secondary" className="text-xs">Depth {step.depth}</Badge>}
                            </div>
                            {step.currentTopic && <p className="text-xs text-muted-foreground">Topic: {step.currentTopic}</p>}
                            {typeof step.sourcesFound !== 'undefined' && <p className="text-xs text-muted-foreground">Found {step.sourcesFound} sources</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Search className="h-12 w-12 mb-4 opacity-50" />
                      <p className="font-medium">Research progress will appear here</p>
                      <p className="text-sm">Start a research to see real-time updates</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="report">
                {result?.report && (
                  <div className="mb-6 p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-primary/10 before:animate-pulse">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Research Report: {topic}</h2>
                        <p className="text-sm text-muted-foreground">Depth: {maxDepth} cycles • {result.sources.length} sources • {result.totalFindings} findings</p>
                      </div>
                    </div>
                  </div>
                )}
                <ScrollArea className="h-[500px] w-full">
                  {result?.report ? (
                    <div className="prose prose-neutral dark:prose-invert max-w-none research-report">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.report}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="font-medium">Research report will appear here</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="sources">
                <ScrollArea className="h-[500px] w-full">
                  {result?.sources && result.sources.length > 0 ? (
                    <div className="space-y-4">
                      {result.sources.map((source, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{source.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground truncate">{source.url}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => window.open(source.url, '_blank')}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Globe className="h-12 w-12 mb-4 opacity-50" />
                      <p className="font-medium">Research sources will appear here</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Deep Research History</DialogTitle>
            <DialogDescription>Your previously completed research reports</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : researchHistory.length > 0 ? (
              <div className="space-y-4">
                {researchHistory.map((item) => (
                  <Card key={item.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 cursor-pointer" onClick={() => loadHistoryItem(item)}>
                        <h4 className="font-medium mb-2">{item.topic}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{item.sources.length} sources</span>
                          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{item.total_findings} findings</span>
                          <span className="flex items-center gap-1"><Target className="h-3 w-3" />Depth {item.max_depth}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => loadHistoryItem(item)}>Load</Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteHistoryItem(item.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No research history found</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Card className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/10">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-2">Deep Research Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use specific, well-defined topics for better research quality.</li>
              <li>Higher research depth provides more comprehensive analysis but takes longer.</li>
              <li>The agent autonomously searches, extracts, analyzes, and synthesizes information.</li>
              <li>Your research history is automatically saved and can be accessed anytime.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}