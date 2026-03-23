"use client";

import { useState } from "react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NavIcons } from "./NavIcons";
import { ModeButtons } from "./ModeButtons";
import { TimerControls } from "./TimerControls";
import { TimerTicker } from "./TimerTicker";
import { ReportModal } from "@/components/report/ReportModal";

export function TimerSection() {
  const [isReportOpen, setIsReportOpen] = useState(false);
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
  } = usePomodoro();

  const isRunning = status === "running" || status === "overtime";

  return (
    <div
      className="relative flex flex-col items-center justify-center w-screen h-screen bg-black text-white overflow-hidden cursor-none [&_button]:cursor-none [&_a]:cursor-none"
    >
      <CustomCursor />
      <NavIcons onOpenReport={() => setIsReportOpen(true)} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <ModeButtons mode={mode} onSwitchMode={handleSwitchMode} />
      <TimerTicker
        status={status}
        startTime={startTime}
        snapshotTime={snapshotTime}
        duration={duration}
        onTimeUp={handleTimeUp}
      />
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
};
