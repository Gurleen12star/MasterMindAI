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
      const isInitialAdminEmail = user?.email === 'naik97059@gmail.com';
      setIsInitialAdmin(isInitialAdminEmail);
      
      // Then check if user has admin flag in their profile
      // Use maybeSingle instead of single to avoid errors when no profile exists
      const { data, error } = await supabase
        .from('student_profiles')
        .select('is_admin')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        if (isInitialAdminEmail) {
          await setupInitialAdmin();
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else if (data && data.is_admin) {
        // Profile exists and has admin flag
        setIsAdmin(true);
      } else if (isInitialAdminEmail) {
        // This is the initial admin email, but profile doesn't exist
        // or doesn't have admin flag set yet
        const { error: setupError } = await setupInitialAdmin();
        if (setupError) {
          console.error('Error setting up initial admin:', setupError);
          toast({
            title: 'Admin Setup Failed',
            description: 'There was an error setting up admin privileges.',
            variant: 'destructive',
          });
        } else {
          setIsAdmin(true);
        }
      } else {
        // Not an admin
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error in admin check:', error);
      // If this is the initial admin email, try to set up admin even if there was an error
      if (user?.email === 'naik97059@gmail.com') {
        const { error: setupError } = await setupInitialAdmin();
        if (!setupError) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setupInitialAdmin = async () => {
    if (!user?.id || !user?.email || user.email !== 'naik97059@gmail.com') {
      return { error: new Error('Not authorized to be initial admin') };
    }

    try {
      console.log('Setting up initial admin for:', user.email);
      
      // Check if user has a profile, if not create one with admin flag
      const { data: existingProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id.toString())
        .maybeSingle();

      if (existingProfile) {
        // Just update the profile to have admin flag
        return await supabase
          .from('student_profiles')
          .update({ is_admin: true })
          .eq('user_id', user.id.toString());
      } else {
        // Create a basic profile with admin flag
        return await supabase
          .from('student_profiles')
          .insert({
            user_id: user.id.toString(),
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
      return { error: error instanceof Error ? error : new Error('Unknown error in setupInitialAdmin') };
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