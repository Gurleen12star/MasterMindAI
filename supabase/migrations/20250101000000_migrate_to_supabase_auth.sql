/*
  # Migrate from Clerk Authentication to Supabase Native Authentication
  
  1. Update RLS Policies
    - Replace Clerk JWT claims with Supabase auth.uid()
    - Update all existing policies to work with Supabase Auth
  
  2. Update student_profiles table
    - Ensure RLS policies work correctly with Supabase Auth
  
  3. Security
    - Maintain security while migrating authentication method
*/

-- Update student_profiles RLS policies for Supabase Auth
DROP POLICY IF EXISTS "Users can insert their own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON student_profiles;

-- Recreate student_profiles policies with Supabase auth
CREATE POLICY "Users can insert their own profile"
  ON student_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own profile"
  ON student_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON student_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own profile"
  ON student_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Update deep_research_history RLS policies for Supabase Auth
DROP POLICY IF EXISTS "Users can insert their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete their own deep research history" ON deep_research_history;

-- Recreate deep_research_history policies with Supabase auth
CREATE POLICY "Users can insert their own deep research history"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own deep research history"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own deep research history"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own deep research history"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Update roadmaps RLS policies for Supabase Auth
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can read their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON roadmaps;

-- Recreate roadmaps policies with Supabase auth
CREATE POLICY "Users can insert their own roadmaps"
  ON roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own roadmaps"
  ON roadmaps
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own roadmaps"
  ON roadmaps
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own roadmaps"
  ON roadmaps
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Update learning_paths RLS policies for Supabase Auth
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can read their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON learning_paths;

-- Recreate learning_paths policies with Supabase auth
CREATE POLICY "Users can insert their own learning paths"
  ON learning_paths
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own learning paths"
  ON learning_paths
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own learning paths"
  ON learning_paths
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own learning paths"
  ON learning_paths
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id); 