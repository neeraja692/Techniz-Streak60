import db from "@/data/db.json";

export type DayStatus = "completed" | "missed" | "pending" | "locked";

export type Submission = {
  github: string;
  linkedin: string;
  submittedAt: string;
  late: boolean;
};

export type ChallengeDay = {
  day: number;
  title: string;
  status: DayStatus;
  description: string;
  requirements: string[];
  submission: Submission | null;
  caption: string | null;
};

// Raw shape as stored in db.json: object keyed by day number (string keys),
// day number itself is NOT repeated inside each entry.
type RawDayEntry = Omit<ChallengeDay, "day">;
type RawDaysMap = Record<string, RawDayEntry>;

export type Badge = {
  id: string;
  label: string;
  earnedDay: number;
};

export type Profile = {
  name: string;
  college: string | null;
  track: string | null;
  avatarInitials: string;
  joinedDay: number | null;
  currentStreak: number;
  longestStreak: number;
  freezesUsed: number;
  freezesTotal: number;
  totalDaysCompleted: number;
  badges: Badge[];
  rank: number | null;
  totalStudents: number;
  recruiterScore: number;
  recruiterSuggestions: string[];
  aiSummary: string | null;
};

export type ProfileKey = "default" | "newUser" | "empty";

const VALID_PROFILE_KEYS: ProfileKey[] = ["default", "newUser", "empty"];

export function resolveProfileKey(input?: string | null): ProfileKey {
  if (input && VALID_PROFILE_KEYS.includes(input as ProfileKey)) {
    return input as ProfileKey;
  }
  return "default";
}

export function getProfile(key: ProfileKey = "default"): Profile {
  return db.profiles[key] as Profile;
}

export function getTrackName(trackId: string | null): string | null {
  if (!trackId) return null;
  return db.tracks.find((t) => t.id === trackId)?.name ?? null;
}

/**
 * Direct O(1) lookup — this is the hot path (`/day/[dayNumber]` hits this
 * on every visit), which is the whole reason `days` is object-keyed rather
 * than an array.
 */
export function getDay(dayNumber: number): ChallengeDay | undefined {
  const raw = (db.days as RawDaysMap)[String(dayNumber)];
  if (!raw) return undefined;
  return { day: dayNumber, ...raw };
}

/**
 * Full list, sorted by day number. Only needed where we're building
 * something across all days (the streak grid, momentum score) — the
 * single-day lookup above should be preferred everywhere else.
 */
export function getAllDays(): ChallengeDay[] {
  const raw = db.days as RawDaysMap;
  return Object.keys(raw)
    .map(Number)
    .sort((a, b) => a - b)
    .map((day) => ({ day, ...raw[String(day)] }));
}

export function getToday(): number {
  return db.meta.today;
}

type DayOverride = {
  status: DayStatus;
  submission: Submission | null;
  caption?: string | null;
};

/**
 * Per-profile overrides for specific days. `default` (Aditi) needs no
 * overrides — her real seeded history is used as-is. `newUser` (Rohan)
 * has shipped Day 1 for real (his own mocked submission). `empty`
 * (Guest) is the true zero state: Day 1 pending, nothing submitted.
 */
function getProfileDayOverrides(profileKey: ProfileKey): Record<number, DayOverride> {
  if (profileKey === "newUser") {
    return {
      1: {
        status: "completed",
        submission: {
          github: "https://github.com/rohanverma/ai-landing-page",
          linkedin: "https://linkedin.com/posts/rohanverma-day1",
          submittedAt: "2026-08-08T23:10:00Z",
          late: false,
        },
        caption: "Shipped my first AI/ML track project — a landing page for my model demo.",
      },
    };
  }
  if (profileKey === "empty") {
    return {
      1: { status: "pending", submission: null, caption: null },
    };
  }
  return {};
}

/**
 * The single place that decides what a given day looks like for a given
 * profile. `default` uses the real seeded history untouched. `newUser`
 * and `empty` get their overrides applied here — day page, story page,
 * the streak grid, and Momentum Score all read through this, so they
 * can never disagree with each other again.
 */
export function getEffectiveDay(
  dayNumber: number,
  profileKey: ProfileKey
): ChallengeDay | undefined {
  const base = getDay(dayNumber);
  if (profileKey === "default") return base;

  const override = getProfileDayOverrides(profileKey)[dayNumber];
  if (override) {
    return {
      day: dayNumber,
      title: base?.title ?? "Untitled",
      description: base?.description ?? "",
      requirements: base?.requirements ?? [],
      status: override.status,
      submission: override.submission,
      caption: override.caption ?? null,
    };
  }

  return base
    ? { ...base, status: "locked", submission: null, caption: null }
    : undefined;
}

export function getEffectiveDays(profileKey: ProfileKey): ChallengeDay[] {
  return getAllDays().map((d) => getEffectiveDay(d.day, profileKey)!);
}

export function getChallengeLength(): number {
  return db.meta.challengeLength;
}

export function getLeaderboard() {
  return db.leaderboard;
}

export function getLandingStats() {
  return db.landingStats;
}

/**
 * Momentum Score: a forgiving alternative to a raw streak counter.
 * A completed day adds a fixed amount (capped at 100); a missed day
 * costs more than a completed day gains, so momentum still trends
 * down on misses, but one bad day doesn't zero out weeks of work
 * the way a classic streak-reset does. Reads through getEffectiveDays
 * so it always agrees with what the day page and story page show.
 */
export function computeMomentumScore(profileKey: ProfileKey): number {
  const days = getEffectiveDays(profileKey);
  let score = 0;
  for (const d of days) {
    if (d.status === "completed") score = Math.min(100, score + 8);
    if (d.status === "missed") score = Math.max(0, score - 20);
  }
  return score;
}

/**
 * For a given profile, build the 60-slot grid used by the commit-grid
 * signature component. Days beyond what's defined in mock data are
 * treated as locked/upcoming. Reads through getEffectiveDays so it
 * always agrees with the day page and story page.
 */
export function buildStreakGrid(profileKey: ProfileKey): DayStatus[] {
  const length = getChallengeLength();
  const effectiveDays = getEffectiveDays(profileKey);
  const byDay = new Map(effectiveDays.map((d) => [d.day, d.status]));
  const grid: DayStatus[] = [];
  for (let i = 1; i <= length; i++) {
    grid.push(byDay.get(i) ?? "locked");
  }
  return grid;
}
