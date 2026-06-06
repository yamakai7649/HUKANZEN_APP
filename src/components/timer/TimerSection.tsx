"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Flame } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useUser } from "@/context/UserContext";
import { useSettings } from "@/hooks/useSettings";
import { usePomodoro } from "@/hooks/usePomodoro";
import { supabase } from "@/lib/supabase";
import { Goal } from "@/types";
import { ModeButtons } from "./ModeButtons";
import { TimerControls } from "./TimerControls";
import { TimerTicker } from "./TimerTicker";
import { SettingsModal } from "./SettingsModal";
import { GoalSelector } from "@/components/GoalSelector";
import { SaveSessionModal } from "./SaveSessionModal";

interface TimerSectionProps {
  isGoalOpen: boolean;
  onGoalOpenChange: (v: boolean) => void;
  isSettingsOpen: boolean;
  onSettingsOpenChange: (v: boolean) => void;
}

export function TimerSection({
  isGoalOpen,
  onGoalOpenChange,
  isSettingsOpen,
  onSettingsOpenChange,
}: TimerSectionProps) {
  const { user } = useUser();
  const { settings, updateSettings } = useSettings();

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [completedMinutes, setCompletedMinutes] = useState(0);

  const sessionStartRef = useRef<number | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("streak").eq("id", user.id).single();
    if (data) setStreak(data.streak);
  }, [user]);

  useEffect(() => { fetchStreak(); }, [fetchStreak]);

  const handlePomodoroComplete = useCallback(() => {
    fetchStreak();
    if (user && sessionStartRef.current) {
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60_000);
      setCompletedMinutes(Math.max(1, elapsed));
      setIsSaveOpen(true);
    }
  }, [user, fetchStreak]);

  const {
    mode, duration, status, startTime, snapshotTime,
    handleToggleTimer, handleResetTimer, handleSkipTimer,
    handleSwitchMode, handleTimeUp, handleStartTimer, handleEndTimer,
  } = usePomodoro({
    userId: user?.id ?? "",
    goalId: selectedGoal?.id ?? null,
    pomodoroMin: settings.pomodoroMin,
    shortBreakMin: settings.shortBreakMin,
    longBreakMin: settings.longBreakMin,
    onPomodoroComplete: handlePomodoroComplete,
  });

  const wrappedStart = () => {
    sessionStartRef.current = Date.now();
    handleStartTimer();
  };

  const wrappedEnd = () => {
    if (status !== "pending" && user && sessionStartRef.current) {
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60_000);
      if (elapsed >= 1) {
        setCompletedMinutes(elapsed);
        setIsSaveOpen(true);
      }
    }
    sessionStartRef.current = null;
    handleEndTimer();
  };

  const isRunning = status === "running" || status === "overtime";

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-black text-white overflow-hidden">
      {user && streak !== null && streak > 0 && (
        <div className="absolute top-6 md:top-10 left-6 md:left-10 z-50 flex items-center gap-1.5 text-orange-400">
          <Flame size={16} strokeWidth={1.5} />
          <span className="text-sm tabular-nums">{streak}</span>
        </div>
      )}

      <AnimatePresence>
        {isGoalOpen && user && (
          <GoalSelector
            userId={user.id}
            selectedGoal={selectedGoal}
            onSelect={setSelectedGoal}
            onClose={() => onGoalOpenChange(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onSave={updateSettings}
            onClose={() => onSettingsOpenChange(false)}
          />
        )}
      </AnimatePresence>

      {user && (
        <SaveSessionModal
          isOpen={isSaveOpen}
          durationMinutes={completedMinutes}
          userId={user.id}
          onClose={() => setIsSaveOpen(false)}
        />
      )}

      <ModeButtons mode={mode} onSwitchMode={handleSwitchMode} />

      <TimerTicker
        status={status}
        startTime={startTime}
        snapshotTime={snapshotTime}
        duration={duration}
        onTimeUp={handleTimeUp}
      />

      {selectedGoal && (
        <div className="absolute top-1/2 mt-20 flex items-center gap-2 text-white/40 text-xs tracking-widest">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedGoal.color }} />
          {selectedGoal.name}
        </div>
      )}

      <button
        onClick={status === "pending" ? wrappedStart : wrappedEnd}
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
