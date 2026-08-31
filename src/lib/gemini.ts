import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

if (!apiKey) {
  throw new Error('Missing Gemini API key environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSummary(content: string, instructions?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const basePrompt = `Create a concise, detailed summary of the following content. Follow these requirements:

STRUCTURE & FORMAT:
- Use clear headings and bullet points for organization
- Keep the summary between 150-300 words (unless content is very short)
- Write in simple, direct language that anyone can understand
- Use active voice and short sentences

CONTENT REQUIREMENTS:
- Extract and highlight the most important key points
- Include specific facts, numbers, and actionable insights
- Maintain logical flow from main ideas to supporting details
- Remove redundancy and filler content
- Focus on what matters most to the reader

TONE & STYLE:
- Be direct and to-the-point
- Use clear, professional language
- Avoid jargon unless necessary (then explain it)
- Make it scannable with proper formatting

OUTPUT FORMAT:
- Start with a one-sentence overview
- Follow with 3-5 key points as bullet points
- End with main takeaways or conclusions
- Use markdown formatting for better readability`;

    const customInstructions = instructions ? `\n\nAdditional instructions: ${instructions}` : '';
    const fullPrompt = `${basePrompt}${customInstructions}\n\nContent to summarize:\n\n${content}`;
    
    console.log("Generating summary with model:", modelName);
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate summary: ${errorMessage}`);
  }
}

