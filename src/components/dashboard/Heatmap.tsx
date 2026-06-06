"use client";

import { useMemo, useState } from "react";

interface HeatmapProps {
  data: { date: string; minutes: number }[];
  weeks?: number;
}

function getColor(minutes: number): string {
  if (minutes === 0) return "bg-white/5";
  if (minutes < 30) return "bg-green-900/60";
  if (minutes < 60) return "bg-green-700/70";
  if (minutes < 120) return "bg-green-500/80";
  return "bg-green-400";
}

export function Heatmap({ data, weeks = 14 }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; minutes: number } | null>(null);

  const grid = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d.minutes]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // align to Monday
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const endSunday = new Date(today);
    endSunday.setDate(today.getDate() + (6 - daysToMonday));

    const cells: { date: string; minutes: number; isFuture: boolean }[] = [];
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const cell = new Date(endSunday);
        cell.setDate(endSunday.getDate() - w * 7 - (6 - d));
        const dateStr = cell.toISOString().split("T")[0];
        cells.push({
          date: dateStr,
          minutes: map.get(dateStr) ?? 0,
          isFuture: cell > today,
        });
      }
    }
    return cells;
  }, [data, weeks]);

  const cols = weeks;

  return (
    <div className="relative">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
      >
        {/* reorder: grid fills column-by-column (weeks), row-by-row (days) */}
        {Array.from({ length: cols }, (_, w) =>
          Array.from({ length: 7 }, (_, d) => {
            const cell = grid[w * 7 + d];
            if (!cell) return null;
            return (
              <div
                key={cell.date}
                className={`w-full aspect-square rounded-sm cursor-default transition-opacity ${
                  cell.isFuture ? "opacity-0" : getColor(cell.minutes)
                }`}
                onMouseEnter={() => !cell.isFuture && setTooltip(cell)}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })
        )}
      </div>
      {tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-xs text-white px-3 py-1.5 rounded whitespace-nowrap pointer-events-none">
          {tooltip.date} · {tooltip.minutes > 0 ? `${tooltip.minutes}分` : "記録なし"}
        </div>
      )}
    </div>
  );
}
