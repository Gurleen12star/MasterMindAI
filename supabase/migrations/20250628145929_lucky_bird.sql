/*
  # Create learning_audio storage bucket

  1. Storage
    - Creates a storage bucket for storing AI-generated audio files
    - Sets up permissions for authenticated users
  2. Security
    - Enables public access to files for sharing
    - Adds policies for authenticated users
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('learning_audio', 'learning_audio', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy for authenticated users to upload audio
CREATE POLICY "Allow authenticated users to upload audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'learning_audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for authenticated users to read audio
CREATE POLICY "Allow authenticated users to read audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'learning_audio');

-- Policy for authenticated users to update their own audio files
CREATE POLICY "Allow authenticated users to update their own audio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'learning_audio' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'learning_audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for authenticated users to delete their own audio files
CREATE POLICY "Allow authenticated users to delete their own audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'learning_audio' AND auth.uid()::text = (storage.foldername(name))[1]);