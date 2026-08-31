/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

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

interface RequestBody {
  message: string;
  chatHistory?: ChatHistoryType[];
  personality?: string;
}

function getSystemInstruction(personality: string = 'Default'): string {
  const baseInstruction = `You are an AI assistant specialized in deep research discussions. You help users understand and explore research findings, reports, and academic content. You can answer questions, provide explanations, and engage in detailed discussions about research topics.

Your role is to:
- Analyze and explain research findings clearly
- Provide context and background information
- Answer follow-up questions about research content
- Help users understand complex concepts
- Suggest related topics for further exploration
- Maintain accuracy while being conversational

Always be helpful, accurate, and engaging in your responses.`;

  switch (personality) {
    case "Formal":
      return `${baseInstruction} Your approach is formal and polite. Please maintain a respectful tone and use precise and objective language. Your response should be well-structured and professional.`;
    case "Informal":
      return `${baseInstruction} Your approach is friendly and relaxed. Use a casual and conversational tone, as if you were talking to a friend. Your response should be engaging and easy to understand, maintaining an informal style.`;
    case "Engraçado":
      return `${baseInstruction} Your approach is fun and humorous. Use humor and creativity to make learning more enjoyable. Your response should be light and entertaining, always with a touch of humor.`;
    case "Sério":
      return `${baseInstruction} Your approach is serious and direct to the point. Maintain a serious and focused tone, avoiding distractions. Your response should be clear, concise and free of unnecessary elements.`;
    default:
      return `${baseInstruction} You are attentive, patient and have incredible teaching skills. You know how to be friendly and relaxed, fun and humorous, but also know how to be serious and direct to the point when necessary. Your response should reflect this versatility, adapting to the appropriate tone for each situation and audience.`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { message, chatHistory = [], personality = 'Default' }: RequestBody = await req.json();

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set in Supabase secrets.");
    }

    console.log('Starting deep research chat conversation...');
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: getSystemInstruction(personality)
    });

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    };

    // Convert chat history to Gemini format
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    // Start chat with history
    const chat = model.startChat({
      generationConfig,
      history: formattedHistory,
    });

    // Send the new message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    console.log('Deep research chat response generated successfully');

    return new Response(JSON.stringify({ 
      response: responseText,
      success: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in deep-research-chat function:", error);
    
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "Authentication failed. Please check the Gemini API key configuration.";
      } else if (error.message.includes('quota') || error.message.includes('429')) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (error.message.includes('fetch')) {
        errorMessage = "Network error. Could not connect to Gemini API.";
      } else {
        errorMessage = error.message;
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