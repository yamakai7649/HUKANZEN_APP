"use client"

import { usePomodoro } from "@/hooks/usePomodoro";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { ModeSelector } from "./ModeSelector";

export const TimerSection = () => {
  const {
    status,
    handleStartEnd,
    handleToggleTimer,
    handleReset,
    handleSkip,
    remainingTime,
    handleSwitchMode,
  } = usePomodoro();
  
  return (
    <div className="flex flex-col h-full">
      <TimerControls
        status={status}
        onStartEnd={handleStartEnd}
        onToggleTimer={handleToggleTimer}
        onReset={handleReset}
        onSkip={handleSkip}
      />
      <TimerDisplay remainingTime={remainingTime} />
      <ModeSelector onSwitchMode={handleSwitchMode} />
    </div>
  );
};
