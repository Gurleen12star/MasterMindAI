/*
  # Fix RLS policies for deep_research_history table

  1. Security Updates
    - Drop existing problematic policies
    - Create new policies that work with current authentication setup
    - Ensure proper user isolation for CRUD operations

  2. Changes
    - Remove old clerk-specific policies that may have conflicts
    - Add simplified policies using auth.uid() for better compatibility
    - Maintain security while fixing the insertion issue
*/

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "deep_research_clerk_insert_fixed" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_clerk_insert_v2" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_clerk_select_v2" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_clerk_update_v2" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_clerk_delete_v2" ON deep_research_history;

-- Create new simplified policies that work with standard Supabase auth
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