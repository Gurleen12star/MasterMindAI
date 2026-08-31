/*
  # Create personalized learning sessions table

  1. New Tables
    - `personalized_learning_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth user)
      - `topic` (text)
      - `personality` (text)
      - `modules_data` (jsonb)
      - `generation_history` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `personalized_learning_sessions` table
    - Add policies for authenticated users to manage their own sessions
*/

-- Create personalized_learning_sessions table
CREATE TABLE IF NOT EXISTS public.personalized_learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  topic text NOT NULL,
  personality text NOT NULL,
  modules_data jsonb DEFAULT '[]'::jsonb,
  generation_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on personalized_learning_sessions
ALTER TABLE public.personalized_learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for personalized_learning_sessions
CREATE POLICY "Users can insert their own personalized learning sessions"
  ON public.personalized_learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own personalized learning sessions"
  ON public.personalized_learning_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own personalized learning sessions"
  ON public.personalized_learning_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own personalized learning sessions"
  ON public.personalized_learning_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personalized_learning_sessions_user_id ON public.personalized_learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_learning_sessions_created_at ON public.personalized_learning_sessions(created_at DESC);

-- Add trigger to automatically update updated_at (assuming update_updated_at_column function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_personalized_learning_sessions_updated_at
        BEFORE UPDATE ON public.personalized_learning_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;