import { useState,useEffect } from "react";

type Mode = "pomodoro" | "shortBreak" | "longBreak";
type Status =  "running" | "paused";

const POMODORO_TIME = 0.2 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 25 * 60;

export const usePomodoro = () => {
    const [count, setCount] = useState<number>(0);
    const [limit, setLimit] = useState<number>(POMODORO_TIME);
    const [mode, setMode] = useState<Mode>("pomodoro");
    const [status, setStatus] = useState<Status>("paused");
    const remainingTime = limit - count;
    
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
    
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };
    
    const switchMode = (nextMode?: Mode) => {
        const currentMode = nextMode ? nextMode : (mode === "pomodoro" ? "shortBreak" : "pomodoro");
    
        const TIME_MAP: Record<Mode, number> = {
            pomodoro: POMODORO_TIME,
            shortBreak: SHORT_BREAK_TIME,
            longBreak: LONG_BREAK_TIME,
        };
    
        setMode(currentMode);
        setLimit(TIME_MAP[currentMode]);
        setCount(0);
        setStatus("paused");
    };
    
    if (remainingTime <= 0) {
        switchMode();
    };
    
    const handleToggleTimer = (e: React.MouseEvent<HTMLButtonElement>) => {
        setStatus(e.currentTarget.value as Status);
    };
    
    const handleReset = () => {
        setCount(0);
        setStatus("paused");
    };
    
    const handleSkip = () => {
        switchMode();
    };
    
    const handleSwitchMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        switchMode(e.currentTarget.value as Mode);
    };

    useEffect(() => {
        if (status !== "running") return;
    
        const timerId = setInterval(() => setCount(prev => prev + 1), 1000);
    
        return () => {
          clearInterval(timerId);
        };
      }, [status, setCount]);
    
    return {
        status,
        setCount,
        formatTime,
        remainingTime,
        handleToggleTimer,
        handleReset,
        handleSkip,
        handleSwitchMode,
    };
};
