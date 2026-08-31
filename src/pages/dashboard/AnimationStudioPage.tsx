import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import { useVideoStatus } from '@/hooks/useVideoStatus';
import { generateVideo } from '@/lib/api';
import { VideoDocument, SceneDocument, listVideoFiles, getFileUrl, FINAL_VIDEOS_BUCKET_ID } from '@/lib/appwrite';
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
  Eye,
  Archive,
  Download,
  FileVideo
} from 'lucide-react';

interface VideoFile {
  $id: string;
  name: string;
  sizeOriginal: number;
  $createdAt: string;
}

export default function AnimationStudioPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subject, setSubject] = useState('general');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoDocument | null>(null);

  const { video, scenes, isLoading } = useVideoStatus(currentVideoId);

  useEffect(() => {
    loadVideoHistory();
  }, []);

  // Update current video when real-time data comes in
  useEffect(() => {
    if (video) {
      setSelectedVideo(video);
      setIsGenerating(false);
    }
  }, [video]);

  const loadVideoHistory = async () => {
    try {
      const files = await listVideoFiles();
      setVideoHistory(files);
    } catch (error) {
      console.error('Error loading video history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load video history',
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
    setCurrentVideoId(null);
    setSelectedVideo(null);

    try {
      const result = await generateVideo(topic.trim(), instructions, subject, difficultyLevel);
      
      if (result.success && result.videoId) {
        setCurrentVideoId(result.videoId);
        toast({
          title: 'Animation Request Submitted',
          description: 'Your animation is being processed. This may take 20+ minutes.',
        });

        // Refresh history
        loadVideoHistory();

        // Clear form
        setTopic('');
        setInstructions('');
      } else {
        throw new Error(result.error || 'Failed to start video generation');
      }
    } catch (error) {
      console.error('Error generating animation:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate animation. Please try again.',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  };

  const loadHistoryVideo = async (file: VideoFile) => {
    // For now, we'll create a mock VideoDocument from the file
    // In a real implementation, you'd fetch the video document from Appwrite
    const mockVideo: VideoDocument = {
      $id: file.$id,
      topic: file.name.replace('.mp4', ''),
      status: 'completed',
      progress: 100,
      scene_count: 1,
      combined_video_url: file.$id,
      created_at: file.$createdAt,
      updated_at: file.$createdAt
    };
    
    setSelectedVideo(mockVideo);
    setCurrentVideoId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rendering':
      case 'planning':
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
      case 'rendering':
      case 'planning':
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
                {(isGenerating || isLoading) && video && (
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
                          Topic: {video.topic}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Progress: {video.progress || 0}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {video.status}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {selectedVideo && selectedVideo.status === 'completed' && (selectedVideo.combined_video_url || (selectedVideo as any).video_url) ? (
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    src={(() => {
                      const urlField = (selectedVideo.combined_video_url || (selectedVideo as any).video_url) as string;
                      // If the field already looks like a full URL, use it directly. Otherwise build Appwrite file URL.
                      return urlField.startsWith('http')
                        ? urlField
                        : getFileUrl(FINAL_VIDEOS_BUCKET_ID, urlField);
                    })()}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : selectedVideo && selectedVideo.status === 'failed' ? (
                  <div className="text-center space-y-2">
                    <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">Animation Failed</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVideo.error_message || 'Animation generation failed'}
                    </p>
                  </div>
                ) : !selectedVideo && !isGenerating && !isLoading ? (
                  <div className="text-center space-y-2">
                    <Film className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">No Animation Selected</p>
                    <p className="text-sm text-muted-foreground">
                      Generate a new animation or select one from your history
                    </p>
                  </div>
                ) : null}
              </div>
              
              {selectedVideo && (
                <div className="p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{selectedVideo.topic}</h4>
                    <Badge className={getStatusColor(selectedVideo.status)}>
                      {selectedVideo.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Created: {new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                    {selectedVideo.progress && (
                      <p>Progress: {selectedVideo.progress}%</p>
                    )}
                  </div>
                </div>
              )}

              {/* Scene Information */}
              {scenes.length > 0 && (
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium mb-2">Scenes ({scenes.length})</h4>
                  <div className="grid gap-2">
                    {scenes.map((scene) => (
                      <div key={scene.$id} className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Scene {scene.scene_number}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(scene.status)}
                          <span className="text-xs px-2 py-1 rounded bg-muted">
                            {scene.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Artifacts Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Archive className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Rendered Artifacts</h3>
        </div>
        
        <ScrollArea className="h-[400px] w-full">
          {videoHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
              {videoHistory.map((file) => (
                <Card 
                  key={file.$id} 
                  className={`overflow-hidden transition-all duration-200 cursor-pointer hover:border-primary/80 ${
                    selectedVideo?.combined_video_url === file.$id ? 'border-primary ring-2 ring-primary/50' : 'border-border'
                  }`}
                  onClick={() => loadHistoryVideo(file)}
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <FileVideo className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="p-3 border-t">
                    <p className="font-medium truncate text-sm mb-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {(file.sizeOriginal / 1024 / 1024).toFixed(2)} MB &bull; {new Date(file.$createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={(e) => { e.stopPropagation(); loadHistoryVideo(file); }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <a 
                        href={getFileUrl(FINAL_VIDEOS_BUCKET_ID, file.$id)}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Archive className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No artifacts found</p>
              <p className="text-sm">Generate an animation to see its artifacts here</p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}