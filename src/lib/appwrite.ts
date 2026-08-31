import { Client, Databases, Storage, Query, Account, ID } from 'appwrite';

// Initialize client
const client = new Client();

// Configure client with proper error handling
try {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
  
  client
    .setEndpoint(endpoint)
    .setProject(projectId);
    
  // Add self-signed certificate support for local development
  if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
    // For local development, we might need to handle self-signed certificates
    console.log('Configuring Appwrite for local development');
  }
} catch (error) {
  console.error('Failed to configure Appwrite client:', error);
}

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Initialize anonymous session if needed
let sessionInitialized = false;

export async function initializeAppwriteSession() {
  if (sessionInitialized) return;
  
  try {
    // Try to get current session
    await account.get();
    sessionInitialized = true;
  } catch (error) {
    try {
      // Create anonymous session if no user session exists
      await account.createAnonymousSession();
      sessionInitialized = true;
      console.log('Created anonymous Appwrite session');
    } catch (sessionError) {
      console.error('Failed to create Appwrite session:', sessionError);
    }
  }
}

// Constants
export const DATABASE_ID = 'video_metadata';
export const VIDEOS_COLLECTION_ID = 'videos';
export const SCENES_COLLECTION_ID = 'scenes';
export const FINAL_VIDEOS_BUCKET_ID = 'final_videos';
export const SCENE_VIDEOS_BUCKET_ID = 'scene_videos';

