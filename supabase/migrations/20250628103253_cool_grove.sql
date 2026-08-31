/*
  # Student Mentors System

  1. New Tables
    - `student_mentors`
      - `id` (uuid, primary key)
      - `mentor_id` (text, references student_profiles.user_id)
      - `student_id` (text, references student_profiles.user_id)
      - `status` (enum: active, pending, inactive, declined)
      - `subjects` (jsonb array of subjects the mentor helps with)
      - `notes` (text, for mentor/student to record session notes)
      - `meeting_schedule` (jsonb, to track scheduled sessions)
      - `created_at` (timestamptz, when relationship was created)
      - `updated_at` (timestamptz, last updated timestamp)
    - `mentor_applications`
      - `id` (uuid, primary key)
      - `user_id` (text, references student_profiles.user_id)
      - `application_status` (enum: pending, approved, rejected)
      - `subjects` (jsonb array of subjects they can mentor)
      - `experience` (text, describing teaching/mentoring experience)
      - `created_at` (timestamptz, when application was submitted)
      - `updated_at` (timestamptz, when application status was updated)
  
  2. Security
    - Enable RLS on both tables
    - Create appropriate policies for data access
      - Students can only see their own mentor relationships
      - Mentors can only see their assigned students
      - Admins can view and manage all relationships
*/

-- Create mentor relationship status type
CREATE TYPE mentor_relationship_status AS ENUM ('active', 'pending', 'inactive', 'declined');

-- Create mentor application status type
CREATE TYPE mentor_application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create student_mentors table
CREATE TABLE IF NOT EXISTS student_mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text NOT NULL REFERENCES student_profiles(user_id),
  student_id text NOT NULL REFERENCES student_profiles(user_id),
  status mentor_relationship_status NOT NULL DEFAULT 'pending',
  subjects jsonb DEFAULT '[]'::jsonb,
  notes text,
  meeting_schedule jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique mentor-student pairs
  CONSTRAINT unique_mentor_student_pair UNIQUE (mentor_id, student_id)
);

-- Create mentor_applications table
CREATE TABLE IF NOT EXISTS mentor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES student_profiles(user_id),
  application_status mentor_application_status NOT NULL DEFAULT 'pending',
  subjects jsonb DEFAULT '[]'::jsonb,
  experience text,
  hourly_rate numeric(10,2),
  availability jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one active application per user
  CONSTRAINT unique_user_application UNIQUE (user_id)
);

-- Create update triggers for timestamp management
CREATE TRIGGER update_student_mentors_updated_at
BEFORE UPDATE ON student_mentors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_applications_updated_at
BEFORE UPDATE ON mentor_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_mentors_mentor_id ON student_mentors(mentor_id);
CREATE INDEX IF NOT EXISTS idx_student_mentors_student_id ON student_mentors(student_id);
CREATE INDEX IF NOT EXISTS idx_student_mentors_status ON student_mentors(status);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_status ON mentor_applications(application_status);

-- Enable Row Level Security
ALTER TABLE student_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_mentors

-- Admins can manage all mentor relationships
CREATE POLICY "Admins can manage all mentor relationships"
  ON student_mentors
  TO authenticated
  USING (is_admin());

-- Students can view their own mentor relationships
CREATE POLICY "Students can view their own mentor relationships"
  ON student_mentors
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id);

-- Mentors can view their assigned students
CREATE POLICY "Mentors can view their assigned students"
  ON student_mentors
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = mentor_id);

-- Only admins can create mentor relationships
CREATE POLICY "Only admins can create mentor relationships"
  ON student_mentors
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admin or the mentor can update a relationship
CREATE POLICY "Only admin or the mentor can update relationships"
  ON student_mentors
  FOR UPDATE
  TO authenticated
  USING (is_admin() OR auth.uid()::text = mentor_id)
  WITH CHECK (is_admin() OR auth.uid()::text = mentor_id);

-- Only admins can delete mentor relationships
CREATE POLICY "Only admins can delete mentor relationships"
  ON student_mentors
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- RLS policies for mentor_applications

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON mentor_applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON mentor_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Users can submit applications
CREATE POLICY "Users can submit applications"
  ON mentor_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update only their pending applications
CREATE POLICY "Users can update their pending applications"
  ON mentor_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id AND application_status = 'pending')
  WITH CHECK (auth.uid()::text = user_id AND application_status = 'pending');

-- Only admins can approve or reject applications
CREATE POLICY "Only admins can approve or reject applications"
  ON mentor_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users can delete their own pending applications
CREATE POLICY "Users can delete their own pending applications"
  ON mentor_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id AND application_status = 'pending');

-- Only admins can delete any application
CREATE POLICY "Admins can delete any application"
  ON mentor_applications
  FOR DELETE
  TO authenticated
  USING (is_admin());