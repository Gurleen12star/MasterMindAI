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
    });

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
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      timeout: error.message.includes('timeout')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});