"use client";

import { memo } from "react";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

type TimerControlsProps = {
  isRunning: boolean;
  onToggle: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export const TimerControls = memo(function TimerControls({
  isRunning,
  onToggle,
  onSkip,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="fixed bottom-[40px] right-[40px] z-50 flex flex-col items-center gap-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-[40px] h-[40px] text-white hover:text-gray-400 transition-colors duration-300"
      >
        {isRunning ? (
          <Pause size={24} strokeWidth={2} />
        ) : (
          <Play size={24} strokeWidth={2} className="ml-1" />
        )}
      </button>
      <button
        onClick={onSkip}
        className="flex items-center justify-center w-[40px] h-[40px] text-white hover:text-gray-400 transition-colors duration-300"
      >
        <FastForward size={24} strokeWidth={2} />
      </button>
      <button
        onClick={onReset}
        className="flex items-center justify-center w-[40px] h-[40px] text-white hover:text-gray-400 transition-colors duration-300"
      >
        <RotateCcw size={24} strokeWidth={2} />
      </button>
    </div>
  );
});
