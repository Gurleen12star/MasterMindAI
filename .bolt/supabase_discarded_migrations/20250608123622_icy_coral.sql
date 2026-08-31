/*
  # Create deep research history table

  1. New Tables
    - `deep_research_history`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth users)
      - `topic` (text, the research topic)
      - `report` (text, the generated markdown report)
      - `sources` (jsonb, array of source objects)
      - `summaries` (jsonb, array of summary strings)
      - `total_findings` (integer, number of findings)
      - `max_depth` (integer, research depth used)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `deep_research_history` table
    - Add policy for authenticated users to read/write their own data
*/

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

ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own research history"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own research history"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own research history"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own research history"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deep_research_history_user_id_created_at 
ON deep_research_history(user_id, created_at DESC);