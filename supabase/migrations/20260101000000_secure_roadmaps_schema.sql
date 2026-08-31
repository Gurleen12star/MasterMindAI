/*
  # Secure Roadmaps Schema and Add Structured Data
  
  1. Changes
    - Add `structured_data` (jsonb) column to `roadmaps` table for Phase 1 structured AI data
    - Make `mermaid_code` nullable to support pure structured data in the future
    - Enable RLS on `roadmaps` (was previously disabled)
  
  2. Security
    - Re-create strict RLS policies using `auth.uid()`
*/

-- Add structured data column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'roadmaps' AND column_name = 'structured_data') THEN
    ALTER TABLE public.roadmaps ADD COLUMN structured_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Make mermaid_code nullable for backward/forward compatibility
ALTER TABLE public.roadmaps ALTER COLUMN mermaid_code DROP NOT NULL;

-- Ensure RLS is strictly enabled
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Drop any existing weak or Clerk-based policies
DROP POLICY IF EXISTS "Users can read own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can insert own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can update own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can delete own roadmaps" ON public.roadmaps;

DROP POLICY IF EXISTS "Users can view their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON public.roadmaps;

-- Create secure policies matching auth.uid()
CREATE POLICY "Users can view their own roadmaps"
  ON public.roadmaps
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own roadmaps"
  ON public.roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own roadmaps"
  ON public.roadmaps
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own roadmaps"
  ON public.roadmaps
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);
