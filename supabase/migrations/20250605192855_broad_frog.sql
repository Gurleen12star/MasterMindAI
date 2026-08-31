/*
  # Create Learning Paths Table

  1. New Tables
    - `learning_paths`
      - `id` (uuid, primary key)
      - `topic` (text)
      - `mermaid_code` (text)
      - `markdown_content` (text)
      - `level` (text)
      - `user_id` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `learning_paths` table
    - Add policies for authenticated users to:
      - Select their own learning paths
      - Insert their own learning paths
      - Update their own learning paths
      - Delete their own learning paths
*/

-- Create the learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    topic text NOT NULL,
    mermaid_code text NOT NULL,
    markdown_content text NOT NULL,
    level text NOT NULL,
    user_id text NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own learning paths"
    ON public.learning_paths
    FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own learning paths"
    ON public.learning_paths
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own learning paths"
    ON public.learning_paths
    FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own learning paths"
    ON public.learning_paths
    FOR DELETE
    USING (auth.uid()::text = user_id);