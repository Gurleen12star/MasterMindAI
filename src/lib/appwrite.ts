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
    // Validate configuration before attempting to connect
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    
    if (!endpoint || !projectId || projectId === 'your_project_id_here') {
      throw new Error('Appwrite configuration is missing. Please check your .env file and ensure VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are properly set.');
    }
    
    await initializeAppwriteSession();
    const response = await storage.listFiles(FINAL_VIDEOS_BUCKET_ID);
    return response.files;
  } catch (error) {
    console.error('Failed to list video files:', error);
    // Re-throw with more specific error information
    if (error instanceof Error) {
      throw new Error(`Failed to list video files: ${error.message}`);
    }
    throw new Error('Failed to list video files: Unknown error occurred');
  }
}

export async function testConnection(): Promise<{
  success: boolean;
  error?: string;
  endpoint?: string;
  projectId?: string;
}> {
  try {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    
    if (!endpoint || !projectId) {
      throw new Error('Missing Appwrite configuration');
    }
    
    return { success: true, endpoint, projectId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Configuration error',
      endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID
    };
  }
}

export { client };