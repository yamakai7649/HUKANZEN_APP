"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Session } from "@/types/timer";
import { Period, formatDuration, getPeriodRange, getDayLabel } from "./reportUtils";
import { BarChart } from "./BarChart";

type ReportViewProps = {
  sessions: Session[];
  onClose: () => void;
}

export function ReportView({ sessions, onClose }: ReportViewProps) {
  const [period, setPeriod] = useState<Period>("day");
  const [offset, setOffset] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleSetPeriod = (p: Period) => {
    setPeriod(p);
    setOffset(0);
  };

  const goToPrev = () => {
    setDirection(-1);
    setOffset((o) => o - 1);
  };

  const goToNext = () => {
    setDirection(1);
    setOffset((o) => o + 1);
  };

  const { start, end, label } = useMemo(() => getPeriodRange(period, offset), [period, offset]);

  const filtered = useMemo(() => {
    return sessions.filter(
      (s) => s.mode === "pomodoro" && new Date(s.started_at) >= start && new Date(s.started_at) < end
    );
  }, [sessions, start, end]);

  const totalFocusMs = filtered.reduce((sum, s) => sum + s.duration_ms + s.overtime_ms, 0);
  const completedCount = filtered.filter((s) => s.end_reason === "completed").length;
  const skippedCount = filtered.filter((s) => s.end_reason === "skipped").length;
  const resetCount = filtered.filter((s) => s.end_reason === "reset").length;

  const chartData = useMemo(() => {
    if (period === "day") {
      return Array.from({ length: 24 }, (_, h) => ({
        label: `${h}`,
        focusMs: filtered
          .filter((s) => new Date(s.started_at).getHours() === h)
          .reduce((sum, s) => sum + s.duration_ms + s.overtime_ms, 0),
      }));
    } else if (period === "week") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((lbl, i) => ({
        label: lbl,
        focusMs: filtered
          .filter((s) => {
            const d = new Date(s.started_at).getDay();
            return (d === 0 ? 6 : d - 1) === i;
          })
          .reduce((sum, s) => sum + s.duration_ms + s.overtime_ms, 0),
      }));
    } else {
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => ({
        label: `${i + 1}`,
        focusMs: filtered
          .filter((s) => {
            const d = new Date(s.started_at);
            return d.getFullYear() === start.getFullYear() && d.getMonth() === start.getMonth() && d.getDate() === i + 1;
          })
          .reduce((sum, s) => sum + s.duration_ms + s.overtime_ms, 0),
      }));
    }
  }, [filtered, period, start]);

  const recentSessions = filtered.slice(0, 10);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 text-xs tracking-widest uppercase"
          >
            <ArrowLeft size={14} />
            Timer
          </button>
          <span className="text-xs tracking-[0.4em] text-white/30 uppercase">Report</span>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-6 border-b border-white/10">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => handleSetPeriod(p)}
              className={`text-xs tracking-[0.3em] uppercase pb-3 transition-all duration-300 border-b-2 ${
                period === p ? "text-white border-white" : "text-white/30 border-transparent hover:text-white/60"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Period Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={goToPrev} className="text-white/40 hover:text-white transition-colors duration-300">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm tracking-widest text-white/60">{label}</span>
          <button
            onClick={goToNext}
            disabled={offset === 0}
            className="text-white/40 hover:text-white transition-colors duration-300 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${period}-${offset}`}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir < 0 ? -40 : 40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-10"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 rounded-lg p-5">
                <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">Focus Time</div>
                <div className="text-3xl font-light">{formatDuration(totalFocusMs)}</div>
              </div>
              <div className="border border-white/10 rounded-lg p-5">
                <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">Completed</div>
                <div className="text-3xl font-light">{completedCount}</div>
                <div className="text-[10px] text-white/30 mt-1">
                  {skippedCount > 0 && `${skippedCount} skipped`}
                  {skippedCount > 0 && resetCount > 0 && "  "}
                  {resetCount > 0 && `${resetCount} reset`}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="border border-white/10 rounded-lg p-5">
              <BarChart data={chartData} />
            </div>

            {/* Recent Sessions */}
            <div>
              <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">Sessions</div>
              {recentSessions.length === 0 ? (
                <div className="text-white/20 text-sm">No sessions.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentSessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border border-white/5 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-white/30" />
                        <span className="text-xs text-white/60">{getDayLabel(s.started_at)}</span>
                        <span
                          className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                            s.end_reason === "completed" ? "border-white/20 text-white/60" : "border-white/10 text-white/30"
                          }`}
                        >
                          {s.end_reason}
                        </span>
                      </div>
                      <div className="text-sm font-light">
                        {formatDuration(s.duration_ms + s.overtime_ms)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
