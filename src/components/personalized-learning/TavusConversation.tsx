import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  Loader2,
  BotMessageSquare,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Info
} from 'lucide-react';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';

const personas = [
  { 
    name: 'Academic Tutor', 
    persona_id: 'rfb51183fe',
    replica_id: 'rfb51183fe',
    description: 'Get help with academic subjects'
  },
  { 
    name: 'History Teacher', 
    persona_id: 'pc55154f229a', 
    replica_id: 'r6ae5b6efc9d',
    description: 'Discuss historical events and concepts'
  },
  { 
    name: 'AI Interviewer', 
    persona_id: 'pe13ed370726', 
    replica_id: 'r9d30b0e55ac',
    description: 'Practice job interviews and get feedback'
  },
  { 
    name: 'Tavus Researcher', 
    persona_id: 'p48fdf065d6b', 
    replica_id: 'rf4703150052',
    description: 'Explore research topics in depth'
  },
  { 
    name: 'Healthcare Intake Assistant', 
    persona_id: 'p5d11710002a', 
    replica_id: 'r4317e64d25a',
    description: 'Practice patient intake conversations'
  },
  { 
    name: 'Sales Coach', 
    persona_id: 'rc2146c13e81', 
    replica_id: 'rc2146c13e81',
    description: 'Learn sales techniques and practice pitches'
  },
  { 
    name: 'Corporate Trainer', 
    persona_id: 'p7fb0be3', 
    replica_id: 'ra54d1d861',
    description: 'Practice corporate training and presentations'
  }
];

const TavusConversation = () => {
  const { toast } = useToast();
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(personas[0].persona_id);
  const [selectedReplicaId, setSelectedReplicaId] = useState(personas[0].replica_id);

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
          replica_id: selectedReplicaId
        },
      });

      if (fnError) throw new Error(fnError.message);

      if (data?.conversation_url) {
        setConversationUrl(data.conversation_url);
        toast({
          title: 'Conversation Created',
          description: 'Your AI conversation partner is ready. Click the button to start talking!'
        });
      } else {
        throw new Error('Failed to get conversation URL.');
      }
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      
      let errorMessage = 'An unexpected error occurred.';
      if (err.message) {
        errorMessage = err.message;
        
        // Handle specific error cases
        if (err.message.includes('timeout')) {
          errorMessage = 'The Tavus API took too long to respond. Please try again later.';
        } else if (err.message.includes('Tavus API error')) {
          errorMessage = 'There was an error communicating with the Tavus API. Please try again.';
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
      window.open(conversationUrl, '_blank');
    }
  };

  return (
    <Card className="shadow-xl border-primary/10 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          Conversational AI Practice
        </CardTitle>
        <CardDescription className="text-base">
          Paste any text-based content below (like an article, a report, or your own notes).
          We'll create a live AI conversation partner for you to discuss it with.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Choose AI Persona</label>
            <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
              {conversationUrl ? 'Conversation Active' : 'Select to Begin'}
            </span>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-30"></div>
            <Select
              value={`${selectedPersonaId}|${selectedReplicaId}`}
              onValueChange={(value) => {
                const [pId, rId] = value.split('|');
                setSelectedPersonaId(pId);
                setSelectedReplicaId(rId);
              }}
              disabled={isLoading || !!conversationUrl}
            >
              <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 h-11 transition-all duration-200">
                <SelectValue placeholder="Select a persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((p) => (
                  <SelectItem key={p.persona_id} value={`${p.persona_id}|${p.replica_id}`} className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            Each persona specializes in different conversational styles and subject matters.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Context for your conversation</label>
            <span className="text-xs text-muted-foreground">
              {context.length} / 10000 characters
            </span>
          </div>
          <Textarea
            placeholder="Paste your content here... For example, an article about machine learning, a research paper, or notes from a lecture. The AI will have knowledge of this content and be prepared to discuss it with you."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={10}
            disabled={isLoading || !!conversationUrl}
            className="resize-none min-h-[220px] font-mono text-sm border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 backdrop-blur-sm rounded-lg shadow-inner"
            maxLength={10000}
          />
          <p className="text-xs text-muted-foreground px-1">
            Your AI conversation partner will analyze this content and be ready to discuss it in detail.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-1">{error}</AlertDescription>
          </Alert>
        )}

        {conversationUrl && (
          <Alert className="bg-primary/10 text-foreground border-primary/30 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg opacity-30"></div>
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-bold">Conversation Ready!</AlertTitle>
            <AlertDescription className="mt-2">
              Your AI conversation partner has been created successfully and is waiting to talk with you. Click the button below to begin your video conversation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center pt-4 border-t border-border/20">
        <div className="text-sm text-muted-foreground flex items-center order-2 sm:order-1">
          <Video className="h-4 w-4 mr-2 text-primary/70" />
          Video conversations powered by Tavus
        </div>
        
        {conversationUrl ? (
          <Button 
            onClick={openConversation} 
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 order-1 sm:order-2 w-full sm:w-auto"
            size="lg"
          >
            <MessageSquare className="h-5 w-5" />
            Start Video Conversation
            <ExternalLink className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleStartConversation} 
            disabled={isLoading || !context.trim() || context.length < 50}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 order-1 sm:order-2 w-full sm:w-auto"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <AnimatedLoadingText message="Creating conversation..." />
              </>
            ) : (
              <>
                <BotMessageSquare className="h-5 w-5" />
                Generate AI Conversation
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TavusConversation;