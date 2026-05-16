"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Goal } from "@/types";

const PRESET_COLORS = [
  "#ffffff", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899",
];

interface GoalSelectorProps {
  userId: string;
  selectedGoal: Goal | null;
  onSelect: (goal: Goal | null) => void;
  onClose: () => void;
}

export function GoalSelector({ userId, selectedGoal, onSelect, onClose }: GoalSelectorProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const [adding, setAdding] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at")
      .then(({ data }) => { if (data) setGoals(data as Goal[]); });
  }, [userId]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { data } = await supabase
        .from("goals")
        .insert({ user_id: userId, name: newName.trim(), color: newColor })
        .select()
        .single();
      if (data) setGoals((prev) => [...prev, data as Goal]);
      setNewName("");
      setNewColor("#ffffff");
      setAdding(false);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (selectedGoal?.id === id) onSelect(null);
  };

  return (
    <motion.div
      className="absolute top-16 md:top-20 right-6 md:right-10 z-[100] w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col gap-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Goal</span>
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <button
        onClick={() => { onSelect(null); onClose(); }}
        className={`text-left text-xs px-3 py-2 rounded transition-colors ${
          selectedGoal === null
            ? "bg-white/15 text-white"
            : "text-white/40 hover:text-white hover:bg-white/5"
        }`}
      >
        No goal
      </button>

      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center gap-2">
          <button
            onClick={() => { onSelect(goal); onClose(); }}
            className={`flex-1 text-left flex items-center gap-2 text-xs px-3 py-2 rounded transition-colors ${
              selectedGoal?.id === goal.id
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: goal.color }}
            />
            {goal.name}
          </button>
          <button
            onClick={() => handleDelete(goal.id)}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <AnimatePresence>
        {adding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              placeholder="Goal name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="bg-transparent border-b border-white/20 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-white/50 transition-colors"
            />
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    newColor === c ? "scale-125 ring-1 ring-white/40" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="text-[10px] tracking-widest uppercase text-white/50 hover:text-white transition-colors disabled:opacity-30"
              >
                ADD
              </button>
              <button
                onClick={() => setAdding(false)}
                className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition-colors"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition-colors mt-1"
          >
            <Plus size={12} />
            New Goal
          </button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
