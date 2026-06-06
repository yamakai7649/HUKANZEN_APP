"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useUser } from "@/context/UserContext";
import { NavIcons } from "@/components/timer/NavIcons";
import { PeriodTabs, Period } from "@/components/dashboard/PeriodTabs";
import { DayView } from "@/components/dashboard/DayView";
import { WeekView } from "@/components/dashboard/WeekView";
import { MonthView } from "@/components/dashboard/MonthView";
import { AllView } from "@/components/dashboard/AllView";
import { TimerSection } from "@/components/timer/TimerSection";

export default function Home() {
  const { user, loading } = useUser();
  const [period, setPeriod] = useState<Period>("day");
  const [timerOpen, setTimerOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavIcons
        timerOpen={timerOpen}
        onOpenTimer={() => setTimerOpen(true)}
        onClose={() => { setTimerOpen(false); setIsGoalOpen(false); setIsSettingsOpen(false); }}
        onOpenGoals={() => setIsGoalOpen((v) => !v)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <header className="mb-8 pr-40">
          <span className="text-xs tracking-[0.4em] uppercase text-white/30">HUKANZEN</span>
        </header>

        {user && !loading ? (
          <>
            <div className="mb-8">
              <PeriodTabs period={period} onChange={setPeriod} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {period === "day"   && <DayView />}
                {period === "week"  && <WeekView />}
                {period === "month" && <MonthView />}
                {period === "all"   && <AllView />}
              </motion.div>
            </AnimatePresence>
          </>
        ) : !loading && !user ? (
          <section>
            <div className="text-white/30 text-sm leading-loose mb-8">
              学習記録を残すには<br />ログインまたは登録が必要です
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-[10px] tracking-[0.3em] uppercase border border-white/20 px-6 py-3 rounded hover:border-white/50 text-white/60 hover:text-white transition-all duration-300"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="text-[10px] tracking-[0.3em] uppercase border border-white/20 px-6 py-3 rounded hover:border-white/50 text-white/60 hover:text-white transition-all duration-300"
              >
                登録
              </Link>
            </div>
          </section>
        ) : null}
      </div>

      <AnimatePresence>
        {timerOpen && (
          <motion.div
            className="fixed inset-0 z-[400]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TimerSection
              isGoalOpen={isGoalOpen}
              onGoalOpenChange={setIsGoalOpen}
              isSettingsOpen={isSettingsOpen}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
