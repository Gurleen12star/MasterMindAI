/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

function buildCorsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
    "Access-Control-Allow-Credentials": "true",
  } as const;
}

// Zod schemas for AI validation
const LearningNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()),
  resources: z.array(z.string()).optional(),
  project: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
  position: z.number().int()
});

const LearningPathSchema = z.object({
  goal: z.string(),
  skills: z.array(z.string()),
  milestones: z.array(LearningNodeSchema),
});

serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get('Authorization');
    const isDemoMode = req.headers.get('x-demo-mode') === 'true';
    
    if (!authHeader && !isDemoMode) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } }
    });

    let profile = null;
    
    if (!isDemoMode && authHeader) {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Fetch User Profile to personalize
      const { data } = await supabaseClient
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      profile = data;
    }

    // 2. Validate Request Body
    const { topic, learnerSnapshot, gaps } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid topic" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. AI Provider Abstraction
    // Currently configured for Gemini via API KEY
    const AI_PROVIDER = Deno.env.get('AI_PROVIDER') || 'gemini';
    const AI_API_KEY = Deno.env.get('AI_API_KEY') || '';
    const AI_MODEL = Deno.env.get('AI_MODEL') || 'gemini-2.0-flash';

    if (!AI_API_KEY) {
      throw new Error("Server configuration error: Missing AI credentials");
    }

    let structuredOutput;

    if (AI_PROVIDER === 'gemini') {
      // Build prompt
      let personalization = "";
      if (learnerSnapshot && gaps) {
        personalization = `
        MASTERMINDAI PERSONALIZATION:
        The learner's career goal is: ${learnerSnapshot.careerIntent.targetRole} (${learnerSnapshot.careerIntent.industryFocus}) in ${learnerSnapshot.careerIntent.timeframeMonths} months.
        Their identified critical skill gaps are:
        ${gaps.map((g: any) => `- ${g.skillName}: Current ${g.currentLevel}/100, Required ${g.requiredLevel}/100 (Criticality: ${g.criticality})`).join('\n')}
        
        INSTRUCTIONS:
        1. Front-load and prioritize the critical skill gaps.
        2. Compress or skip topics the user already knows well.
        3. Include a final capstone project specifically tailored to their industry focus (${learnerSnapshot.careerIntent.industryFocus}) to prove their skills.
        `;
      } else if (profile) {
        personalization = `
        The learner is a ${profile.learning_style || 'mixed'} learner.
        Current education level: ${profile.education_level || 'unknown'}.
        Programming experience: ${profile.programming_experience || 'none'}.
        Preferred difficulty: ${profile.preferred_difficulty || 'intermediate'}.
        Please tailor the milestones, projects, and resources to this profile.`;
      }

      const prompt = `
      You are MasterMindAI, an expert career and learning intelligence engine.
      The user wants to learn: "${topic}".
      ${personalization}
      
      Generate a comprehensive, structured learning path. 
      Break it down into chronological milestones (nodes). 
      Make sure to assign a unique web-safe 'id' to each node, and specify any 'prerequisites' using those IDs.
      The 'position' should be 1-indexed.
      `;

      // Call Gemini API using REST for simplicity in Edge Function
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`;
      
      // Define the exact JSON schema Gemini should follow
      const schema = {
        type: "OBJECT",
        properties: {
          goal: { type: "STRING" },
          skills: { type: "ARRAY", items: { type: "STRING" } },
          milestones: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                title: { type: "STRING" },
                description: { type: "STRING" },
                difficulty: { type: "STRING", enum: ["beginner", "intermediate", "advanced"] },
                estimatedMinutes: { type: "INTEGER" },
                prerequisites: { type: "ARRAY", items: { type: "STRING" } },
                resources: { type: "ARRAY", items: { type: "STRING" } },
                project: { type: "STRING" },
                status: { type: "STRING", enum: ["not_started", "in_progress", "completed"] },
                position: { type: "INTEGER" }
              },
              required: ["id", "title", "description", "difficulty", "estimatedMinutes", "prerequisites", "position"]
            }
          }
        },
        required: ["goal", "skills", "milestones"]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: schema
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        throw new Error(`AI Provider Error: ${response.statusText}`);
      }

      const aiData = await response.json();
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error("AI returned an empty or malformed response");
      }

      structuredOutput = JSON.parse(rawText);
    } else {
      throw new Error(`Unsupported AI Provider: ${AI_PROVIDER}`);
    }

    // 4. Validate AI Output using Zod
    const validatedData = LearningPathSchema.parse(structuredOutput);

    // 5. Return Validated Data
    return new Response(JSON.stringify({ data: validatedData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Error in generate-roadmap function:", error);
    
    // Check if it's a Zod validation error
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: { code: "VALIDATION_ERROR", message: "AI generated invalid structure", details: error.errors, retryable: true } }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: { code: "SERVER_ERROR", message: error.message, retryable: true } }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
