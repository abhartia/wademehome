"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { StarRating } from "@/components/reviews/StarRating";
import { readMyReviewsReviewsMineGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const fmt = (iso: string) => MONTH_YEAR.format(new Date(iso));

export default function MyReviewsPage() {
  const myQ = useQuery(
    readMyReviewsReviewsMineGetOptions({ query: { limit: 100, offset: 0 } })
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My reviews</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/search">Find a building</Link>
        </Button>
      </div>

      {myQ.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (myQ.data?.reviews ?? []).length === 0 ? (
        <Card>
          <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
            <p>You haven&apos;t written any reviews yet.</p>
            <p>
              Open a building page and tap <em>Write a review</em>. After
              submitting, upload lease proof to earn the{" "}
              <strong>Verified tenant</strong> badge.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myQ.data!.reviews.map((r) => {
            const tenancy = r.tenancy_end
              ? `${fmt(r.tenancy_start)} – ${fmt(r.tenancy_end)}`
              : `Since ${fmt(r.tenancy_start)}`;
            const statusBadge =
              r.status === "published" ? (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Published
                </Badge>
              ) : r.status === "pending_cooldown" ? (
                <Badge className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <Clock className="h-3 w-3" />
                  In 24h cooldown
                </Badge>
              ) : r.status === "hidden" || r.status === "removed" ? (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {r.status}
                </Badge>
              ) : (
                <Badge variant="outline">{r.status}</Badge>
              );
            return (
              <Card key={r.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StarRating value={r.overall_rating} size="sm" />
                        {statusBadge}
                        {r.verified_tenant && (
                          <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {r.title && <div className="font-medium">{r.title}</div>}
                      <div className="text-xs text-muted-foreground">
                        {tenancy} · Landlord:{" "}
                        <Link
                          href={`/landlords/${r.landlord_entity_id}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {r.landlord_entity_name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/buildings/${r.building_id}`}>
                          View building
                        </Link>
                      </Button>
                      {!r.verified_tenant && (
                        <Button asChild size="sm">
                          <Link href={`/account/reviews/${r.id}/verify`}>
                            Upload proof
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm">
                    {r.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
