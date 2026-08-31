/*
# Add Summaries Table

1. New Tables
  - `summaries`: Stores all generated summaries
    - `id` (uuid, primary key)
    - `user_id` (text, not null)
    - `title` (text, extracted from content)
    - `original_content` (text, for text-based summaries)
    - `pdf_url` (text, for PDF-based summaries)
    - `instructions` (text, optional guidance)
    - `generated_summary` (text, the summary result)
    - `audio_url` (text, optional URL for audio version)
    - `created_at` (timestamp with timezone)
    - `updated_at` (timestamp with timezone)

2. Security
  - Enable RLS on `summaries` table
  - Add policies for authenticated users to manage their summaries
*/

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  original_content text,
  pdf_url text,
  instructions text,
  generated_summary text NOT NULL,
  audio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at DESC);

-- Set up the updated_at column trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_summaries_updated_at
BEFORE UPDATE ON summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
-- Insert policy
CREATE POLICY "Users can insert their own summaries"
ON summaries
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- Select policy
CREATE POLICY "Users can view their own summaries"
ON summaries
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'sub') = user_id);

-- Update policy
CREATE POLICY "Users can update their own summaries"
ON summaries
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- Delete policy
CREATE POLICY "Users can delete their own summaries"
ON summaries
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'sub') = user_id);

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploaded-documents', 'uploaded-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public policy for uploaded-documents bucket
CREATE POLICY "Public access to uploaded-documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'uploaded-documents');