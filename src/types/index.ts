export interface Profile {
  id: string;
  username: string;
  profile_picture: string;
  desc: string;
  streak: number;
  last_active_date: string | null;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TimeLog {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  duration_minutes: number;
  note: string | null;
  logged_at: string;
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface TimeLogWithCategory extends TimeLog {
  category: Category | null;
}

export interface WeeklyGoal {
  id: string;
  user_id: string;
  target_minutes: number;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  todayCount: number;
}
