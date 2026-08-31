/*
  # Create Roadmaps Table
  
  1. New Tables
    - `roadmaps`
      - `id` (uuid, primary key)
      - `topic` (text, not null)
      - `data` (jsonb, not null)
      - `user_id` (uuid, not null)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `roadmaps` table
    - Add policies for authenticated users to:
      - Insert their own roadmaps
      - Read their own roadmaps
*/

CREATE TABLE IF NOT EXISTS roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  data jsonb NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own roadmaps"
  ON roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own roadmaps"
  ON roadmaps
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);