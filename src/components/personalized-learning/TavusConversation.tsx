import React, { useState } from 'react';
import { useEffect } from 'react';
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
  Info
} from 'lucide-react';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';

interface Persona {
  id: string;
  name: string;
  persona_id: string;
  replica_id: string;
  description: string;
  category?: string;
}

const TavusConversation = () => {
  const { toast } = useToast();
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [selectedReplicaId, setSelectedReplicaId] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true);
  
  useEffect(() => {
    async function fetchPersonas() {
      try {
        setIsLoadingPersonas(true);
        const { data, error } = await supabase
          .from('tavus_personas')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        
        setPersonas(data || []);
        if (data && data.length > 0) {
          setSelectedPersonaId(data[0].persona_id);
          setSelectedReplicaId(data[0].replica_id);
        }
      } catch (err) {
        console.error('Error fetching personas:', err);
        toast({
          title: 'Failed to load personas',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingPersonas(false);
      }
    }
    
    fetchPersonas();
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
    <Card className="shadow-lg border-primary/10 bg-card/70 backdrop-blur-sm h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          Conversational AI Practice
        </CardTitle>
        <CardDescription className="text-sm">
          Paste any text-based content below (like an article, a report, or your own notes).
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-3 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Choose AI Persona</label>
          </div>
          <Select
            value={selectedPersonaId ? `${selectedPersonaId}|${selectedReplicaId}` : ""}
            onValueChange={(value) => {
              const [pId, rId] = value.split('|');
              setSelectedPersonaId(pId);
              setSelectedReplicaId(rId);
            }}
            disabled={isLoading || !!conversationUrl || isLoadingPersonas}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingPersonas ? "Loading personas..." : "Select a persona"} />
            </SelectTrigger>
            <SelectContent>
              {personas.map((p) => (
                <SelectItem key={p.id || p.persona_id} value={`${p.persona_id}|${p.replica_id}`}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Conversation Context</label>
            <span className="text-xs text-muted-foreground">
              {context.length} / 10000 characters
            </span>
          </div>
          <Textarea
            placeholder="Paste content to discuss (article, research paper, notes, etc.)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={7}
            disabled={isLoading || !!conversationUrl}
            className="resize-none min-h-[160px] text-sm"
            maxLength={10000}
          />
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
              Your AI conversation partner has been created successfully. Click the button below to start talking.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground flex items-center">
          <Video className="h-4 w-4 mr-2" />
          Powered by Tavus
        </div>
        
        {conversationUrl ? (
          <Button onClick={openConversation} size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Conversation
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button 
            size="sm"
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
      </CardFooter>
    </Card>
  );
};

export default TavusConversation;