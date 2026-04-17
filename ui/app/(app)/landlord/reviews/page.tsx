"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ReviewCard } from "@/components/reviews/ReviewCard";
import { readLandlordInboxReviewsLandlordInboxGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

export default function LandlordInboxPage() {
  const inboxQ = useQuery(
    readLandlordInboxReviewsLandlordInboxGetOptions({
      query: { limit: 100, offset: 0 },
    })
  );
  const queryClient = useQueryClient();

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Review inbox</h1>
        <Badge variant="outline">{inboxQ.data?.total ?? 0} reviews</Badge>
      </div>

      {inboxQ.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (inboxQ.data?.reviews ?? []).length === 0 ? (
        <Card>
          <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
            <p>No reviews on your claimed entities yet.</p>
            <p>
              Haven&apos;t claimed an entity? Find it on the building page and
              tap <em>Claim profile</em>. After admin approves, reviews show up
              here.{" "}
              <Link
                href="/landlord"
                className="underline-offset-2 hover:underline"
              >
                Back to dashboard
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inboxQ.data!.reviews.map((r) => (
            <div key={r.id} className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Building:{" "}
                <Link
                  href={`/buildings/${r.building_id}`}
                  className="underline-offset-2 hover:underline"
                >
                  View building →
                </Link>
              </div>
              <ReviewCard
                review={{
                  id: r.id,
                  author_display_name: "Tenant",
                  overall_rating: r.overall_rating,
                  title: r.title,
                  body: r.body,
                  tenancy_start: r.tenancy_start,
                  tenancy_end: r.tenancy_end,
                  verified_tenant: r.verified_tenant,
                  landlord_relation: r.landlord_relation,
                  landlord_entity_id: r.landlord_entity_id,
                  landlord_entity_name: r.landlord_entity_name,
                  subratings: r.subratings,
                  response_body: r.response?.body ?? null,
                  created_at: r.created_at,
                }}
                showLandlordLink={false}
                canRespond
                onResponseSubmitted={() =>
                  queryClient.invalidateQueries({
                    queryKey: readLandlordInboxReviewsLandlordInboxGetOptions({
                      query: { limit: 100, offset: 0 },
                    }).queryKey,
                  })
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
