/*
  # Mentor Matching System

  1. New Functions
    - `is_mentor()` function to check if a user is an approved mentor
    - `get_matching_mentors()` function to find suitable mentors based on criteria
    - `calculate_mentor_match_score()` function to score mentor-student compatibility

  2. Security
    - Add admin settings for mentor program configuration
    - Add notification triggers for mentor application status changes

  3. Indexes
    - Add additional indexes for performance optimization
*/

-- Function to check if a user is an approved mentor
CREATE OR REPLACE FUNCTION is_mentor() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM mentor_applications
    WHERE user_id = auth.uid()::text
    AND application_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get matching mentors for a student based on criteria
CREATE OR REPLACE FUNCTION get_matching_mentors(
  student_id text,
  subject_filter text DEFAULT NULL,
  max_results integer DEFAULT 10
) 
RETURNS TABLE (
  mentor_id text,
  first_name text,
  last_name text,
  profile_image text,
  subjects jsonb,
  experience text,
  hourly_rate numeric,
  availability jsonb,
  match_score numeric
) AS $$
DECLARE
  student_profile student_profiles;
BEGIN
  -- Get student profile to use for matching
  SELECT * INTO student_profile FROM student_profiles WHERE user_id = student_id;

  -- Return the matching mentors
  RETURN QUERY
  WITH mentor_list AS (
    SELECT 
      m.user_id,
      sp.first_name,
      sp.last_name,
      sp.profile_image,
      m.subjects,
      m.experience,
      m.hourly_rate,
      m.availability,
      calculate_mentor_match_score(
        sp.programming_experience, 
        student_profile.programming_experience,
        sp.learning_style,
        student_profile.learning_style,
        m.subjects, 
        COALESCE(student_profile.interests, '[]'::jsonb)
      ) AS score
    FROM mentor_applications m
    JOIN student_profiles sp ON m.user_id = sp.user_id
    WHERE m.application_status = 'approved'
    AND (subject_filter IS NULL OR 
         EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.subjects) subj 
                WHERE subj ILIKE '%' || subject_filter || '%'))
    AND NOT EXISTS (
      -- Exclude mentors who already have an active or pending relationship with this student
      SELECT 1 FROM student_mentors sm
      WHERE sm.mentor_id = m.user_id
      AND sm.student_id = student_id
      AND sm.status IN ('active', 'pending')
    )
    ORDER BY score DESC
    LIMIT max_results
  )
  SELECT * FROM mentor_list;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate matching score between mentor and student
CREATE OR REPLACE FUNCTION calculate_mentor_match_score(
  mentor_programming_experience text,
  student_programming_experience text,
  mentor_learning_style text,
  student_learning_style text,
  mentor_subjects jsonb,
  student_interests jsonb
) RETURNS numeric AS $$
DECLARE
  experience_score numeric := 0;
  learning_style_score numeric := 0;
  subject_interest_score numeric := 0;
  total_score numeric := 0;
  subject_match_count integer := 0;
BEGIN
  -- Score based on programming experience match
  -- Higher score when mentor is 1-2 levels above student
  CASE 
    WHEN mentor_programming_experience = student_programming_experience THEN experience_score := 3;
    WHEN 
      (mentor_programming_experience = 'intermediate' AND student_programming_experience = 'beginner') OR
      (mentor_programming_experience = 'advanced' AND student_programming_experience = 'intermediate') OR
      (mentor_programming_experience = 'expert' AND student_programming_experience = 'advanced')
    THEN experience_score := 5;
    WHEN
      (mentor_programming_experience = 'advanced' AND student_programming_experience = 'beginner') OR
      (mentor_programming_experience = 'expert' AND student_programming_experience = 'intermediate')
    THEN experience_score := 4;
    WHEN
      (mentor_programming_experience = 'expert' AND student_programming_experience = 'beginner')
    THEN experience_score := 3;
    ELSE experience_score := 2;
  END CASE;
  
  -- Score based on learning style match
  IF mentor_learning_style = student_learning_style THEN
    learning_style_score := 5;
  ELSIF 
    (mentor_learning_style = 'mixed') OR 
    (student_learning_style = 'mixed')
  THEN
    learning_style_score := 4;
  ELSE
    learning_style_score := 2;
  END IF;
  
  -- Score based on subject-interest overlap
  SELECT COUNT(*) INTO subject_match_count
  FROM jsonb_array_elements_text(mentor_subjects) mentor_subj
  JOIN jsonb_array_elements_text(student_interests) student_int
    ON mentor_subj ILIKE '%' || student_int || '%' 
       OR student_int ILIKE '%' || mentor_subj || '%';
  
  IF subject_match_count > 3 THEN
    subject_interest_score := 5;
  ELSIF subject_match_count > 1 THEN
    subject_interest_score := 4;
  ELSIF subject_match_count > 0 THEN
    subject_interest_score := 3;
  ELSE
    subject_interest_score := 1;
  END IF;
  
  -- Calculate total score (weighted average)
  total_score := (experience_score * 0.3) + (learning_style_score * 0.3) + (subject_interest_score * 0.4);
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create admin settings specifically for mentor program
INSERT INTO admin_settings (key, value, description)
VALUES (
  'mentor_program_settings',
  '{
    "max_students_per_mentor": 5,
    "max_mentors_per_student": 2,
    "enable_auto_matching": true,
    "require_admin_approval": true,
    "minimum_mentor_experience": "intermediate",
    "default_meeting_duration": 30
  }'::jsonb,
  'Configuration settings for the mentor matching program'
) ON CONFLICT (key) DO NOTHING;

-- Add some additional indexes to optimize common queries
CREATE INDEX IF NOT EXISTS idx_mentor_applications_subjects ON mentor_applications USING GIN (subjects);
CREATE INDEX IF NOT EXISTS idx_student_profiles_interests ON student_profiles USING GIN (interests);

-- Create a notification function and trigger for mentor application status changes
CREATE OR REPLACE FUNCTION notify_mentor_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_status != OLD.application_status THEN
    INSERT INTO admin_activity_logs(
      admin_id,
      action,
      entity_type,
      entity_id,
      details
    ) VALUES (
      auth.uid()::text,
      CASE
        WHEN NEW.application_status = 'approved' THEN 'approve_mentor'
        WHEN NEW.application_status = 'rejected' THEN 'reject_mentor'
        ELSE 'update_mentor_status'
      END,
      'mentor_application',
      NEW.id::text,
      jsonb_build_object(
        'old_status', OLD.application_status,
        'new_status', NEW.application_status,
        'user_id', NEW.user_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER mentor_application_status_change
AFTER UPDATE OF application_status ON mentor_applications
FOR EACH ROW
EXECUTE FUNCTION notify_mentor_application_status_change();