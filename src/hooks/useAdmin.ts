import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialAdmin, setIsInitialAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.id) {
      checkAdminStatus();
    } else {
      setIsLoading(false);
      setIsAdmin(false);
    }
  }, [user?.id]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      // First check if this is the specified admin email
      if (user?.email === 'naik97059@gmail.com') {
        setIsInitialAdmin(true);
      }
      
      // Then check if user has admin flag in their profile
      const { data, error } = await supabase
        .from('student_profiles')
        .select('is_admin')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else if (data) {
        setIsAdmin(!!data.is_admin);
      } else if (user?.email === 'naik97059@gmail.com') {
        // If no profile exists but this is the initial admin email
        // We'll set up this user as an admin
        const { error: setupError } = await setupInitialAdmin();
        if (setupError) {
          console.error('Error setting up initial admin:', setupError);
        } else {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error in admin check:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupInitialAdmin = async () => {
    if (!user?.id || !user?.email || user.email !== 'naik97059@gmail.com') {
      return { error: 'Not authorized to be initial admin' };
    }

    try {
      // Check if user has a profile, if not create one with admin flag
      const { data: existingProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Just update the profile to have admin flag
        return await supabase
          .from('student_profiles')
          .update({ is_admin: true })
          .eq('user_id', user.id);
      } else {
        // Create a basic profile with admin flag
        return await supabase
          .from('student_profiles')
          .insert({
            user_id: user.id,
            first_name: 'Admin',
            last_name: 'User',
            email: user.email,
            is_admin: true,
            education_level: 'professional',
            learning_style: 'visual',
            preferred_difficulty: 'advanced',
            programming_experience: 'advanced',
            profile_completed: true,
            onboarding_completed: true
          });
      }
    } catch (error) {
      console.error('Error in setupInitialAdmin:', error);
      return { error };
    }
  };

  const logAdminActivity = async (action: string, entityType: string, entityId?: string, details?: any) => {
    if (!isAdmin || !user?.id) return;

    try {
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_id: user.id,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          details: details || null
        });
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  };

  return {
    isAdmin,
    isLoading,
    isInitialAdmin,
    logAdminActivity
  };
}