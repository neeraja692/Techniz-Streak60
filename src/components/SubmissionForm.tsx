"use client";

import { useState } from "react";

function isValidGithub(url: string) {
  return /^https:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/i.test(url.trim());
}

function isValidLinkedin(url: string) {
  return /^https:\/\/(www\.)?linkedin\.com\/(posts|feed)\//i.test(url.trim());
}

export function SubmissionForm({ day }: { day: number }) {
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const githubValid = isValidGithub(github);
  const linkedinValid = isValidLinkedin(linkedin);
  const canSubmit = githubValid && linkedinValid;

  if (submitted) {
    return (
      <div className="rounded-xl border border-green/40 bg-green-dim/30 p-5 text-center">
        <div className="text-2xl mb-2">✅</div>
        <p className="font-semibold text-text mb-1">
          Day {day} logged. Streak's alive.
        </p>
        <p className="text-sm text-text-muted">
          Your Recruiter Radar score updates shortly. See you tomorrow.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canSubmit) setSubmitted(true);
      }}
    >
      <div>
        <label
          htmlFor="github"
          className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5 font-[family-name:var(--font-plex-mono)]"
        >
          GitHub repo or commit
        </label>
        <input
          id="github"
          type="url"
          inputMode="url"
          placeholder="https://github.com/you/project"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className={`w-full rounded-lg bg-ink border px-3 py-2.5 text-sm text-text placeholder:text-text-faint outline-none focus:ring-2 focus:ring-amber/60 ${
            touched && !githubValid ? "border-red" : "border-ink-border"
          }`}
        />
        {touched && !githubValid && (
          <p className="mt-1 text-xs text-red">
            Paste a real GitHub repo or commit link.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="linkedin"
          className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5 font-[family-name:var(--font-plex-mono)]"
        >
          LinkedIn post
        </label>
        <input
          id="linkedin"
          type="url"
          inputMode="url"
          placeholder="https://linkedin.com/posts/you-day12"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className={`w-full rounded-lg bg-ink border px-3 py-2.5 text-sm text-text placeholder:text-text-faint outline-none focus:ring-2 focus:ring-amber/60 ${
            touched && !linkedinValid ? "border-red" : "border-ink-border"
          }`}
        />
        {touched && !linkedinValid && (
          <p className="mt-1 text-xs text-red">
            Paste the link to today&apos;s LinkedIn post.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-amber text-ink font-semibold py-3 text-sm active:scale-[0.99] transition-transform"
      >
        Submit Day {day}
      </button>
      <p className="text-xs text-text-faint text-center">
        Both links are required to keep your streak.
      </p>
    </form>
  );
}
