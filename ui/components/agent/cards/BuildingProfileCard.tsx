"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building, MapPin, Star } from "lucide-react";

import type { BuildingProfileAnnotation } from "../types";

interface Props {
  data: BuildingProfileAnnotation["data"];
}

export function BuildingProfileCard({ data }: Props) {
  const reviews = data.recent_reviews ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Building className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href={`/buildings/${data.id}`}>Open</Link>
        </Button>
      </div>
      <div className="space-y-2 px-4 py-3">
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">
            {data.address}
            {data.city ? `, ${data.city}` : ""}
            {data.state ? `, ${data.state}` : ""}
          </span>
        </p>
        {data.landlord_name ? (
          <p className="text-xs text-muted-foreground">Landlord: {data.landlord_name}</p>
        ) : null}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {typeof data.avg_rating === "number" ? (
            <Badge className="border-transparent bg-amber-500/15 text-[10px] text-amber-700 dark:text-amber-300">
              <Star className="mr-0.5 h-3 w-3" />
              {data.avg_rating.toFixed(1)} ({data.review_count ?? 0})
            </Badge>
          ) : null}
          {typeof data.hpd_open_count === "number" && data.hpd_open_count > 0 ? (
            <Badge className="border-transparent bg-rose-500/15 text-[10px] text-rose-700 dark:text-rose-300">
              {data.hpd_open_count} HPD open
            </Badge>
          ) : null}
          {typeof data.dob_open_count === "number" && data.dob_open_count > 0 ? (
            <Badge className="border-transparent bg-rose-500/15 text-[10px] text-rose-700 dark:text-rose-300">
              {data.dob_open_count} DOB open
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
                {r.verified_tenant ? (
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    verified
                  </Badge>
                ) : null}
              </div>
              {r.title ? <p className="text-xs font-medium">{r.title}</p> : null}
              <p className="line-clamp-2 text-xs text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
