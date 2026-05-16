"use client";

import { memo } from "react";
import Link from "next/link";
import { Clock, BarChart2, Tag, Trophy, Settings } from "lucide-react";
import { useUser } from "@/context/UserContext";

type NavIconsProps = {
  onOpenReport?: () => void;
  onOpenGoals?: () => void;
  onOpenSettings: () => void;
};

export const NavIcons = memo(function NavIcons({
  onOpenReport,
  onOpenGoals,
  onOpenSettings,
}: NavIconsProps) {
  const { user } = useUser();

  return (
    <div className="absolute top-6 md:top-10 right-6 md:right-10 z-50 flex items-center gap-8 md:gap-12 text-white/40">
      <button className="hover:text-white transition-all duration-500 hover:scale-110" title="Timer">
        <Clock size={22} strokeWidth={1.5} />
      </button>
      <button
        onClick={onOpenReport}
        className="hover:text-white transition-all duration-500 hover:scale-110"
        title="Report"
      >
        <BarChart2 size={22} strokeWidth={1.5} />
      </button>
      <button
        onClick={onOpenGoals}
        className="hover:text-white transition-all duration-500 hover:scale-110"
        title="Goals"
      >
        <Tag size={22} strokeWidth={1.5} />
      </button>
      <Link
        href="/ranking"
        className="hover:text-white transition-all duration-500 hover:scale-110"
        title="Ranking"
      >
        <Trophy size={22} strokeWidth={1.5} />
      </Link>
      <button
        onClick={onOpenSettings}
        className="hover:text-white transition-all duration-500 hover:scale-110"
        title="Settings"
      >
        <Settings size={22} strokeWidth={1.5} />
      </button>
      {user && (
        <Link
          href={`/profile/${user.username}`}
          className="flex items-center justify-center w-6 h-6 rounded-full border border-white/20 hover:border-white/60 transition-all duration-500 hover:scale-110 text-[10px] tracking-wider"
          title="Profile"
        >
          {user.username[0].toUpperCase()}
        </Link>
      )}
    </div>
  );
});
