export interface MentorApplication {
  id: string;
  user_id: string;
  application_status: 'pending' | 'approved' | 'rejected';
  subjects: string[];
  experience: string;
  hourly_rate: number;
  availability: {
    [key: string]: {
      start: string;
      end: string;
    }[];
  };
  created_at: string;
  updated_at: string;
}

export interface MentorRelationship {
  id: string;
  mentor_id: string;
  student_id: string;
  status: 'active' | 'pending' | 'inactive' | 'declined';
  subjects: string[];
  notes: string;
  meeting_schedule: Array<{
    date: string;
    start_time: string;
    end_time: string;
    topic?: string;
    completed?: boolean;
  }>;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image?: string;
  bio?: string;
  subjects: string[];
  expertise_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hourly_rate: number;
  availability: {
    [key: string]: {
      start: string;
      end: string;
    }[];
  };
  total_sessions: number;
  rating: number;
  is_active: boolean;
}

export interface MentorSearchParams {
  subject?: string;
  expertise_level?: string;
  max_hourly_rate?: number;
  availability_day?: string;
  sort_by?: 'rating' | 'hourly_rate' | 'total_sessions';
  sort_order?: 'asc' | 'desc';
}

export interface SessionRequest {
  id: string;
  mentor_id: string;
  student_id: string;
  proposed_times: Array<{
    date: string;
    start_time: string;
    end_time: string;
  }>;
  topic: string;
  notes: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
}