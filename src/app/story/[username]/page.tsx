import React from "react";
import Link from "next/link";
import { getAllDays, getProfile, resolveProfileKey, computeMomentumScore } from "@/lib/data";
import TimelineItem from "@/components/TimelineItem";

type Props = {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function StoryPage({ params, searchParams }: Props) {
  const profileKey = resolveProfileKey(params.username as any);
  const profile = getProfile(profileKey);
  const days = getAllDays().slice(0, 12); // show first 12 for compact story

  const profileQuery = typeof searchParams?.profile === "string" ? `?profile=${searchParams.profile}` : `?profile=${profileKey}`;

  const momentum = computeMomentumScore(profileKey);

  return (
    <div className="min-h-screen p-4 bg-white text-ink-navy">
      <main className="max-w-md mx-auto">
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
              <p className="text-sm text-gray-600">{params.username}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Momentum</div>
              <div className="text-lg font-medium">{momentum}</div>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
            {profile.aiSummary ? (
              <p className="text-sm leading-snug line-clamp-3">{profile.aiSummary}</p>
            ) : (
              <p className="text-sm leading-snug text-gray-600">No AI summary yet 14 submit Day 1 to generate a personalized summary.</p>
            )}

            <div className="mt-3 flex gap-2">
              <Link href={`/dashboard${profileQuery}`}>
                <a className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded">Back to dashboard</a>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2">Builder Story</h3>

          <div className="space-y-2 mt-2">
            {days.map((d) => (
              <TimelineItem
                key={d.day}
                day={d.day}
                status={d.status === "missed" ? "missed" : d.status === "locked" ? "locked" : d.status === "pending" ? "pending" : d.submission?.late ? "late" : "completed"}
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
