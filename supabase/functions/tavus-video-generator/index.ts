import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, X-Requested-With, Accept, Origin"
};

// Set up timeout constants
const VIDEO_GENERATION_TIMEOUT_MS = 300000; // 5 minutes
const STATUS_CHECK_TIMEOUT_MS = 60000;      // 1 minute

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { scriptContent, videoId } = await req.json();

    // Validate request
    if (!scriptContent) {
      return new Response(
        JSON.stringify({ error: "Script content is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Environment variables check
    console.log("Environment variables check:");
    const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
    const TAVUS_REPLICA_ID = Deno.env.get("TAVUS_REPLICA_ID");

    console.log(`- TAVUS_API_KEY: ${TAVUS_API_KEY ? "✓ Set" : "❌ Missing"}`);
    console.log(`- TAVUS_REPLICA_ID: ${TAVUS_REPLICA_ID ? "✓ Set" : "❌ Missing"}`);

    if (!TAVUS_API_KEY || !TAVUS_REPLICA_ID) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Prepare Supabase client for updating job status
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Update job status to processing
    if (videoId) {
      await updateJobStatus(supabaseClient, videoId, "processing", "Sending request to Tavus API", 10);
    }

    // Prepare request to Tavus API
    console.log(`Initiating Tavus video generation with script length: ${scriptContent.length}`);
    console.log("Preparing request to https://api.tavus.io/v2/videos");
    
    const requestBody = {
      script: scriptContent,
      replica_id: TAVUS_REPLICA_ID,
      webhook_url: null  // Optional: Add webhook URL for status updates
    };
    
    console.log("Request body prepared (script not shown for brevity)");
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VIDEO_GENERATION_TIMEOUT_MS);
    
    try {
      // Make the API call with timeout
      const response = await fetch("https://api.tavus.io/v2/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TAVUS_API_KEY
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Tavus API error: ${response.status} ${response.statusText}`);
        console.error(`Error body: ${errorBody}`);
        
        if (videoId) {
          await updateJobStatus(
            supabaseClient, 
            videoId, 
            "failed", 
            `Tavus API error: ${response.status} ${response.statusText}`, 
            0
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: `Tavus API error: ${response.status} ${response.statusText}`,
            details: errorBody
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      const data = await response.json();
      
      // Update job status with success
      if (videoId) {
        await updateJobStatus(
          supabaseClient, 
          videoId, 
          "processing", 
          "Video generation request successful, processing video", 
          20,
          data.video_id
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Video generation request successful",
          tavus_video_id: data.video_id,
          status_url: data.status_url
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
      
    } catch (error) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (error.name === "AbortError") {
        console.error("Network error when calling Tavus API: AbortError: The signal has been aborted");
        
        if (videoId) {
          await updateJobStatus(
            supabaseClient, 
            videoId, 
            "failed", 
            "Request timeout: Tavus API took too long to respond (>60 seconds). Please try again later.",
            0
          );
        }
        
        throw new Error("Request timeout: Tavus API took too long to respond (>60 seconds). Please try again later.");
      }
      
      throw error;
    }
  } catch (error) {
    console.error("Error stack:", error.stack || error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Helper function to update job status in database
async function updateJobStatus(
  supabaseClient: any,
  jobId: string,
  status: string,
  message?: string,
  progress?: number,
  tavus_video_id?: string
) {
  try {
    const updateData: any = { 
      status, 
      current_step: message,
      updated_at: new Date().toISOString()
    };
    
    if (progress !== undefined) {
      updateData.progress = progress;
    }
    
    if (tavus_video_id) {
      updateData.tavus_video_id = tavus_video_id;
    }
    
    const { error } = await supabaseClient
      .from('animation_jobs')
      .update(updateData)
      .eq('id', jobId);
      
    if (error) {
      console.error("Error updating job status:", error);
    }
  } catch (err) {
    console.error("Failed to update job status:", err);
  }
}