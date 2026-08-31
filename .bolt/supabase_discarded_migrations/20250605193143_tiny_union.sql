/*
  # Learning Paths RLS Policies

  1. Security Changes
    - Enable RLS on learning_paths table
    - Add policies for:
      - Users can read their own learning paths
      - Users can insert their own learning paths
      - Users can update their own learning paths
      - Users can delete their own learning paths
*/

-- Enable RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies
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

CREATE POLICY "Users can update own learning paths"
ON learning_paths
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own learning paths"
ON learning_paths
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);