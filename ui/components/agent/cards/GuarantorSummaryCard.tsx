"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Mail } from "lucide-react";

import type { GuarantorSummaryAnnotation } from "../types";

interface Props {
  data: GuarantorSummaryAnnotation["data"];
}

export function GuarantorSummaryCard({ data }: Props) {
  const saved = data.saved ?? [];
  const requests = data.requests ?? [];
  const empty = saved.length === 0 && requests.length === 0;
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/guarantor">Open</Link>
        </Button>
      </div>
      {empty ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No saved guarantors or requests yet."}
        </div>
      ) : (
        <div className="divide-y">
          {saved.length > 0 ? (
            <div className="px-4 py-3">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Saved guarantors
              </p>
              <ul className="space-y-1.5">
                {saved.slice(0, 4).map((g) => (
                  <li key={g.id} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {g.email}
                    </span>
                    {g.relationship ? (
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {g.relationship}
                      </Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {requests.length > 0 ? (
            <div className="px-4 py-3">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Active requests
              </p>
              <ul className="space-y-2">
                {requests.slice(0, 4).map((r) => (
                  <li key={r.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">
                        {r.guarantor_name} → {r.property_name || "—"}
                      </span>
                      <Badge className="border-transparent bg-amber-500/15 text-[10px] uppercase text-amber-700 dark:text-amber-300">
                        {r.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {[r.property_address, r.monthly_rent]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {r.invite_url ? (
                      <a
                        href={r.invite_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary underline"
                      >
                        Copy invite link
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
