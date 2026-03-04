"use client"

import { usePomodoro } from "@/hooks/usePomodoro";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { ModeSelector } from "./ModeSelector";

export const TimerSection = () => {
  const {
    status,
    handleStartTimer,
    handleEndTimer,
    handleToggleTimer,
    handleResetTimer,
    handleSkipTimer,
    remainingTime,
    handleSwitchMode,
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
      <TimerDisplay remainingTime={remainingTime} status={status} />
      <ModeSelector onSwitchMode={handleSwitchMode} />
    </div>
  );
};
