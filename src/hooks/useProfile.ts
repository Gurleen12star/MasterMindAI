import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabaseClient } from '@/lib/supabase-admin';
import { StudentProfile, ProfileFormData } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

export function useProfile() {
  const { user } = useUser();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (profileData: ProfileFormData) => {
    if (!user?.id) return false;

    try {
      setIsSaving(true);
      
      const profilePayload = {
        ...profileData,
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || profileData.email,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseClient
        .from('student_profiles')
        .upsert(profilePayload, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: 'Profile Saved',
        description: 'Your profile has been updated successfully!',
      });
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const isProfileComplete = (profile: StudentProfile | null): boolean => {
    if (!profile) return false;
    
    const requiredFields = [
      'first_name',
      'last_name',
      'education_level',
      'learning_style',
      'preferred_difficulty',
      'programming_experience'
    ];
    
    return requiredFields.every(field => 
      profile[field as keyof StudentProfile] !== undefined && 
      profile[field as keyof StudentProfile] !== ''
    );
  };

  return {
    profile,
    isLoading,
    isSaving,
    saveProfile,
    fetchProfile,
    isProfileComplete: isProfileComplete(profile),
    needsProfileSetup: !profile || !isProfileComplete(profile),
  };
}