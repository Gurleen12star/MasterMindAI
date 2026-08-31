import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

const TavusConversation = () => {
  const { toast } = useToast();
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);

  const handleStartConversation = async () => {
    if (!context.trim()) {
      setError('Please provide some context for the conversation.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('tavus-conversation', {
        body: { context },
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
              Your AI conversation partner has been created successfully. Click the button below to start talking.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center">
          <Video className="h-4 w-4 mr-2" />
          Video conversations powered by Tavus
        </div>
        
        {conversationUrl ? (
          <Button onClick={openConversation} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Conversation
            <ExternalLink className="h-4 w-4 ml-1" />
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
      </CardFooter>
    </Card>
  );
};

export default TavusConversation;