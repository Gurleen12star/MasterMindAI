import { IPersistence } from './PersistenceProvider';
import { StudentProfile, ProfileFormData } from '@/types/profile';
import { LearningPath } from '@/types/roadmap';

const DEMO_PROFILE_KEY = 'mastermind_demo_profile';
const DEMO_ROADMAPS_KEY = 'mastermind_demo_roadmaps';

export const DemoPersistence: IPersistence = {
  async fetchProfile(userId: string): Promise<StudentProfile | null> {
    const stored = sessionStorage.getItem(DEMO_PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },

  async saveProfile(userId: string, email: string, data: ProfileFormData): Promise<StudentProfile> {
    const profilePayload: StudentProfile = {
      ...data,
      id: 'demo-profile-id',
      user_id: userId,
      email: email || data.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as StudentProfile;

    sessionStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profilePayload));
    return profilePayload;
  },

  async fetchRoadmaps(userId: string): Promise<LearningPath[]> {
    const stored = sessionStorage.getItem(DEMO_ROADMAPS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  },

  async saveRoadmap(userId: string, roadmap: any): Promise<any> {
    const stored = sessionStorage.getItem(DEMO_ROADMAPS_KEY);
    let roadmaps = stored ? JSON.parse(stored) : [];
    
    const newRoadmap = {
      ...roadmap,
      id: roadmap.id || crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString()
    };

    roadmaps = [newRoadmap, ...roadmaps];
    sessionStorage.setItem(DEMO_ROADMAPS_KEY, JSON.stringify(roadmaps));
    return newRoadmap;
  }
};
