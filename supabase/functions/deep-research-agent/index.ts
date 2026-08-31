const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: topic,
        pageOptions: {
          fetchPageContent: false,
          includeHtml: false,
        },
        searchOptions: {
          limit: 10,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Firecrawl search failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Firecrawl search unsuccessful: ${data.error || 'Unknown error'}`);
    }

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
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/batch/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls: urls,
        formats: ['extract'],
        extract: {
          prompt: prompt,
          schema: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: 'Extracted content based on the prompt'
              }
            },
            required: ['content']
          }
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Firecrawl extract failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Firecrawl extract unsuccessful: ${data.error || 'Unknown error'}`);
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Firecrawl extract error:', error);
    throw error;
  }
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
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
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
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', responseText);
      throw new Error('Gemini returned invalid JSON');
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
  const researchState: ResearchState = {
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
      progressCallback?.({
        step: 'completion',
        message: 'No more gaps to investigate. Finishing research.',
        depth
      });
      break;
    }

    const currentTopic = researchState.gaps.shift()!; // Get the next topic to research
    
    progressCallback?.({
      step: 'searching',
      message: `Researching: "${currentTopic}"`,
      depth: depth + 1,
      currentTopic
    });

    try {
      // 1. Search for relevant information using Firecrawl
      const searchResult = await firecrawlSearch(currentTopic);

      if (!searchResult.success || searchResult.data.length === 0) {
        progressCallback?.({
          step: 'error',
          message: 'Search failed or returned no results.',
          depth: depth + 1
        });
        continue;
      }
      
      // Collect sources
      const newSources = searchResult.data.map((result: any) => ({
        url: result.url,
        title: result.title || 'Untitled',
        description: result.description || result.content || 'No description available',
      }));
      researchState.sources.push(...newSources);

      progressCallback?.({
        step: 'extracting',
        message: `Found ${searchResult.data.length} sources, extracting content...`,
        depth: depth + 1,
        sourcesFound: searchResult.data.length
      });

      // 2. Extract detailed information from the top 3-5 search results
      const urlsToExtract = searchResult.data.slice(0, Math.min(5, searchResult.data.length)).map((result: any) => result.url);

      if (urlsToExtract.length > 0) {
        try {
          const extractResult = await firecrawlExtract(
            urlsToExtract,
            `Extract key facts, data, statistics, expert opinions, and comprehensive information about "${currentTopic}". Focus on factual content, research findings, and authoritative insights. Be detailed and thorough.`
          );
          
          if (extractResult.success && extractResult.data.length > 0) {
            extractResult.data.forEach((item: any, index: number) => {
              if (item.extract && item.extract.content) {
                researchState.findings.push({ 
                  text: item.extract.content, 
                  source: urlsToExtract[index] || 'Unknown source'
                });
              }
            });
          }
        } catch (extractError) {
          console.error('Extract error:', extractError);
          // Continue with search results as fallback
          searchResult.data.slice(0, 3).forEach((result: any) => {
            if (result.content) {
              researchState.findings.push({
                text: result.content,
                source: result.url
              });
            }
          });
        }
      }
      
      // 3. Analyze and Plan with Gemini
      progressCallback?.({
        step: 'analyzing',
        message: 'Analyzing findings and planning next steps...',
        depth: depth + 1
      });

      const analysisPrompt = `You are a research analyst. Based on the initial topic "${topic}" and the following findings, please perform an analysis.

Current Findings:
${researchState.findings.map(f => `[Source: ${f.source}]:\n${f.text}`).join('\n\n')}

Previous Summaries:
${researchState.summaries.join('\n\n')}

Your task is to:
1. Briefly summarize what has been learned so far about "${topic}".
2. Identify the most critical remaining knowledge gaps. These should be specific questions or subtopics that need investigation.
3. Decide if the research should continue. It should only stop if the topic is well-covered or if we've reached sufficient depth.

Respond in the following JSON format:
{
  "summary": "A concise summary of the key findings so far.",
  "gaps": ["specific gap 1 as a question", "specific gap 2 as a question", "specific gap 3 as a question"],
  "shouldContinue": true
}

Make sure the gaps are specific, actionable research questions that would add value to understanding "${topic}".`;

      const analysis = await geminiAnalysis(analysisPrompt);
      
      researchState.summaries.push(analysis.summary);
      
      // Add new, unique gaps to the list
      if (analysis.gaps && Array.isArray(analysis.gaps)) {
        analysis.gaps.forEach((gap: string) => {
          if (!researchState.gaps.includes(gap) && gap.trim().length > 0) {
            researchState.gaps.push(gap);
          }
        });
      }

      if (!analysis.shouldContinue || depth >= maxDepth - 1) {
        progressCallback?.({
          step: 'completion',
          message: 'Analysis indicates research is complete.',
          depth: depth + 1
        });
        break;
      }

    } catch (e) {
      console.error("Error during research cycle:", e);
      progressCallback?.({
        step: 'error',
        message: `Error during research: ${e instanceof Error ? e.message : 'Unknown error'}`,
        depth: depth + 1
      });
      
      // Continue with next gap if available, don't break entirely
      if (researchState.gaps.length === 0) {
        break;
      }
    }
  }

  // 4. Final Synthesis
  progressCallback?.({
    step: 'synthesizing',
    message: 'Generating comprehensive final report...',
    depth: maxDepth
  });

  const finalPrompt = `Based on all the information gathered, write a comprehensive and detailed research report on the topic: "${topic}".

Use the findings and summaries below to create a well-structured report with clear headings, subheadings, and proper citations.

Structure the report as follows:
1. Executive Summary
2. Key Findings
3. Detailed Analysis (with subsections as appropriate)
4. Implications and Applications
5. Future Outlook
6. Conclusion
7. Sources and References

Findings:
${researchState.findings.map((f, index) => `[${index + 1}] Source: ${f.source}\nContent: ${f.text}`).join('\n\n')}

Research Summaries:
${researchState.summaries.join('\n\n')}

Make the report comprehensive, well-organized, and include proper citations using the source URLs provided. Use markdown formatting for better readability.`;

  const finalReport = await geminiGenerateReport(finalPrompt);

  return {
    report: finalReport,
    sources: researchState.sources,
    summaries: researchState.summaries,
    totalFindings: researchState.findings.length
  };
}

// Main server handler
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: {
        ...corsHeaders,
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
          ...corsHeaders,
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
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      });
    }

    const researchResult = await runDeepResearch(topic, validMaxDepth);

    return new Response(JSON.stringify(researchResult), {
      headers: {
        ...corsHeaders,
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
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    });
  }
});