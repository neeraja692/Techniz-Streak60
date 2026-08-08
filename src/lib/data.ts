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
 * the way a classic streak-reset does.
 */
export function computeMomentumScore(profileKey: ProfileKey): number {
  if (profileKey === "empty" || profileKey === "newUser") return 0;

  const days = getAllDays();
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
 * treated as locked/upcoming.
 */
export function buildStreakGrid(profileKey: ProfileKey): DayStatus[] {
  const length = getChallengeLength();
  const days = getAllDays();
  const grid: DayStatus[] = [];

  if (profileKey === "empty" || profileKey === "newUser") {
    for (let i = 1; i <= length; i++) {
      grid.push(i === 1 ? "pending" : "locked");
    }
    return grid;
  }

  const byDay = new Map(days.map((d) => [d.day, d.status]));
  for (let i = 1; i <= length; i++) {
    grid.push(byDay.get(i) ?? "locked");
  }
  return grid;
}
