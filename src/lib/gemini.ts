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

export async function generateLearningPathMermaid(topic: string, level: string, additionalInfo?: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = `Create a visual learning roadmap for "${topic}" at ${level} level using Mermaid flowchart syntax.
    ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}
    
    Requirements:
    1. Use flowchart LR syntax
    2. Include 6-8 key learning milestones
    3. Show dependencies between topics
    4. Use appropriate node shapes
    5. Include difficulty progression
    
    Return ONLY the mermaid code, no explanations or markdown formatting.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    handleGeminiError(error);
  }
}

export async function generateRoadmapMermaid(topic: string): Promise<string> {
  try {
    const generativeModel = getModel();
    
    const prompt = `Create a detailed learning roadmap for "${topic}" using Mermaid flowchart syntax.
    
    Requirements:
    1. Use flowchart LR syntax
    2. Include major topics and subtopics
    3. Show clear progression path
    4. Use appropriate node shapes
    5. Include branching paths where relevant
    
    Return ONLY the mermaid flowchart code, no explanations or markdown formatting.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    handleGeminiError(error);
  }
}