export async function generateRoadmapMermaid(topic: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const escapedTopic = topic.replace(/"/g, '\\"').replace(/`/g, '\\`');

    const prompt = `Create a learning roadmap for \"${escapedTopic}\" using Mermaid flowchart syntax.

    Follow these CRITICAL guidelines:
    1.  **Layout**: Use 'flowchart LR' (Left-to-Right) format.
    2.  **One Statement Per Line**: This is VERY IMPORTANT. Each node definition (e.g., A[\"Node Text\"]:::className) MUST be on its own new line. Each link/edge definition (e.g., A --> B) MUST also be on its own new line.
    3.  **Node Text Quoting**: If node text contains ANY special characters (parentheses, colons, ampersands, etc.), it MUST be enclosed in double quotes. Example: A[\"Text with (parentheses) & colon:\"]:::className.
    4.  **Node Styling Classes**: Assign a class to each node for styling. Use the following classes in sequence for DIFFERENT branches or levels if possible, otherwise cycle through them:
        - First (starting) node: :::classPurple
        - Subsequent nodes/branches: :::classGreen, :::classYellow, :::classBlue, :::classOrange (cycle through these for distinct steps/branches)
    5.  **Node IDs**: Use simple, unique uppercase letters or letter-number combinations (e.g., A, B, C1, D2).
    6.  **Concise Text**: Node text should be concise (2-5 words ideally).
    7.  **Connections**: Use '-->' for connections.
    8.  **No Inline Styles**: Do NOT use any inline styling (the 'style' keyword) or other advanced Mermaid features not explicitly requested.
    9.  **Clean Output**: Return ONLY the valid Mermaid code. No extra text, explanations, or markdown code fences (such as three backticks) surrounding the code block.

    Correct Multi-line Example (imagine the topic is '${escapedTopic}'):
    flowchart LR
    A[\"Start Here: Topic Basics\"]:::classPurple
    B[\"Data Types & Variables\"]:::classGreen
    C[\"Operators & Expressions\"]:::classGreen
    A --> B
    B --> C

    Ensure every single node definition and every single edge definition is on a new line.
    `;
    
    console.log("Gemini Prompt (first 200 chars):", prompt.substring(0, 200) + "...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    let mermaidCode = response.text().trim(); 
    console.log("Raw AI Output (first 300 chars):\n", mermaidCode.substring(0,300) + (mermaidCode.length > 300 ? "..." : ""));

    // Remove potential markdown ```mermaid and ``` backticks
    if (mermaidCode.startsWith('```mermaid')) {
      mermaidCode = mermaidCode.substring('```mermaid'.length);
    }
    if (mermaidCode.startsWith('```')) {
      mermaidCode = mermaidCode.substring('```'.length);
    }
    if (mermaidCode.endsWith('```')) {
      mermaidCode = mermaidCode.substring(0, mermaidCode.length - '```'.length);
    }
    mermaidCode = mermaidCode.trim(); 
    console.log("After Stripping Backticks (first 300 chars):\n", mermaidCode.substring(0,300) + (mermaidCode.length > 300 ? "..." : ""));

    // Normalize newlines and split into lines from AI
    const aiLines = mermaidCode.replace(/\r\n?/g, '\n').split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log("AI Lines (first 5 elements):", JSON.stringify(aiLines.slice(0,5), null, 2));
    
    if (aiLines.length === 0) {
        console.warn("AI returned empty or only whitespace code. Using default error diagram.");
        return `flowchart LR\nERROR[\"AI failed to generate a diagram (empty output)\"]:::classPurple`;
    }

    const processedLines: string[] = [];
    // Ensure first line is flowchart LR
    processedLines.push('flowchart LR');
    
    // Add the rest of the AI's lines, skipping any redundant headers it might have provided
    for (const line of aiLines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.startsWith('flowchart lr') || lowerLine.startsWith('flowchart') || lowerLine.startsWith('curve basis')) {
            // Skip, as we've already added standardized headers
            continue;
        }
        processedLines.push(line);
    }
    
    // If after processing, we only have our header, it means AI returned no usable content beyond header
    if (processedLines.length <= 1) {
         console.warn("AI returned insufficient content (only header or less). Appending error node.");
         processedLines.push('ERROR[\"AI returned no diagram content beyond header\"]:::classPurple');
    }
              
    const finalMermaidCode = processedLines.join('\n');
    console.log("Final Processed Mermaid Code (should be multi-line, first 300 chars):\n", finalMermaidCode.substring(0,300) + (finalMermaidCode.length > 300 ? "..." : ""));

    return finalMermaidCode;
  } catch (error) {
    console.error('Error generating roadmap with Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Sanitize errorMessage for inclusion in Mermaid node text
    const sanitizedErrorMessage = errorMessage.replace(/"/g, "'").replace(/\n/g, " "); // Replace double quotes with single, newlines with space
    return `flowchart LR\nERROR[\"Failed to generate diagram: ${sanitizedErrorMessage}\"]:::classPurple`;
  }
} 

export async function generateLearningPathMermaid(topic: string, level: 'beginner' | 'intermediate' | 'advanced', additionalInfo?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const escapedTopic = topic.replace(/"/g, '\\"').replace(/`/g, '\\`');

    const prompt = `Create a visual learning path for "${escapedTopic}" at ${level} level using Mermaid flowchart syntax.
    ${additionalInfo ? `Consider this context: ${additionalInfo}\n` : ''}

    Follow these CRITICAL guidelines:
    1. Use 'flowchart LR' (Left-to-Right) format with subgraphs for visual organization
    2. Each node and connection MUST be on its own line
    3. Use descriptive node IDs (A, B, C1, etc.)
    4. Quote node text containing special characters
    5. Use these node shapes and style classes for visual hierarchy:
       - Main topic/start: A["Topic"]:::classPurple (rounded rectangle)
       - Core concepts: B[("Concept")]:::classGreen (circle)
       - Practice/Projects: C{{"Project"}}:::classYellow (hexagon)
       - Advanced topics: D[/"Advanced"/]:::classBlue (parallelogram)
       - Assessments/Milestones: E{{"Milestone"}}:::classOrange (hexagon)
    6. Keep node text concise but descriptive (2-5 words)
    7. Use creative connections:
       - Main flow: -->
       - Optional paths: -.->, -.->
       - Prerequisites: ==>
    8. Include 6-8 key learning milestones
    9. Group related nodes using subgraphs
    10. Return ONLY valid Mermaid code

    Example structure:
    flowchart LR
    A["Start: ${escapedTopic} Basics"]:::classPurple
    B["Core Concept 1"]:::classGreen
    C["Practice Project"]:::classYellow
    A --> B
    B --> C`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let mermaidCode = response.text().trim();

    // Process the mermaid code (remove markdown fences if present)
    if (mermaidCode.startsWith('```mermaid')) {
      mermaidCode = mermaidCode.substring('```mermaid'.length);
    }
    if (mermaidCode.startsWith('```')) {
      mermaidCode = mermaidCode.substring('```'.length);
    }
    if (mermaidCode.endsWith('```')) {
      mermaidCode = mermaidCode.substring(0, mermaidCode.length - '```'.length);
    }
    mermaidCode = mermaidCode.trim();

    // Ensure the code starts with flowchart LR
    const lines = mermaidCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const processedLines = ['flowchart LR'];
    
    for (const line of lines) {
      if (!line.toLowerCase().startsWith('flowchart')) {
        processedLines.push(line);
      }
    }

    return processedLines.join('\n');
  } catch (error) {
    console.error('Error generating learning path diagram:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `flowchart LR\nERROR["Failed to generate learning path: ${errorMessage.replace(/"/g, "'")}"]:::classPurple`;
  }
}

export async function generateLearningPath(topic: string, level: 'beginner' | 'intermediate' | 'advanced', additionalInfo?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const escapedTopic = topic.replace(/"/g, '\\"').replace(/`/g, '\\`');
    
    const prompt = `Create a detailed learning path for "${escapedTopic}" at ${level} level.
    ${additionalInfo ? `Additional context: ${additionalInfo}\n` : ''}
    
    Format the response as markdown with:
    1. A brief introduction
    2. Clear learning objectives
    3. Detailed steps with estimated time commitments
    4. Recommended resources for each step
    5. Projects or exercises to practice
    6. Assessment criteria to measure progress
    
    Use proper markdown formatting with:
    - Headers (##, ###)
    - Lists (-, *)
    - Bold and italic text
    - Code blocks where relevant
    
    Keep the content practical and actionable.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating learning path:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `# Error Generating Learning Path\n\nSorry, there was an error: ${errorMessage}\n\nPlease try again.`;
  }
}