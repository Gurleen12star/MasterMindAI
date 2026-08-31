/*
  # Fix Deep Research History RLS Policies

  1. Security
    - Enable RLS on `deep_research_history` table (if not already enabled)
    - Add policy for authenticated users to insert their own research history
    - Add policy for authenticated users to read their own research history
    - Add policy for authenticated users to delete their own research history

  2. Changes
    - Ensures users can only access their own deep research history data
    - Prevents unauthorized access to other users' research data
*/

-- Enable RLS on deep_research_history table
ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete own deep research history" ON deep_research_history;

-- Policy for INSERT operations
CREATE POLICY "Users can insert own deep research history"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for SELECT operations
CREATE POLICY "Users can read own deep research history"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for DELETE operations
CREATE POLICY "Users can delete own deep research history"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);