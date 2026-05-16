"use client";

import { useState, useEffect } from "react";

export interface Settings {
  pomodoroMin: number;
  shortBreakMin: number;
  longBreakMin: number;
}

const DEFAULT: Settings = { pomodoroMin: 25, shortBreakMin: 5, longBreakMin: 15 };
const KEY = "hukanzen-settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  const updateSettings = (next: Settings) => {
    setSettings(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return { settings, updateSettings };
}
