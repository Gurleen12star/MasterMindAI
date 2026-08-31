// API functions for video generation and status checking

export interface GenerateRequest {
  topic: string;
  description?: string;
  subject?: string;
  difficulty_level?: string;
}

export interface GenerateResponse {
  success: boolean;
  videoId?: string;
  message?: string;
  error?: string;
}

export interface StatusResponse {
  status?: string;
  progress?: number;
  message?: string;
  video_id?: string;
  error?: string;
}

export async function generateVideo(
  topic: string, 
  description: string = '',
  subject: string = 'general',
  difficultyLevel: string = 'intermediate'
): Promise<GenerateResponse> {
  try {
    const { databases, client, initializeAppwriteSession } = await import('./appwrite');
    const { ID } = await import('appwrite');
    
    // Initialize Appwrite session
    await initializeAppwriteSession();
    
    // Create video document in Appwrite
    const videoId = ID.unique();
    const videoDocument = await databases.createDocument(
      'video_metadata',
      'videos',
      videoId,
      {
        topic: topic.trim(),
        description: description.trim(),
        status: 'queued',
        progress: 0,
        scene_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    // Trigger GitHub workflow (if environment variables are available)
    if (import.meta.env.VITE_GITHUB_REPO_OWNER && 
        import.meta.env.VITE_GH_PAT && 
        import.meta.env.VITE_GITHUB_REPO_NAME) {
      
      try {
        const githubResponse = await fetch(
          `https://api.github.com/repos/${import.meta.env.VITE_GITHUB_REPO_OWNER}/${import.meta.env.VITE_GITHUB_REPO_NAME}/actions/workflows/${import.meta.env.VITE_GITHUB_WORKFLOW_FILENAME || 'video-renderer.yml'}/dispatches`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_GH_PAT}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
              ref: 'main',
              inputs: {
                video_id: videoId
              }
            })
          }
        );

        if (!githubResponse.ok) {
          console.warn('Failed to trigger GitHub workflow, but video document created');
        }
      } catch (githubError) {
        console.warn('GitHub workflow trigger failed:', githubError);
      }
    }

    return {
      success: true,
      videoId: videoDocument.$id,
      message: 'Video generation started successfully'
    };

  } catch (error) {
    console.error('Video generation failed:', error);
    throw error;
  }
}

export async function checkVideoStatus(videoId: string): Promise<StatusResponse> {
  try {
    const { getVideo } = await import('./appwrite');
    const video = await getVideo(videoId);
    
    if (!video) {
      return { error: 'Video not found' };
    }
    
    return {
      status: video.status,
      progress: video.progress,
      message: `Video is ${video.status}`,
      video_id: video.$id
    };
  } catch (error) {
    console.error('Status check failed:', error);
    return { error: error instanceof Error ? error.message : 'Status check failed' };
  }
} 