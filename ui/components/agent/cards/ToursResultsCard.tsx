"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarCheck, Clock, MapPin } from "lucide-react";

import type { ToursResultsAnnotation } from "../types";

interface Props {
  data: ToursResultsAnnotation["data"];
}

const STATUS_TONE: Record<string, string> = {
  saved: "bg-muted text-muted-foreground",
  requested: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  scheduled: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  completed: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

function formatDate(date?: string, time?: string) {
  if (!date) return time ? time : null;
  try {
    const dt = new Date(`${date}T${time || "00:00"}`);
    if (Number.isNaN(dt.getTime())) return `${date}${time ? ` · ${time}` : ""}`;
    return dt.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(time ? { hour: "numeric", minute: "2-digit" } : {}),
    });
  } catch {
    return `${date}${time ? ` · ${time}` : ""}`;
  }
}

export function ToursResultsCard({ data }: Props) {
  const tours = data.tours ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <CalendarCheck className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/tours">View all</Link>
        </Button>
      </div>
      {tours.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No tours yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {tours.slice(0, 6).map((t) => {
            const when = formatDate(t.scheduled_date, t.scheduled_time);
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image}
                      alt={t.property_name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{t.property_name}</p>
                    <Badge
                      className={`shrink-0 border-transparent text-[10px] uppercase ${STATUS_TONE[t.status] ?? "bg-muted"}`}
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{t.property_address}</span>
                    </span>
                    {when ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {when}
                      </span>
                    ) : null}
                    {t.rent ? <span>{t.rent}</span> : null}
                    {t.beds ? <span>{t.beds}</span> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
