import { formatDuration } from "./reportUtils";

const ONE_HOUR_MS = 60 * 60 * 1000;

type BarChartProps = {
  data: { label: string; focusMs: number }[];
};

export function BarChart({ data }: BarChartProps) {
  const actualMax = Math.max(...data.map((d) => d.focusMs), 1);
  const ceiling = Math.ceil(actualMax / ONE_HOUR_MS) * ONE_HOUR_MS;
  const ticks = Array.from({ length: ceiling / ONE_HOUR_MS }, (_, i) => (i + 1) * ONE_HOUR_MS);

  return (
    <div className="flex gap-2">
      {/* y軸 */}
      <div className="relative h-24 w-10 shrink-0">
        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 text-[9px] text-white/40 leading-none"
            style={{ bottom: `${(tick / ceiling) * 100}%`, transform: "translateY(50%)" }}
          >
            {formatDuration(tick)}
          </span>
        ))}
        <span
          className="absolute right-0 bottom-0 text-[9px] text-white/40 leading-none"
          style={{ transform: "translateY(50%)" }}
        >
          0
        </span>
      </div>

      {/* バー + x軸ラベル */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="relative flex items-end gap-1 h-24">
          {/* 横線 */}
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute left-0 right-0 border-t border-white/10"
              style={{ bottom: `${(tick / ceiling) * 100}%` }}
            />
          ))}
          <div className="absolute left-0 right-0 border-t border-white/10 bottom-0" />
          {data.map((d) => {
            const heightPct = (d.focusMs / ceiling) * 100;
            return (
              <div key={d.label} className="relative flex-1 h-full flex items-end">
                <div
                  className="w-full bg-white/80 rounded-sm transition-all duration-500"
                  style={{ height: `${heightPct}%`, minHeight: d.focusMs > 0 ? 2 : 0 }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1">
          {data.map((d) => (
            <span key={d.label} className="flex-1 text-center text-[9px] text-white/40">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
