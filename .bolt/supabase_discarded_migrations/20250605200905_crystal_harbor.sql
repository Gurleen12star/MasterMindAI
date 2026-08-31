/*
  # Fix RLS policies to use JWT sub claim

  1. Security Changes
    - Drop existing RLS policies for learning_paths and roadmaps tables
    - Create new policies using auth.jwt()->>'sub' instead of auth.uid()::text
    - Enable RLS on both tables
    
  2. Changes
    - Update all policies to use auth.jwt()->>'sub' for user identification
    - Maintain existing CRUD operations but with correct user identification
*/

-- Enable RLS on both tables
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Update policies for learning_paths table
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can read their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON public.learning_paths;

CREATE POLICY "Users can insert their own learning paths"
ON public.learning_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can read their own learning paths"
ON public.learning_paths
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update their own learning paths"
ON public.learning_paths
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id)
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete their own learning paths"
ON public.learning_paths
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id);

-- Update policies for roadmaps table
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON public.roadmaps;

CREATE POLICY "Users can view their own roadmaps"
ON public.roadmaps
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert their own roadmaps"
ON public.roadmaps
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update their own roadmaps"
ON public.roadmaps
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id)
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete their own roadmaps"
ON public.roadmaps
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id);