Vibe Coding Log — ABTalks / Streak60 Redesign

This log documents the actual build process for the ABTalks (Streak60) redesign — decisions made, ideas rejected, and real bugs that were caught and fixed — as proof of the vibe-coding workflow used for this hackathon submission. It covers both teammates: Shreya (Person B — landing page, day-page polish, Builder Story/Proof Page) and Neeraja (Person A — data layer, dashboard, Momentum Score).

===================================================================
PART 1 — SHREYA (Person B): Landing Page, Theming, Builder Story
===================================================================

1. Scoping the brief
Before any code, the problem statement was broken into an explicit requirements checklist rather than working from assumptions:

- Landing (/): trust, clarity, motivation to commit to 60 days
- Dashboard (/dashboard): streak, today's task, progress, completion %, standing/achievements
- Challenge day (/day/12): task, requirements, GitHub + LinkedIn submission
- Cross-cutting: mobile-first at 390px, understandable to a first-time visitor, mocked JSON data, one thoughtful original feature
- Required edge cases: Day 1 / no streak, a missed day, an empty profile

This checklist was treated as the single source of truth for what "done" meant, separate from any feature brainstorming.

2. Feature ideation — narrowing, not just generating
Multiple rounds of candidate "extra feature" ideas were generated and deliberately cut down rather than stacked:

- Round 1: streak freeze / grace token, auto-generated share card, draft auto-save, catch-up mode, time-of-day nudges, leaderboard
- Round 2: narrowed to ideas specific to this context (Indian college students, GitHub+LinkedIn proof, recruiter visibility) rather than generic streak-app patterns — Builder Story (public timeline profile), Momentum Score (decaying score vs. binary streak), Recruiter Radar (profile-strength meter), Verified Build (authenticity check)
- Round 3: a teammate proposed a points/leaderboard/token-shop/Discord system; this was deliberately scoped back down rather than adopted wholesale, keeping only the underlying "earn your forgiveness" mechanic and folding it into Momentum Score instead of building a separate economy

Final decision: two features, not five — an AI-generated recruiter summary combined with a public Builder Story page (flagship), plus Momentum Score as the consistency mechanic. Rejected ideas (Recruiter Radar, Verified Build, leaderboard, token shop) were kept as consciously-scoped-out "future roadmap" items rather than silently dropped, to be able to explain the scoping decision to judges.

3. Naming and visual identity
The flagship feature was named "Proof Page" — deliberately reusing the problem statement's own phrase ("daily proof of work") so the name explains itself to a judge without extra context.

4. Build order
Standard instinct is to build the easiest screen first (landing) for early momentum. That was deliberately reversed: /day/12 was built first because it has the most data dependencies and would surface data-model problems earliest; /dashboard second since it mostly aggregates what /day/12 already proved worked; / last since it needed almost no dynamic data and carried the least risk.

5. Tooling constraint -> implementation decision
The original plan specified Next.js + Tailwind + Vercel. Once inside the actual build environment (no network access for npm install), the approach was adapted to static HTML/CSS/JS with an identical folder-per-route structure (/, /dashboard/, /day/12/), so the required route map still held exactly — deployable to Vercel with zero build step. (This static build was later migrated into the shared Next.js app — see Part 3.)

6. A real bug, caught and fixed
After the first deploy-ready version, opening any page directly (double-click / mobile file viewer) showed no styling and no dynamic content. Diagnosis: browsers block fetch() to local files and some mobile file-preview apps don't process external <link> stylesheets when a file is opened via file:// instead of served over HTTP — a real CORS/loading gotcha, not a code logic bug.

Fix: every page was made fully self-contained — CSS inlined via <style>, mock data embedded directly as a JS object instead of fetched, and app.js inlined too — so every route renders correctly whether opened directly, previewed on a phone, or deployed properly.

7. Theme iteration
Three full visual directions were built and compared, not just one:

- "Commit Grid" — dark theme built around a GitHub-contribution-graph motif (day cells as the core signature element, functionally meaningful — not decorative)
- "Pin Board" — a Pinterest-coded light theme with real CSS-column masonry for the day-log feed and testimonials
- "Desk Lamp" (final) — a warm, low-glare dark theme chosen specifically because the brief states most usage happens late at night on phones; avoids blue-tinted blacks and neon (both increase eye strain at night) in favor of a warm charcoal background, amber glow accents, cream (not stark white) text, and a serif display face for a calmer feel

The Commit Grid's day-cell signature element was carried through all three themes as the one constant, since it's the part that's functionally tied to the product (each cell = one real day), not just decoration.

