"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

import type { GroupListAnnotation } from "../types";

interface Props {
  data: GroupListAnnotation["data"];
}

export function GroupListCard({ data }: Props) {
  const groups = data.groups ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <UsersRound className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/groups">Open</Link>
        </Button>
      </div>
      {groups.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No groups yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {groups.slice(0, 6).map((g) => {
            const pendingInvites = (g.invites ?? []).filter((i) => i.status === "pending").length;
            return (
              <li key={g.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <UsersRound className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{g.name}</p>
                    <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                      {g.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {g.member_count ?? 0} member(s)
                    {typeof g.saved_count === "number" ? ` · ${g.saved_count} saved` : ""}
                    {pendingInvites > 0 ? ` · ${pendingInvites} pending invite(s)` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
