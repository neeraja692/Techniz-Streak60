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
  const statusColor =
    status === "completed" ? "bg-emerald-100 text-emerald-800" : status === "missed" ? "bg-amber-100 text-amber-800" : status === "late" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700";

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-sm font-medium">{day}</div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">{title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded ${statusColor}`}>{status}</span>
              {status === "late" && <span className="text-xs text-gray-500 ml-1">Late</span>}
            </div>
            <div className="text-xs text-gray-500">{caption ? `${caption.slice(0, 100)}` : "No details"}</div>
          </div>

          <div className="ml-2 flex flex-col items-end gap-1">
            {href ? (
              <Link href={href}>
                <a className="text-xs text-amber-600">View</a>
              </Link>
            ) : null}
            <button
              className="text-xs text-gray-500"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls={`caption-${day}`}
            >
              {open ? "Hide" : "Expand"}
            </button>
          </div>
        </div>

        {open && (
          <div id={`caption-${day}`} className="mt-2 text-sm text-slate-700">
            {caption || "No additional notes."}
          </div>
        )}
      </div>
    </div>
  );
}
