/*
  # Create student profiles table

  1. New Tables
    - `student_profiles`
      - `id` (uuid, primary key)
      - `user_id` (text, references Clerk user)
      - Personal information fields
      - Academic information fields
      - Learning preferences
      - Goals and interests
      - Experience and background
      - Notification preferences
      - Profile status fields
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `student_profiles` table
    - Add policies for authenticated users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  
  -- Personal Information
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  profile_image text,
  
  -- Academic Information
  education_level text NOT NULL CHECK (education_level IN ('high_school', 'undergraduate', 'graduate', 'postgraduate', 'professional')),
  institution text,
  field_of_study text,
  graduation_year integer,
  current_gpa decimal(3,2),
  
  -- Learning Preferences
  learning_style text NOT NULL CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading_writing', 'mixed')),
  preferred_difficulty text NOT NULL CHECK (preferred_difficulty IN ('beginner', 'intermediate', 'advanced')),
  study_hours_per_week integer,
  preferred_study_time text CHECK (preferred_study_time IN ('morning', 'afternoon', 'evening', 'night', 'flexible')),
  
  -- Goals and Interests
  career_goals jsonb DEFAULT '[]'::jsonb,
  learning_objectives jsonb DEFAULT '[]'::jsonb,
  interests jsonb DEFAULT '[]'::jsonb,
  skills_to_develop jsonb DEFAULT '[]'::jsonb,
  
  -- Experience and Background
  programming_experience text NOT NULL CHECK (programming_experience IN ('none', 'beginner', 'intermediate', 'advanced', 'expert')),
  languages_known jsonb DEFAULT '[]'::jsonb,
  previous_courses jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  
  -- Preferences
  notification_preferences jsonb DEFAULT '{
    "email_notifications": true,
    "push_notifications": true,
    "weekly_progress": true,
    "course_recommendations": true
  }'::jsonb,
  
  -- Profile Status
  profile_completed boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Clerk authentication
CREATE POLICY "Users can insert their own profile"
  ON student_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read their own profile"
  ON student_profiles
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own profile"
  ON student_profiles
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own profile"
  ON student_profiles
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_education_level ON student_profiles(education_level);
CREATE INDEX IF NOT EXISTS idx_student_profiles_programming_experience ON student_profiles(programming_experience);
CREATE INDEX IF NOT EXISTS idx_student_profiles_created_at ON student_profiles(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_student_profiles_updated_at
    BEFORE UPDATE ON student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();