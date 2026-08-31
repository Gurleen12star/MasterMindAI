import { Client, Databases, Storage, Query, Account, ID } from 'appwrite';

// Initialize client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

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
    // Validate configuration with detailed error messages
    const configValidation = await validateAppwriteConfig();
    if (!configValidation.isValid) {
      throw new Error(configValidation.error);
    }

    try {
      await initializeAppwriteSession();
    } catch (sessionError) {
      console.error('Session initialization failed:', sessionError);
      throw new Error('Failed to initialize Appwrite session. Please check your configuration.');
    }

    try {
      const response = await storage.listFiles(FINAL_VIDEOS_BUCKET_ID);
      return response.files || [];
    } catch (storageError: any) {
      console.error('Storage operation failed:', storageError);
      
      // Handle specific Appwrite error types
      if (storageError.code === 404) {
        throw new Error(`Storage bucket '${FINAL_VIDEOS_BUCKET_ID}' not found. Please ensure the bucket exists in your Appwrite project.`);
      } else if (storageError.code === 401) {
        throw new Error('Authentication failed. Please check your Appwrite configuration and permissions.');
      } else if (storageError.code === 403) {
        throw new Error(`Access denied to storage bucket '${FINAL_VIDEOS_BUCKET_ID}'. Please check bucket permissions.`);
      } else if (storageError.message?.includes('CORS')) {
        throw new Error('CORS error: Please add your domain to the Appwrite project\'s allowed origins.');
      } else if (storageError.message?.includes('network') || storageError.message?.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Appwrite. Please check your internet connection and Appwrite endpoint.');
      }
      
      throw new Error(`Storage operation failed: ${storageError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to list video files:', error);
    throw error; // Re-throw the original error with detailed message
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
}> {
  try {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    
    const configValidation = await validateAppwriteConfig();
    if (!configValidation.isValid) {
      return {
        success: false,
        error: configValidation.error,
        endpoint,
        projectId,
        details: 'Configuration validation failed'
      };
    }
    
    // Test actual connection
    try {
      await initializeAppwriteSession();
      return { 
        success: true, 
        endpoint, 
        projectId,
        details: 'Connection successful'
      };
    } catch (connectionError: any) {
      return {
        success: false,
        error: `Connection test failed: ${connectionError.message || 'Unknown error'}`,
        endpoint,
        projectId,
        details: 'Failed to establish connection to Appwrite'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown configuration error',
      endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      details: 'Test connection failed'
    };
  }
}

export { client };