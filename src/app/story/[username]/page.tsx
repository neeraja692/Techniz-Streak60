import React from "react";
import Link from "next/link";
import { getAllDays, getProfile, resolveProfileKey, computeMomentumScore, getTrackName, buildStreakGrid } from "@/lib/data";
import TimelineItem from "@/components/TimelineItem";
import { CommitGrid } from "@/components/CommitGrid";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ profile?: string }>;
};

export default async function StoryPage({ params, searchParams }: Props) {
  const { username } = await params;
  const { profile: queryProfile } = await searchParams;

  const profileKey = resolveProfileKey(username);
  const profile = getProfile(profileKey);
  const days = getAllDays().slice(0, 12); // Show first 12 for compact story

  const profileQuery = queryProfile ? `?profile=${queryProfile}` : `?profile=${profileKey}`;
  const momentum = computeMomentumScore(profileKey);
  const trackName = getTrackName(profile.track);
  const grid = buildStreakGrid(profileKey);

  return (
    <div className="min-h-screen bg-ink text-text font-body selection:bg-amber selection:text-ink pb-16">
      <main className="max-w-md mx-auto px-4 pt-6">
        
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard${profileQuery}`}
              className="text-xs font-[family-name:var(--font-plex-mono)] text-text-muted hover:text-text"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-xs font-[family-name:var(--font-plex-mono)] text-text-faint uppercase tracking-wider">
              AI Builder Story
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink-border bg-ink-raised p-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold leading-none text-text">
                {profile.name || "Guest Student"}
              </h1>
              <p className="text-xs font-[family-name:var(--font-plex-mono)] text-text-muted">
                {profile.college || "Independent Builder"}
              </p>
              {trackName && (
                <span className="mt-1.5 self-start text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-dim/20 text-amber border border-amber/30">
                  {trackName}
                </span>
              )}
            </div>
            
            <div className="text-right flex flex-col gap-1 shrink-0">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-faint font-[family-name:var(--font-plex-mono)]">
                Standing
              </span>
              <span className="text-2xl font-bold font-[family-name:var(--font-plex-mono)] text-green">
                #{profile.rank || "—"}
              </span>
            </div>
          </div>
        </header>

        {/* AI Recruiter Assessment Block */}
        <section className="mb-6">
          <div className="rounded-xl border border-amber/30 bg-amber-dim/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-xl pointer-events-none" />
            
            <h2 className="text-xs uppercase font-bold tracking-wider text-amber mb-2.5 font-[family-name:var(--font-plex-mono)] flex items-center gap-1.5">
              <span>✨</span> AI Recruiter Assessment
            </h2>

            {profile.aiSummary ? (
              <p className="text-xs sm:text-sm leading-relaxed text-text font-light">
                {profile.aiSummary}
              </p>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed text-text-muted italic font-light">
                No AI summary yet. Submit Day 1 to generate a personalized summary.
              </p>
            )}
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-ink-border bg-ink-raised p-3 text-center flex flex-col justify-center gap-0.5">
            <span className="text-lg font-bold font-[family-name:var(--font-plex-mono)] text-text">
              {profile.totalDaysCompleted}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-light">
              Days Built
            </span>
          </div>
          <div className="rounded-xl border border-ink-border bg-ink-raised p-3 text-center flex flex-col justify-center gap-0.5">
            <span className="text-lg font-bold font-[family-name:var(--font-plex-mono)] text-text">
              {profile.longestStreak}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-light">
              Longest Streak
            </span>
          </div>
          <div className="rounded-xl border border-ink-border bg-ink-raised p-3 text-center flex flex-col justify-center gap-0.5">
            <span className="text-lg font-bold font-[family-name:var(--font-plex-mono)] text-amber">
              {momentum}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-light">
              Momentum
            </span>
          </div>
        </section>

        {/* 60-Day Visual grid */}
        <section className="mb-6 rounded-xl border border-ink-border bg-ink-raised p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider font-[family-name:var(--font-plex-mono)]">
            <span className="text-text-muted">60-Day consistency map</span>
            <span className="text-text-faint">Timeline</span>
          </div>
          <CommitGrid grid={grid} cellSize="sm" />
        </section>

        {/* Builder Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted font-[family-name:var(--font-plex-mono)]">
              Build Timeline
            </h3>
            <span className="text-xs font-[family-name:var(--font-plex-mono)] text-text-faint">
              Days 1–12
            </span>
          </div>

          <div className="space-y-3">
            {days.map((d) => (
              <TimelineItem
                key={d.day}
                day={d.day}
                status={
                  d.status === "missed"
                    ? "missed"
                    : d.status === "locked"
                    ? "locked"
                    : d.status === "pending"
                    ? "pending"
                    : d.submission?.late
                    ? "late"
                    : "completed"
                }
                title={d.title}
                caption={d.caption ?? d.description}
                href={`/day/${d.day}${profileQuery}`}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
