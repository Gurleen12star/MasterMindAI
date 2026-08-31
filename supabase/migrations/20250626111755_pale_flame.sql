/*
  # Fix Admin View Permissions to Show All Users
  
  1. New Functions
    - Improved `is_admin()` function with better error handling
    - Added debugging functions to help diagnose permission issues
  
  2. Security
    - Ensure admins can properly view all profiles with fixed policies
    - Added diagnostics query to help debug user visibility issues
*/

-- Drop and recreate the is_admin function with improved error handling
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  is_admin_user boolean;
  current_uid text;
BEGIN
  current_uid := auth.uid()::text;
  
  -- Check for null auth.uid() to avoid potential issues
  IF current_uid IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get admin status from profile
  SELECT sp.is_admin INTO is_admin_user
  FROM public.student_profiles sp
  WHERE sp.user_id = current_uid;
  
  -- If no record found, default to false
  RETURN COALESCE(is_admin_user, false);
EXCEPTION
  WHEN OTHERS THEN
    -- In case of any error, log it and return false
    RAISE NOTICE 'Error in is_admin function: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to debug the current user's admin status
CREATE OR REPLACE FUNCTION public.debug_admin_status()
RETURNS TABLE (
  current_user_id text,
  profile_exists boolean,
  is_admin boolean
) AS $$
DECLARE
  current_uid text;
BEGIN
  current_uid := auth.uid()::text;
  
  RETURN QUERY
  SELECT 
    current_uid as current_user_id,
    EXISTS(
      SELECT 1 FROM public.student_profiles 
      WHERE user_id = current_uid
    ) as profile_exists,
    public.is_admin() as is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure to recreate the admin view policy with SECURITY DEFINER attribute
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.student_profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.student_profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- This function sets is_admin=true for a specified user (useful for initial admin setup)
CREATE OR REPLACE FUNCTION public.set_admin_status(user_email text, admin_status boolean)
RETURNS boolean AS $$
DECLARE
  target_user_id text;
  target_profile_id uuid;
BEGIN
  -- Find the user ID from the email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email
  LIMIT 1;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
    RETURN false;
  END IF;
  
  -- Check if user has a profile
  SELECT id INTO target_profile_id 
  FROM public.student_profiles 
  WHERE user_id = target_user_id;
  
  IF target_profile_id IS NULL THEN
    RAISE EXCEPTION 'No profile found for user %', user_email;
    RETURN false;
  END IF;
  
  -- Update the admin status
  UPDATE public.student_profiles
  SET is_admin = admin_status
  WHERE user_id = target_user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error setting admin status: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the initial admin (naik97059@gmail.com) has admin privileges
-- This is a safeguard to make sure there's always at least one admin
DO $$ 
BEGIN
  -- Try to set admin status
  PERFORM public.set_admin_status('naik97059@gmail.com', true);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not automatically set admin status for initial admin: %', SQLERRM;
END $$;