"use client";

import { memo } from "react";
import { Clock, BarChart2, Tag, Settings } from "lucide-react";

type NavIconsProps = {
  onOpenReport: () => void;
}

export const NavIcons = memo(function NavIcons({ onOpenReport }: NavIconsProps) {
  return (
    <div className="absolute top-6 md:top-10 right-6 md:right-10 z-50 flex items-center gap-8 md:gap-12 text-white/40">
      <button className="hover:text-white transition-all duration-500 hover:scale-110" title="Timer">
        <Clock size={22} strokeWidth={1.5} />
      </button>
      <button onClick={onOpenReport} className="hover:text-white transition-all duration-500 hover:scale-110" title="Report">
        <BarChart2 size={22} strokeWidth={1.5} />
      </button>
      <button className="hover:text-white transition-all duration-500 hover:scale-110" title="Tags">
        <Tag size={22} strokeWidth={1.5} />
      </button>
      <button className="hover:text-white transition-all duration-500 hover:scale-110" title="Settings">
        <Settings size={22} strokeWidth={1.5} />
      </button>
    </div>
  );
});
