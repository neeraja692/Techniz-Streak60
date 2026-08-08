# 🚀 Streak60 — Build in Public. 60 Days. One Streak.

Streak60 is a 60-day build challenge platform for college students to
build consistently, document their progress publicly, and create a
recruiter-facing portfolio that shows real work — not just completed
courses.

Instead of collecting certificates, Streak60 asks students to build
something every day and prove it with a GitHub commit and a LinkedIn
post, tracked through a forgiving Momentum Score, achievements, and a
recruiter-focused summary page.

**🔗 Live demo:** https://techniz-streak60.vercel.app/
**🔗 Repository:** https://github.com/neeraja692/Techniz-Streak60

---

## ✨ Features

### 🎯 60-Day Build Challenge
- Daily challenge tracking with day-by-day pages
- 60-day progress visualization
- Four explicit states per day: **completed**, **missed**, **pending**, **locked**
- Upcoming days stay locked until reached

### 📊 Student Dashboard
Centralized view of a student's progress:
- 🔥 Current streak + longest streak
- 📈 Momentum Score
- 📅 Today's task
- 📊 Overall completion percentage
- 🥇 Standing / rank
- 🎖️ Achievements and badges
- 🟩 60-day progress grid
- ⚠️ Missed-day acknowledgment (honest, not punishing)

The dashboard updates live based on the selected profile.

### 💻 Daily Submission System
Every challenge day requires proof:
- 🔗 GitHub repository or commit URL
- 🔗 LinkedIn post URL

Both links are validated client-side and required to keep a streak active.

### 📈 Momentum Score
A forgiving alternative to a raw streak counter: completed days add to
the score, missed days subtract more than a single day adds — so one
bad day costs you, but doesn't erase weeks of consistent work the way
a hard streak-reset would.

### 🎖️ Achievements & Badges
Earned as students progress; shown on the dashboard for visual feedback.

### 🤖 Recruiter Radar
Estimates how compelling a student's public build history would look
to a recruiter — a score, a visual indicator, and specific improvement
suggestions (e.g. "add a project link to your last post"). Encourages
a portfolio built on real, consistent work rather than credentials
alone.

### ✨ AI Builder Story
A recruiter-friendly, shareable summary page per student:
- Name, college, track, standing
- AI-generated assessment of their build history
- Total days built, longest streak, Momentum Score
- 60-day consistency map
- Full build timeline

### 🧪 Profile Simulation
Three seeded profiles demonstrate every required UI state without a
real backend:

| Profile | Purpose |
|---|---|
| `default` | Mid-challenge student with real progress, a missed day, and a late submission |
| `newUser` | Student starting from Day 1, no streak yet |
| `empty` | Clean slate — no track picked, nothing submitted |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16.3.0 | React framework, App Router |
| React 19.2.8 | UI |
| TypeScript | Type-safe data layer and components |
| Tailwind CSS 4 | Styling, responsive UI |
| JSON data layer | Seeded challenge + profile data (no backend) |
| Vercel | Deployment |

---

## 🏗️ Project Structure

```
Techniz-Streak60/
├── public/                          static assets
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx       student dashboard
│   │   ├── day/[dayNumber]/page.tsx individual challenge day
│   │   ├── story/[username]/page.tsx AI Builder Story
│   │   ├── globals.css              theme tokens (ink-navy + amber/green/red)
│   │   ├── layout.tsx
│   │   └── page.tsx                 landing page
│   ├── components/
│   │   ├── CommitGrid.tsx           streak/progress grid (signature visual)
│   │   ├── RecruiterRadar.tsx       recruiter-facing profile strength score
│   │   ├── SubmissionForm.tsx       GitHub + LinkedIn submission UI
│   │   └── TimelineItem.tsx         one day's row on the Builder Story timeline
│   ├── data/db.json                 all mock data — profiles, days, leaderboard, landing stats
│   └── lib/data.ts                  typed data-access layer every page reads through
├── AGENTS.md / CLAUDE.md            Next.js-generated AI agent guidance (do not remove)
├── PROMPTS.md                       vibe-coding build log
└── README.md
```

---

## 🔄 Application Flow

```
Landing Page
     │
     ▼
Choose Profile / Start Day 1
     │
     ▼
Dashboard ──┬── Today's Task ──▶ Day Page ──▶ Submit GitHub + LinkedIn
            ├── Progress Grid                        │
            └── Achievements                          ▼
                                              Streak / Momentum updates
                                                        │
                                                        ▼
                                              AI Builder Story (public)
```

---

