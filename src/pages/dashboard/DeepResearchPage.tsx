import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { Search, BookOpen, ExternalLink, Play, Pause, Volume2, VolumeX, Copy, MousePointer, MessageSquare, Expand, RotateCcw } from 'lucide-react';

interface ResearchReport {
  id: string;
  topic: string;
  report: string;
  sources: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  summaries: string[];
  total_findings: number;
  max_depth: number;
  created_at: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  selectedText: string;
}

interface ExpandModalState {
  visible: boolean;
  originalText: string;
  expandedText: string;
  isLoading: boolean;
}

export default function DeepResearchPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setInitialConvoMessage } = useAppContext();
  
  const [searchTopic, setSearchTopic] = useState('');
  const [maxDepth, setMaxDepth] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [currentReport, setCurrentReport] = useState<ResearchReport | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: ''
  });
  const [expandModal, setExpandModal] = useState<ExpandModalState>({
    visible: false,
    originalText: '',
    expandedText: '',
    isLoading: false
  });
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isLoading: false,
    audioUrl: null as string | null,
    currentTime: 0,
    duration: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadResearchHistory();
    }
  }, [user?.id]);

  useEffect(() => {
    // Close context menu when clicking outside
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    // Handle text selection
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() && reportContentRef.current?.contains(selection.anchorNode)) {
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
          setContextMenu(prev => ({ ...prev, selectedText }));
        }
      }
    };

    document.addEventListener('selectionchange', handleTextSelection);
    return () => document.removeEventListener('selectionchange', handleTextSelection);
  }, []);

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        selectedText
      });
    }
  };

  const loadResearchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const { data, error } = await supabase
        .from('deep_research_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error('Error loading research history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load research history',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const generateResearch = async () => {
    if (!searchTopic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a research topic',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('deep-research-agent', {
        body: { 
          topic: searchTopic.trim(),
          maxDepth: Math.min(Math.max(1, maxDepth), 5)
        }
      });

      if (error) throw error;

      // Save to database
      const { data: savedReport, error: saveError } = await supabase
        .from('deep_research_history')
        .insert({
          user_id: user?.id,
          topic: searchTopic.trim(),
          report: data.report,
          sources: data.sources || [],
          summaries: data.summaries || [],
          total_findings: data.totalFindings || 0,
          max_depth: maxDepth
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setCurrentReport(savedReport);
      setReports(prev => [savedReport, ...prev]);
      
      toast({
        title: 'Research Complete',
        description: `Generated report with ${data.totalFindings || 0} findings from ${data.sources?.length || 0} sources`,
      });

    } catch (error: any) {
      console.error('Research generation error:', error);
      toast({
        title: 'Research Failed',
        description: error.message || 'Failed to generate research report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Context menu actions
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(contextMenu.selectedText);
      toast({
        title: 'Copied',
        description: 'Text copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive',
      });
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSelectAll = () => {
    if (reportContentRef.current) {
      const range = document.createRange();
      range.selectNodeContents(reportContentRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSendToConvoAI = () => {
    setInitialConvoMessage(contextMenu.selectedText);
    setContextMenu(prev => ({ ...prev, visible: false }));
    navigate('/dashboard/personalized-learning');
  };

  const handleExpandText = async () => {
    setExpandModal({
      visible: true,
      originalText: contextMenu.selectedText,
      expandedText: '',
      isLoading: true
    });
    setContextMenu(prev => ({ ...prev, visible: false }));

    try {
      const { data, error } = await supabase.functions.invoke('expand-content', {
        body: { textToExpand: contextMenu.selectedText }
      });

      if (error) throw error;

      setExpandModal(prev => ({
        ...prev,
        expandedText: data.expandedText,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Text expansion error:', error);
      toast({
        title: 'Expansion Failed',
        description: error.message || 'Failed to expand text',
        variant: 'destructive',
      });
      setExpandModal(prev => ({ ...prev, visible: false, isLoading: false }));
    }
  };

  // Audio functionality
  const generateAudio = async () => {
    if (!currentReport?.report) {
      toast({
        title: 'Error',
        description: 'No report content available for audio conversion',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAudioState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: currentReport.report,
          voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George voice
          modelId: 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128'
        }
      });

      if (error) throw error;

      // Convert the response to a blob and create URL
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioState(prev => ({
        ...prev,
        audioUrl,
        isLoading: false
      }));

      toast({
        title: 'Audio Generated',
        description: 'Your research report has been converted to audio',
      });

    } catch (error: any) {
      console.error('Audio generation error:', error);
      toast({
        title: 'Audio Generation Failed',
        description: error.message || 'Failed to convert report to audio',
        variant: 'destructive',
      });
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (audioState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        duration: audioRef.current?.duration || 0
      }));
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0
      }));
    }
  };

  const handleAudioPlay = () => {
    setAudioState(prev => ({ ...prev, isPlaying: true }));
  };

  const handleAudioPause = () => {
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deep Research Agent</h1>
        <p className="text-muted-foreground">
          Generate comprehensive research reports on any topic using AI-powered web research
        </p>
      </div>

      {/* Research Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Start New Research
          </CardTitle>
          <CardDescription>
            Enter a topic to generate an in-depth research report with multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="topic">Research Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., AI in healthcare, climate change solutions..."
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="depth">Research Depth</Label>
              <Input
                id="depth"
                type="number"
                min="1"
                max="5"
                value={maxDepth}
                onChange={(e) => setMaxDepth(parseInt(e.target.value) || 3)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button onClick={generateResearch} disabled={isLoading || !searchTopic.trim()}>
            {isLoading ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Generate Research
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Report Display */}
      {currentReport && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {currentReport.topic}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {currentReport.total_findings} findings
                  </Badge>
                  <Badge variant="secondary">
                    {currentReport.sources?.length || 0} sources
                  </Badge>
                  <Badge variant="secondary">
                    Depth: {currentReport.max_depth}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {audioState.audioUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAudioPlayback}
                      disabled={audioState.isLoading}
                    >
                      {audioState.isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAudio}
                  disabled={audioState.isLoading}
                >
                  {audioState.isLoading ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {audioState.isLoading ? 'Generating...' : 'Listen to Report'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              ref={reportContentRef}
              className="prose prose-sm max-w-none dark:prose-invert select-text"
              onContextMenu={handleContextMenu}
              style={{ userSelect: 'text' }}
            >
              <div dangerouslySetInnerHTML={{ __html: currentReport.report.replace(/\n/g, '<br/>') }} />
            </div>

            {currentReport.sources && currentReport.sources.length > 0 && (
              <div className="mt-6">
                <Separator className="mb-4" />
                <h3 className="text-lg font-semibold mb-3">Sources</h3>
                <div className="grid gap-3">
                  {currentReport.sources.map((source, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{source.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Element */}
            {audioState.audioUrl && (
              <audio
                ref={audioRef}
                src={audioState.audioUrl}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onTimeUpdate={handleAudioTimeUpdate}
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                className="hidden"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Research History */}
      <Card>
        <CardHeader>
          <CardTitle>Research History</CardTitle>
          <CardDescription>Your previous research reports</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                No research reports yet. Generate your first report above!
              </AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card 
                    key={report.id} 
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      currentReport?.id === report.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentReport(report)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium">{report.topic}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{report.total_findings} findings</span>
                            <span>•</span>
                            <span>{report.sources?.length || 0} sources</span>
                            <span>•</span>
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-background border rounded-md shadow-md z-50 p-1"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            transform: 'translate(-50%, -100%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start h-8 px-2"
              onClick={handleCopyText}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start h-8 px-2"
              onClick={handleSelectAll}
            >
              <MousePointer className="h-3 w-3 mr-2" />
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start h-8 px-2"
              onClick={handleSendToConvoAI}
            >
              <MessageSquare className="h-3 w-3 mr-2" />
              Send to Convo AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start h-8 px-2"
              onClick={handleExpandText}
            >
              <Expand className="h-3 w-3 mr-2" />
              Expand
            </Button>
          </div>
        </div>
      )}

      {/* Expand Modal */}
      <Dialog open={expandModal.visible} onOpenChange={(open) => 
        setExpandModal(prev => ({ ...prev, visible: open }))
      }>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Expanded Content</DialogTitle>
            <DialogDescription>
              AI-generated detailed explanation of the selected text
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Original Text:</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  {expandModal.originalText}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Expanded Explanation:</h4>
                {expandModal.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ 
                      __html: expandModal.expandedText.replace(/\n/g, '<br/>') 
                    }} />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}