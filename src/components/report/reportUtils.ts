export type Period = "day" | "week" | "month";

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getPeriodRange(period: Period, offset: number): { start: Date; end: Date; label: string } {
  const now = new Date();

  if (period === "day") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const end = new Date(start.getTime() + 86400_000);
    const label = `${start.getMonth() + 1}/${start.getDate()}`;
    return { start, end, label };
  }

  if (period === "week") {
    const day = now.getDay();
    const mondayDiff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.getFullYear(), now.getMonth(), mondayDiff + offset * 7);
    const end = new Date(start.getTime() + 7 * 86400_000);
    const last = new Date(end.getTime() - 86400_000);
    const label = `${start.getMonth() + 1}/${start.getDate()} ~ ${last.getMonth() + 1}/${last.getDate()}`;
    return { start, end, label };
  }

  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  const label = start.toLocaleString("en-US", { month: "long", year: "numeric" });
  return { start, end, label };
}

export function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
