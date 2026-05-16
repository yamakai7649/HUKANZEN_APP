export type Mode = "pomodoro" | "shortBreak" | "longBreak";
export type Status = "pending" | "running" | "paused" | "overtime";
export type EndReason = "completed" | "skipped" | "reset";

export interface SessionRecord {
  mode: Mode;
  started_at: string;
  ended_at: string;
  duration_ms: number;
  overtime_ms: number;
  end_reason: EndReason;
}

export interface Session extends SessionRecord {
  id: string;
  user_id: string;
  goal_id: string | null;
  created_at: string;
}
