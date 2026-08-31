import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import {
  Film,
  Sparkles,
  Send,
  Loader2,
  Play,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Zap,
  Eye
} from 'lucide-react';

interface AnimationJob {
  id: string;
  user_id: string;
  query: string;
  subject: string;
  difficulty_level: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_step?: string;
  video_url?: string;
  audio_url?: string;
  script?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export default function AnimationStudioPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subject, setSubject] = useState('general');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<AnimationJob | null>(null);
  const [history, setHistory] = useState<AnimationJob[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<AnimationJob | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchAnimationHistory();
    }
  }, [user?.id]);

  const fetchAnimationHistory = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('animation_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching animation history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load animation history',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateAnimation = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic for your animation',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to generate animations',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setCurrentJob(null);
    setSelectedVideo(null);

    try {
      const { data, error } = await supabase
        .from('animation_jobs')
        .insert([{
          user_id: user.id,
          query: topic.trim(),
          subject: subject,
          difficulty_level: difficultyLevel,
          status: 'pending',
          progress: 0,
          current_step: 'Initializing animation request...'
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrentJob(data);
      toast({
        title: 'Animation Request Submitted',
        description: 'Your animation is being processed. This may take 20+ minutes.',
      });

      // Refresh history
      fetchAnimationHistory();

      // Clear form
      setTopic('');
      setInstructions('');
    } catch (error) {
      console.error('Error creating animation job:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit animation request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadHistoryVideo = (job: AnimationJob) => {
    setSelectedVideo(job);
    setCurrentJob(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Warning Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 border-2 border-orange-200 rounded-xl p-4 group">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
          <h3 className="font-semibold text-orange-800">Important Processing Information</h3>
        </div>
        <div className="relative h-8 overflow-hidden bg-orange-50/50 rounded-md">
          <div className="scrolling-text absolute whitespace-nowrap text-sm text-orange-700 font-medium leading-8 group-hover:animation-paused">
            ⚠️ Animation processing is hosted on GitHub and may take 20+ minutes to complete • Please don't close the browser or disconnect from the network • The system may occasionally experience errors during processing • Check back periodically for updates • ⚠️
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Film className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Animation Studio</h1>
          <p className="text-muted-foreground">
            Create educational animations using AI-powered Manim
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* ChatGPT-style Input */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Create New Animation</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Animation Topic</label>
                  <Input
                    placeholder="e.g., Pythagorean Theorem, Linear Algebra, Machine Learning..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Instructions (Optional)</label>
                  <Textarea
                    placeholder="Provide specific instructions for the animation style, focus areas, or teaching approach..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    disabled={isGenerating}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="general">General</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="computer_science">Computer Science</option>
                      <option value="biology">Biology</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                    <select
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleGenerateAnimation}
                disabled={isGenerating || !topic.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AnimatedLoadingText message="Submitting request..." />
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate Animation
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Video Display Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Animation Player</h3>
              </div>
              
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                {currentJob && (
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Processing Animation</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Topic: {currentJob.query}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Progress: {currentJob.progress}%</span>
                        </div>
                        {currentJob.current_step && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {currentJob.current_step}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {selectedVideo && selectedVideo.video_url ? (
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    src={selectedVideo.video_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : selectedVideo ? (
                  <div className="text-center space-y-2">
                    <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">Video Not Available</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVideo.status === 'failed' 
                        ? selectedVideo.error_message || 'Animation generation failed'
                        : 'Video is still processing or not yet available'
                      }
                    </p>
                  </div>
                ) : !currentJob && (
                  <div className="text-center space-y-2">
                    <Film className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">No Animation Selected</p>
                    <p className="text-sm text-muted-foreground">
                      Generate a new animation or select one from your history
                    </p>
                  </div>
                )}
              </div>
              
              {selectedVideo && (
                <div className="p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{selectedVideo.query}</h4>
                    <Badge className={getStatusColor(selectedVideo.status)}>
                      {selectedVideo.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Subject: {selectedVideo.subject}</p>
                    <p>Difficulty: {selectedVideo.difficulty_level}</p>
                    <p>Created: {new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* History Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Animation History</h3>
        </div>
        
        <ScrollArea className="h-[400px] w-full">
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-accent/50 ${
                    selectedVideo?.id === job.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                  onClick={() => loadHistoryVideo(job)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(job.status)}
                        <h4 className="font-medium truncate">{job.query}</h4>
                        <Badge variant="outline" className="text-xs">
                          {job.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Difficulty: {job.difficulty_level}</span>
                        <span>Progress: {job.progress}%</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      {job.current_step && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.current_step}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadHistoryVideo(job);
                        }}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Film className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No animations yet</p>
              <p className="text-sm">Create your first animation to get started</p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}