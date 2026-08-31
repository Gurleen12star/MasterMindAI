import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, X-Requested-With, Accept, Origin",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voiceId, modelId, outputFormat } = await req.json();

    if (!text || !voiceId) {
      return new Response(JSON.stringify({ error: "Text and voiceId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY environment variable is not set in Supabase secrets.");
    }

    console.log('Generating audio with ElevenLabs...');
    
    let apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    if (outputFormat) {
      apiUrl += `?output_format=${outputFormat}`;
    }
    
    // Call ElevenLabs API directly
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorData}`);
    }

    // Get audio as binary data
    const audioData = await response.arrayBuffer();
    
    // Validate that we received audio data
    if (!audioData || audioData.byteLength === 0) {
      throw new Error("No audio data received from ElevenLabs API");
    }

    let contentType = "audio/mpeg"; // Default for default output format from API
    if (outputFormat) {
      if (outputFormat.includes("mp3")) {
        contentType = "audio/mpeg";
      } else if (outputFormat.includes("pcm")) {
        contentType = "audio/wav";
      } else if (outputFormat.includes("ulaw")) { // mu-law
        contentType = "audio/basic";
      } else if (outputFormat.includes("opus")) {
        contentType = "audio/opus";
      }
    }

    console.log(`Audio generated successfully: ${audioData.byteLength} bytes`);

    // Return the audio binary data
    return new Response(audioData, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error in elevenlabs-tts function:", error);
    
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('API key')) {
        errorMessage = "Authentication failed. Please check your ElevenLabs API key.";
      } else if (errorMessage.includes('429')) {
        errorMessage = "Rate limit exceeded. Please try again later or upgrade your ElevenLabs plan.";
      } else if (errorMessage.includes('fetch')) {
        errorMessage = "Network error. Could not connect to ElevenLabs API.";
      }
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});