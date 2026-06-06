"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

interface RankEntry {
  user_id: string;
  username: string;
  streak: number;
  total_ms: number;
  count: number;
}

function formatMs(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function RankingPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("get_weekly_ranking")
      .then(({ data, error }) => {
        if (error) console.error(error);
        if (data) setRanking(data as RankEntry[]);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <h1 className="text-xs tracking-[0.4em] uppercase text-white/60">
            Weekly Ranking
          </h1>
        </div>

        {loading ? (
          <p className="text-white/30 text-xs tracking-widest text-center">LOADING...</p>
        ) : ranking.length === 0 ? (
          <p className="text-white/30 text-xs tracking-widest text-center">NO DATA YET</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {ranking.map((entry, i) => (
              <li key={entry.user_id} className="flex items-center gap-5">
                <span className="w-6 text-right text-xs text-white/30 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm tracking-wider">{entry.username}</span>
                    {entry.streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-400">
                        <Flame size={12} />
                        {entry.streak}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/50 tabular-nums">
                    {formatMs(Number(entry.total_ms))}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
