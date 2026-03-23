"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { ReportView } from "./ReportView";
import { Session } from "@/types/timer";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const cutoff = new Date(Date.now() - 35 * 86400_000).toISOString();
    supabase
      .from("pomodoro_sessions")
      .select("*")
      .gte("started_at", cutoff)
      .order("started_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setSessions(data ?? []);
      });
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            className="relative z-10 min-h-full"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReportView sessions={sessions} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
