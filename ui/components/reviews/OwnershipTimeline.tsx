"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const fmt = (iso: string) => MONTH_YEAR.format(new Date(iso));

export interface OwnershipPeriod {
  id: string;
  landlord_entity: {
    id: string;
    canonical_name: string;
    kind: string;
  };
  role: string;
  start_date: string;
  end_date?: string | null;
  source: string;
}

export function OwnershipTimeline({ periods }: { periods: OwnershipPeriod[] }) {
  if (periods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No ownership history on file yet. ACRIS ingest will populate this
          over time.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {periods.map((p) => (
        <Card key={p.id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div>
              <Link
                href={`/landlords/${p.landlord_entity.id}`}
                className="font-medium underline-offset-2 hover:underline"
              >
                {p.landlord_entity.canonical_name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <Badge variant="outline" className="capitalize">
                  {p.role}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {p.landlord_entity.kind.replace("_", " ")}
                </Badge>
                <span>Source: {p.source.replace("_", " ")}</span>
              </div>
            </div>
            <div className="text-right text-sm">
              <div>
                {fmt(p.start_date)} — {p.end_date ? fmt(p.end_date) : "present"}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
