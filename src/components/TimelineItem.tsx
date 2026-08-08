"use client";

import React, { useState } from "react";
import Link from "next/link";

type Props = {
  day: number;
  status: "completed" | "missed" | "pending" | "locked" | "late";
  title: string;
  caption?: string | null;
  href?: string;
};

export default function TimelineItem({ day, status, title, caption, href }: Props) {
  const [open, setOpen] = useState(false);

  const statusStyles = {
    completed: {
      bg: "bg-green-dim/20 border-green/30 text-green",
      label: "Shipped",
    },
    missed: {
      bg: "bg-red-dim/20 border-red/30 text-red",
      label: "Missed",
    },
    late: {
      bg: "bg-amber-dim/20 border-amber/30 text-amber",
      label: "Late Submission",
    },
    pending: {
      bg: "bg-ink border-amber text-amber border-2",
      label: "Pending Today",
    },
    locked: {
      bg: "bg-ink border-ink-border text-text-faint",
      label: "Locked",
    },
  };

  const style = statusStyles[status];

  return (
    <div className="flex items-start gap-3.5 p-4 rounded-xl border border-ink-border bg-ink-raised hover:border-text-faint/30 transition-colors">
      
      {/* Day circle */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-ink border border-ink-border text-sm font-semibold font-[family-name:var(--font-plex-mono)]">
          {day}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-text truncate">
                {title}
              </h4>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${style.bg}`}>
                {style.label}
              </span>
            </div>
            
            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
              {caption ? caption : "No summary details provided."}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 ml-1 font-[family-name:var(--font-plex-mono)]">
            {href && status !== "locked" ? (
              <Link 
                href={href}
                className="text-xs font-semibold text-amber hover:text-amber/80 underline underline-offset-2"
              >
                View
              </Link>
            ) : null}
            
            {caption && (
              <button
                className="text-[10px] text-text-faint hover:text-text-muted font-medium focus:outline-none"
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-controls={`caption-${day}`}
              >
                {open ? "Collapse" : "Expand"}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Caption Block */}
        {open && caption && (
          <div 
            id={`caption-${day}`} 
            className="mt-3 pt-3 border-t border-ink-border/50 text-xs text-text-muted leading-relaxed font-light bg-ink/30 p-2.5 rounded-lg border border-ink-border/30"
          >
            {caption}
          </div>
        )}
      </div>

    </div>
  );
}
