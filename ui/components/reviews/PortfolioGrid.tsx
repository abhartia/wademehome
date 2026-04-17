"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const fmt = (iso: string) => MONTH_YEAR.format(new Date(iso));

import { StarRating } from "./StarRating";

export interface PortfolioBuilding {
  building: {
    id: string;
    street_line1: string;
    city: string;
    state: string;
    postal_code?: string | null;
  };
  review_count: number;
  avg_rating: number | string | null;
  role: string;
  start_date: string;
  end_date?: string | null;
}

export function PortfolioGrid({ buildings }: { buildings: PortfolioBuilding[] }) {
  if (buildings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No buildings linked to this landlord yet.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {buildings.map(({ building, review_count, avg_rating, role, start_date, end_date }) => {
        const avg = avg_rating ? Number(avg_rating) : null;
        return (
          <Link key={building.id} href={`/buildings/${building.id}`} className="block">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium">{building.street_line1}</div>
                  <Badge variant="outline" className="capitalize">
                    {role}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {building.city}, {building.state} {building.postal_code ?? ""}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {avg !== null ? (
                      <>
                        <StarRating value={Math.round(avg)} size="sm" />
                        <span className="text-xs">{avg.toFixed(1)}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No reviews yet</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review_count} review{review_count === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {fmt(start_date)} – {end_date ? fmt(end_date) : "present"}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
