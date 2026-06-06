"use client";

import { motion } from "motion/react";

export type Period = "day" | "week" | "month" | "all";

const TABS: { value: Period; label: string }[] = [
  { value: "day",   label: "日" },
  { value: "week",  label: "週" },
  { value: "month", label: "月" },
  { value: "all",   label: "全体" },
];

interface PeriodTabsProps {
  period: Period;
  onChange: (p: Period) => void;
}

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  return (
    <div className="flex gap-1 bg-white/[0.04] rounded-lg p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className="relative flex-1 py-2 rounded-md"
        >
          {/* スライドするハイライト */}
          {period === tab.value && (
            <motion.div
              layoutId="period-indicator"
              className="absolute inset-0 bg-white/10 rounded-md"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <span
            className={`relative z-10 text-xs tracking-[0.2em] transition-colors duration-150 ${
              period === tab.value ? "text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
