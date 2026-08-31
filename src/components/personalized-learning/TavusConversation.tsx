import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  BotMessageSquare,
  AlertCircle,
  ExternalLink,
  Info,
  X,
  Minimize2,
  Loader2,
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
  const [context, setContext] = useState(() => localStorage.getItem("convoAiContext") || '');
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showVideo]);

  // Check for imported text from StudyPlatform
  useEffect(() => {
    const importedText = localStorage.getItem("convoAiContext");
    if (importedText) {
      setContext(importedText);
      localStorage.removeItem("convoAiContext");
      toast({
        title: "Text Imported",
        description: "Content from personalized learning has been imported",
      });
    }
  }, [toast]);

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

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

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
      setError(err.message);
      toast({
        title: 'Conversation Creation Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openConversation = () => {
    if (conversationUrl) setShowVideo(true);
  };

  const closeVideo = () => setShowVideo(false);
  const resetConversation = () => {
    setConversationUrl(null);
    setShowVideo(false);
    setError(null);
  };

  if (showVideo && conversationUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#1E1E1E] rounded-3xl w-full max-w-7xl h-full max-h-[95vh] flex flex-col shadow-2xl border border-border/20">
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6B5FED] rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Video Conversation</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={closeVideo} className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-2">
            <iframe
              src={conversationUrl}
              className="w-full h-full border-0 rounded-2xl"
              allow="camera; microphone; fullscreen; display-capture"
              title="Tavus AI Conversation"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full bg-[#1E1E1E] border-0 shadow-none">
      {/* Unified Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#6B5FED] rounded-lg flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-base font-medium text-white">Video conversations powered by Tavus</h2>
        </div>
        
        {conversationUrl ? (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetConversation}
              className="h-9 px-4 rounded-lg bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <BotMessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button 
              onClick={openConversation} 
              className="h-9 px-4 rounded-lg bg-white text-black hover:bg-gray-200"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Video Call
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleStartConversation} 
            disabled={isLoading || !context.trim() || context.length < 50}
            className="h-9 px-4 rounded-lg bg-white text-black hover:bg-gray-200 disabled:bg-gray-500 disabled:text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Create Conversation
              </>
            )}
          </Button>
        )}
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Choose AI Persona</label>
          <Select
            value={`${selectedPersonaId}|${selectedReplicaId}`}
            onValueChange={(value) => {
              const [pId, rId] = value.split('|');
              setSelectedPersonaId(pId);
              setSelectedReplicaId(rId);
            }}
            disabled={isLoading || !!conversationUrl}
          >
            <SelectTrigger className="w-full h-11 rounded-lg border-0 bg-[#2A2B32] text-white focus:ring-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-0 bg-[#2A2B32] text-white">
              {personas.map((p) => (
                <SelectItem key={p.persona_id} value={`${p.persona_id}|${p.replica_id}`} className="focus:bg-white/10 focus:text-white">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">💡 Select an AI persona to interact with. Each persona has a unique style and role.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">Context for your AI conversation partner</label>
            <span className="text-xs text-muted-foreground font-mono">{context.length} / 10000</span>
          </div>
          <Textarea
            placeholder="Paste your context here... For example, an article about machine learning, a research paper, or notes from a lecture."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={10}
            disabled={isLoading || !!conversationUrl}
            className="resize-none min-h-[240px] font-mono text-sm rounded-lg border-0 bg-[#2A2B32] text-white focus:ring-primary/50"
            maxLength={10000}
          />
           <p className="text-sm text-muted-foreground">🤖 The AI will have knowledge of this content and be prepared to discuss it with you.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-lg bg-red-900/50 border-0 text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-300 font-semibold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TavusConversation;