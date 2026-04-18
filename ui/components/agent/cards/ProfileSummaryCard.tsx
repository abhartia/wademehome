"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, UserCircle } from "lucide-react";

import type { ProfileSummaryAnnotation } from "../types";

interface Props {
  data: ProfileSummaryAnnotation["data"];
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className={`min-w-0 ${highlight ? "font-medium text-foreground" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export function ProfileSummaryCard({ data }: Props) {
  const updated = new Set(data.updated_fields);

  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <UserCircle className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        {data.updated_fields.length > 0 ? (
          <Badge variant="secondary" className="gap-1 text-xs">
            <CheckCircle2 className="h-3 w-3" />
            Updated
          </Badge>
        ) : null}
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/profile">Edit</Link>
        </Button>
      </div>
      <div className="space-y-2 px-4 py-3">
        <Field
          label="Cities"
          value={data.cities.length ? data.cities.join(", ") : null}
          highlight={updated.has("preferred_cities")}
        />
        <Field
          label="Budget"
          value={data.max_monthly_rent || null}
          highlight={updated.has("max_monthly_rent")}
        />
        <Field
          label="Bedrooms"
          value={data.bedrooms_needed || null}
          highlight={updated.has("bedrooms_needed")}
        />
        <Field
          label="Move timeline"
          value={data.move_timeline || null}
          highlight={updated.has("move_timeline")}
        />
        <Field
          label="Pets"
          value={data.has_pets == null ? null : data.has_pets ? "Yes" : "No"}
          highlight={updated.has("has_pets")}
        />
        {data.dealbreakers.length > 0 ? (
          <div className="flex flex-wrap items-start gap-2 pt-1">
            <span className="w-28 shrink-0 text-sm text-muted-foreground">
              Dealbreakers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.dealbreakers.slice(0, 8).map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  className="text-xs font-normal"
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
