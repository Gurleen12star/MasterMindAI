export interface StudentProfile {
  id: string;
  user_id: string;
  
  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  profile_image?: string;
  
  // Academic Information
  education_level: 'high_school' | 'undergraduate' | 'graduate' | 'postgraduate' | 'professional';
  institution?: string;
  field_of_study?: string;
  graduation_year?: number;
  current_gpa?: number;
  
  // Learning Preferences
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | 'mixed';
  preferred_difficulty: 'beginner' | 'intermediate' | 'advanced';
  study_hours_per_week?: number;
  preferred_study_time: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  
  // Goals and Interests
  career_goals?: string[];
  learning_objectives?: string[];
  interests?: string[];
  skills_to_develop?: string[];
  
  // Experience and Background
  programming_experience: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  languages_known?: string[];
  previous_courses?: string[];
  certifications?: string[];
  
  // Preferences
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    weekly_progress: boolean;
    course_recommendations: boolean;
  };
  
  // Profile Status
  profile_completed: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData extends Omit<StudentProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}