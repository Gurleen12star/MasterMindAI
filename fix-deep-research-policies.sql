-- Fix Deep Research Authentication Issues
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- First, check if the table exists and create if needed
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

-- Drop ALL existing policies for deep_research_history (to handle any naming variations)
DROP POLICY IF EXISTS "Users can insert their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can insert own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can insert own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete own research history" ON deep_research_history;

-- Create new policies with Clerk JWT support
CREATE POLICY "clerk_insert_deep_research"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "clerk_read_deep_research"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "clerk_update_deep_research"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "clerk_delete_deep_research"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deep_research_history_user_id_created_at 
ON deep_research_history(user_id, created_at DESC);

-- Test the policies work by checking if they're properly configured
-- This query should return the new policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history'; 