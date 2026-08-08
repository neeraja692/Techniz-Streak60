"use client";

import { useState } from "react";
import Link from "next/link";
import { getLandingStats } from "@/lib/data";

export default function Home() {
  const stats = getLandingStats();
  const [profile, setProfile] = useState<"default" | "newUser" | "empty">("default");

  // Map chosen profile to the correct routing parameter
  const profileQuery = `?profile=${profile}`;

  // Start Day 1 routing logic:
  const startDayHref = profile === "default" ? `/day/12${profileQuery}` : `/day/1${profileQuery}`;
  const exploreDayHref = `/day/12${profileQuery}`;
  const storyHref = `/story/${profile === "default" ? "default" : profile}${profileQuery}`;

  return (
    <div className="flex flex-col min-h-screen bg-ink text-text font-body selection:bg-amber selection:text-ink relative overflow-hidden">
      
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
          {Array.from({ length: 40 }).map((_, i) => {
            const highlight = i === 3 || i === 8 || i === 15 || i === 22 || i === 29;
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-lg border transition-colors ${
                  highlight 
                    ? "bg-amber/10 border-amber/25" 
                    : "bg-ink-raised/40 border-ink-border/50"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xl text-text tracking-tight">AB</span>
          <span className="font-serif font-bold text-xl text-amber tracking-tight">Talks</span>
        </div>
        <Link
          href={startDayHref}
          className="rounded-full bg-amber text-ink px-4 py-1.5 text-xs font-bold hover:bg-amber/90 transition-colors cursor-pointer"
        >
          Start Day 1
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col gap-12 z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-xl mx-auto gap-4 mt-4">
          <span className="text-amber font-[family-name:var(--font-plex-mono)] tracking-wider text-[10px] sm:text-xs font-bold uppercase">
            60-DAY CHALLENGE &nbsp;•&nbsp; FOR INDIAN COLLEGE STUDENTS
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-bold font-serif leading-tight text-text">
            Build in public.<br />
            60 days. One streak.
          </h1>
          
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md mt-1 font-light">
            Pick a track. Build something every day. Prove it with a GitHub commit and a LinkedIn post — and turn 60 days of work into a portfolio recruiters actually look at.
          </p>

          <div className="flex flex-col items-center gap-4 w-full mt-4">
            <Link
              href={startDayHref}
              className="w-full max-w-xs rounded-full bg-amber text-ink py-3 text-sm font-bold text-center hover:bg-amber/90 transition-all active:scale-[0.99] cursor-pointer"
            >
              Start Day 1 →
            </Link>
            
            <div className="flex gap-4">
              <Link
                href={storyHref}
                className="text-xs text-amber font-semibold hover:text-amber/80 underline underline-offset-2 transition-colors cursor-pointer"
              >
                View AI Builder Story
              </Link>
              <span className="text-text-faint text-xs">|</span>
              <Link
                href={exploreDayHref}
                className="text-xs text-text-muted underline hover:text-text transition-colors cursor-pointer"
              >
                See what a challenge day looks like
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="border-t border-b border-ink-border/50 py-6">
          <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-plex-mono)] text-amber">
                {stats.activeStudents.toLocaleString()}+
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-light">
                Students building
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-plex-mono)] text-amber">
                {stats.commitsShipped.toLocaleString()}+
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-light">
                Commits shipped
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-plex-mono)] text-amber">
                {stats.colleges.toLocaleString()}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-light">
                Colleges represented
              </span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="max-w-2xl mx-auto w-full flex flex-col gap-4">
          <h2 className="text-amber font-[family-name:var(--font-plex-mono)] text-xs tracking-widest font-bold uppercase">
            HOW IT WORKS
          </h2>

          <div className="rounded-2xl border border-ink-border bg-ink-raised/50 p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="text-amber font-[family-name:var(--font-plex-mono)] font-bold text-sm">01</span>
              <div>
                <h3 className="font-bold text-sm text-text">Pick a track</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Full Stack Web Dev, AI/ML Engineering, or DSA. Choose a track tailored to modern tech stacks.
                </p>
              </div>
            </div>

            <div className="border-t border-ink-border/50 pt-4 flex gap-4">
              <span className="text-amber font-[family-name:var(--font-plex-mono)] font-bold text-sm">02</span>
              <div>
                <h3 className="font-bold text-sm text-text">Build daily</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Log your progress every day for 60 consecutive days. Keep momentum high to avoid score decay.
                </p>
              </div>
            </div>

            <div className="border-t border-ink-border/50 pt-4 flex gap-4">
              <span className="text-amber font-[family-name:var(--font-plex-mono)] font-bold text-sm">03</span>
              <div>
                <h3 className="font-bold text-sm text-text">Prove with commits</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Submit your GitHub repository commit and a LinkedIn post. Recruiter Radar rates your build presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Sandbox Panel */}
        <section className="max-w-2xl mx-auto w-full mt-6 pt-6 border-t border-ink-border/50">
          <div className="bg-ink-raised border border-dashed border-amber/30 rounded-2xl p-5">
            <h3 className="text-xs font-bold font-[family-name:var(--font-plex-mono)] text-amber uppercase tracking-wider mb-2">
              🛠️ Sandbox Profile Selector
            </h3>
            <p className="text-[11px] text-text-muted mb-4 font-light leading-relaxed">
              Test dynamic landing actions and routing edge cases by toggling the simulator profile below.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { key: "default", label: "Aditi Sharma", desc: "Default Active" },
                { key: "newUser", label: "Rohan Verma", desc: "First Timer" },
                { key: "empty", label: "Guest Student", desc: "Clean Slate" }
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setProfile(p.key as any)}
                  className={`text-center py-2.5 px-2 rounded-lg border text-xs transition-all cursor-pointer ${
                    profile === p.key
                      ? "border-amber bg-amber-dim/20 text-text font-semibold"
                      : "border-ink-border bg-ink hover:border-text-faint text-text-muted"
                  }`}
                >
                  <div className="font-medium truncate">{p.label}</div>
                  <div className="text-[9px] text-text-faint mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-5 pt-3 border-t border-ink-border/50">
              <span className="text-[11px] text-text-faint">
                Active Simulation: <span className="text-amber font-semibold">{profile}</span>
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  href={storyHref}
                  className="w-full sm:w-auto text-center px-4 py-1.5 bg-amber/10 border border-amber/30 text-amber hover:bg-amber/20 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  View AI Builder Story →
                </Link>
                <Link
                  href={`/dashboard${profileQuery}`}
                  className="w-full sm:w-auto text-center px-4 py-1.5 bg-ink-raised border border-ink-border text-text-muted hover:text-text rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-6 border-t border-ink-border/50 text-center text-xs text-text-faint font-[family-name:var(--font-plex-mono)] z-10">
        &copy; {new Date().getFullYear()} ABTalks. Designed for the 60-Day Build Challenge.
      </footer>
    </div>
  );
}
