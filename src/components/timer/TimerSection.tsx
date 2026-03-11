"use client"

import { usePomodoro } from "@/hooks/usePomodoro";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { ModeSelector } from "./ModeSelector";

export const TimerSection = () => {
  const {
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
  } = usePomodoro();
  
  return (
    <div className="flex flex-col h-full">
      <TimerControls
        status={status}
        onStartTimer={handleStartTimer}
        onEndTimer={handleEndTimer}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        onSkipTimer={handleSkipTimer}
      />
      <TimerDisplay status={status} startTime={startTime} snapshotTime={snapshotTime} onTimeUp={handleTimeUp} />
      <ModeSelector onSwitchMode={handleSwitchMode} />
    </div>
  );
};
