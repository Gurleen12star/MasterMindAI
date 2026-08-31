import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateRoadmapMermaid(topic: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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