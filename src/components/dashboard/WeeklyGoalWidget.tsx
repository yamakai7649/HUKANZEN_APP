"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { WeeklyGoal } from "@/types";
import { formatMinutes } from "@/lib/timeUtils";

interface WeeklyGoalWidgetProps {
  goal: WeeklyGoal | null;
  weekMinutes: number;
  onSave: (targetMinutes: number) => Promise<void>;
}

export function WeeklyGoalWidget({ goal, weekMinutes, onSave }: WeeklyGoalWidgetProps) {
  const [editing, setEditing] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const [saving, setSaving] = useState(false);

  const targetMin = goal?.target_minutes ?? 0;
  const pct = targetMin > 0 ? Math.min(100, Math.round((weekMinutes / targetMin) * 100)) : 0;
  const remaining = Math.max(0, targetMin - weekMinutes);

  const handleSave = async () => {
    const mins = parseInt(inputStr, 10);
    if (isNaN(mins) || mins < 1) return;
    setSaving(true);
    await onSave(mins);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="border border-white/5 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">週間目標</span>
        {!editing ? (
          <button
            onClick={() => { setInputStr(String(targetMin || 600)); setEditing(true); }}
            className="text-white/20 hover:text-white transition-colors"
          >
            <Pencil size={12} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="number"
              min={1}
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="分"
              className="w-20 bg-transparent border-b border-white/30 text-xs text-white text-right focus:outline-none"
            />
            <span className="text-xs text-white/40">分</span>
            <button onClick={handleSave} disabled={saving} className="text-white/60 hover:text-white transition-colors">
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(false)} className="text-white/30 hover:text-white transition-colors">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {targetMin > 0 ? (
        <>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-2xl font-light tabular-nums">{formatMinutes(weekMinutes)}</span>
            <span className="text-xs text-white/30">/ {formatMinutes(targetMin)}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-white/60 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30">
            <span>{pct}% 達成</span>
            {remaining > 0 && <span>残り {formatMinutes(remaining)}</span>}
            {remaining === 0 && <span className="text-green-400">目標達成!</span>}
          </div>
        </>
      ) : (
        <p className="text-sm text-white/20">目標を設定してください</p>
      )}
    </div>
  );
}
