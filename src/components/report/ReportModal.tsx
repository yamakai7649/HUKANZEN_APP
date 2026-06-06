"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { ReportView } from "./ReportView";
import { Session } from "@/types/timer";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        if (data) setSessions(data as Session[]);
      });
  }, [isOpen, user]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto cursor-none [&_button]:cursor-none [&_a]:cursor-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />
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
