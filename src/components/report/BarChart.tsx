type BarChartProps = {
  data: { label: string; focusMs: number }[];
};

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.focusMs), 1);
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((d) => {
        const heightPct = (d.focusMs / max) * 100;
        return (
          <div key={d.label} className="flex flex-col items-center flex-1 gap-1">
            <div
              className="w-full bg-white/80 rounded-sm transition-all duration-500"
              style={{ height: `${heightPct}%`, minHeight: d.focusMs > 0 ? 2 : 0 }}
            />
            <span className="text-[9px] text-white/40">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
