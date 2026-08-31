/*
  # Add RLS policies for learning paths table

  1. Security Changes
    - Enable RLS on learning_paths table if not already enabled
    - Add policies for:
      - Users can insert their own learning paths
      - Users can read their own learning paths
      - Users can update their own learning paths
      - Users can delete their own learning paths
*/

-- Enable RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Policy for inserting learning paths
CREATE POLICY "Users can insert their own learning paths"
ON learning_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- Policy for reading learning paths
CREATE POLICY "Users can read their own learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Policy for updating learning paths
CREATE POLICY "Users can update their own learning paths"
ON learning_paths
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy for deleting learning paths
CREATE POLICY "Users can delete their own learning paths"
ON learning_paths
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);