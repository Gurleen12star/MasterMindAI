/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

function buildCorsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    // Explicitly allow all relevant headers (the list is case-sensitive for some browsers)
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, x-client-info, apikey, X-Requested-With, Accept, Origin",
    "Access-Control-Allow-Credentials": "true",
  } as const;
}

// We build the default headers once (using * as a fallback)
const corsHeaders = buildCorsHeaders();

interface ResearchState {
  findings: Array<{ text: string; source: string }>;
  summaries: Array<string>;
  gaps: Array<string>;
  sources: Array<{ url: string; title: string; description: string }>;
}

interface ResearchProgress {
  step: string;
  message: string;
  depth: number;
  currentTopic?: string;
  sourcesFound?: number;
}

// Real Firecrawl implementation
async function firecrawlSearch(topic: string) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  console.log('🔍 Starting Firecrawl search for topic:', topic);
  console.log('🔑 Firecrawl API key present:', !!apiKey);
  
  if (!apiKey) {
    console.error('❌ FIRECRAWL_API_KEY environment variable is not set');
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  try {
    console.log('📡 Making request to Firecrawl API...');
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: topic,
        limit: 10,
      }),
    });

    console.log('📊 Firecrawl response status:', response.status);
    console.log('📊 Firecrawl response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Firecrawl API error response:', errorText);
      throw new Error(`Firecrawl search failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 Raw Firecrawl response data:', JSON.stringify(data, null, 2));
    console.log('✅ Firecrawl search success:', data.success);
    console.log('📊 Number of results returned:', data.data?.length || 0);
    
    if (!data.success) {
      console.error('❌ Firecrawl search unsuccessful:', data.error);
      throw new Error(`Firecrawl search unsuccessful: ${data.error || 'Unknown error'}`);
    }

    console.log('🎯 Returning search results:', data.data?.length || 0, 'items');
    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Firecrawl search error:', error);
    throw error;
  }
}

async function firecrawlExtract(urls: string[], prompt: string) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) throw new Error('FIRECRAWL_API_KEY not set');

  const results: any[] = [];
  for (const url of urls) {
    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ url, formats: ['markdown'] }),
      });
      if (!response.ok) {
        console.error('Firecrawl scrape error', url, await response.text());
        continue;
      }
      const data = await response.json();
      if (data.success) {
        results.push({ url, content: data.data.markdown || '' });
      }
    } catch (err) {
      console.error('Firecrawl scrape exception', url, err);
    }
  }
  return { success: true, data: results };
}

// Real Gemini implementation
async function geminiAnalysis(prompt: string) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt}\n\nPlease format your response as a valid JSON object.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      // Attempt to find a JSON object within the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // Fallback for cases where Gemini doesn't return valid JSON
      console.warn('Gemini response was not valid JSON, returning fallback object:', responseText);
      return { findings: [], gaps: [], summary: 'Could not analyze content due to invalid format.' };

    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', responseText, parseError);
      // Even with the regex, parsing might fail. Return a fallback.
      return { findings: [], gaps: [], summary: 'Could not analyze content due to a parsing error.' };
    }
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

async function geminiGenerateReport(prompt: string) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini report generation error:', error);
    throw error;
  }
}

// The main research function
async function runDeepResearch(
  topic: string, 
  maxDepth: number = 3,
  progressCallback?: (progress: ResearchProgress) => void
) {
  console.log('🚀 Starting deep research for topic:', topic, 'with max depth:', maxDepth);
  
  let researchState: ResearchState = {
    findings: [],
    summaries: [],
    gaps: [topic], // Start with the initial topic as the first gap
    sources: [],
  };

  progressCallback?.({
    step: 'initialization',
    message: 'Starting deep research analysis...',
    depth: 0
  });

  for (let depth = 0; depth < maxDepth; depth++) {
    if (researchState.gaps.length === 0) {
      console.log('✅ No more gaps to investigate. Finishing research.');
      break;
    }
    
    const currentGaps = researchState.gaps.join(' ');
    progressCallback?.({
      step: 'searching',
      message: `Searching for information about "${currentGaps}"...`,
      depth: depth + 1,
      currentTopic: currentGaps
    });

    const searchResults = await firecrawlSearch(currentGaps);
    const newSources = searchResults.data.map((result: any) => ({
      url: result.url,
      title: result.title,
      description: result.raw_content ? result.raw_content.substring(0, 200) : ''
    }));
    
    // Avoid adding duplicate sources
    const uniqueNewSources = newSources.filter((source: any) => !researchState.sources.some(s => s.url === source.url));
    researchState.sources.push(...uniqueNewSources);

    progressCallback?.({
      step: 'extracting',
      message: 'Extracting content from relevant sources...',
      depth: depth + 1,
      sourcesFound: uniqueNewSources.length
    });

    const urlsToCrawl = uniqueNewSources.map((s: any) => s.url).filter(Boolean);
    if (urlsToCrawl.length > 0) {
      console.log('🔥 Crawling URLs:', urlsToCrawl);
      const extractionPrompt = `Based on the following content, extract key findings, data points, and potential areas for further research related to the topic: "${topic}". Focus on factual information and novel insights.`;
      const extractedData = await firecrawlExtract(urlsToCrawl, extractionPrompt);
      
      const MAX_CONTENT_LENGTH_PER_SOURCE = 4000;
      const extractedContentWithSources = extractedData.data.map((d: any) => ({
        source: d.url,
        content: d.content ? d.content.substring(0, MAX_CONTENT_LENGTH_PER_SOURCE) : ''
      })).filter((item: any) => item.content);

      const analysisPrompt = `
        Previous Findings: ${JSON.stringify(researchState.findings)}
        New Content: ${JSON.stringify(extractedContentWithSources)}
        
        Based on the new content (provided with sources), identify:
        1. New, non-redundant findings (findings) as an array of objects. Each object should have a 'text' property with the finding and a 'source' property with the URL it came from.
        2. Key questions that remain unanswered (gaps) as an array of strings.
        3. A brief summary of the new information (summaries) as an array of strings.
        
        Return a JSON object with keys: "findings", "gaps", "summaries".
      `;

      console.log('🧠 Sending prompt to Gemini for analysis:', analysisPrompt);
      progressCallback?.({ step: 'analyzing', message: 'Analyzing findings and identifying knowledge gaps...', depth: depth + 2 });
      const analysisResult = await geminiAnalysis(analysisPrompt);
      console.log('✨ Gemini Analysis Result:', JSON.stringify(analysisResult, null, 2));
      
      researchState = {
        findings: [...researchState.findings, ...(analysisResult.findings || [])],
        summaries: [...researchState.summaries, ...(analysisResult.summaries || [])],
        gaps: analysisResult.gaps || [],
        sources: researchState.sources,
      };
    }
  }

  progressCallback?.({
    step: 'synthesizing',
    message: 'Generating comprehensive research report...',
    depth: maxDepth
  });

  const finalReportPrompt = `
    Generate a comprehensive research report on the topic: "${topic}".
    Use the following findings and summaries to construct the report.
    Structure it with an executive summary, key findings, detailed analysis, and a conclusion.
    Cite sources by linking findings to the source URLs.
    
    Findings:
    ${JSON.stringify(researchState.findings, null, 2)}
    
    Source Summaries:
    ${JSON.stringify(researchState.summaries, null, 2)}
    
    Sources:
    ${JSON.stringify(researchState.sources, null, 2)}
  `;
  
  const report = await geminiGenerateReport(finalReportPrompt);

  progressCallback?.({
    step: 'completed',
    message: `Research completed! Generated ${researchState.findings.length} findings from ${researchState.sources.length} sources.`,
    depth: maxDepth
  });

  console.log('✅ Deep research finished successfully.');
  
  return {
    report,
    sources: researchState.sources,
    summaries: researchState.summaries,
    totalFindings: researchState.findings.length,
  };
}

// Main Deno server logic
serve(async (req) => {
  const origin = req.headers.get("Origin");
  const requestCorsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: requestCorsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: {
        ...requestCorsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const { topic, maxDepth = 3 } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400,
        headers: {
          ...requestCorsHeaders,
          'Content-Type': 'application/json'
        },
      });
    }

    // Validate maxDepth
    const validMaxDepth = Math.min(Math.max(1, parseInt(maxDepth) || 3), 5);

    // Check for required environment variables
    const requiredEnvVars = ['FIRECRAWL_API_KEY', 'GEMINI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !Deno.env.get(varName));
    
    if (missingVars.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required environment variables: ${missingVars.join(', ')}` 
      }), {
        status: 500,
        headers: {
          ...requestCorsHeaders,
          'Content-Type': 'application/json'
        },
      });
    }

    const researchResult = await runDeepResearch(topic, validMaxDepth);

    return new Response(JSON.stringify(researchResult), {
      headers: {
        ...requestCorsHeaders,
        'Content-Type': 'application/json'
      },
    });
  } catch (e) {
    console.error('Deep research error:', e);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (e instanceof Error) {
      if (e.message.includes('FIRECRAWL_API_KEY')) {
        errorMessage = 'Firecrawl API configuration error. Please check your API key.';
      } else if (e.message.includes('GEMINI_API_KEY')) {
        errorMessage = 'Gemini API configuration error. Please check your API key.';
      } else if (e.message.includes('quota') || e.message.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else {
        errorMessage = e.message;
      }
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        ...requestCorsHeaders,
        'Content-Type': 'application/json'
      },
    });
  }
});