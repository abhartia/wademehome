"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

import type { RoommateMatchesAnnotation } from "../types";

interface Props {
  data: RoommateMatchesAnnotation["data"];
}

export function RoommateMatchesCard({ data }: Props) {
  const matches = data.matches ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Users className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/roommates">Open</Link>
        </Button>
      </div>
      {matches.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No matches yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {matches.slice(0, 6).map((m, idx) => (
            <li key={m.id} className="flex items-start gap-3 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {m.avatar_initials || m.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    #{idx + 1} · {m.name}
                    {m.age ? <span className="text-muted-foreground">, {m.age}</span> : null}
                  </p>
                  {typeof m.compatibility_score === "number" ? (
                    <Badge className="shrink-0 border-transparent bg-emerald-500/15 text-[10px] uppercase text-emerald-700 dark:text-emerald-300">
                      {m.compatibility_score}% match
                    </Badge>
                  ) : null}
                </div>
                {m.occupation || m.target_city ? (
                  <p className="text-xs text-muted-foreground">
                    {[m.occupation, m.target_city].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {m.bio ? (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.bio}</p>
                ) : null}
                {m.compatibility_reasons && m.compatibility_reasons.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {m.compatibility_reasons.slice(0, 3).map((r) => (
                      <Badge
                        key={r}
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
