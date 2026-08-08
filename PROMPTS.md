# Vibe Coding Log — ABTalks Redesign

This log documents the actual build process for the ABTalks redesign —
decisions made, ideas rejected, and one real bug that was caught and
fixed — as proof of the vibe-coding workflow used for this hackathon
submission.

---

## 1. Scoping the brief

Before any code, the problem statement was broken into an explicit
requirements checklist rather than working from assumptions:

- Landing (`/`): trust, clarity, motivation to commit to 60 days
- Dashboard (`/dashboard`): streak, today's task, progress, completion %, standing/achievements
- Challenge day (`/day/12`): task, requirements, GitHub + LinkedIn submission
- Cross-cutting: mobile-first at 390px, understandable to a first-time visitor, mocked JSON data, one thoughtful original feature
- Required edge cases: Day 1 / no streak, a missed day, an empty profile

This checklist was treated as the single source of truth for what
"done" meant, separate from any feature brainstorming.

## 2. Feature ideation — narrowing, not just generating

Multiple rounds of candidate "extra feature" ideas were generated and
deliberately cut down rather than stacked:

- **Round 1:** streak freeze / grace token, auto-generated share card, draft auto-save, catch-up mode, time-of-day nudges, leaderboard
- **Round 2:** narrowed to ideas specific to *this* context (Indian college students, GitHub+LinkedIn proof, recruiter visibility) rather than generic streak-app patterns — Builder Story (public timeline profile), Momentum Score (decaying score vs. binary streak), Recruiter Radar (profile-strength meter), Verified Build (authenticity check)
- **Round 3:** a teammate proposed a points/leaderboard/token-shop/Discord system; this was deliberately scoped back down rather than adopted wholesale, keeping only the underlying "earn your forgiveness" mechanic and folding it into Momentum Score instead of building a separate economy

**Final decision:** two features, not five — an AI-generated recruiter
summary combined with a public Builder Story page (flagship), plus
Momentum Score as the consistency mechanic. Rejected ideas (Recruiter
Radar, Verified Build, leaderboard, token shop) were kept as
consciously-scoped-out "future roadmap" items rather than silently
dropped, to be able to explain the scoping decision to judges.

## 3. Naming and visual identity

The flagship feature was named "Proof Page" — deliberately reusing the
problem statement's own phrase ("daily proof of work") so the name
explains itself to a judge without extra context.

## 4. Build order

Standard instinct is to build the easiest screen first (landing) for
early momentum. That was deliberately reversed: `/day/12` was built
first because it has the most data dependencies and would surface
data-model problems earliest; `/dashboard` second since it mostly
aggregates what `/day/12` already proved worked; `/` last since it
needed almost no dynamic data and carried the least risk.

## 5. Tooling constraint → implementation decision

The original plan specified Next.js + Tailwind + Vercel. Once inside
the actual build environment (no network access for `npm install`),
the approach was adapted to static HTML/CSS/JS with an identical
folder-per-route structure (`/`, `/dashboard/`, `/day/12/`), so the
required route map still holds exactly — deployable to Vercel with
zero build step.

## 6. A real bug, caught and fixed

After the first deploy-ready version, opening any page directly
(double-click / mobile file viewer) showed no styling and no dynamic
content. Diagnosis: browsers block `fetch()` to local files and some
mobile file-preview apps don't process external `<link>` stylesheets
when a file is opened via `file://` instead of served over HTTP — a
real CORS/loading gotcha, not a code logic bug.

**Fix:** every page was made fully self-contained — CSS inlined via
`<style>`, mock data embedded directly as a JS object instead of
fetched, and `app.js` inlined too — so every route renders correctly
whether opened directly, previewed on a phone, or deployed properly.

## 7. Theme iteration

Three full visual directions were built and compared, not just one:

