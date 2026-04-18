"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

import type { RoommateConnectionsAnnotation } from "../types";

interface Props {
  data: RoommateConnectionsAnnotation["data"];
}

export function RoommateConnectionsCard({ data }: Props) {
  const connections = data.connections ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <MessageCircle className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/roommates">Open</Link>
        </Button>
      </div>
      {connections.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No active connections."}
        </div>
      ) : (
        <ul className="divide-y">
          {connections.slice(0, 6).map((c) => (
            <li key={c.id} className="flex items-start gap-3 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {c.roommate_initials || c.roommate_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{c.roommate_name}</p>
                  {c.last_message_time ? (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {c.last_message_time}
                    </span>
                  ) : null}
                </div>
                {c.last_message ? (
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {c.last_message}
                  </p>
                ) : null}
                {typeof c.message_count === "number" && c.message_count > 0 ? (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {c.message_count} message(s)
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
