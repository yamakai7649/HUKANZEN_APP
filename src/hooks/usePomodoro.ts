import { useState } from "react";
import { Mode, Status } from "@/types/timer";

const POMODORO_TIME = 0.3 * 60 * 1000;
const SHORT_BREAK_TIME = 0.2 * 60 * 1000;
const LONG_BREAK_TIME = 25 * 60 * 1000;

export const usePomodoro = () => {
    const [duration, setDuration] = useState<number>(POMODORO_TIME);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [snapshotTime, setSnapshotTime] = useState<number>(duration);
    const [mode, setMode] = useState<Mode>("pomodoro");
    const [status, setStatus] = useState<Status>("pending");
    
    const switchMode = (nextMode?: Mode) => {
        const currentMode = nextMode ? nextMode : (mode === "pomodoro" ? "shortBreak" : "pomodoro");
        setMode(currentMode);

        const TIME_MAP: Record<Mode, number> = {
            pomodoro: POMODORO_TIME,
            shortBreak: SHORT_BREAK_TIME,
            longBreak: LONG_BREAK_TIME,
        };
    
        setDuration(TIME_MAP[currentMode]);
        setSnapshotTime(TIME_MAP[currentMode]);
        setStartTime(null);
        setStatus("pending");
    };

    const switchStatus = (nextStatus: Status) => {
        setStatus(nextStatus);
    };

    const handleStartTimer = () => {
        switchStatus("running");
        setStartTime(Date.now());
    };

    const handleEndTimer = () => {
        switchStatus("pending");
        switchMode();
    };
    
    const handleToggleTimer = () => {
        if (status === "running" || status === "overtime") {
            // 💡 一時停止した「今この瞬間」の残り時間を、写真に撮って残す（スナップショット）！
            if (startTime !== null) {
                setSnapshotTime(snapshotTime - (Date.now() - startTime));
            }
            setStartTime(null);
            switchStatus("paused");
        } else {
            // 再開する時はスタート時間を記録するだけ
            switchStatus("running");
            setStartTime(Date.now());
        }
    };
    
    const handleResetTimer = () => {
        setStartTime(null);
        setSnapshotTime(duration); // リセット時は初期値（25分）の写真を残す
        setStatus("pending");
    };
    
    const handleSkipTimer = () => {
        switchMode();
    };
    
    const handleSwitchMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        switchMode(e.currentTarget.value as Mode);
    };

    const handleTimeUp = () => {
    if (mode === "pomodoro") {
        switchStatus("overtime"); // 残業モード突入！
    } else {
        switchMode(); // 休憩終わり！次のモードへ
    }
};
    
    return {
        status,
        startTime,
        snapshotTime,
        handleStartTimer,
        handleEndTimer,
        handleToggleTimer,
        handleResetTimer,
        handleSkipTimer,
        handleSwitchMode,
        handleTimeUp,
    };
};