1. **"Commit Grid"** — dark theme built around a GitHub-contribution-graph motif (day cells as the core signature element, functionally meaningful — not decorative)
2. **"Pin Board"** — a Pinterest-coded light theme with real CSS-column masonry for the day-log feed and testimonials
3. **"Desk Lamp"** (final) — a warm, low-glare dark theme chosen specifically because the brief states most usage happens late at night on phones; avoids blue-tinted blacks and neon (both increase eye strain at night) in favor of a warm charcoal background, amber glow accents, cream (not stark white) text, and a serif display face for a calmer feel

The Commit Grid's day-cell signature element was carried through all
three themes as the one constant, since it's the part that's
functionally tied to the product (each cell = one real day), not just
decoration.

## 8. Edge cases as first-class screens, not just states

Initially the "Day 1 / no streak" requirement was handled only as a
visual state inside other pages. On review, it was rebuilt as its own
standalone route (`/day/1/`) with distinct copy ("there's nothing to
catch up on — you're exactly on time") rather than reusing Day 12's
copy with different numbers, since a first-time user's context is
different enough to need different messaging, not just different data.

---

## Final feature set shipped

- **Proof Page** — AI-generated recruiter summary + 60-day Builder
  Story timeline (`/story/[username]`)
- **Momentum Score** — decaying, forgiving alternative to a binary streak
- Full edge-case coverage: `/day/1` (no streak), missed-day state
  (visible, not hidden, across grid/timeline), `/story/new-user`
  (empty profile)

---

# Next.js Migration & Refactoring Prompt History

This section details the prompts and AI conversation log during the migration of Shreya's (Person B's) features from static HTML files into the Next.js app on branch `feature/story-page`.

## Phase 1 — Project Diagnosis & Scope Alignment

### Prompt
> "This my repo https://github.com/neeraja692/Techniz-Streak60, where my project is, view it and analyse. Here's the full plan... I am Person B (Shreya). Is my work completed?"

### Actions Taken
* Audited the cloned codebase.
* Identified that the landing page `/` was still boilerplate.
* Fixed the `params` dynamic route Promise rendering issue on `/story/[username]`.
* Cleaned up Next.js hydration issues (removed nested `<a>` inside `<Link>`).
* Resolved the light-theme styling mismatch on the story page to align with the rest of the application.

---

## Phase 2 — Landing Page Redesign (Desk Lamp Theme Alignment)

### Prompt
> "this is frontend theme of my project dont changes regarding theme" *(Mockup screenshot of the gold-accented mobile landing page provided)*

### Actions Taken
* Redesigned `/` at [src/app/page.tsx](file:///C:/Users/sy432/.gemini/antigravity/scratch/Techniz-Streak60/src/app/page.tsx).
* Added a warm, low-glare grid of square panels in the background to resemble the screenshot's watermark.
* Replaced boilerplate layout with the serif display face ("AB Talks", "Build in public...") and gold pill buttons.
* Added the collapsible Sandbox Profile Selector to allow testing different profile routing states.

---

## Phase 3 — Integrating the Backup Zip Archive (Day & Timeline Features)

### Prompt
> `"C:\Users\sy432\Downloads\abtalks-site.zip", this what my previous zip file in this there momentum tracker, page 1, page 60. Analyze it and add the missing features to my project`
> `you can analyse the provided zip file and add the missing features in context with shreya's work don't do things that comes under neeraja's work.`

### Actions Taken
* Extracted and analyzed the static mockup zip.
* Kept dashboard changes out of scope to avoid conflicting with Neeraja's task.
* Ported the custom Day 1 "No Streak" state for Rohan/Guest to [src/app/day/[dayNumber]/page.tsx](file:///C:/Users/sy432/.gemini/antigravity/scratch/Techniz-Streak60/src/app/day/%5BdayNumber%5D/page.tsx).
* Generalized the progress path tracker as a dynamic `PathStrip` widget on the Day details page.
* Integrated dynamic Days Built, Longest Streak, and Momentum Score panels alongside the 60-day visual grid on `/story/[username]`.