8. Edge cases as first-class screens, not just states
Initially the "Day 1 / no streak" requirement was handled only as a visual state inside other pages. On review, it was rebuilt as its own standalone route (/day/1/) with distinct copy ("there's nothing to catch up on — you're exactly on time") rather than reusing Day 12's copy with different numbers, since a first-time user's context is different enough to need different messaging, not just different data.

Final feature set shipped (Shreya's scope):
- Proof Page — AI-generated recruiter summary + 60-day Builder Story timeline (/story/[username])
- Full edge-case coverage: /day/1 (no streak), missed-day state (visible, not hidden, across grid/timeline), /story/new-user (empty profile)

9. Next.js Migration & Refactoring

Phase 1 — Project Diagnosis & Scope Alignment
Prompt: "This my repo https://github.com/neeraja692/Techniz-Streak60, where my project is, view it and analyse. Here's the full plan... I am Person B (Shreya). Is my work completed?"
Actions Taken:
- Audited the cloned codebase.
- Identified that the landing page / was still boilerplate.
- Fixed the params dynamic route Promise rendering issue on /story/[username].
- Cleaned up Next.js hydration issues (removed nested <a> inside <Link>).
- Resolved the light-theme styling mismatch on the story page to align with the rest of the application.

Phase 2 — Landing Page Redesign (Desk Lamp Theme Alignment)
Prompt: "this is frontend theme of my project dont changes regarding theme" (mockup screenshot of the gold-accented mobile landing page provided)
Actions Taken:
- Redesigned / at src/app/page.tsx.
- Added a warm, low-glare grid of square panels in the background to resemble the screenshot's watermark.
- Replaced boilerplate layout with the serif display face ("AB Talks", "Build in public...") and gold pill buttons.
- Added the collapsible Sandbox Profile Selector to allow testing different profile routing states.

Phase 3 — Integrating the Backup Zip Archive (Day & Timeline Features)
Prompt: "C:\Users\sy432\Downloads\abtalks-site.zip", this what my previous zip file in this there momentum tracker, page 1, page 60. Analyze it and add the missing features to my project — you can analyse the provided zip file and add the missing features in context with shreya's work, don't do things that comes under neeraja's work.
Actions Taken:
- Extracted and analyzed the static mockup zip.
- Kept dashboard changes out of scope to avoid conflicting with Neeraja's task.
- Ported the custom Day 1 "No Streak" state for Rohan/Guest to src/app/day/[dayNumber]/page.tsx.
- Generalized the progress path tracker as a dynamic PathStrip widget on the Day details page.
- Integrated dynamic Days Built, Longest Streak, and Momentum Score panels alongside the 60-day visual grid on /story/[username].

===================================================================
PART 2 — NEERAJA (Person A): Data Layer, Dashboard, Cross-Page Fix
===================================================================

Phase 1 — Scoping and Feature Decision
Prompt: "Redesign ABTalks... what problem statement is better" followed by a series of feature-ideation rounds narrowing down to a final set.
Actions Taken:
- Broke the brief into an explicit requirements checklist (3 routes, mobile-first at 390px, mocked data, 3 required edge cases) before any code was written.
- Ran multiple rounds of "extra feature" ideation and deliberately narrowed rather than stacked: cut Recruiter Radar down from flagship to optional/secondary once AI-generated recruiter summary + Builder Story were agreed as the stronger, more context-specific flagship.
- Locked final feature set: AI-generated recruiter summary + Builder Story (Person B), Momentum Score as the consistency mechanic (Person A).

Phase 2 — Stack Setup and Data Layer
Prompt: "start building" / "my approach is like first reviewing the website... then choose a stack and ai tools and then start building"
Actions Taken:
- Scaffolded a Next.js (App Router) + TypeScript + Tailwind project.
- Designed src/data/db.json as the single source of truth before any page was built, so both teammates' pages could read from one consistent schema.
- Built src/lib/data.ts with typed data-access functions: getDay, getProfile, getAllDays, buildStreakGrid, resolveProfileKey.
- Set global design tokens (dark "ink navy" palette, amber/green/red accent system, IBM Plex Mono + Manrope) deliberately grounded in developer/commit-culture visual language rather than a generic AI-template look.

Phase 3 — Schema Conversion (Array to Object-Keyed Days)
Prompt: A teammate proposed keeping db.json's profile naming as-is but converting the days field from an array to an object keyed by day number, for direct lookups on the hot-path /day/[dayNumber] route.
Actions Taken:
- Converted db.json's days field from an array to an object keyed by day number, removing the redundant day field from inside each entry.
- Rewrote getDay() in lib/data.ts as an O(1) object lookup instead of an array scan; rebuilt getAllDays() to reconstruct a sorted array only where genuinely needed (streak grid, Momentum Score).
- Verified the conversion with npx tsc --noEmit — zero type errors after the schema change, confirming no call site was missed.
- Added aiSummary (per profile) and caption (per day entry) fields to db.json to support the flagship Builder Story feature, deliberately avoiding a separate duplicate dayLog array to prevent schema drift.

Phase 4 — Building the Day Page and Submission Form
Prompt: "start building" (day page prioritized first, per agreed build order: hardest screen first)
Actions Taken:
- Built src/app/day/[dayNumber]/page.tsx handling all four required states: completed, missed, pending, and locked.
- Built src/components/SubmissionForm.tsx as a client component with regex validation for GitHub repo/commit URLs and LinkedIn post URLs, plus a mocked success state.
- Built src/components/CommitGrid.tsx — a GitHub-contribution-graph-style grid reused across the day page and dashboard as the signature visual element.

Phase 5 — Building the Dashboard
Prompt: "start building my part" (Person A's task: /dashboard — streak, Momentum Score, today's task, progress, completion %, badges, and edge cases)
Actions Taken:
- Built src/app/dashboard/page.tsx: streak card, Momentum Score card, today's task card linking to the correct day, progress grid + legend, completion %, standing, and an achievements/badges section.
- Implemented computeMomentumScore() — a decay-based alternative to a binary streak (+8 per completed day capped at 100, -20 per missed day floored at 0), the team's chosen "thoughtful feature" for consistency.
- Built explicit handling for all three required edge cases via a ?profile= query param and an in-UI profile switcher: default (mid-challenge, includes a missed-day banner), newUser (Day 1, zero streak), and empty (dedicated empty state with a single clear CTA).
- Verified with npx tsc --noEmit and npx eslint src/ — both clean; fixed two pre-existing lint errors (unescaped quotes/apostrophes) and one stale UI string still referencing the demoted "Recruiter Radar" feature instead of Momentum Score.
- Rendered and screenshotted the dashboard and day page at 390px width across all three profiles using a headless browser, to visually confirm the edge cases before calling the work done.

Phase 6 — A Real Bug, Found and Fixed
Prompt: "is my whole work done?" -> "do all things that are open"
Actions Taken:
- Diagnosis: /day/1 was showing the newUser and empty profiles the default profile's (Aditi's) completed GitHub/LinkedIn submission, because the day page trusted global day-status data regardless of which mock profile was viewing it.
- Fix: added a shared getCurrentDayForProfile() helper to lib/data.ts (default profile stays on the global "today"; newUser and empty are always freshly on Day 1), used by both the dashboard and the day page so they can never disagree on which day a profile is actually on.
- Re-verified with tsc, eslint, and a full screenshot regression pass across both pages after the fix to confirm nothing else broke.

