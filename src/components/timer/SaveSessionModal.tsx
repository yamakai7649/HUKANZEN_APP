"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

interface SaveSessionModalProps {
  isOpen: boolean;
  durationMinutes: number;
  userId: string;
  onClose: () => void;
}

export function SaveSessionModal({ isOpen, durationMinutes, userId, onClose }: SaveSessionModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;
    supabase.from("categories").select("*").eq("user_id", userId).order("name")
      .then(({ data }) => { if (data) setCategories(data as Category[]); });
  }, [isOpen, userId]);

  const handleSave = async () => {
    if (!title.trim() || durationMinutes < 1) return;
    setSaving(true);
    const { error } = await supabase.from("time_logs").insert({
      user_id: userId,
      category_id: categoryId || null,
      title: title.trim(),
      duration_minutes: durationMinutes,
      note: note.trim() || null,
      logged_at: new Date().toISOString(),
      visibility,
    });
    setSaving(false);
    if (!error) {
      setTitle("");
      setCategoryId("");
      setNote("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-md bg-black border border-white/15 rounded-2xl p-6 flex flex-col gap-5"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-white/40 mb-0.5">記録を保存</div>
                <div className="text-sm text-white/60">{durationMinutes}分のセッション</div>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <input
              autoFocus
              type="text"
              placeholder="何をしていましたか？（例: React学習）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/50 transition-colors"
            />

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryId("")}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    categoryId === "" ? "border-white/50 text-white" : "border-white/15 text-white/40"
                  }`}
                >
                  なし
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-colors ${
                      categoryId === c.id ? "border-white/50 text-white" : "border-white/15 text-white/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            <textarea
              placeholder="メモ（任意）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/50 transition-colors resize-none"
            />

            <div className="flex gap-2">
              {(["private", "public"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    visibility === v ? "border-white/50 text-white" : "border-white/15 text-white/40"
                  }`}
                >
                  {v === "private" ? "非公開" : "公開"}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!title.trim() || saving}
                className="flex-1 py-3 bg-white text-black text-[11px] tracking-[0.3em] uppercase font-medium rounded-full hover:bg-white/90 transition-colors disabled:opacity-30"
              >
                {saving ? "保存中..." : "保存する"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 border border-white/20 text-white/40 text-[11px] tracking-[0.3em] uppercase rounded-full hover:border-white/40 hover:text-white transition-colors"
              >
                スキップ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
