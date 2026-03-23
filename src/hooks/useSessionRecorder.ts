"use client";

import { useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Mode, EndReason, SessionRecord } from "@/types/timer";

export const useSessionRecorder = () => {
  const sessionStartRef = useRef<Date | null>(null);
  const overtimeStartRef = useRef<Date | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const lastResumedAtRef = useRef<Date | null>(null);

  const onTimerStart = useCallback((mode: Mode) => {
    const now = new Date();
    sessionStartRef.current = now;
    lastResumedAtRef.current = now;
    accumulatedMsRef.current = 0;
    overtimeStartRef.current = null;
    console.log(`[recorder] start: ${mode}`);
  }, []);

  const onTimerPause = useCallback(() => {
    if (lastResumedAtRef.current) {
      accumulatedMsRef.current += Date.now() - lastResumedAtRef.current.getTime();
      lastResumedAtRef.current = null;
    }
  }, []);

  const onTimerResume = useCallback(() => {
    lastResumedAtRef.current = new Date();
  }, []);

  const onOvertimeStart = useCallback(() => {
    overtimeStartRef.current = new Date();
  }, []);

  const onSessionEnd = useCallback(async (mode: Mode, endReason: EndReason) => {
    if (!sessionStartRef.current) return;

    const now = new Date();

    if (lastResumedAtRef.current) {
      accumulatedMsRef.current += now.getTime() - lastResumedAtRef.current.getTime();
    }

    const overtimeMs = overtimeStartRef.current
      ? now.getTime() - overtimeStartRef.current.getTime()
      : 0;

    const record: SessionRecord = {
      mode,
      started_at: sessionStartRef.current.toISOString(),
      ended_at: now.toISOString(),
      duration_ms: Math.max(0, accumulatedMsRef.current - overtimeMs),
      overtime_ms: overtimeMs,
      end_reason: endReason,
    };

    // リセット
    sessionStartRef.current = null;
    lastResumedAtRef.current = null;
    overtimeStartRef.current = null;
    accumulatedMsRef.current = 0;

    console.log("[recorder] save:", record);

    const { error } = await supabase.from("pomodoro_sessions").insert(record);
    if (error) console.error("[recorder] failed:", error);
  }, []);

  return { onTimerStart, onTimerPause, onTimerResume, onOvertimeStart, onSessionEnd };
};
