export interface AdminSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalLearningSessions: number;
  totalRoadmaps: number;
  totalResearchReports: number;
  activeUsers: number;
}

export interface AdminUserData {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  last_active?: string;
  created_at: string;
}

export interface AdminLearningSession {
  id: string;
  user_id: string;
  user_email?: string;
  topic: string;
  personality: string;
  module_count: number;
  created_at: string;
}

export interface AdminFeedback {
  id: string;
  user_id: string;
  rating: number;
  feedback: string;
  category: string;
  created_at: string;
}

export interface AdminActionResult {
  success: boolean;
  message: string;
  data?: any;
}