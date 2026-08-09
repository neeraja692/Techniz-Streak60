import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEffectiveDay,
  getToday,
  getChallengeLength,
  resolveProfileKey,
  buildStreakGrid,
  DayStatus,
} from "@/lib/data";
import { SubmissionForm } from "@/components/SubmissionForm";

export default async function DayPage({
  params,
  searchParams,
}: {
  params: Promise<{ dayNumber: string }>;
  searchParams: Promise<{ profile?: string }>;
}) {
  const { dayNumber } = await params;
  const { profile } = await searchParams;
  const profileKey = resolveProfileKey(profile);

  const dayNum = Number(dayNumber);
  if (!Number.isInteger(dayNum) || dayNum < 1) notFound();

  const today = getToday();
  const length = getChallengeLength();
  const day = getEffectiveDay(dayNum, profileKey);

  // Status now comes straight from the effective day itself (already
  // profile-aware), not a separate grid lookup — single source of truth.
  const grid = buildStreakGrid(profileKey);
  const status = day?.status ?? "locked";

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-5 sm:max-w-2xl text-text selection:bg-amber selection:text-ink">
      
      {/* Dynamic Header */}
      <div className="mb-5 flex items-center justify-between">
        <Link
          href={`/dashboard?profile=${profileKey}`}
          className="text-sm text-text-muted hover:text-text font-[family-name:var(--font-manrope)]"
        >
          ← Dashboard
        </Link>
        <span className="font-[family-name:var(--font-plex-mono)] text-xs text-text-faint">
          Day {dayNum} / {length}
        </span>
      </div>

      {status === "locked" && dayNum > today && (
        <LockedState dayNum={dayNum} today={today} profileKey={profileKey} />
      )}

      {status === "missed" && (
        <MissedState day={day!} profileKey={profileKey} grid={grid} />
      )}

      {status === "completed" && <CompletedState day={day!} profileKey={profileKey} grid={grid} />}

      {status === "pending" && day && <PendingState day={day} profileKey={profileKey} grid={grid} />}

      {status === "locked" && dayNum <= today && !day && (
        <LockedState dayNum={dayNum} today={today} profileKey={profileKey} />
      )}
    </main>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "red" | "muted";
}) {
  const styles: Record<string, string> = {
    green: "bg-green-dim text-green border-green/40",
    amber: "bg-amber-dim text-amber border-amber/40",
    red: "bg-red-dim text-red border-red/40",
    muted: "bg-ink-raised text-text-muted border-ink-border",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold font-[family-name:var(--font-plex-mono)] ${styles[tone]}`}
    >
      {label}
    </span>
  );
}

/* Path Strip Component to show progress on day details */
function PathStrip({
  dayNum,
  profileKey,
  grid,
}: {
  dayNum: number;
  profileKey: string;
  grid: DayStatus[];
}) {
  const actualPathSlice = grid.slice(0, dayNum);
  const completedCount = actualPathSlice.filter((s) => s === "completed").length;
  const missedCount = actualPathSlice.filter((s) => s === "missed").length;

  // Render the "no streak yet" empty state only for the true zero-state
  // profile (empty/Guest). newUser (Rohan) has a real completed Day 1
  // now, so he no longer qualifies for this block.
  if (dayNum === 1 && profileKey === "empty") {
    return (
      <div className="rounded-xl border border-ink-border bg-ink-raised p-4 text-center mt-4 mb-6">
        <div className="text-2xl mb-1">🌙</div>
        <p className="text-xs text-text-muted mt-2 leading-relaxed font-light font-[family-name:var(--font-manrope)]">
          Your streak starts the moment you submit today. There's nothing to catch up on — you're exactly on time.
        </p>
        <div className="flex gap-1.5 justify-center mt-4">
          <span 
            className="w-2.5 h-2.5 rounded-[3px] bg-ink border-2 border-amber ring-2 ring-amber/30 animate-pulse" 
            title="Day 1: Today" 
          />
          {Array.from({ length: 9 }).map((_, i) => (
            <span 
              key={i} 
              className="w-2.5 h-2.5 rounded-[3px] bg-ink-raised border border-ink-border" 
              title={`Day ${i + 2}: Locked`} 
            />
          ))}
        </div>
      </div>
    );
  }

  // Cell color classes
  const cellStyles: Record<string, string> = {
    completed: "bg-green border border-green",
    missed: "bg-red-dim border border-red/60",
    pending: "bg-amber-dim border-2 border-amber ring-2 ring-amber/30",
    locked: "bg-ink-raised border border-ink-border",
  };

  const hasMissed = missedCount > 0;

  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-4 mt-4 mb-6 flex flex-col gap-3">
      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider font-[family-name:var(--font-plex-mono)]">
        <span className="text-text-muted">YOUR PATH TO DAY {dayNum}</span>
        <span className="text-amber">
          {completedCount} done {missedCount > 0 && `· ${missedCount} missed`}
        </span>
      </div>
      
      {/* Cells list */}
      <div className="flex flex-wrap gap-1.5">
        {actualPathSlice.map((status, i) => {
          const isToday = i + 1 === dayNum;
          return (
            <div
              key={i}
              title={`Day ${i + 1}: ${status}`}
              className={`w-2.5 h-2.5 rounded-[3px] ${isToday && status === "pending" ? cellStyles["pending"] : cellStyles[status]}`}
            />
          );
        })}
      </div>

      {hasMissed && (
        <p className="text-[10px] text-text-faint font-light leading-normal border-t border-ink-border/50 pt-2 font-[family-name:var(--font-manrope)]">
          Day 9 was missed — it's marked, not erased. Day 10 came in late but still counted toward momentum.
        </p>
      )}
    </div>
  );
}

function TaskHeader({
  day,
  tone,
  label,
  profileKey,
  grid,
}: {
  day: { day: number; title: string; description: string; requirements: string[] };
  tone: "green" | "amber" | "red" | "muted";
  label: string;
  profileKey: string;
  grid: DayStatus[];
}) {
  return (
    <>
      <div className="mb-3">
        <StatusPill label={label} tone={tone} />
      </div>
      
      {day.day === 1 && profileKey === "empty" ? (
        <span className="text-[10px] uppercase tracking-wider font-bold text-amber font-[family-name:var(--font-plex-mono)]">
          NO STREAK YET — AND THAT'S FINE
        </span>
      ) : (
        <span className="text-[10px] uppercase tracking-wider font-bold text-text-faint font-[family-name:var(--font-plex-mono)]">
          DAY {day.day} GOAL
        </span>
      )}

      <h1 className="text-xl font-bold text-text mt-1.5 mb-2 leading-snug font-serif">
        {day.title}
      </h1>
      
      <p className="text-xs text-text-muted leading-relaxed mb-4 font-light font-[family-name:var(--font-manrope)]">
        {day.description}
      </p>

      {/* Embedded Dynamic Path Tracker */}
      <PathStrip dayNum={day.day} profileKey={profileKey} grid={grid} />

      {day.requirements.length > 0 && (
        <div className="mb-6 rounded-xl border border-ink-border bg-ink-raised p-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2 font-[family-name:var(--font-plex-mono)]">
            What "done" looks like
          </h2>
          <ul className="space-y-1.5">
            {day.requirements.map((r, i) => (
              <li key={i} className="flex gap-2 text-xs text-text font-[family-name:var(--font-manrope)] font-light">
                <span className="text-green shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function PendingState({
  day,
  profileKey,
  grid,
}: {
  day: NonNullable<ReturnType<typeof getEffectiveDay>>;
  profileKey: string;
  grid: DayStatus[];
}) {
  return (
    <>
      <TaskHeader day={day} tone="amber" label="Today's task" profileKey={profileKey} grid={grid} />
      <SubmissionForm day={day.day} />
    </>
  );
}

function CompletedState({
  day,
  profileKey,
  grid,
}: {
  day: NonNullable<ReturnType<typeof getEffectiveDay>>;
  profileKey: string;
  grid: DayStatus[];
}) {
  return (
    <>
      <TaskHeader day={day} tone="green" label="Shipped" profileKey={profileKey} grid={grid} />
      <div className="rounded-xl border border-ink-border bg-ink-raised p-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-3 font-[family-name:var(--font-plex-mono)]">
          Your submission
        </h2>
        {day.submission?.late && (
          <div className="mb-3">
            <StatusPill label="Submitted late" tone="amber" />
          </div>
        )}
        <div className="space-y-2 text-xs font-[family-name:var(--font-plex-mono)]">
          <a
            href={day.submission?.github}
            className="flex items-center gap-2 text-text hover:text-amber underline underline-offset-2 break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-text-faint shrink-0">GitHub →</span>
            {day.submission?.github}
          </a>
          <a
            href={day.submission?.linkedin}
            className="flex items-center gap-2 text-text hover:text-amber underline underline-offset-2 break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-text-faint shrink-0">LinkedIn →</span>
            {day.submission?.linkedin}
          </a>
        </div>
      </div>
    </>
  );
}

function MissedState({
  day,
  profileKey,
  grid,
}: {
  day: NonNullable<ReturnType<typeof getEffectiveDay>>;
  profileKey: string;
  grid: DayStatus[];
}) {
  return (
    <>
      <TaskHeader day={day} tone="red" label="Missed" profileKey={profileKey} grid={grid} />
      <div className="rounded-xl border border-red/30 bg-red-dim/20 p-4 mb-4">
        <p className="text-xs text-text leading-relaxed font-light font-[family-name:var(--font-manrope)]">
          This one slipped by — it happens. Your momentum score took a hit,
          but your streak isn&apos;t erased. Focus on today instead of going
          back.
        </p>
      </div>
      <Link
        href={`/dashboard?profile=${profileKey}`}
        className="block w-full rounded-lg bg-amber text-ink font-bold py-3 text-sm text-center active:scale-[0.99] transition-transform cursor-pointer"
      >
        Go to today&apos;s task
      </Link>
    </>
  );
}

function LockedState({
  dayNum,
  today,
  profileKey,
}: {
  dayNum: number;
  today: number;
  profileKey: string;
}) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-6 text-center">
      <div className="text-3xl mb-3">🔒</div>
      <h1 className="text-base font-bold text-text mb-1.5 font-serif">
        Day {dayNum} isn&apos;t open yet
      </h1>
      <p className="text-xs text-text-muted mb-5 leading-normal font-light font-[family-name:var(--font-manrope)]">
        {dayNum > today
          ? `This unlocks once you reach Day ${dayNum}. Keep building.`
          : `This day isn't part of the challenge data yet.`}
      </p>
      <Link
        href={`/day/${today}?profile=${profileKey}`}
        className="inline-block rounded-lg bg-amber text-ink font-bold px-5 py-2.5 text-xs active:scale-[0.99] transition-transform cursor-pointer"
      >
        Go to Day {today}
      </Link>
    </div>
  );
}
