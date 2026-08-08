import Link from "next/link";
import {
  getProfile,
  getDay,
  getAllDays,
  getCurrentDayForProfile,
  getChallengeLength,
  computeMomentumScore,
  buildStreakGrid,
  getTrackName,
  resolveProfileKey,
  type ProfileKey,
} from "@/lib/data";
import { CommitGrid, GridLegend } from "@/components/CommitGrid";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ profile?: string }>;
}) {
  const { profile } = await searchParams;
  const profileKey = resolveProfileKey(profile);
  const student = getProfile(profileKey);

  if (profileKey === "empty") {
    return <EmptyDashboard />;
  }

  const length = getChallengeLength();
  const isNewUser = profileKey === "newUser";
  const currentDayNum = getCurrentDayForProfile(profileKey);
  const todaysTask = getDay(currentDayNum);
  const momentum = computeMomentumScore(profileKey);
  const grid = buildStreakGrid(profileKey);
  const completionPct = Math.round((student.totalDaysCompleted / length) * 100);
  const missedDay = findMostRecentMissedDay(profileKey, currentDayNum);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-5 sm:max-w-2xl">
      <ProfileSwitcher current={profileKey} />

      <Header
        name={student.name}
        college={student.college}
        trackName={getTrackName(student.track)}
        initials={student.avatarInitials}
      />

      {missedDay && <MissedDayBanner dayTitle={missedDay.title} />}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StreakCard streak={student.currentStreak} longest={student.longestStreak} />
        <MomentumCard score={momentum} />
      </div>

      {todaysTask && (
        <TodayTaskCard
          dayNum={currentDayNum}
          title={todaysTask.title}
          description={todaysTask.description}
          submitted={!isNewUser && todaysTask.status === "completed"}
          profileKey={profileKey}
        />
      )}

      <section className="rounded-xl border border-ink-border bg-ink-raised p-4 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted font-[family-name:var(--font-plex-mono)]">
            Progress
          </h2>
          <span className="text-sm text-text font-[family-name:var(--font-plex-mono)]">
            Day {currentDayNum} / {length}
          </span>
        </div>
        <CommitGrid grid={grid} todayDay={currentDayNum} />
        <div className="mt-3 flex items-center justify-between">
          <GridLegend />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Completion" value={`${completionPct}%`} />
        <StatCard
          label="Standing"
          value={student.rank ? `#${student.rank}` : "Unranked"}
          sub={student.rank ? `of ${student.totalStudents}` : undefined}
        />
      </div>

      <BadgesSection badges={student.badges} />
    </main>
  );
}

function findMostRecentMissedDay(profileKey: ProfileKey, upToDay: number) {
  if (profileKey !== "default") return null;
  // Only the seeded "default" profile has real per-day submission history.
  const missed = getAllDays()
    .filter((d) => d.status === "missed" && d.day < upToDay)
    .sort((a, b) => b.day - a.day);
  return missed[0] ?? null;
}

