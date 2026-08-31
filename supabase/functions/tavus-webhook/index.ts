import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    
    console.log('Tavus webhook received:', {
      event_type: webhookData.event_type,
      message_type: webhookData.message_type,
      conversation_id: webhookData.conversation_id,
      timestamp: webhookData.timestamp
    });

    // Handle different types of Tavus webhook events
    switch (webhookData.event_type) {
      case 'system.replica_joined':
        console.log('Replica joined conversation:', webhookData.conversation_id);
        // Handle replica joining the conversation
        break;

      case 'system.shutdown':
        console.log('Conversation ended:', {
          conversation_id: webhookData.conversation_id,
          shutdown_reason: webhookData.properties?.shutdown_reason
        });
        // Handle conversation ending
        break;

      case 'application.transcription_ready':
        console.log('Transcription ready for conversation:', webhookData.conversation_id);
        // Handle transcription being ready
        if (webhookData.properties?.transcript) {
          console.log('Transcript length:', webhookData.properties.transcript.length);
        }
        break;

      default:
        console.log('Unknown webhook event type:', webhookData.event_type);
    }

    // Store webhook data if needed (you can implement database storage here)
    // Example: Store conversation events in a database table
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        event_type: webhookData.event_type
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process webhook',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 