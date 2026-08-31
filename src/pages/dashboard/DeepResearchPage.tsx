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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import {
  Search, Loader2, Copy, Download, ExternalLink, AlertCircle, CheckCircle, Clock,
  Globe, FileText, Sparkles, Brain, Target, Zap, History, Trash2, Headphones,
  Play, Pause, Volume2, VolumeX, X
} from 'lucide-react';

// Interfaces remain the same
interface ResearchSource { url: string; title: string; description: string; }
interface ResearchResult { report: string; sources: ResearchSource[]; summaries: string[]; totalFindings: number; }
interface ResearchProgress { step: string; message: string; depth: number; currentTopic?: string; sourcesFound?: number; }
interface DeepResearchHistory { id: string; topic: string; report: string; sources: ResearchSource[]; summaries: string[]; total_findings: number; max_depth: number; created_at: string; }

const mockProgressSteps: Omit<ResearchProgress, 'depth'>[] = [
    { step: 'starting', message: 'Initializing deep research agent...' },
    { step: 'searching', message: 'Scanning for initial data sources on the web...' },
    { step: 'analyzing', message: 'Analyzing preliminary findings and identifying key vectors...' },
    { step: 'searching', message: 'Executing deep search based on key vectors...' },
    { step: 'extracting', message: 'Extracting and parsing content from high-relevance sources...' },
    { step: 'analyzing', message: 'Identifying informational patterns and knowledge gaps...' },
    { step: 'searching', message: 'Conducting targeted searches to bridge identified gaps...' },
    { step: 'synthesizing', message: 'Synthesizing diverse findings into a coherent narrative...' },
    { step: 'analyzing', message: 'Performing cross-validation of sources and facts...' },
    { step: 'synthesizing', message: 'Structuring and compiling the final research report...' },
];

