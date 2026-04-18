"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase, Star } from "lucide-react";

import type { LandlordProfileAnnotation } from "../types";

interface Props {
  data: LandlordProfileAnnotation["data"];
}

export function LandlordProfileCard({ data }: Props) {
  const reviews = data.recent_reviews ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Briefcase className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.canonical_name}</p>
      </div>
      <div className="space-y-1 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] font-normal">
            {data.portfolio_size ?? 0} buildings
          </Badge>
          {typeof data.avg_rating === "number" ? (
            <Badge className="border-transparent bg-amber-500/15 text-[10px] text-amber-700 dark:text-amber-300">
              <Star className="mr-0.5 h-3 w-3" />
              {data.avg_rating.toFixed(1)} ({data.review_count ?? 0})
            </Badge>
          ) : null}
          {typeof data.verified_tenant_review_count === "number" &&
          data.verified_tenant_review_count > 0 ? (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {data.verified_tenant_review_count} verified
            </Badge>
          ) : null}
        </div>
      </div>
      {reviews.length > 0 ? (
        <ul className="divide-y border-t">
          {reviews.slice(0, 3).map((r) => (
            <li key={r.id} className="space-y-1 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{r.author}</span>
                <Badge className="border-transparent bg-amber-500/15 text-[10px] text-amber-700 dark:text-amber-300">
                  <Star className="mr-0.5 h-3 w-3" />
                  {r.rating}
                </Badge>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
