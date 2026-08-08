import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDay,
  getToday,
  getChallengeLength,
  resolveProfileKey,
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
  const day = getDay(dayNum);

  // Days beyond our seeded mock data (13-60) are simply locked/upcoming.
  const status = day?.status ?? (dayNum > today ? "locked" : "locked");

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-5 sm:max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href={`/dashboard?profile=${profileKey}`}
          className="text-sm text-text-muted hover:text-text"
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
        <MissedState day={day!} profileKey={profileKey} />
      )}

      {status === "completed" && <CompletedState day={day!} />}

      {status === "pending" && day && <PendingState day={day} />}

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

function TaskHeader({
  day,
  tone,
  label,
}: {
  day: { day: number; title: string; description: string; requirements: string[] };
  tone: "green" | "amber" | "red" | "muted";
  label: string;
}) {
  return (
    <>
      <div className="mb-3">
        <StatusPill label={label} tone={tone} />
      </div>
      <h1 className="text-xl font-bold text-text mb-2 leading-snug">
        {day.title}
      </h1>
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        {day.description}
      </p>
      {day.requirements.length > 0 && (
        <div className="mb-6 rounded-xl border border-ink-border bg-ink-raised p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2 font-[family-name:var(--font-plex-mono)]">
            What "done" looks like
          </h2>
          <ul className="space-y-1.5">
            {day.requirements.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-text">
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
}: {
  day: NonNullable<ReturnType<typeof getDay>>;
}) {
  return (
    <>
      <TaskHeader day={day} tone="amber" label="Today's task" />
      <SubmissionForm day={day.day} />
    </>
  );
}

function CompletedState({ day }: { day: NonNullable<ReturnType<typeof getDay>> }) {
  return (
    <>
      <TaskHeader day={day} tone="green" label="Shipped" />
      <div className="rounded-xl border border-ink-border bg-ink-raised p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3 font-[family-name:var(--font-plex-mono)]">
          Your submission
        </h2>
        {day.submission?.late && (
          <div className="mb-3">
            <StatusPill label="Submitted late" tone="amber" />
          </div>
        )}
        <div className="space-y-2 text-sm">
          <a
            href={day.submission?.github}
            className="flex items-center gap-2 text-text hover:text-amber underline underline-offset-2 break-all"
          >
            <span className="text-text-faint shrink-0">GitHub →</span>
            {day.submission?.github}
          </a>
          <a
            href={day.submission?.linkedin}
            className="flex items-center gap-2 text-text hover:text-amber underline underline-offset-2 break-all"
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
}: {
  day: NonNullable<ReturnType<typeof getDay>>;
  profileKey: string;
}) {
  return (
    <>
      <TaskHeader day={day} tone="red" label="Missed" />
      <div className="rounded-xl border border-red/30 bg-red-dim/20 p-4 mb-4">
        <p className="text-sm text-text leading-relaxed">
          This one slipped by — it happens. Your momentum score took a hit,
          but your streak isn&apos;t erased. Focus on today instead of going
          back.
        </p>
      </div>
      <Link
        href={`/dashboard?profile=${profileKey}`}
        className="block w-full rounded-lg bg-amber text-ink font-semibold py-3 text-sm text-center"
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
      <h1 className="text-lg font-bold text-text mb-1">
        Day {dayNum} isn&apos;t open yet
      </h1>
      <p className="text-sm text-text-muted mb-5">
        {dayNum > today
          ? `This unlocks once you reach Day ${dayNum}. Keep building.`
          : `This day isn't part of the challenge data yet.`}
      </p>
      <Link
        href={`/day/${today}?profile=${profileKey}`}
        className="inline-block rounded-lg bg-amber text-ink font-semibold px-5 py-2.5 text-sm"
      >
        Go to Day {today}
      </Link>
    </div>
  );
}
