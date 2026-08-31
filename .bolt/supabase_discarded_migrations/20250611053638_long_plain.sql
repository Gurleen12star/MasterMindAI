/*
  # Fix Deep Research RLS Policies

  1. New Tables
    - Ensures `deep_research_history` table exists with proper structure
    - Adds proper indexes for performance

  2. Security Updates
    - Drops and recreates RLS policies for `deep_research_history` table
    - Updates policies for `roadmaps` and `learning_paths` tables to use Clerk JWT
    - All policies now properly use `(auth.jwt() ->> 'sub')` for Clerk integration

  3. Performance
    - Adds optimized indexes for user queries
*/

-- Create deep_research_history table if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "deep_research_insert_policy" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_select_policy" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_update_policy" ON deep_research_history;
DROP POLICY IF EXISTS "deep_research_delete_policy" ON deep_research_history;
DROP POLICY IF EXISTS "Users can insert their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete their own deep research history" ON deep_research_history;

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
DO $$
BEGIN
  -- Check if roadmaps table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'roadmaps') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can insert own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can read own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can update own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can delete own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can read their own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Users can view their own roadmaps" ON roadmaps;
    DROP POLICY IF EXISTS "Public access policy" ON roadmaps;

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
  END IF;
END $$;

-- Fix existing RLS policies for learning_paths table (update to use Clerk JWT)
DO $$
BEGIN
  -- Check if learning_paths table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'learning_paths') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can insert their own learning paths" ON learning_paths;
    DROP POLICY IF EXISTS "Users can read their own learning paths" ON learning_paths;
    DROP POLICY IF EXISTS "Users can update their own learning paths" ON learning_paths;
    DROP POLICY IF EXISTS "Users can delete their own learning paths" ON learning_paths;
    DROP POLICY IF EXISTS "Users can view their own learning paths" ON learning_paths;

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
  END IF;
END $$;