import { useState, useEffect } from "react";
import { Status } from "@/types/timer";

export const useTimer = (
    status: Status,
    startTime: number | null,
    snapshotTime: number,
    onTimeUp: () => void
) => {
    
    // 50msごとの心臓の鼓動（現在時刻）
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        if (status !== "running" && status !== "overtime") return;

        const timerId = setInterval(() => {
            const currentNow = Date.now();
            setNow(currentNow);

            // running（カウントダウン中）の時だけ監視する
            if (status === "running" && startTime !== null) {
                const remainingTime = snapshotTime - (currentNow - startTime);
                
                if (remainingTime <= 0) {
                    onTimeUp(); 
                }
            }
        }, 50);

        return () => clearInterval(timerId);
    }, [status, snapshotTime, startTime, onTimeUp]);

    // ────────────────────────────
    // 🔥 あなたの直感が活きる「完璧な計算（派生状態）」
    // ────────────────────────────
    
    // 1. 止まっている時（paused, pending）
    if (status !== "running" && status !== "overtime") {
        // 💡 止まってるなら、親が撮った写真（snapshotTime）をそのまま返すだけ！
        // durationじゃないから、25分にリセットされるバグは起きない！
        return snapshotTime;
    }

    // 2. 走っている時（running）
    if (startTime !== null && now !== null) {
        // nowが古くてマイナスになった時は「0」として扱うことで、逆行を物理的に防ぐ。
        const elapsedTime = Math.max(0, now - startTime);
        // 💡 写真の時間から、さらに「走り始めてから今までの経過時間」を引く！
        return snapshotTime - elapsedTime;
    }

    return snapshotTime;
};
