"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useUser } from "@/context/UserContext";
import { useSettings } from "@/hooks/useSettings";
import { usePomodoro } from "@/hooks/usePomodoro";
import { supabase } from "@/lib/supabase";
import { Goal } from "@/types";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NavIcons } from "./NavIcons";
import { ModeButtons } from "./ModeButtons";
import { TimerControls } from "./TimerControls";
import { TimerTicker } from "./TimerTicker";
import { SettingsModal } from "./SettingsModal";
import { ReportModal } from "@/components/report/ReportModal";
import { GoalSelector } from "@/components/GoalSelector";

export function TimerSection() {
  const { user } = useUser();
  const { settings, updateSettings } = useSettings();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("streak")
      .eq("id", user.id)
      .single();
    if (data) setStreak(data.streak);
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const {
    mode,
    duration,
    status,
    startTime,
    snapshotTime,
    handleToggleTimer,
    handleResetTimer,
    handleSkipTimer,
    handleSwitchMode,
    handleTimeUp,
    handleStartTimer,
    handleEndTimer,
  } = usePomodoro({
    userId: user?.id ?? "",
    goalId: selectedGoal?.id ?? null,
    pomodoroMin: settings.pomodoroMin,
    shortBreakMin: settings.shortBreakMin,
    longBreakMin: settings.longBreakMin,
    onPomodoroComplete: fetchStreak,
  });

  const isRunning = status === "running" || status === "overtime";

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-black text-white overflow-hidden cursor-none [&_button]:cursor-none [&_a]:cursor-none">
      <CustomCursor />

      {/* Streak — top left */}
      {user && streak !== null && streak > 0 && (
        <div className="absolute top-6 md:top-10 left-6 md:left-10 z-50 flex items-center gap-1.5 text-orange-400">
          <Flame size={16} strokeWidth={1.5} />
          <span className="text-sm tabular-nums">{streak}</span>
        </div>
      )}

      <NavIcons
        onOpenReport={user ? () => setIsReportOpen(true) : undefined}
        onOpenGoals={user ? () => setIsGoalOpen((v) => !v) : undefined}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {user && <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />}

      <AnimatePresence>
        {isGoalOpen && user && (
          <GoalSelector
            userId={user.id}
            selectedGoal={selectedGoal}
            onSelect={setSelectedGoal}
            onClose={() => setIsGoalOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onSave={updateSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      <ModeButtons mode={mode} onSwitchMode={handleSwitchMode} />

      <TimerTicker
        status={status}
        startTime={startTime}
        snapshotTime={snapshotTime}
        duration={duration}
        onTimeUp={handleTimeUp}
      />

      {/* Selected goal badge — below timer */}
      {selectedGoal && (
        <div className="absolute top-1/2 mt-20 flex items-center gap-2 text-white/40 text-xs tracking-widest">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedGoal.color }}
          />
          {selectedGoal.name}
        </div>
      )}

      <button
        onClick={status === "pending" ? handleStartTimer : handleEndTimer}
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-50 text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors duration-500"
      >
        {status === "pending" ? "START" : "END"}
      </button>

      <TimerControls
        isRunning={isRunning}
        onToggle={handleToggleTimer}
        onSkip={handleSkipTimer}
        onReset={handleResetTimer}
      />
    </div>
  );
}
