import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key on module load
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize with error checking
let genAI: GoogleGenerativeAI | null = null;
try {
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error);
}

const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

// Helper function to get model with error checking
function getModel() {
  if (!genAI) {
    throw new Error('Gemini API is not properly initialized. Please check your API key.');
  }
  return genAI.getGenerativeModel({ model });
}

// Helper function to handle API errors
function handleGeminiError(error: any): never {
  console.error('Gemini API Error:', error);
  
  if (error.message?.includes('Failed to fetch')) {
    throw new Error('Network error: Unable to connect to Gemini API. Please check your internet connection and try again.');
  }
  
  if (error.message?.includes('API_KEY_INVALID')) {
    throw new Error('Invalid API key: Please check your Gemini API key configuration.');
  }
  
  if (error.message?.includes('QUOTA_EXCEEDED')) {
    throw new Error('API quota exceeded: You have reached your Gemini API usage limit.');
  }
  
  if (error.message?.includes('PERMISSION_DENIED')) {
    throw new Error('Permission denied: Please check your API key permissions.');
  }
  
  // Generic error fallback
  throw new Error(`Gemini API error: ${error.message || 'Unknown error occurred'}`);
}

export async function generateSummary(content: string, instructions?: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = instructions 
      ? `Please summarize the following content with these specific instructions: ${instructions}\n\nContent:\n${content}`
      : `Please provide a clear and concise summary of the following content:\n\n${content}`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

export async function generateLearningPath(topic: string, level: string, additionalInfo?: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = `Create a comprehensive learning path for "${topic}" at ${level} level.
    ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}
    
    Include:
    1. Clear learning objectives
    2. Step-by-step progression
    3. Recommended resources
    4. Practice exercises
    5. Assessment criteria
    
    Format the response in clear markdown with proper headings, bullet points, and sections.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

function cleanMermaidCode(code: string): string {
  // Remove markdown code block formatting
  let cleaned = code.replace(/```mermaid\s*/gi, '').replace(/```\s*$/g, '');
  
  // Remove any extra whitespace and line breaks at the start/end
  cleaned = cleaned.trim();
  
  // Ensure it starts with a valid Mermaid declaration
  if (!cleaned.toLowerCase().startsWith('flowchart') && 
      !cleaned.toLowerCase().startsWith('graph')) {
    cleaned = 'flowchart LR\n' + cleaned;
  }
  
  // Fix node labels with special characters that cause parsing errors
  cleaned = cleaned.replace(/\[([^\]]*)\]/g, (match, label) => {
    // Remove or replace problematic characters in node labels
    let cleanLabel = label
      .replace(/\([^)]*\)/g, '') // Remove parentheses and their content
      .replace(/[(),\[\]{}]/g, '') // Remove brackets, parentheses, braces
      .replace(/[^\w\s-]/g, '') // Keep only alphanumeric, spaces, and hyphens
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
    
    // Ensure label is not empty
    if (!cleanLabel) {
      cleanLabel = 'Step';
    }
    
    return `[${cleanLabel}]`;
  });
  
  // Remove any duplicate flowchart/graph declarations
  const lines = cleaned.split('\n');
  const filteredLines = [];
  let hasFlowchartDeclaration = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    if (trimmedLine.startsWith('flowchart') || trimmedLine.startsWith('graph')) {
      if (!hasFlowchartDeclaration) {
        filteredLines.push(line);
        hasFlowchartDeclaration = true;
      }
      // Skip duplicate declarations
    } else if (trimmedLine.length > 0) { // Skip empty lines
      filteredLines.push(line);
    }
  }
  
  return filteredLines.join('\n').trim();
}

export async function generateLearningPathMermaid(topic: string, level: string, additionalInfo?: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = `Create a visual learning roadmap for "${topic}" at ${level} level using Mermaid flowchart syntax.
    ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}
    
    CRITICAL SYNTAX REQUIREMENTS:
    1. Start with "flowchart LR" (Left to Right layout)
    2. Include 6-8 key learning milestones as nodes
    3. Show dependencies between topics with arrows
    4. Use simple node syntax like A[Node Label] --> B[Next Node]
    5. Node labels MUST be simple text only - NO parentheses, commas, or special characters
    6. Use short, clear labels like "Python Basics" not "Python Basics (Variables, Functions)"
    7. Include difficulty progression from basic to advanced
    8. Do NOT include any markdown formatting, code blocks, or explanations
    9. Return ONLY valid Mermaid flowchart syntax
    
    VALID Example:
    flowchart LR
        A[Start] --> B[Python Basics]
        B --> C[Data Structures]
        C --> D[Control Flow]
        D --> E[Functions]
        E --> F[Object Oriented]
        F --> G[Advanced Topics]
    
    INVALID Examples (DO NOT USE):
    - A[Python Basics (Variables, Functions)] - Contains parentheses
    - B[Data Visualization (Matplotlib, Seaborn)] - Contains parentheses
    
    Return ONLY the mermaid flowchart code with no additional text or formatting.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const rawCode = response.text();
    
    // Clean and validate the generated code
    const cleanedCode = cleanMermaidCode(rawCode);
    
    // Basic validation - ensure it has valid structure
    if (!cleanedCode || cleanedCode.length < 20) {
      throw new Error('Generated diagram is too short or empty');
    }
    
    return cleanedCode;
  } catch (error) {
    console.error('Error generating learning path mermaid:', error);
    
    // Return a fallback diagram instead of throwing
    return `flowchart LR
    A[Start Learning ${topic}] --> B[Learn Basics]
    B --> C[Practice Fundamentals]
    C --> D[Intermediate Concepts]
    D --> E[Advanced Topics]
    E --> F[Real Projects]
    F --> G[Master ${topic}]`;
  }
}

export async function generateRoadmapMermaid(topic: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = `Create a detailed learning roadmap for "${topic}" using Mermaid flowchart syntax.
    
    CRITICAL SYNTAX REQUIREMENTS:
    1. Start with "flowchart LR" (Left to Right layout)
    2. Include major topics and subtopics as nodes
    3. Show clear progression path with arrows
    4. Use simple node syntax like A[Node Label] --> B[Next Node]
    5. Node labels MUST be simple text only - NO parentheses, commas, or special characters
    6. Use short, clear labels like "Git Basics" not "Version Control (Git)"
    7. Include branching paths where relevant
    8. Do NOT include any markdown formatting, code blocks, or explanations
    9. Return ONLY valid Mermaid flowchart syntax
    
    VALID Example:
    flowchart LR
        A[Start] --> B[Fundamentals]
        B --> C[Core Concepts]
        C --> D[Intermediate Skills]
        D --> E[Advanced Topics]
        E --> F[Specialization]
    
    INVALID Examples (DO NOT USE):
    - A[Version Control (Git)] - Contains parentheses
    - B[Data Visualization (Tools)] - Contains parentheses
        
    Return ONLY the mermaid flowchart code with no additional text or formatting.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const rawCode = response.text();
    
    // Clean and validate the generated code
    const cleanedCode = cleanMermaidCode(rawCode);
    
    // Basic validation - ensure it has valid structure
    if (!cleanedCode || cleanedCode.length < 20) {
      throw new Error('Generated roadmap is too short or empty');
    }
    
    return cleanedCode;
  } catch (error) {
    console.error('Error generating roadmap mermaid:', error);
    
    // Return a fallback diagram instead of throwing
    return `flowchart LR
    A[Start ${topic}] --> B[Fundamentals]
    B --> C[Core Concepts]
    C --> D[Intermediate Skills]
    D --> E[Advanced Topics]
    E --> F[Specialization]
    F --> G[Expert Level]`;
  }
}