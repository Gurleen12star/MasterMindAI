/*
  # Fix RLS Policies for Learning Paths
  
  1. Changes
    - Drop existing policies that use incorrect type comparison
    - Create new policies using auth.jwt()->>'sub' for proper text comparison with user_id
    - Ensure all policies use authenticated role
  
  2. Security
    - Maintain row-level security
    - Fix type mismatch between auth.jwt()->>'sub' (text) and user_id (text)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can read their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON learning_paths;

-- Create new policies with correct type handling
CREATE POLICY "Users can insert their own learning paths"
ON learning_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can read their own learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update their own learning paths"
ON learning_paths
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id)
WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete their own learning paths"
ON learning_paths
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id);