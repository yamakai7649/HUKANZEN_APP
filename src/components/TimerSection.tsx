"use client"

import { usePomodoro } from "@/hooks/usePomodoro";

export const TimerSection = () => {
  const {
    status,
    formatTime,
    remainingTime,
    handleToggleTimer,
    handleReset,
    handleSkip,
    handleSwitchMode,
  } = usePomodoro();
  
  return (
    <>
      <h1>{formatTime(remainingTime)}</h1>
      <div>
        <button onClick={handleToggleTimer} value={status === "running" ? "paused" : "running"}>{status === "running" ? "一時停止" : "再生"}</button>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handleSkip}>SKIP</button>
      </div>
      <div>
        <button onClick={handleSwitchMode} value="pomodoro">pomodoro</button>
        <button onClick={handleSwitchMode} value="shortBreak">short break</button>
        <button onClick={handleSwitchMode} value="longBreak">long break</button>
      </div>
    </>
  );
};