Phase 7 — Rename and Documentation
Prompt: "streak60 name of the website fix that in code and give final corrected zip"
Actions Taken:
- Renamed the project from "ABTalks" to "Streak60" across the browser tab title (layout.tsx) and package.json.
- Replaced the untouched create-next-app default README with a real project README, including the required Route Map (/, /dashboard, /day/12), edge-case test URLs, the Momentum Score feature explanation, and the project's file structure.

Phase 8 — Integration with Person B's Work
Prompt: "i am pushing this one first time" -> later: "the repo is same the work of shreya is merged i want to do mine"
Actions Taken:
- Diagnosed a rejected push caused by Shreya's already-merged feature/story-page branch existing on the remote.
- Re-cloned the repository fresh into a clean folder to avoid an unresolved local merge state, rather than force-pushing over a teammate's work.
- Confirmed db.json's aiSummary and caption fields survived Shreya's merge intact.
- Found that getCurrentDayForProfile() (added in Phase 6) was missing from the freshly cloned repo, since that fix postdated the last push — added it back into the correct lib/data.ts in the clean clone before pushing, so the dashboard wouldn't fail to build against the current shared file.
- Copied dashboard/page.tsx into the fresh clone and pushed cleanly on top of Shreya's existing history (verified via git diff HEAD origin/main returning empty — confirming an exact match between local and remote).

===================================================================
PART 3 — Combined Final Feature Set
===================================================================

- Proof Page (Shreya) — AI-generated recruiter summary + 60-day Builder Story timeline at /story/[username]
- Momentum Score (Neeraja) — decaying, forgiving alternative to a binary streak, shown on both /dashboard and /story/[username]
- Shared data layer (Neeraja, extended by Shreya) — src/lib/data.ts and src/data/db.json as the single source of truth for both teammates' pages
- Full required-route coverage: / (Shreya), /dashboard (Neeraja), /day/12 (Neeraja, polished by Shreya)
- Full edge-case coverage: Day 1 / no streak (/day/1, both), missed-day state (visible on dashboard and day page, not hidden), empty profile (/dashboard?profile=empty and /story/empty)
