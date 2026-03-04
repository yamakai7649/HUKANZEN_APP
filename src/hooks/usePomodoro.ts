import { useState, useEffect } from "react";
import { Mode, Status } from "@/types/timer";

const POMODORO_TIME = 0.1 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 25 * 60;

export const usePomodoro = () => {
    const [count, setCount] = useState<number>(0);
    const [limit, setLimit] = useState<number>(POMODORO_TIME);
    const [mode, setMode] = useState<Mode>("pomodoro");
    const [status, setStatus] = useState<Status>("pending");
    const remainingTime = limit - count;
    
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
        setStatus("pending");
    };

    const switchStatus = (nextStatus: Status) => {
        setStatus(nextStatus);
    };

    const handleStartTimer = () => {
        switchStatus("running");
    };

    const handleEndTimer = () => {
        switchStatus("pending");
        switchMode();
    };
    
    const handleToggleTimer = () => {
        if (status === "running" || status === "overtime") {
            switchStatus("paused");
        } else {
            switchStatus("running");
        }
    };
    
    const handleResetTimer = () => {
        setCount(0);
        setStatus("paused");
    };
    
    const handleSkipTimer = () => {
        switchMode();
    };
    
    const handleSwitchMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        switchMode(e.currentTarget.value as Mode);
    };

    if (remainingTime <= 0) {
        if (mode === "pomodoro") {
            if (status === "running") {
                switchStatus("overtime");
            }
        } else {
            switchMode();
        }
    };

    useEffect(() => {
        if (status !== "running" && status !== "overtime") return;
    
        const timerId = setInterval(() => setCount(prev => prev + 1), 1000);
    
        return () => {
            clearInterval(timerId);
        };
    }, [status, setCount]);
    
    return {
        status,
        setCount,
        remainingTime,
        handleStartTimer,
        handleEndTimer,
        handleToggleTimer,
        handleResetTimer,
        handleSkipTimer,
        handleSwitchMode,
    };
};