// Types
export interface VideoDocument {
  $id: string;
  topic: string;
  description?: string;
  status: 'queued' | 'planning' | 'rendering' | 'completed' | 'failed';
  progress?: number;
  scene_count: number;
  combined_video_url?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface SceneDocument {
  $id: string;
  video_id: string;
  scene_number: number;
  status: 'planned' | 'coded' | 'rendered' | 'failed';
  video_url?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

// Utility functions
export async function getVideo(videoId: string): Promise<VideoDocument | null> {
  try {
    await initializeAppwriteSession();
    const response = await databases.getDocument(
      DATABASE_ID,
      VIDEOS_COLLECTION_ID,
      videoId
    );
    return response as unknown as VideoDocument;
  } catch (error) {
    console.error('Failed to get video:', error);
    return null;
  }
}

export async function getVideoScenes(videoId: string): Promise<SceneDocument[]> {
  try {
    await initializeAppwriteSession();
    const response = await databases.listDocuments(
      DATABASE_ID,
      SCENES_COLLECTION_ID,
      [Query.equal('video_id', videoId)]
    );
    return response.documents as unknown as SceneDocument[];
  } catch (error) {
    console.error('Failed to get scenes:', error);
    return [];
  }
}

export function getFileUrl(bucketId: string, fileId: string): string {
  try {
    return storage.getFileView(bucketId, fileId).toString();
  } catch (error) {
    console.error('Failed to generate file URL:', error);
    return '';
  }
}

export async function listVideoFiles(): Promise<any[]> {
  try {
    return await listVideoFilesWithRetry();
  } catch (error) {
    console.error('Failed to list video files:', error);
    throw error; // Re-throw the original error with detailed message
  }
}

// Helper function with retry logic and better CORS handling
async function listVideoFilesWithRetry(maxRetries = 3): Promise<any[]> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Validate configuration
      const configValidation = await validateAppwriteConfig();
      if (!configValidation.isValid) {
        throw new Error(configValidation.error);
      }

      // Initialize session
      await initializeAppwriteSession();
      
      // Attempt storage operation
      const response = await storage.listFiles(FINAL_VIDEOS_BUCKET_ID);
      return response.files || [];
      
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // Check if this is a CORS error
      if (isCorsError(error)) {
        throw createCorsError();
      }
      
      // Check if this is a configuration error (don't retry these)
      if (isConfigurationError(error)) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw createNetworkError(error);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError;
}

// Helper functions for error detection
function isCorsError(error: any): boolean {
  return (
    error.message?.toLowerCase().includes('cors') ||
    error.message?.toLowerCase().includes('cross-origin') ||
    error.name === 'TypeError' && error.message?.includes('Failed to fetch') ||
    error.code === 0 || // Network error code
    (error.message?.includes('fetch') && !error.code) // Generic fetch error without specific code
  );
}

function isConfigurationError(error: any): boolean {
  return (
    error.message?.includes('not configured') ||
    error.message?.includes('placeholder value') ||
    error.message?.includes('invalid URL')
  );
}

function createCorsError(): Error {
  const currentDomain = window.location.origin;
  return new Error(
    `CORS Error: Unable to connect to Appwrite from ${currentDomain}. ` +
    `Please add "${currentDomain}" to your Appwrite project's allowed origins. ` +
    `Go to your Appwrite Console → Project Settings → Platforms → Add Web Platform → Add "${currentDomain}"`
  );
}

function createNetworkError(originalError: any): Error {
  if (originalError.code === 404) {
    return new Error(`Storage bucket '${FINAL_VIDEOS_BUCKET_ID}' not found. Please ensure the bucket exists in your Appwrite project.`);
  } else if (originalError.code === 401) {
    return new Error('Authentication failed. Please check your Appwrite configuration and permissions.');
  } else if (originalError.code === 403) {
    return new Error(`Access denied to storage bucket '${FINAL_VIDEOS_BUCKET_ID}'. Please check bucket permissions.`);
  } else {
    return new Error(`Network error: Unable to connect to Appwrite. Please check your internet connection and Appwrite endpoint. Original error: ${originalError.message || 'Unknown error'}`);
  }
}

// Add validation function for Appwrite configuration
async function validateAppwriteConfig(): Promise<{ isValid: boolean; error?: string }> {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  
  if (!endpoint) {
    return {
      isValid: false,
      error: 'VITE_APPWRITE_ENDPOINT is not configured. Please add it to your .env file.'
    };
  }
  
  if (!projectId || projectId === 'your_project_id_here') {
    return {
      isValid: false,
      error: 'VITE_APPWRITE_PROJECT_ID is not configured or using placeholder value. Please add your actual Appwrite project ID to your .env file.'
    };
  }
  
  // Validate endpoint format
  try {
    new URL(endpoint);
  } catch {
    return {
      isValid: false,
      error: 'VITE_APPWRITE_ENDPOINT is not a valid URL. Please check your configuration.'
    };
  }
  
  return { isValid: true };
}
export async function testConnection(): Promise<{
  success: boolean;
  error?: string;
  endpoint?: string;
  projectId?: string;
  details?: string;
  corsGuidance?: string;
}> {
  try {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    const currentDomain = window.location.origin;
    
    const configValidation = await validateAppwriteConfig();
    if (!configValidation.isValid) {
      return {
        success: false,
        error: configValidation.error,
        endpoint,
        projectId,
        details: 'Configuration validation failed',
        corsGuidance: `Add ${currentDomain} to Appwrite allowed origins`
      };
    }
    
    // Test actual connection
    try {
      await initializeAppwriteSession();
      return { 
        success: true, 
        endpoint, 
        projectId,
        details: 'Connection successful',
        corsGuidance: 'CORS properly configured'
      };
    } catch (connectionError: any) {
      const corsGuidance = isCorsError(connectionError) 
        ? `CORS Issue: Add ${currentDomain} to your Appwrite project's allowed origins in the Console`
        : 'Check network connectivity and endpoint configuration';
        
      return {
        success: false,
        error: isCorsError(connectionError) 
          ? createCorsError().message
          : `Connection test failed: ${connectionError.message || 'Unknown error'}`,
        endpoint,
        projectId,
        details: 'Failed to establish connection to Appwrite',
        corsGuidance
      };
    }
  } catch (error) {
    const currentDomain = window.location.origin;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown configuration error',
      endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      details: 'Test connection failed',
      corsGuidance: `Add ${currentDomain} to Appwrite allowed origins`
    };
  }
}

export { client };