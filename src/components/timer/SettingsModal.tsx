"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { Settings } from "@/hooks/useSettings";

interface SettingsModalProps {
  settings: Settings;
  onSave: (next: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [pomodoro, setPomodoro] = useState(String(settings.pomodoroMin));
  const [shortBreak, setShortBreak] = useState(String(settings.shortBreakMin));
  const [longBreak, setLongBreak] = useState(String(settings.longBreakMin));

  const handleSave = () => {
    const p = Math.max(1, Math.min(99, Number(pomodoro) || 25));
    const s = Math.max(1, Math.min(60, Number(shortBreak) || 5));
    const l = Math.max(1, Math.min(60, Number(longBreak) || 15));
    onSave({ pomodoroMin: p, shortBreakMin: s, longBreakMin: l });
    onClose();
  };

  const fields = [
    { label: "POMODORO", value: pomodoro, set: setPomodoro },
    { label: "SHORT BREAK", value: shortBreak, set: setShortBreak },
    { label: "LONG BREAK", value: longBreak, set: setLongBreak },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-black border border-white/10 rounded-xl p-8 w-80 flex flex-col gap-8"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/50">Settings</span>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {fields.map(({ label, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase text-white/40">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  min={1}
                  max={99}
                  className="w-12 text-right bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none focus:border-white/50 transition-colors tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-white/30">min</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors duration-500"
        >
          SAVE
        </button>
      </motion.div>
    </motion.div>
  );
}
