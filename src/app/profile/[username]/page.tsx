"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, LogOut, BarChart2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { User, Goal } from "@/types";
import { Session } from "@/types/timer";
import { ReportModal } from "@/components/report/ReportModal";

interface Stats {
  totalMs: number;
  completedCount: number;
  streak: number;
}

interface GoalBreakdown {
  goal: Goal;
  totalMs: number;
}

function formatMs(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function ProfilePage() {
  const { user: me, loading: authLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [goalBreakdown, setGoalBreakdown] = useState<GoalBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !me) router.push("/login");
  }, [me, authLoading, router]);

  useEffect(() => {
    if (!username || !me) return;

    const load = async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (!p) { setLoading(false); return; }
      setProfile(p as User);

      // Stats via security-definer function (works for any user)
      const { data: statsRows } = await supabase.rpc("get_user_stats", { p_user_id: p.id });
      if (statsRows?.[0]) {
        setStats({
          totalMs: Number(statsRows[0].total_ms),
          completedCount: Number(statsRows[0].completed_count),
          streak: statsRows[0].streak,
        });
      }

      // Goal breakdown: only for own profile (RLS allows reading own data)
      if (me.id === p.id) {
        const [{ data: sessions }, { data: goals }] = await Promise.all([
          supabase
            .from("sessions")
            .select("goal_id, duration_ms, overtime_ms")
            .eq("user_id", p.id)
            .eq("mode", "pomodoro")
            .eq("end_reason", "completed"),
          supabase
            .from("goals")
            .select("*")
            .eq("user_id", p.id)
            .order("created_at"),
        ]);

        if (sessions && goals) {
          const breakdown: GoalBreakdown[] = (goals as Goal[])
            .map((goal) => ({
              goal,
              totalMs: (sessions as Pick<Session, "goal_id" | "duration_ms" | "overtime_ms">[])
                .filter((s) => s.goal_id === goal.id)
                .reduce((sum, s) => sum + s.duration_ms + s.overtime_ms, 0),
            }))
            .filter((b) => b.totalMs > 0)
            .sort((a, b) => b.totalMs - a.totalMs);
          setGoalBreakdown(breakdown);
        }
      }

      setLoading(false);
    };

    load().catch(console.error);
  }, [username, me]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (authLoading || !me) return null;

  const maxGoalMs = goalBreakdown[0]?.totalMs ?? 1;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-lg mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={18} strokeWidth={1.5} />
            </Link>
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/60">Profile</h1>
          </div>
          {me.username === username && (
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-white/30 text-xs tracking-widest text-center">LOADING...</p>
        ) : !profile ? (
          <p className="text-white/30 text-xs tracking-widest text-center">USER NOT FOUND</p>
        ) : (
          <>
            {/* User info */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl tracking-widest font-light">{profile.username}</h2>
              {profile.desc && (
                <p className="text-white/40 text-sm">{profile.desc}</p>
              )}
              {(stats?.streak ?? 0) > 0 && (
                <div className="flex items-center gap-2 mt-1 text-orange-400">
                  <Flame size={14} />
                  <span className="text-sm">{stats?.streak} day streak</span>
                </div>
              )}
            </div>

            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-[10px] text-white/30 tracking-widest mb-2">TOTAL</p>
                  <p className="text-xl font-light tabular-nums">{formatMs(stats.totalMs)}</p>
                </div>
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-[10px] text-white/30 tracking-widest mb-2">SESSIONS</p>
                  <p className="text-xl font-light tabular-nums">{stats.completedCount}</p>
                </div>
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-[10px] text-white/30 tracking-widest mb-2">STREAK</p>
                  <p className="text-xl font-light tabular-nums">{stats.streak}</p>
                </div>
              </div>
            )}

            {/* Goal breakdown (own profile only) */}
            {goalBreakdown.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-white/40">Goals</h3>
                <div className="flex flex-col gap-3">
                  {goalBreakdown.map(({ goal, totalMs }) => (
                    <div key={goal.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="text-xs text-white/70">{goal.name}</span>
                        </div>
                        <span className="text-xs text-white/40 tabular-nums">{formatMs(totalMs)}</span>
                      </div>
                      <div className="h-px bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(totalMs / maxGoalMs) * 100}%`,
                            backgroundColor: goal.color,
                            opacity: 0.6,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report button (own profile only) */}
            {me.id === profile.id && (
              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs tracking-widest uppercase"
              >
                <BarChart2 size={14} strokeWidth={1.5} />
                View Report
              </button>
            )}
          </>
        )}
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
}
