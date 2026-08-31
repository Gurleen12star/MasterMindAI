import { StudentProfile, ProfileFormData } from '@/types/profile';
import { LearningPath } from '@/types/roadmap';

export interface IPersistence {
  fetchProfile(userId: string): Promise<StudentProfile | null>;
  saveProfile(userId: string, email: string, data: ProfileFormData): Promise<StudentProfile>;
  fetchRoadmaps(userId: string): Promise<LearningPath[]>;
  saveRoadmap(userId: string, roadmap: any): Promise<any>;
}

import { DemoPersistence } from './DemoPersistence';
import { SupabasePersistence } from './SupabasePersistence';

export class PersistenceProvider {
  private static instance: IPersistence;

  static initialize(isDemoMode: boolean) {
    if (isDemoMode) {
      this.instance = DemoPersistence;
    } else {
      this.instance = SupabasePersistence;
    }
  }

  static getInstance(): IPersistence {
    if (!this.instance) {
      // Default fallback
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      this.initialize(isDemoMode);
    }
    return this.instance;
  }
}