## 📱 Main Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | Student progress dashboard |
| `/day/[dayNumber]` | Individual challenge day |
| `/story/[username]` | AI Builder Story |

All routes accept `?profile=default\|newUser\|empty` to demo every
required edge case without real authentication.

---

## 📊 Data Architecture

All challenge and profile data lives in `src/data/db.json`, accessed
exclusively through typed helpers in `src/lib/data.ts`:

- `getProfile()`, `resolveProfileKey()` — profile lookups + safe fallback
- `getDay()` — O(1) single-day lookup (the hot path for `/day/[dayNumber]`)
- `getAllDays()` — sorted full list, used for the streak grid and Momentum Score
- `getToday()`, `getChallengeLength()` — challenge metadata
- `getLeaderboard()`, `getLandingStats()` — pass-throughs for those sections
- `computeMomentumScore()` — +8/completed (capped 100), −20/missed (floored 0)
- `buildStreakGrid()` — the 60-cell status array `CommitGrid` renders

`days` is object-keyed by day number (not an array) specifically so
`/day/[dayNumber]` gets a direct lookup instead of scanning a list on
every page load.

---

## 🎨 Design Philosophy

- Minimal, dark developer-style theme (ink-navy background)
- Amber accent for active/streak elements, green/red for status
- IBM Plex Mono + Manrope
- Compact information cards, progress-oriented visualizations
- Mobile-first (390px), recruiter-friendly on the Builder Story page
- Feels closer to a developer productivity tool than a classroom dashboard

---

## 🚀 Getting Started

```bash
git clone https://github.com/neeraja692/Techniz-Streak60.git
cd Techniz-Streak60
npm install
npm run dev
```
Visit `http://localhost:3000`.

## 📦 Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint check |

---

## 🌐 Deployment

Deployed on Vercel, connected directly to this GitHub repository.

```
GitHub Repository → Vercel → Production Build → Live Application
```
**Live:** https://techniz-streak60.vercel.app/

---

## 🔐 Current Implementation Notes

Streak60 is currently a front-end-focused prototype with seeded, local
data. Submission forms validate GitHub and LinkedIn URLs client-side;
profile, challenge, leaderboard, and progress data all come from the
local JSON data layer — no real backend, auth, or database, by design
for this hackathon scope.

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Real database integration
- [ ] Persistent user submissions
- [ ] Real GitHub / LinkedIn API integration + automated verification
- [ ] Real-time leaderboard
- [ ] User-created profiles, custom challenge tracks
- [ ] Full 60-day challenge content (currently seeded through Day 14)
- [ ] AI-generated recruiter feedback (beyond the current mocked summary)
- [ ] Streak freeze functionality
- [ ] Admin dashboard, production-grade backend API

---

## 🎓 Target Users

College students, engineering students, and beginner-to-intermediate
developers across Full Stack, AI/ML, and DSA tracks who want a public,
provable record of consistent building — not just another course
certificate.

## 💡 Why Streak60?

> Don't just learn. Build. Ship. Prove it. Repeat.

Many students spend months learning without producing visible proof of
skill. Streak60 turns daily technical work into a measurable,
shareable journey — one a recruiter can actually skim in under a
minute via the AI Builder Story page.

## 🧩 Challenge Tracks

- **Full Stack Web Development** — ship practical web projects, build a consistent GitHub presence
- **AI / ML Engineering** — machine-learning-focused tasks, documented publicly
- **Data Structures & Algorithms** — consistent problem-solving practice with a visible record

## 📈 Progress Model

| Status | Meaning |
|---|---|
| 🟩 Completed | Challenge successfully completed |
| 🟥 Missed | Challenge was not completed |
| 🟨 Pending | Current active challenge |
| ⬛ Locked | Future challenge, not yet reached |

---

## 🤝 Contributing

```bash
# Fork, then:
git clone <your-fork-url>
cd Techniz-Streak60
git checkout -b feature/your-feature

# make your changes, then:
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature
```
Then open a Pull Request.

## 📄 License

MIT License — see [`LICENSE`](./LICENSE).

```
MIT License

Copyright (c) 2026 Techniz-Streak60 contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ✅ Verified against the live deployment

The dashboard, landing page, and profile-simulation routes described
above were checked directly against the live deployment
(`techniz-streak60.vercel.app`) — the numbers on `/dashboard?profile=default`
(streak 2, best 8, momentum 60, rank #214 of 3820) match `src/data/db.json`
and the `computeMomentumScore()` formula in `src/lib/data.ts` exactly.

---

⭐ If you find this project useful, consider starring the repo and
sharing it with other students who want to build consistently.

**Build in public. 60 days. One streak.**
