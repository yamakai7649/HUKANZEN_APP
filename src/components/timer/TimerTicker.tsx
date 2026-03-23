"use client";

import { useTimer } from "@/hooks/useTimer";
import { Status } from "@/types/timer";
import { CanvasBackground } from "./CanvasBackground";
import { ProgressBorder } from "./ProgressBorder";
import { AnimatedTime } from "./AnimatedTime";

function formatTime(ms: number) {
  const absSeconds = Math.abs(Math.ceil(ms / 1000));
  return {
    minutes: Math.floor(absSeconds / 60).toString().padStart(2, "0"),
    seconds: (absSeconds % 60).toString().padStart(2, "0"),
  };
}

type TimerTickerProps = {
  status: Status;
  startTime: number | null;
  snapshotTime: number;
  duration: number;
  onTimeUp: () => void;
}

export function TimerTicker({
  status,
  startTime,
  snapshotTime,
  duration,
  onTimeUp,
}: TimerTickerProps) {
  const remainingMs = useTimer(status, startTime, snapshotTime, onTimeUp);

  const isRunning = status === "running" || status === "overtime";
  const isCountUp = status === "overtime";
  const progress = Math.max(0, Math.min(1, remainingMs / duration));

  const { minutes, seconds } = formatTime(remainingMs);

  return (
    <>
      <CanvasBackground isRunning={isRunning} progress={progress} />
      <ProgressBorder progress={progress} />
      <div className="relative z-10 flex items-center justify-center w-full -translate-y-4 md:-translate-y-8">
        <AnimatedTime minutes={minutes} seconds={seconds} fontWeight={400} isCountUp={isCountUp} />
      </div>
    </>
  );
}
