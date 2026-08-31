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
  VolumeX
} from 'lucide-react';

export default function QuickSummariesPage() {
  const { toast } = useToast();
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
  const audioRef = useRef<HTMLAudioElement>(null);

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
        const text = await file.text();
        setContent(text);
        setActiveTab('text');
        toast({
          title: 'File Uploaded',
          description: 'Text file content loaded successfully.',
        });
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll show a message that PDF parsing is not yet implemented
        toast({
          title: 'PDF Upload',
          description: 'PDF parsing will be implemented soon. Please copy and paste the text content for now.',
          variant: 'destructive',
        });
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
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter or upload content to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedSummary = await generateSummary(content, instructions);
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
            Upload documents or paste content to get AI-powered summaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 space-y-6">
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
                
                {content && (
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
            disabled={isGenerating || !content.trim()}
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
        <Card className="p-6">
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

            <ScrollArea className="h-[500px] w-full rounded-lg border bg-background/50 p-4">
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
          </div>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-2">Tips for Better Summaries</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Provide clear, well-structured content for best results</li>
              <li>• Use specific instructions to tailor the summary to your needs</li>
              <li>• For academic papers, mention "include methodology and conclusions"</li>
              <li>• For business documents, try "focus on key decisions and action items"</li>
              <li>• PDF support is coming soon - currently supports text files only</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}