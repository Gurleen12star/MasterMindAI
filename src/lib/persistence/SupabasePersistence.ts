import { IPersistence } from './PersistenceProvider';
import { StudentProfile, ProfileFormData } from '@/types/profile';
import { LearningPath } from '@/types/roadmap';
import { supabase } from '@/lib/supabase';

export const SupabasePersistence: IPersistence = {
  async fetchProfile(userId: string): Promise<StudentProfile | null> {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async saveProfile(userId: string, email: string, data: ProfileFormData): Promise<StudentProfile> {
    const profilePayload = {
      ...data,
      user_id: userId,
      email: email || data.email,
      updated_at: new Date().toISOString(),
    };

    const { data: savedData, error } = await supabase
      .from('student_profiles')
      .upsert(profilePayload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return savedData;
  },

  async fetchRoadmaps(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => {
      if (row.structured_data) {
        // New roadmaps store the entire payload in structured_data
        return {
          ...row.structured_data,
          id: row.id,
          created_at: row.created_at,
          mermaid_code: row.structured_data.mermaid_code || row.mermaid_code,
        };
      }
      // Fallback for old roadmaps
      return {
        id: row.id,
        topic: row.title,
        goal: row.title,
        mermaid_code: row.mermaid_code,
        markdown_content: row.markdown_content,
        created_at: row.created_at
      };
    });
  },

  async saveRoadmap(userId: string, roadmap: any): Promise<any> {
    const roadmapPayload = {
      user_id: userId,
      title: roadmap.topic || roadmap.goal,
      mermaid_code: roadmap.mermaid_code,
      markdown_content: roadmap.markdown_content,
      structured_data: roadmap,
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('roadmaps')
      .insert(roadmapPayload)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data.structured_data,
      id: data.id,
      created_at: data.created_at
    };
  },
};
