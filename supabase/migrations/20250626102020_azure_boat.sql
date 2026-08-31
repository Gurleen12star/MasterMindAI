/*
  # Add Admin Functionality
  
  1. New Tables
    - `admin_settings` table for global application settings
    - Add `is_admin` column to student_profiles table
  
  2. Security
    - Create admin-specific RLS policies for content management
    - Enable admin access to view all users' data
  
  3. Changes
    - Update student_profiles to track admin status
    - Set initial admin user (naik97059@gmail.com)
*/

-- Add is_admin column to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin_settings table for global application settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  SELECT sp.is_admin INTO is_admin_user
  FROM public.student_profiles sp
  WHERE sp.user_id = auth.uid()::text;
  
  RETURN COALESCE(is_admin_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Only admins can manage settings"
ON public.admin_settings
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create admin-specific policies for student_profiles
CREATE POLICY "Admins can view all profiles"
ON public.student_profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create admin-specific policies for personalized_learning_sessions
CREATE POLICY "Admins can view all learning sessions"
ON public.personalized_learning_sessions
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create admin-specific policies for deep_research_history
CREATE POLICY "Admins can view all research history"
ON public.deep_research_history
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create admin-specific policies for roadmaps
CREATE POLICY "Admins can view all roadmaps"
ON public.roadmaps
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create admin-specific policies for learning_paths
CREATE POLICY "Admins can view all learning paths"
ON public.learning_paths
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create table for admin activity logs
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_activity_logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Only admins can view activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (public.is_admin());

-- Only admins can insert logs
CREATE POLICY "Only admins can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (public.is_admin() AND admin_id = auth.uid()::text);

-- Add trigger for updated_at on admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();