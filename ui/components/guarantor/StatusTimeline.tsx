"use client";

import { StatusHistoryEntry } from "@/lib/types/guarantor";
import { cn } from "@/lib/utils";

const STEPS = ["draft", "sent", "viewed", "signed"] as const;

const STEP_LABELS: Record<string, string> = {
  draft: "Created",
  sent: "Sent",
  viewed: "Viewed",
  signed: "Signed",
};

function formatTimestamp(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: string;
}

export function StatusTimeline({ history, currentStatus }: StatusTimelineProps) {
  const reachedStatuses = new Set(history.map((h) => h.status));
  const currentIdx = STEPS.indexOf(currentStatus as (typeof STEPS)[number]);

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const reached = reachedStatuses.has(step);
        const isCurrent = step === currentStatus;
        const entry = history.find((h) => h.status === step);
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  reached && step === "signed"
                    ? "border-green-500 bg-green-500"
                    : reached
                      ? "border-primary bg-primary"
                      : isCurrent || i === currentIdx + 1
                        ? "border-primary bg-transparent"
                        : "border-muted-foreground/20 bg-transparent",
                )}
              >
                {reached && (
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-6",
                    reached && reachedStatuses.has(STEPS[i + 1])
                      ? "bg-primary"
                      : "bg-muted-foreground/15",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-xs font-medium leading-5",
                  reached ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {STEP_LABELS[step]}
              </p>
              {entry && (
                <p className="text-[11px] text-muted-foreground">
                  {entry.note} &middot; {formatTimestamp(entry.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