function ProfileSwitcher({ current }: { current: ProfileKey }) {
  const options: { key: ProfileKey; label: string }[] = [
    { key: "default", label: "Mid-challenge" },
    { key: "newUser", label: "Day 1" },
    { key: "empty", label: "Empty" },
  ];
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      {options.map((o) => (
        <Link
          key={o.key}
          href={`/dashboard?profile=${o.key}`}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium font-[family-name:var(--font-plex-mono)] ${
            current === o.key
              ? "border-amber bg-amber-dim text-amber"
              : "border-ink-border text-text-muted"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

function Header({
  name,
  college,
  trackName,
  initials,
}: {
  name: string;
  college: string | null;
  trackName: string | null;
  initials: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-dim border border-amber/40 text-amber font-bold font-[family-name:var(--font-plex-mono)]">
        {initials}
      </div>
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-text truncate">{name}</h1>
        <p className="text-xs text-text-muted truncate">
          {[trackName, college].filter(Boolean).join(" · ") || "No track selected"}
        </p>
      </div>
    </div>
  );
}

function MissedDayBanner({ dayTitle }: { dayTitle: string }) {
  return (
    <div className="mb-4 rounded-xl border border-red/30 bg-red-dim/20 p-3">
      <p className="text-sm text-text leading-relaxed">
        <span className="text-red font-semibold">One slipped by</span> —
        &ldquo;{dayTitle}&rdquo; wasn&apos;t submitted in time. Momentum dipped,
        but today&apos;s a clean slate.
      </p>
    </div>
  );
}

function StreakCard({ streak, longest }: { streak: number; longest: number }) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-lg">🔥</span>
        <span className="text-2xl font-bold text-text font-[family-name:var(--font-plex-mono)]">
          {streak}
        </span>
      </div>
      <p className="text-xs text-text-muted">
        Day streak · best {longest}
      </p>
    </div>
  );
}

function MomentumCard({ score }: { score: number }) {
  const color = score >= 70 ? "text-green" : score >= 35 ? "text-amber" : "text-text-muted";
  const barColor = score >= 70 ? "bg-green" : score >= 35 ? "bg-amber" : "bg-text-faint";
  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-4">
      <div className={`text-2xl font-bold font-[family-name:var(--font-plex-mono)] ${color}`}>
        {score}
      </div>
      <p className="text-xs text-text-muted mb-2">Momentum</p>
      <div className="h-1.5 w-full rounded-full bg-ink overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(score, 3)}%` }} />
      </div>
    </div>
  );
}

function TodayTaskCard({
  dayNum,
  title,
  description,
  submitted,
  profileKey,
}: {
  dayNum: number;
  title: string;
  description: string;
  submitted: boolean;
  profileKey: ProfileKey;
}) {
  return (
    <section className="mb-4 rounded-xl border border-amber/30 bg-amber-dim/10 p-4">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-amber font-[family-name:var(--font-plex-mono)]">
          {submitted ? "Today — done" : "Today's task"}
        </h2>
        <span className="text-xs text-text-faint font-[family-name:var(--font-plex-mono)]">
          Day {dayNum}
        </span>
      </div>
      <h3 className="text-base font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-3 line-clamp-2">{description}</p>
      <Link
        href={`/day/${dayNum}?profile=${profileKey}`}
        className="inline-block rounded-lg bg-amber text-ink font-semibold px-4 py-2 text-sm"
      >
        {submitted ? "View submission" : "Start building →"}
      </Link>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-4">
      <div className="text-xl font-bold text-text font-[family-name:var(--font-plex-mono)]">
        {value}
      </div>
      <p className="text-xs text-text-muted">
        {label}
        {sub ? ` · ${sub}` : ""}
      </p>
    </div>
  );
}

function BadgesSection({
  badges,
}: {
  badges: { id: string; label: string; earnedDay: number }[];
}) {
  if (badges.length === 0) {
    return (
      <section className="rounded-xl border border-ink-border bg-ink-raised p-4 text-center">
        <p className="text-sm text-text-muted">
          No badges yet — your first one unlocks after Day 1.
        </p>
      </section>
    );
  }
  return (
    <section className="rounded-xl border border-ink-border bg-ink-raised p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3 font-[family-name:var(--font-plex-mono)]">
        Achievements
      </h2>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.id}
            className="rounded-full border border-green/40 bg-green-dim/30 px-3 py-1 text-xs font-medium text-green"
          >
            {b.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function EmptyDashboard() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:max-w-2xl">
      <ProfileSwitcher current="empty" />
      <div className="text-4xl mb-4">👋</div>
      <h1 className="text-xl font-bold text-text mb-2">
        Nothing here yet
      </h1>
      <p className="text-sm text-text-muted mb-6 max-w-xs leading-relaxed">
        No track picked, no days logged. Your dashboard fills up the moment
        you submit Day 1 — streak, progress, badges, all of it starts there.
      </p>
      <Link
        href="/day/1?profile=empty"
        className="rounded-lg bg-amber text-ink font-semibold px-5 py-3 text-sm"
      >
        Start Day 1
      </Link>
    </main>
  );
}
