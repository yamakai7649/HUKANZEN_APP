"use client"

import { useEffect, useState } from "react";

type Mode = "focus" | "break";
type Status = "idle" | "running" | "paused";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0.2 * 60);
  const [mode, setMode] = useState<Mode>("focus");
  const [status, setStatus] = useState<Status>("idle");

  const getTimeLeft = () => { 
    const time = limit - count;

    if (time <= 0) {
      setCount(0);
      setLimit(5 * 60);
      setMode("break");
      setStatus("idle");
    };

    const minute = Math.floor(time / 60);
    const second = time % 60;

    return `${minute.toString().padStart(2,"0")}:${second.toString().padStart(2,"0")}`;
  }
    
  const timeLeft: string = getTimeLeft();

  const handleReset = () => {
    setCount(0);
    setLimit(25 * 60);
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
      <h1>{timeLeft}</h1>
      <h2>
        {
          mode === "focus" ?
            "作業中"
            :
            "休憩中"
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
}
