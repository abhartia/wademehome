"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ListChecks, MapPin } from "lucide-react";

import type { MoveInChecklistAnnotation } from "../types";

interface Props {
  data: MoveInChecklistAnnotation["data"];
}

export function MoveInChecklistCard({ data }: Props) {
  const tasks = data.tasks ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <ListChecks className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/move-in">Open</Link>
        </Button>
      </div>
      {(data.target_address || data.move_date) ? (
        <div className="flex flex-wrap items-center gap-3 border-b bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
          {data.target_address ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{data.target_address}</span>
            </span>
          ) : null}
          {data.move_date ? <span>Move: {data.move_date}</span> : null}
        </div>
      ) : null}
      {tasks.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No tasks yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {tasks.slice(0, 8).map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  t.completed
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                    : "border-border bg-background"
                }`}
              >
                {t.completed ? <Check className="h-3 w-3" /> : null}
              </div>
              <span
                className={`flex-1 text-sm ${
                  t.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {t.label}
              </span>
              {t.category ? (
                <Badge variant="secondary" className="text-[10px] font-normal">
                  {t.category}
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
