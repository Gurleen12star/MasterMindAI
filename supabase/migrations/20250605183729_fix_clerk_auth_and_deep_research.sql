/*
  # Fix Clerk Authentication Integration and Add Deep Research Table
  
  1. Deep Research Table
    - Create `deep_research_history` table with proper schema
    - Add RLS policies that work with Clerk JWT tokens
  
  2. Fix RLS Policies for Clerk Auth
    - Update all table policies to use Clerk JWT claims
    - Use `auth.jwt() ->> 'sub'` instead of `auth.uid()`
  
  3. Security
    - Enable RLS on all tables
    - Ensure policies work with Clerk authentication
*/

-- Create deep_research_history table
CREATE TABLE IF NOT EXISTS deep_research_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  topic text NOT NULL,
  report text NOT NULL,
  sources jsonb DEFAULT '[]'::jsonb,
  summaries jsonb DEFAULT '[]'::jsonb,
  total_findings integer DEFAULT 0,
  max_depth integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on deep_research_history
ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deep_research_history (Clerk compatible)
CREATE POLICY "Users can insert their own deep research history"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read their own deep research history"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own deep research history"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own deep research history"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deep_research_history_user_id_created_at 
ON deep_research_history(user_id, created_at DESC);

-- Fix existing RLS policies for roadmaps table (update to use Clerk JWT)
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can read their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON roadmaps;

-- Recreate roadmaps policies with Clerk JWT support
CREATE POLICY "Users can insert their own roadmaps"
  ON roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read their own roadmaps"
  ON roadmaps
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own roadmaps"
  ON roadmaps
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own roadmaps"
  ON roadmaps
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Fix existing RLS policies for learning_paths table (update to use Clerk JWT)
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can read their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON learning_paths;

-- Recreate learning_paths policies with Clerk JWT support
CREATE POLICY "Users can insert their own learning paths"
  ON learning_paths
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read their own learning paths"
  ON learning_paths
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own learning paths"
  ON learning_paths
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own learning paths"
  ON learning_paths
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id); 