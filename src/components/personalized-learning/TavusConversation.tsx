import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  MessageSquare,
  Loader2,
  BotMessageSquare,
  AlertCircle,
  ExternalLink,
  Info,
  X,
  Minimize2
} from 'lucide-react';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';

const personas = [
  { name: 'Sales Coach', persona_id: 'pdced222244b', replica_id: 'rc2146c13e81' },
  { name: 'History Teacher', persona_id: 'pc55154f229a', replica_id: 'r6ae5b6efc9d' },
  { name: 'AI Interviewer', persona_id: 'pe13ed370726', replica_id: 'r9d30b0e55ac' },
  { name: 'Tavus Researcher', persona_id: 'p48fdf065d6b', replica_id: 'rf4703150052' },
  { name: 'Healthcare Intake Assistant', persona_id: 'p5d11710002a', replica_id: 'r4317e64d25a' },
  { name: 'College Tutor', persona_id: 'p88964a7', replica_id: 'rfb51183fe' },
  { name: 'Corporate Trainer', persona_id: 'p7fb0be3', replica_id: 'ra54d1d861' },
];

const TavusConversation = () => {
  const { toast } = useToast();
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(personas[0].persona_id);
  const [selectedReplicaId, setSelectedReplicaId] = useState(personas[0].replica_id);
  const [showVideo, setShowVideo] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideo) {
        closeVideo();
      }
    };

    if (showVideo) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showVideo]);

  const handleStartConversation = async () => {
    if (!context.trim()) {
      setError('Please provide some context for the conversation.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('tavus-conversation', {
        body: { 
          context,
          persona_id: selectedPersonaId,
          replica_id: selectedReplicaId,
          conversation_name: `EchoVerse Learning Session - ${new Date().toLocaleString()}`,
          custom_greeting: "Hello! I'm excited to discuss the content you've shared with me. What would you like to explore first?",
          callback_url: `https://pczxwjqcfzxojvflhdql.supabase.co/functions/v1/tavus-webhook`
        },
      });

      if (fnError) {
        console.error('Supabase function error:', fnError);
        throw new Error(fnError.message);
      }

      if (data?.error) {
        console.error('Tavus API error:', data.error);
        throw new Error(data.error);
      }

      if (data?.conversation_url) {
        setConversationUrl(data.conversation_url);
        toast({
          title: 'Conversation Created',
          description: 'Your AI conversation partner is ready. Click "Start Video Call" to begin!'
        });
      } else {
        throw new Error('Failed to get conversation URL from response.');
      }
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      
      let errorMessage = 'An unexpected error occurred.';
      if (err.message) {
        errorMessage = err.message;
        
        // Handle specific error cases
        if (err.message.includes('timeout')) {
          errorMessage = 'The Tavus API took too long to respond. Please try again in a moment.';
        } else if (err.message.includes('Tavus API error')) {
          errorMessage = 'There was an error with the Tavus API. Please check your API configuration and try again.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: 'Conversation Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openConversation = () => {
    if (conversationUrl) {
      setShowVideo(true);
    }
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  const resetConversation = () => {
    setConversationUrl(null);
    setShowVideo(false);
    setError(null);
  };

  // Render video iframe if showVideo is true
  if (showVideo && conversationUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-7xl h-full max-h-[95vh] flex flex-col shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
          {/* Modern Header with gradient background */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-t-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-px h-6 bg-gray-300 mx-3"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    AI Video Conversation
                  </h3>
                  <p className="text-xs text-gray-500">Live conversation session</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeVideo}
                className="h-10 px-4 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200/50 transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Minimize</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeVideo}
                className="h-10 w-10 rounded-xl bg-red-50/80 hover:bg-red-100 border border-red-200/50 transition-all duration-200 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Modern Video Container */}
          <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mx-4 my-2 rounded-2xl overflow-hidden shadow-inner">
            {/* Video loading overlay */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 flex items-center justify-center">
              <div className="text-white/60 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Video className="h-8 w-8 text-white/80" />
                </div>
                <p className="text-sm font-medium">Connecting to AI...</p>
              </div>
            </div>
            <iframe
              src={conversationUrl}
              className="w-full h-full border-0 rounded-2xl relative z-10"
              allow="camera; microphone; fullscreen; display-capture"
              title="Tavus AI Conversation"
            />
          </div>
          
          {/* Modern Footer with glass effect */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-b-3xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-xl border border-gray-200/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live Session</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                  <kbd className="px-2 py-1 text-xs bg-white/60 rounded-lg border border-gray-200/50 font-mono">Esc</kbd>
                  <span>to close</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(conversationUrl, '_blank')}
                  className="h-10 px-4 rounded-xl bg-white/60 hover:bg-white/80 border border-gray-200/50 transition-all duration-200 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">New Tab</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetConversation}
                  className="h-10 px-4 rounded-xl bg-white/60 hover:bg-white/80 border border-gray-200/50 transition-all duration-200 flex items-center gap-2"
                >
                  <BotMessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </Button>
                <Button 
                  onClick={closeVideo}
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-primary/10 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          Conversational AI Practice
        </CardTitle>
        <CardDescription>
          Paste any text-based content below (like an article, a report, or your own notes).
          We'll create a live AI conversation partner for you to discuss it with.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose AI Persona</label>
          <Select
            value={`${selectedPersonaId}|${selectedReplicaId}`}
            onValueChange={(value) => {
              const [pId, rId] = value.split('|');
              setSelectedPersonaId(pId);
              setSelectedReplicaId(rId);
            }}
            disabled={isLoading || !!conversationUrl}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map((p) => (
                <SelectItem key={p.persona_id} value={`${p.persona_id}|${p.replica_id}`}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select an AI persona to interact with. Each persona has a unique style and role.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Context for your AI conversation partner</label>
            <span className="text-xs text-muted-foreground">
              {context.length} / 10000 characters
            </span>
          </div>
          <Textarea
            placeholder="Paste your context here... For example, an article about machine learning, a research paper, or notes from a lecture."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={10}
            disabled={isLoading || !!conversationUrl}
            className="resize-none min-h-[200px] font-mono text-sm"
            maxLength={10000}
          />
          <p className="text-xs text-muted-foreground">
            The AI will have knowledge of this content and be prepared to discuss it with you.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {conversationUrl && (
          <Alert className="bg-primary/10 text-foreground border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle>Conversation Ready!</AlertTitle>
            <AlertDescription>
              Your AI conversation partner has been created successfully. Click "Start Video Call" to begin talking.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center">
          <Video className="h-4 w-4 mr-2" />
          Video conversations powered by Tavus
        </div>
        
        <div className="flex gap-2">
          {conversationUrl && (
            <Button variant="outline" onClick={resetConversation}>
              New Conversation
            </Button>
          )}
          
          {conversationUrl ? (
            <Button onClick={openConversation} className="gap-2">
              <Video className="h-4 w-4" />
              Start Video Call
            </Button>
          ) : (
            <Button 
              onClick={handleStartConversation} 
              disabled={isLoading || !context.trim() || context.length < 50}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AnimatedLoadingText message="Creating conversation..." />
                </>
              ) : (
                <>
                  <BotMessageSquare className="h-4 w-4" />
                  Create Conversation
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TavusConversation;