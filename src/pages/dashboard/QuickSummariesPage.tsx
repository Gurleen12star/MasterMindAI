import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSummary } from '@/lib/gemini';
import { generateAudio, AVAILABLE_VOICES } from '@/lib/elevenlabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { useAuth } from '@/components/auth/SupabaseAuthProvider'; // Import Auth hook
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wand2, 
  Upload, 
  FileText, 
  Loader2, 
  Copy, 
  Download, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Volume2,
  Play,
  Pause,
  VolumeX,
  RotateCcw
} from 'lucide-react';

export default function QuickSummariesPage() {
  const { toast } = useToast();
  const { user } = useAuth(); // Get authenticated user for Supabase Storage
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(AVAILABLE_VOICES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // New state for PDF handling
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdfFileSize, setPdfFileSize] = useState<string>('');
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported File Type',
        description: 'Please upload a PDF or TXT file.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (file.type === 'text/plain') {
        // Handle text file upload
        const text = await file.text();
        setContent(text);
        setPdfFileUrl(null); // Clear PDF state
        setUploadedFileName(null);
        setPdfFileSize('');
        setActiveTab('text');
        toast({
          title: 'File Uploaded',
          description: 'Text file content loaded successfully.',
        });
      } else if (file.type === 'application/pdf') {
        // Handle PDF file upload to Supabase Storage
        if (!user?.id) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to upload PDF files.',
            variant: 'destructive',
          });
          return;
        }
        
        // Format file size
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setPdfFileSize(`${fileSizeInMB} MB`);
        
        try {
          setIsUploading(true);
          setPdfUploadProgress(0);
          setContent(''); // Clear text content when uploading PDF
          
          // Create a unique file path in the bucket
          const timestamp = new Date().getTime();
          const filePath = `${user.id}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          // Upload PDF to Supabase Storage
          const { data, error } = await supabase.storage
            .from('uploaded_documents') // Make sure this bucket exists!
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
            
          if (error) throw error;
          
          // Get public URL for the uploaded file
          const { data: urlData } = supabase.storage
            .from('uploaded_documents')
            .getPublicUrl(filePath);
            
          if (urlData?.publicUrl) {
            setPdfFileUrl(urlData.publicUrl);
            setUploadedFileName(file.name);
            setActiveTab('upload');
            setPdfUploadProgress(100);
            
            toast({
              title: 'PDF Uploaded Successfully',
              description: 'Your PDF is ready to be summarized.',
            });
          } else {
            throw new Error('Failed to get public URL for the uploaded PDF.');
          }
        } catch (uploadError) {
          console.error('PDF upload error:', uploadError);
          toast({
            title: 'PDF Upload Failed',
            description: uploadError instanceof Error ? uploadError.message : 'Failed to upload PDF file.',
            variant: 'destructive',
          });
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'File Read Error',
        description: 'Failed to read the file. Please try again.',
        variant: 'destructive',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateSummary = async () => {
    if (!content.trim() && !pdfFileUrl) {
      toast({
        title: 'Content Required',
        description: 'Please enter or upload content to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    // Clear audio when generating new summary
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    try {
      let generatedSummary: string;
      
      if (pdfFileUrl) {
        // PDF summarization using the Edge Function
        toast({
          title: 'Processing PDF',
          description: 'This may take longer for large documents.',
        });
        
        const { data, error } = await supabase.functions.invoke('gemini-pdf-summarizer', {
          body: { 
            pdfUrl: pdfFileUrl, 
            prompt: instructions || "Please summarize this document concisely while capturing the key points."
          },
        });
        
        if (error) throw new Error(`Edge function error: ${error.message}`);
        if (!data || !data.summarizedText) throw new Error('No summary received from PDF processor.');
        
        generatedSummary = data.summarizedText;
      } else {
        // Text summarization using the local Gemini function
        generatedSummary = await generateSummary(content, instructions);
      }
      
      setSummary(generatedSummary);
      toast({
        title: 'Summary Generated',
        description: 'Your content has been successfully summarized!',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error && error.message.includes('overloaded')
        ? 'The AI model is currently overloaded. Please wait a moment and try again.'
        : 'Failed to generate summary. Please try again.';
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!summary) {
      toast({
        title: 'Summary Required',
        description: 'Please generate a summary first before converting to audio.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingAudio(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    try {
      const audioUrl = await generateAudio({
        text: summary,
        voiceId: selectedVoice,
      });
      
      // Clean up previous audio URL
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      setAudioUrl(audioUrl);
      toast({
        title: 'Audio Generated',
        description: 'Your summary has been converted to audio!',
      });
    } catch (error) {
      console.error('Error generating audio:', error);
      
      // Check if it's an API key related error
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        toast({
          title: 'ElevenLabs Authentication Error',
          description: 'Please check your API key in the environment settings. Your account may need credits or the key might be invalid.',
          variant: 'destructive',
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({
          title: 'Audio Generation Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleVoiceChange = async (newVoiceId: string) => {
    setSelectedVoice(newVoiceId);
    
    // If we have a summary and audio was previously generated, regenerate with new voice
    if (summary && audioUrl) {
      setIsGeneratingAudio(true);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      try {
        const newAudioUrl = await generateAudio({
          text: summary,
          voiceId: newVoiceId,
        });
        
        // Clean up previous audio URL
        if (audioRef.current?.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        
        setAudioUrl(newAudioUrl);
        toast({
          title: 'Voice Changed',
          description: 'Audio regenerated with new voice!',
        });
      } catch (error) {
        console.error('Error regenerating audio:', error);
        
        // Check if it's an API key related error
        if (error instanceof Error && error.message.includes('Authentication failed')) {
          toast({
            title: 'ElevenLabs Authentication Error',
            description: 'Please check your API key in the environment settings. Your account may need credits or the key might be invalid.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Voice Change Failed',
            description: 'Failed to regenerate audio with new voice.',
            variant: 'destructive',
          });
        }
      } finally {
        setIsGeneratingAudio(false);
      }
    }
  };

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

  const handleDownloadAudio = () => {
    if (!audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'summary-audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: 'Download Started',
      description: 'Audio file is being downloaded.',
    });
  };

  const handleCopySummary = async () => {
    if (!summary) return;
    
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: 'Copied to Clipboard',
        description: 'Summary has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) return;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Summary is being downloaded as a text file.',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Wand2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quick Summaries</h1>
          <p className="text-muted-foreground">
            Upload documents or paste content to get AI-powered summaries with audio playback
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 space-y-6 rounded-2xl">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Input
            </h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="upload">File Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Paste your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <div className="text-sm text-muted-foreground">
                  {content.length} characters
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Upload a file</p>
                  <p className="text-muted-foreground mb-4">
                    Supports TXT and PDF files (up to 10MB) 
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-primary mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading PDF...
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${pdfUploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {uploadedFileName && !isUploading && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        PDF uploaded successfully
                      </div>
                      {pdfFileSize && <span className="text-muted-foreground">{pdfFileSize}</span>}
                    </div>
                    <p className="font-medium truncate">{uploadedFileName}</p>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setPdfFileUrl(null);
                        setUploadedFileName(null);
                        setPdfFileSize('');
                      }}
                      className="mt-2 text-destructive hover:bg-destructive/10"
                    >
                      <span className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        Clear PDF
                      </span>
                    </Button>
                  </div>
                )}
                
                {content && !uploadedFileName && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Content loaded successfully
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {content.length} characters loaded
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Instructions (Optional)
            </h3>
            <Textarea
              placeholder="Add specific instructions for the summary (e.g., 'Focus on key findings', 'Make it suitable for executives', 'Include action items')..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating || (!content.trim() && !pdfFileUrl)}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AnimatedLoadingText message="Analyzing content..." />
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </Card>

        {/* Output Section */}
        <Card className="p-6 rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Summary
              </h3>
              {summary && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSummary}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="h-[400px] w-full rounded-lg border bg-background/50 p-4">
              {summary ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  {isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div>
                        <AnimatedLoadingText message="Processing your content..." className="font-medium" />
                        <p className="text-sm mt-2">Extracting key insights...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <Wand2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <div>
                        <p className="font-medium">Your summary will appear here</p>
                        <p className="text-sm">Add content and click "Generate Summary" to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Voice Selection and Audio Generation */}
            {summary && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Audio Conversion
                  </h4>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Voice</label>
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_VOICES.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{voice.name}</span>
                              <span className="text-xs text-muted-foreground">{voice.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-2 block opacity-0">Action</label>
                    <Button
                      onClick={handleGenerateAudio}
                      disabled={isGeneratingAudio}
                      className="gap-2"
                    >
                      {isGeneratingAudio ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <AnimatedLoadingText message="Converting..." />
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          To Audio
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Audio Player */}
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl border-2 border-primary/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Audio Summary
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-primary/20 rounded-full mb-4 cursor-pointer overflow-hidden"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-150"
                    <AnimatedLoadingText 
                      message={pdfFileUrl ? "Analyzing your PDF document..." : "Processing your content..."} 
                      className="font-medium" 
                    />
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                      className="h-12 w-12 rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleMuteToggle}
                      className="h-10 w-10 rounded-full border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAudio}
                      className="gap-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
                    >
                      <Download className="h-4 w-4" />
                      Download MP3
                    </Button>
                  </div>
                </div>
                
                {/* Hidden Audio Element */}
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
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/10 rounded-2xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-2">Tips for Better Summaries & Audio</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Provide clear, well-structured content for best results</li>
              <li>• Use specific instructions to tailor the summary to your needs</li>
              <li>• For academic papers, mention "include methodology and conclusions"</li>
              <li>• For business documents, try "focus on key decisions and action items"</li>
              <li>• When summarizing PDFs, the system can understand diagrams and tables</li>
              <li>• Choose different voices to match your preference for audio content</li>
              <li>• Audio generation uses ElevenLabs AI for high-quality voice synthesis</li>
              <li>• Changing voice will automatically regenerate audio with the new voice</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}