export default function DeepResearchPage() {
  const { toast } = useToast();
  const { user, session } = useAuth();

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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressIndexRef = useRef(0);
  const intervalRef = useRef<number | undefined>();
  
  const isFullyAuthenticated = !!session;

  useEffect(() => {
    const scrollToBottom = () => {
      if (progressRef.current) {
        progressRef.current.scrollTop = progressRef.current.scrollHeight;
      }
    };
    
    if (isResearching) {
      progressIndexRef.current = 0;
      setProgress([]);

      const addNextStep = () => {
        if (progressIndexRef.current < mockProgressSteps.length) {
          const step = mockProgressSteps[progressIndexRef.current];
          const depth = Math.min(maxDepth, Math.floor(progressIndexRef.current / (mockProgressSteps.length / maxDepth)) + 1);
          setProgress(prev => [...prev, { ...step, depth }]);
          progressIndexRef.current++;
          scrollToBottom();
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        }
      };

      addNextStep(); // Show first step immediately

      // Interval duration between 4 to 7 seconds.
      const randomInterval = () => Math.random() * 3000 + 4000;
      intervalRef.current = window.setInterval(addNextStep, randomInterval());

    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isResearching, maxDepth]);

  const saveResearchToHistory = async (researchData: ResearchResult) => {
    if (!isFullyAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('deep_research_history')
        .insert([{
          user_id: user.id,
          topic: topic.trim(),
          report: researchData.report,
          sources: researchData.sources || [],
          summaries: researchData.summaries || [],
          total_findings: researchData.totalFindings || 0,
          max_depth: maxDepth
        }]);

      if (error) throw error;
      
      console.log('✅ Deep research saved successfully!');
      toast({ title: 'Research Saved', description: 'Your research has been saved.' });

    } catch (error) {
      console.error('An unexpected error occurred during save:', error);
      toast({ title: 'Save Failed', description: error instanceof Error ? error.message : 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const fetchResearchHistory = async () => {
    if (!isFullyAuthenticated || !user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('deep_research_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({ title: 'Error', description: 'Failed to load research history.', variant: 'destructive' });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadHistoryItem = (item: DeepResearchHistory) => {
    setSelectedHistoryItem(item);
    setResult({ report: item.report, sources: item.sources, summaries: item.summaries, totalFindings: item.total_findings });
    setTopic(item.topic);
    setMaxDepth(item.max_depth);
    setShowHistoryDialog(false);
    setActiveTab('report');
  };

  const deleteHistoryItem = async (id: string) => {
    if (!isFullyAuthenticated) return;
    try {
      const { error } = await supabase.from('deep_research_history').delete().eq('id', id);
      if (error) throw error;
      setResearchHistory(prev => prev.filter(item => item.id !== id));
      toast({ title: 'Deleted', description: 'Research history item deleted.' });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({ title: 'Error', description: 'Failed to delete history item.', variant: 'destructive' });
    }
  };

  const handleStartResearch = async () => {
    if (!isFullyAuthenticated) {
        toast({ title: 'Authentication Required', description: 'Please wait for the session to initialize.', variant: 'destructive' });
        return;
    }
    if (!topic.trim()) {
      toast({ title: 'Topic Required', description: 'Please enter a topic to research.', variant: 'destructive' });
      return;
    }

    setResult(null);
    setSelectedHistoryItem(null);
    setActiveTab('progress');
    setIsResearching(true);

    try {
      const { data, error } = await supabase.functions.invoke('deep-research-agent', {
        body: { topic: topic.trim(), maxDepth: Math.min(Math.max(1, maxDepth), 5) },
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }

      if (error) throw new Error(error.message || 'Failed to start research');
      if (!data) throw new Error('No data received from research agent');

      setProgress(prev => [...prev, { step: 'completed', message: `Research completed! Generated ${data.totalFindings || 0} findings from ${data.sources?.length || 0} sources.`, depth: maxDepth }]);
      if (progressRef.current) {
        progressRef.current.scrollTop = progressRef.current.scrollHeight;
      }

      setResult(data);
      setActiveTab('report');
      toast({ title: 'Research Complete', description: `Generated report on "${topic}".` });
      
      await saveResearchToHistory(data);

    } catch (error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      console.error('Research error:', error);
      setProgress(prev => [...prev, { step: 'error', message: `Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`, depth: 0 }]);
      toast({ title: 'Research Failed', description: error instanceof Error ? error.message : 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      if (audioUrl) {
        setAudioUrl(null);
      }
      setIsResearching(false);
    }
  };

  const handleCopyReport = async () => {
    if (!result?.report) return;
    try { await navigator.clipboard.writeText(result.report); toast({ title: 'Copied to Clipboard' }); } 
    catch (error) { toast({ title: 'Copy Failed', variant: 'destructive' }); }
  };

  const handleGenerateAudio = async () => {
    if (!result?.report) {
      toast({
        title: "No content",
        description: "No report available to convert to audio",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAudio(true);
    
    try {
      // Call the Supabase Edge Function
      const response = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: result.report,
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella voice
        },
      });

      if (response.error) throw new Error(response.error.message);
      
      // Convert response data to a blob and create URL
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(audioBlob);
      
      // If user is authenticated, store in Supabase
      if (user?.id) {
        try {
          // Create a file name using the topic
          const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const fileName = `${sanitizedTopic}-report.mp3`;
          
          // Upload to Supabase Storage
          const { data: storageData, error: storageError } = await supabase.storage
            .from('learning_audio')
            .upload(`${user.id}/${fileName}`, audioBlob, {
              contentType: 'audio/mpeg',
              upsert: true
            });
          
          if (storageError) {
            console.error('Error storing audio:', storageError);
            throw new Error(storageError.message);
          }
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('learning_audio')
            .getPublicUrl(`${user.id}/${fileName}`);
          
          // Store the public URL
          if (publicUrlData) {
            setAudioUrl(publicUrlData.publicUrl);
            
            // Revoke the temporary blob URL to free memory
            if (blobUrl) URL.revokeObjectURL(blobUrl);
          } else {
            // If we can't get the public URL, fallback to the blob URL
            setAudioUrl(blobUrl);
          }
        } catch (error) {
          console.error('Storage error:', error);
          // Fallback to using the blob URL directly if storage fails
          setAudioUrl(blobUrl);
          toast({
            title: "Storage Error",
            description: "Audio generated but couldn't be stored. It will be available for this session only.",
            variant: "destructive"
          });
        }
      } else {
        // If not authenticated, just use the blob URL
        setAudioUrl(blobUrl);
      }
      
      toast({
        title: "Audio Generated",
        description: "Your report has been converted to audio!",
      });
    } catch (error) {
      console.error('Error generating audio:', error);
      
      // Enhanced error handling for different types of errors
      let errorMessage = "An unexpected error occurred during audio generation.";
      if (error instanceof Error) {
        if (error.message.includes('ELEVENLABS_API_KEY')) {
          errorMessage = 'ElevenLabs API key is not configured in Supabase secrets.';
        } else if (error.message.includes('Authentication failed')) {
          errorMessage = 'ElevenLabs authentication failed. Check your API key and account credits.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'ElevenLabs rate limit exceeded. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Audio Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Audio player control functions
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Close audio player
  const handleCloseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
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
    toast({ title: 'Download Started' });
  };

  const getStepIcon = (step: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      starting: <Zap className="h-4 w-4 text-blue-500" />,
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
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Deep Research</h1>
          <p className="text-muted-foreground">AI-powered autonomous research agent</p>
        </div>
        {user && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => { fetchResearchHistory(); setShowHistoryDialog(true); }}>
            <History className="h-4 w-4" /> View History
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Target className="h-5 w-5" /> Research Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Research Topic</label>
                <Input placeholder="e.g., Artificial Intelligence in Healthcare..." value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isResearching} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Research Depth</label>
                <div className="flex items-center gap-2">
                  <Input type="number" min="1" max="5" value={maxDepth} onChange={(e) => setMaxDepth(parseInt(e.target.value) || 3)} disabled={isResearching} className="w-20" />
                  <span className="text-sm text-muted-foreground">cycles (1-5)</span>
                </div>
              </div>
            </div>
            <Button onClick={handleStartResearch} disabled={isResearching || !topic.trim() || !isFullyAuthenticated} className="w-full gap-2" size="lg">
              {isResearching ? (<><Loader2 className="h-4 w-4 animate-spin" /><AnimatedLoadingText message="Researching..." /></>) 
              : !isFullyAuthenticated ? (<><Loader2 className="h-4 w-4 animate-spin" />Initializing Session...</>) 
              : (<><Search className="h-4 w-4" />Start Deep Research</>)}
            </Button>
          </div>

          {result && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">Research Summary</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-accent rounded-lg"><div className="text-lg font-bold text-primary">{result.sources.length}</div><div className="text-xs text-muted-foreground">Sources</div></div>
                <div className="text-center p-3 bg-accent rounded-lg"><div className="text-lg font-bold text-primary">{result.totalFindings}</div><div className="text-xs text-muted-foreground">Findings</div></div>
              </div>
              {selectedHistoryItem && (<div className="text-xs text-muted-foreground text-center pt-2 border-t"><Clock className="inline h-3 w-3 mr-1" />From history: {new Date(selectedHistoryItem.created_at).toLocaleDateString()}</div>)}
            </div>
          )}
        </Card>

        <div className="xl:col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4 z-10">
                <TabsList>
                  <TabsTrigger value="progress" className="flex items-center gap-2"><Clock className="h-4 w-4" /> Progress</TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-2" disabled={!result}><FileText className="h-4 w-4" /> Report</TabsTrigger>
                  <TabsTrigger value="sources" className="flex items-center gap-2" disabled={!result}><Globe className="h-4 w-4" /> Sources</TabsTrigger>
                </TabsList>
                {result && activeTab === 'report' && (<div className="flex gap-2"><Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-2"><Copy className="h-4 w-4" /> Copy</Button><Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-2"><Download className="h-4 w-4" /> Download</Button></div>)}
              </div>
              <TabsContent value="progress">
                <ScrollArea className="h-[500px] w-full" ref={progressRef}>
                  {progress.length > 0 ? (<div className="space-y-4">{progress.map((step, index) => (<motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-3 p-3 rounded-lg bg-accent"><div className="flex-shrink-0 mt-0.5">{getStepIcon(step.step)}</div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="font-medium text-sm">{step.message}</span>{step.depth > 0 && <Badge variant="secondary" className="text-xs">Depth {step.depth}</Badge>}</div>{step.currentTopic && <p className="text-xs text-muted-foreground">Topic: {step.currentTopic}</p>}{typeof step.sourcesFound !== 'undefined' && <p className="text-xs text-muted-foreground">Found {step.sourcesFound} sources</p>}</div></motion.div>))}</div>) 
                  : (<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"><Search className="h-12 w-12 mb-4 opacity-50" /><p className="font-medium">Research progress will appear here</p></div>)}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="report">
                <div className="relative">
                  {/* Floating Audio Generation Button */}
                  {result?.report && (
                    <div className="fixed bottom-8 right-8 z-10">
                      <Button 
                        variant="default"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                        onClick={handleGenerateAudio}
                        disabled={isGeneratingAudio}
                      >
                        {isGeneratingAudio ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Headphones className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  )}
                  <ScrollArea className="h-[500px] w-full">
                    {result?.report ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.report}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <p className="font-medium">Research report will appear here</p>
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Audio Player */}
                  {audioUrl && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 mt-4 p-4 rounded-lg bg-card border border-primary/20 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">Audio Version</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={handleCloseAudio}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div 
                        className="w-full h-2 bg-primary/20 rounded-full mb-3 cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePlayPause}
                          className="h-10 w-10 rounded-full"
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleMuteToggle}
                          className="h-8 w-8 rounded-full"
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
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
                          className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
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
                  ) 
              : (<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"><Globe className="h-12 w-12 mb-4 opacity-50" /><p className="font-medium">Research sources will appear here</p></div>)}</ScrollArea></TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Deep Research History</DialogTitle><DialogDescription>Your previously completed research reports</DialogDescription></DialogHeader>
          <ScrollArea className="h-[500px] pr-4">{isLoadingHistory ? (<div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) 
          : researchHistory.length > 0 ? (<div className="space-y-4">{researchHistory.map((item) => (<Card key={item.id} className="p-4 hover:bg-accent transition-colors"><div className="flex items-start justify-between gap-4"><div className="flex-1 cursor-pointer" onClick={() => loadHistoryItem(item)}><h4 className="font-medium mb-2">{item.topic}</h4><div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2"><span className="flex items-center gap-1"><Globe className="h-3 w-3" />{item.sources.length} sources</span><span className="flex items-center gap-1"><FileText className="h-3 w-3" />{item.total_findings} findings</span><span className="flex items-center gap-1"><Target className="h-3 w-3" />Depth {item.max_depth}</span></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{new Date(item.created_at).toLocaleString()}</div></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => loadHistoryItem(item)}>Load</Button><Button variant="ghost" size="sm" onClick={() => deleteHistoryItem(item.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></div></div></Card>))}</div>) 
          : (<div className="text-center py-8 text-muted-foreground"><History className="mx-auto h-12 w-12 opacity-50 mb-2" /><p>No research history found</p></div>)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}