export interface User {
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
