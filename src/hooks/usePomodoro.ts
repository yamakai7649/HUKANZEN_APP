import { useState, useEffect } from "react";
import { Mode, Status } from "@/types/timer";
import { useSessionRecorder } from "./useSessionRecorder";

interface UsePomodoroOptions {
  userId: string;
  goalId: string | null;
  pomodoroMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  onPomodoroComplete?: () => void;
}

export const usePomodoro = ({
  userId,
  goalId,
  pomodoroMin,
  shortBreakMin,
  longBreakMin,
  onPomodoroComplete,
}: UsePomodoroOptions) => {
  const getDurationMap = () => ({
    pomodoro: pomodoroMin * 60 * 1000,
    shortBreak: shortBreakMin * 60 * 1000,
    longBreak: longBreakMin * 60 * 1000,
  });

  const [duration, setDuration] = useState<number>(() => pomodoroMin * 60 * 1000);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [snapshotTime, setSnapshotTime] = useState<number>(() => pomodoroMin * 60 * 1000);
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [status, setStatus] = useState<Status>("pending");
  const recorder = useSessionRecorder();

  // Update duration when settings change (only if not running)
  useEffect(() => {
    if (status === "pending") {
      const d = getDurationMap()[mode];
      setDuration(d);
      setSnapshotTime(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodoroMin, shortBreakMin, longBreakMin]);

  const switchMode = (nextMode?: Mode) => {
    const currentMode = nextMode ?? (mode === "pomodoro" ? "shortBreak" : "pomodoro");
    setMode(currentMode);
    const d = getDurationMap()[currentMode];
    setDuration(d);
    setSnapshotTime(d);
    setStartTime(null);
    setStatus("pending");
  };

  const handleStartTimer = () => {
    setStatus("running");
    setStartTime(Date.now());
    recorder.onTimerStart(mode);
  };

  const handleEndTimer = () => {
    if (status !== "pending") {
      recorder.onSessionEnd(mode, "completed", userId, goalId);
      if (mode === "pomodoro") onPomodoroComplete?.();
    }
    switchMode();
  };

  const handleToggleTimer = () => {
    if (status === "running" || status === "overtime") {
      if (startTime !== null) {
        setSnapshotTime(snapshotTime - (Date.now() - startTime));
      }
      setStartTime(null);
      setStatus("paused");
      recorder.onTimerPause();
    } else if (status === "pending") {
      setStatus("running");
      setStartTime(Date.now());
      recorder.onTimerStart(mode);
    } else {
      setStatus("running");
      setStartTime(Date.now());
      recorder.onTimerResume();
    }
  };

  const handleResetTimer = () => {
    if (status !== "pending") {
      recorder.onSessionEnd(mode, "reset", userId, goalId);
    }
    setStartTime(null);
    setSnapshotTime(duration);
    setStatus("pending");
  };

  const handleSkipTimer = () => {
    if (status !== "pending") {
      recorder.onSessionEnd(mode, "skipped", userId, goalId);
    }
    switchMode();
  };

  const handleSwitchMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    switchMode(e.currentTarget.value as Mode);
  };

  const handleTimeUp = () => {
    if (mode === "pomodoro") {
      setStatus("overtime");
      recorder.onOvertimeStart();
    } else {
      recorder.onSessionEnd(mode, "completed", userId, goalId);
      switchMode();
    }
  };

  return {
    mode,
    duration,
    status,
    startTime,
    snapshotTime,
    handleStartTimer,
    handleEndTimer,
    handleToggleTimer,
    handleResetTimer,
    handleSkipTimer,
    handleSwitchMode,
    handleTimeUp,
  };
};
