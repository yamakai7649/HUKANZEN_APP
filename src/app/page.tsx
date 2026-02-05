"use client"

import { useEffect, useState } from "react";

type Mode = "focus" | "break";
type Status = "idle" | "running" | "paused";

const FOCUS_TIME = 0.2 * 60;
const BREAK_TIME = 0.2 * 60;

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(FOCUS_TIME);
  const [mode, setMode] = useState<Mode>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const remainingTime = limit - count;

  if (remainingTime <= 0) {
      setCount(0);
      setLimit(mode === "focus" ? BREAK_TIME : FOCUS_TIME);
      setMode(mode === "focus" ? "break" : "focus");
      setStatus("idle");
  };

  const formatTime = (seconds :number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setCount(0);
    setLimit(mode === "focus" ? FOCUS_TIME : BREAK_TIME);
    setStatus("idle");
  };

  const handleStartTimer = () => setStatus("running");

  const handleToggleTimer = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStatus(e.currentTarget.value as Status);
  };
  
  useEffect(() => {
    if (status !== "running") return;

    const timerId = setInterval(() => setCount(prev => prev + 1), 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [status]);
  
  return (
    <>
      <h1>{formatTime(remainingTime)}</h1>
      <h2>
        {
          mode === "focus" ?
            "作業モード"
            :
            "休憩モード"
        }
      </h2>
      {
        status === "idle" ?
          <button onClick={handleStartTimer}>開始</button>
          :
          <>
            <button onClick={handleToggleTimer} value={status === "running" ? "paused" : "running"}>{status === "running" ? "一時停止" : "再生"}</button>
            <button onClick={handleReset}>リセット</button>
          </>
      }
    </>
  );
};
