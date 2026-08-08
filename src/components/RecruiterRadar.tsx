function scoreColor(score: number) {
  if (score >= 70) return "text-green";
  if (score >= 35) return "text-amber";
  return "text-text-muted";
}

function barColor(score: number) {
  if (score >= 70) return "bg-green";
  if (score >= 35) return "bg-amber";
  return "bg-text-faint";
}

export function RecruiterRadar({
  score,
  suggestions,
  empty = false,
}: {
  score: number;
  suggestions: string[];
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-raised p-4 sm:p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold tracking-wide text-text-muted uppercase font-[family-name:var(--font-plex-mono)]">
          Recruiter Radar
        </h3>
        <span
          className={`text-2xl font-bold font-[family-name:var(--font-plex-mono)] ${scoreColor(score)}`}
        >
          {score}%
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-ink border border-ink-border overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${barColor(score)} transition-all`}
          style={{ width: `${Math.max(score, 3)}%` }}
        />
      </div>

      {empty ? (
        <p className="text-sm text-text-muted leading-relaxed">
          Submit your first day to get a score. This measures how strong your
          public build history would look to a recruiter right now.
        </p>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-3 leading-relaxed">
            How compelling your build history would look to a recruiter
            today. Not a vanity metric — every point maps to something fixable.
          </p>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-text leading-relaxed"
              >
                <span className="text-amber shrink-0">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
