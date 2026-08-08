import type { DayStatus } from "@/lib/data";

const STATUS_STYLE: Record<DayStatus, string> = {
  completed: "bg-green border border-green",
  missed: "bg-red-dim border border-red/60",
  pending: "bg-amber-dim border-2 border-amber",
  locked: "bg-ink-raised border border-ink-border",
};

export function CommitGrid({
  grid,
  todayDay,
  cellSize = "sm",
}: {
  grid: DayStatus[];
  todayDay?: number;
  cellSize?: "sm" | "md";
}) {
  const size = cellSize === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5";

  return (
    <div
      className="grid grid-cols-12 gap-1 sm:grid-cols-15"
      role="img"
      aria-label={`Challenge progress grid, ${grid.filter((s) => s === "completed").length} of ${grid.length} days completed`}
    >
      {grid.map((status, i) => {
        const dayNum = i + 1;
        const isToday = todayDay === dayNum;
        return (
          <div
            key={dayNum}
            title={`Day ${dayNum}: ${status}${isToday ? " (today)" : ""}`}
            className={`${size} rounded-[3px] ${STATUS_STYLE[status]} ${
              isToday ? "ring-2 ring-amber ring-offset-1 ring-offset-ink" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

export function GridLegend() {
  const items: { status: DayStatus; label: string }[] = [
    { status: "completed", label: "Shipped" },
    { status: "missed", label: "Missed" },
    { status: "pending", label: "Today" },
    { status: "locked", label: "Upcoming" },
  ];
  return (
    <div className="flex flex-wrap gap-3 text-xs text-text-muted font-[family-name:var(--font-plex-mono)]">
      {items.map(({ status, label }) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-[3px] ${STATUS_STYLE[status]}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
