import { useState, useEffect } from 'react';
import { VideoDocument, SceneDocument, client, DATABASE_ID, VIDEOS_COLLECTION_ID, SCENES_COLLECTION_ID } from '../lib/appwrite';
import { RealtimeResponseEvent } from 'appwrite';

export function useVideoStatus(videoId: string | null) {
  const [video, setVideo] = useState<VideoDocument | null>(null);
  const [scenes, setScenes] = useState<SceneDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    setIsLoading(true);

    // Subscribe to video updates
    const videoChannel = `databases.${DATABASE_ID}.collections.${VIDEOS_COLLECTION_ID}.documents.${videoId}`;
    const unsubscribeVideo = client.subscribe(
      videoChannel,
      (response: RealtimeResponseEvent<VideoDocument>) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update') || 
            response.events.includes('databases.*.collections.*.documents.*.create')) {
          setVideo(response.payload);
          setIsLoading(false);
        }
      }
    );

    // Subscribe to scene updates
    const sceneChannel = `databases.${DATABASE_ID}.collections.${SCENES_COLLECTION_ID}.documents`;
    const unsubscribeScenes = client.subscribe(
      sceneChannel,
      (response: RealtimeResponseEvent<SceneDocument>) => {
        if (response.payload.video_id === videoId) {
          setScenes(prev => {
            const existingIndex = prev.findIndex(s => s.$id === response.payload.$id);
            if (existingIndex >= 0) {
              const newScenes = [...prev];
              newScenes[existingIndex] = response.payload;
              return newScenes;
            }
            return [...prev, response.payload].sort((a, b) => a.scene_number - b.scene_number);
          });
        }
      }
    );

    return () => {
      unsubscribeVideo();
      unsubscribeScenes();
      setIsLoading(false);
    };
  }, [videoId]);

  return { video, scenes, isLoading };
} 