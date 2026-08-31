import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, X-Requested-With, Accept, Origin",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { context, persona_id, replica_id } = await req.json();
    if (!context) {
      return new Response(JSON.stringify({ error: 'Context is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
    
    if (!TAVUS_API_KEY) {
      throw new Error('Missing required Tavus API key');
    }
    
    if (!persona_id || !replica_id) {
      throw new Error('Missing required persona_id or replica_id');
    }

    console.log('Creating Tavus conversation...');
    
    // Create AbortController with timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout
    
    try {
      const response = await fetch('https://api.tavus.io/v2/conversations', {
        method: 'POST',
        headers: {
          'x-api-key': TAVUS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: replica_id,
          persona_id: persona_id,
          conversation_name: 'EchoVerse Custom Conversation',
          conversational_context: context,
          // Optional: set a longer duration, default is 4 minutes
          max_call_duration: 600 // 10 minutes
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = `Tavus API error: ${response.statusText}`;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage += `, ${JSON.stringify(parsedError)}`;
        } catch (e) {
          errorMessage += `, ${errorData}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Conversation created successfully');

      return new Response(JSON.stringify({ 
        conversation_url: data.conversation_url,
        conversation_id: data.conversation_id 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle specific types of network errors with user-friendly messages
      if (fetchError.name === 'AbortError') {
        throw new Error('Request to Tavus API timed out. Please try again later.');
      } else if (fetchError.message.includes('fetch failed') || fetchError.message.includes('error sending request')) {
        throw new Error('Unable to connect to Tavus API. Please check your internet connection and try again.');
      } else if (fetchError.message.includes('DNS') || fetchError.message.includes('resolve')) {
        throw new Error('DNS resolution failed for Tavus API. Please try again later.');
      } else if (fetchError.message.includes('network')) {
        throw new Error('Network error connecting to Tavus API. Please try again later.');
      } else {
        throw fetchError;
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      timeout: error.message.includes('timeout') || error.message.includes('timed out')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});