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

// Mock implementation for demonstration - replace with actual Firecrawl integration
async function mockFirecrawlSearch(topic: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: [
      {
        url: `https://example.com/article-1-${encodeURIComponent(topic)}`,
        title: `Understanding ${topic}: A Comprehensive Guide`,
        content: `This article provides an overview of ${topic}, covering fundamental concepts and recent developments.`
      },
      {
        url: `https://example.com/article-2-${encodeURIComponent(topic)}`,
        title: `${topic}: Latest Research and Trends`,
        content: `Recent studies and industry trends related to ${topic}, including expert opinions and data analysis.`
      },
      {
        url: `https://example.com/article-3-${encodeURIComponent(topic)}`,
        title: `Practical Applications of ${topic}`,
        content: `Real-world applications and case studies demonstrating the practical use of ${topic}.`
      }
    ]
  };
}

async function mockFirecrawlExtract(url: string, prompt: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const topicMatch = prompt.match(/about "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : 'the subject';
  
  return {
    success: true,
    data: [{
      data: `Detailed information about ${topic} extracted from ${url}. This includes key facts, expert opinions, statistical data, and comprehensive analysis. The content covers various aspects including historical context, current applications, future trends, and practical implications. Research shows significant developments in this field with measurable impacts across multiple sectors.`
    }]
  };
}

async function mockGeminiAnalysis(prompt: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Extract topic from prompt
  const topicMatch = prompt.match(/initial topic "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : 'the subject';
  
  // Simulate analysis based on research depth
  const findingsCount = (prompt.match(/\[Source:/g) || []).length;
  const shouldContinue = findingsCount < 6; // Continue if we have fewer than 6 sources
  
  return {
    summary: `Current research on ${topic} reveals significant insights across multiple dimensions. Key findings include technological advancements, market trends, and practical applications. The analysis shows both opportunities and challenges in this domain.`,
    gaps: [
      `What are the latest technological innovations in ${topic}?`,
      `How does ${topic} impact different industry sectors?`,
      `What are the future predictions and trends for ${topic}?`
    ],
    shouldContinue
  };
}

async function mockGeminiFinalReport(prompt: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const topicMatch = prompt.match(/topic: "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : 'the subject';
  
  return `# Comprehensive Research Report: ${topic}

## Executive Summary

This comprehensive analysis of ${topic} provides an in-depth examination of current trends, technological developments, and future implications. Based on extensive research across multiple authoritative sources, this report synthesizes key findings and presents actionable insights.

## Key Findings

### Current State
- **Market Position**: ${topic} has shown significant growth and adoption across various sectors
- **Technology Maturity**: Current implementations demonstrate both strengths and areas for improvement
- **Industry Impact**: Measurable effects on productivity, efficiency, and innovation

### Technological Developments
- **Recent Innovations**: Latest advancements have addressed previous limitations
- **Integration Capabilities**: Enhanced compatibility with existing systems
- **Performance Metrics**: Improved benchmarks across key performance indicators

### Market Analysis
- **Growth Trends**: Consistent upward trajectory in adoption and investment
- **Competitive Landscape**: Multiple players contributing to ecosystem development
- **Economic Impact**: Quantifiable benefits for early adopters

## Detailed Analysis

### Technical Aspects
The technical foundation of ${topic} demonstrates robust architecture and scalable implementation. Recent developments have focused on improving efficiency, reducing complexity, and enhancing user experience. Performance benchmarks indicate significant improvements over previous generations.

### Industry Applications
Across various sectors, ${topic} has proven its value through practical implementations. Case studies reveal consistent patterns of improved outcomes, reduced costs, and enhanced capabilities. Organizations report positive ROI and strategic advantages.

### Future Outlook
Projections indicate continued growth and evolution in the ${topic} space. Emerging trends suggest new applications and expanded capabilities. Investment patterns and research directions point toward sustained innovation and development.

## Recommendations

### Short-term Actions
1. **Assessment**: Evaluate current capabilities and identify improvement opportunities
2. **Planning**: Develop implementation roadmap aligned with organizational goals
3. **Pilot Programs**: Initiate small-scale trials to validate approaches

### Long-term Strategy
1. **Investment**: Allocate resources for sustained development and adoption
2. **Partnerships**: Establish relationships with key players in the ecosystem
3. **Innovation**: Contribute to ongoing research and development efforts

## Conclusion

The research demonstrates that ${topic} represents a significant opportunity for organizations willing to invest in understanding and implementing relevant solutions. Success factors include strategic planning, appropriate resource allocation, and commitment to ongoing learning and adaptation.

The evidence supports a positive outlook for continued development and adoption, with multiple pathways for value creation and competitive advantage.

## Sources and References

This report synthesizes information from multiple authoritative sources, including academic research, industry reports, expert analyses, and practical case studies. All findings are based on current data and established methodologies.`;
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
      // 1. Search for relevant information
      const searchResult = await mockFirecrawlSearch(currentTopic);

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
        title: result.title,
        description: result.content,
      }));
      researchState.sources.push(...newSources);

      progressCallback?.({
        step: 'extracting',
        message: `Found ${searchResult.data.length} sources, extracting content...`,
        depth: depth + 1,
        sourcesFound: searchResult.data.length
      });

      // 2. Extract detailed information from the top 3 search results
      const urlsToCrawl = searchResult.data.slice(0, 3).map((result: any) => result.url);

      for (const url of urlsToCrawl) {
        const extractResult = await mockFirecrawlExtract(
          url,
          `Extract key facts, data, and expert opinions about "${currentTopic}". Be comprehensive and detailed.`
        );
        
        if (extractResult.success && extractResult.data.length > 0) {
          researchState.findings.push({ 
            text: extractResult.data[0].data, 
            source: url 
          });
        }
      }
      
      // 3. Analyze and Plan with Gemini
      progressCallback?.({
        step: 'analyzing',
        message: 'Analyzing findings and planning next steps...',
        depth: depth + 1
      });

      const analysisPrompt = `
        You are a research analyst. Based on the initial topic "${topic}" and the following findings, please perform an analysis.

        Current Findings:
        ${researchState.findings.map(f => `[Source: ${f.source}]:\n${f.text}`).join('\n\n')}

        Previous Summaries:
        ${researchState.summaries.join('\n\n')}

        Your task is to:
        1. Briefly summarize what has been learned so far about "${topic}".
        2. Identify the most critical remaining knowledge gaps. These should be specific questions.
        3. Decide if the research should continue. It should only stop if the topic is well-covered or the max depth is reached.

        Respond in the following JSON format:
        {
          "summary": "A concise summary of the key findings.",
          "gaps": ["gap 1 as a question", "gap 2 as a question", "..."],
          "shouldContinue": true
        }
      `;

      const analysis = await mockGeminiAnalysis(analysisPrompt);
      
      researchState.summaries.push(analysis.summary);
      // Add new, unique gaps to the list
      analysis.gaps.forEach((gap: string) => {
        if (!researchState.gaps.includes(gap)) {
          researchState.gaps.push(gap);
        }
      });

      if (!analysis.shouldContinue) {
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
      break;
    }
  }

  // 4. Final Synthesis
  progressCallback?.({
    step: 'synthesizing',
    message: 'Generating comprehensive final report...',
    depth: maxDepth
  });

  const finalPrompt = `
    Based on all the information gathered, write a comprehensive and detailed report on the topic: "${topic}".
    Use the findings and summaries below. Structure the report logically with clear headings.

    Findings:
    ${researchState.findings.map(f => `[Source: ${f.source}]:\n${f.text}`).join('\n\n')}

    Summaries:
    ${researchState.summaries.join('\n\n')}
  `;

  const finalReport = await mockGeminiFinalReport(finalPrompt);

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

    const researchResult = await runDeepResearch(topic, validMaxDepth);

    return new Response(JSON.stringify(researchResult), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    });
  } catch (e) {
    console.error('Deep research error:', e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : 'Internal server error' 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    });
  }
});