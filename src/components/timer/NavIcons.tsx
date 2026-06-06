"use client";

import { memo } from "react";
import Link from "next/link";
import { Tag, Settings, Trophy, Timer, X } from "lucide-react";
import { useUser } from "@/context/UserContext";

type NavIconsProps = {
  timerOpen: boolean;
  onOpenTimer: () => void;
  onClose: () => void;
  onOpenGoals?: () => void;
  onOpenSettings: () => void;
};

export const NavIcons = memo(function NavIcons({
  timerOpen,
  onOpenTimer,
  onClose,
  onOpenGoals,
  onOpenSettings,
}: NavIconsProps) {
  const { user } = useUser();
  return (
    <div className="fixed top-6 md:top-10 right-6 md:right-10 z-[500] flex items-center gap-8 md:gap-12 text-white/40">
      <Link href="/ranking" className="hover:text-white transition-all duration-500 hover:scale-110" title="ランキング">
        <Trophy size={22} strokeWidth={1.5} />
      </Link>

      {timerOpen ? (
        <>
          {user && onOpenGoals && (
            <button onClick={onOpenGoals} className="hover:text-white transition-all duration-500 hover:scale-110" title="ゴール">
              <Tag size={22} strokeWidth={1.5} />
            </button>
          )}
          <button onClick={onOpenSettings} className="hover:text-white transition-all duration-500 hover:scale-110" title="設定">
            <Settings size={22} strokeWidth={1.5} />
          </button>
          <button onClick={onClose} className="hover:text-white transition-all duration-500 hover:scale-110" title="閉じる">
            <X size={22} strokeWidth={1.5} />
          </button>
        </>
      ) : (
        <button onClick={onOpenTimer} className="hover:text-white transition-all duration-500 hover:scale-110" title="タイマー">
          <Timer size={22} strokeWidth={1.5} />
        </button>
      )}

      {user ? (
        <Link href={`/profile/${user.username}`} className="hover:text-white transition-all duration-500">
          <span className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-[11px] font-medium">
            {user.username[0].toUpperCase()}
          </span>
        </Link>
      ) : (
        <Link href="/login" className="text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors">
          Login
        </Link>
      )}
    </div>
  );
});
