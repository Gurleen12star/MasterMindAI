/*
  # Create Learning Paths Table with RLS

  1. New Tables
    - `learning_paths`
      - `id` (uuid, primary key)
      - `topic` (text, not null)
      - `mermaid_code` (text, not null)
      - `markdown_content` (text, not null)
      - `level` (text, not null)
      - `user_id` (text, not null)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `learning_paths` table
    - Add policies for authenticated users to:
      - Read their own learning paths
      - Insert their own learning paths
*/

CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  mermaid_code text NOT NULL,
  markdown_content text NOT NULL,
  level text NOT NULL,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own learning paths"
  ON learning_paths
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own learning paths"
  ON learning_paths
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);