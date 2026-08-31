import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, X-Requested-With, Accept, Origin",
};

interface ChatHistoryType {
  role: 'user' | 'model';
  parts: { text: string }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, chatHistory, personality } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set in Supabase secrets.");
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // System instruction based on personality and context
    const getSystemInstruction = (personality: string): string => {
      const baseInstruction = `You are an AI assistant specialized in deep research analysis. You help users understand and explore research reports by answering questions, providing explanations, and offering insights. You have access to the context from previous conversations about research topics.`;
      
      switch (personality) {
        case "Formal":
          return `${baseInstruction} Your approach is formal and academic. Use precise, professional language and provide well-structured, scholarly responses.`;
        case "Informal":
          return `${baseInstruction} Your approach is friendly and conversational. Use casual language and explain things in an easy-to-understand way, like talking to a friend.`;
        case "Engraçado":
          return `${baseInstruction} Your approach is fun and engaging. Use humor and creativity to make research topics more interesting and memorable.`;
        case "Sério":
          return `${baseInstruction} Your approach is serious and direct. Be concise, focused, and provide clear, no-nonsense explanations.`;
        default:
          return `${baseInstruction} Adapt your tone and approach based on the context and user's needs. Be helpful, informative, and engaging.`;
      }
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: getSystemInstruction(personality || "Default"),
    });

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    // Start chat with history
    const chat = model.startChat({
      generationConfig,
      history: chatHistory || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    return new Response(JSON.stringify({ 
      response: responseText,
      success: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in deep-research-chat function:", error);
    
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes('API key')) {
        errorMessage = "Authentication failed. Please check your Gemini API key.";
      } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (errorMessage.includes('fetch')) {
        errorMessage = "Network error. Could not connect to Gemini API.";
      }
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});