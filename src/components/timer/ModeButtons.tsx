"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { Mode } from "@/types/timer";

const modeLabels: Record<Mode, string> = {
  pomodoro: "DEEP FOCUS",
  shortBreak: "SHORT BREATHE",
  longBreak: "LONG REST",
};

const modePositions: Record<Mode, string> = {
  pomodoro: "top-[20%] left-[8%] md:left-[12%] text-left",
  shortBreak: "bottom-[15%] left-[8%] md:left-[12%] text-left",
  longBreak: "bottom-[20%] right-[10%] md:right-[15%] text-right",
};

type ModeButtonsProps = {
  mode: Mode;
  onSwitchMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ModeButtons = memo(function ModeButtons({ mode, onSwitchMode }: ModeButtonsProps) {
  return (
    <>
      {(["pomodoro", "shortBreak", "longBreak"] as Mode[]).map((m) => (
        <div key={m} className={`absolute z-30 ${modePositions[m]}`}>
          <motion.button
            value={m}
            onClick={onSwitchMode}
            initial={false}
            animate={{
              opacity: mode === m ? 1 : 0.2,
              scale: mode === m ? 1.05 : 1,
              filter: mode === m ? "blur(0px)" : "blur(2px)",
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-[10px] md:text-xs tracking-[0.4em] font-medium uppercase hover:opacity-100 transition-opacity duration-500"
          >
            <span className="relative z-10">{modeLabels[m]}</span>
            {mode === m && (
              <motion.div
                layoutId="active-mode"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] bg-white/5 border border-white/10 rounded-full mix-blend-screen pointer-events-none"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
        </div>
      ))}
    </>
  );
});
