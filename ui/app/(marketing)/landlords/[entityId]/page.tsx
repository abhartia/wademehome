"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { PortfolioGrid } from "@/components/reviews/PortfolioGrid";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { StarRating } from "@/components/reviews/StarRating";

import {
  readEntityLandlordEntitiesEntityIdGetOptions,
  readPortfolioLandlordEntitiesEntityIdBuildingsGetOptions,
  readReviewsLandlordEntitiesEntityIdReviewsGetOptions,
} from "@/lib/api/generated/@tanstack/react-query.gen";

const DIMENSION_LABELS: Record<string, string> = {
  responsiveness: "Responsiveness",
  maintenance: "Maintenance",
  deposit_return: "Deposit return",
  heat_hot_water: "Heat / hot water",
  pest_control: "Pest control",
  harassment: "Respect",
  building_condition: "Building condition",
  noise: "Noise",
  value: "Value",
};

export default function LandlordEntityPage({
  params,
}: {
  params: Promise<{ entityId: string }>;
}) {
  const { entityId } = use(params);
  const entityQ = useQuery(
    readEntityLandlordEntitiesEntityIdGetOptions({ path: { entity_id: entityId } })
  );
  const portfolioQ = useQuery(
    readPortfolioLandlordEntitiesEntityIdBuildingsGetOptions({
      path: { entity_id: entityId },
    })
  );
  const reviewsQ = useQuery(
    readReviewsLandlordEntitiesEntityIdReviewsGetOptions({
      path: { entity_id: entityId },
      query: { limit: 50, offset: 0 },
    })
  );

  if (entityQ.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (!entityQ.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">Landlord not found.</div>
    );
  }

  const entity = entityQ.data;
  const avg = entity.avg_rating ? Number(entity.avg_rating) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="capitalize">
            {entity.kind.replace("_", " ")}
          </Badge>
          {entity.claimed && (
            <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">
              Claimed profile
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold">{entity.canonical_name}</h1>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Portfolio</div>
            <div className="text-xl font-semibold">{entity.portfolio_size}</div>
            <div className="text-xs text-muted-foreground">buildings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Rating</div>
            <div className="flex items-center gap-2">
              {avg !== null ? (
                <>
                  <StarRating value={Math.round(avg)} size="sm" />
                  <span className="text-xl font-semibold">{avg.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Reviews</div>
            <div className="text-xl font-semibold">{entity.review_count}</div>
            <div className="text-xs text-muted-foreground">
              {entity.verified_tenant_review_count} verified
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(entity.dimension_averages).length > 0 && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-1 p-4 text-sm sm:grid-cols-3">
            {Object.entries(entity.dimension_averages).map(([dim, score]) => (
              <div
                key={dim}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {DIMENSION_LABELS[dim] ?? dim}
                </span>
                <span className="font-medium">
                  {Number(score).toFixed(1)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!entity.claimed && (
        <Card>
          <CardContent className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">Are you this landlord?</div>
              <div className="text-sm text-muted-foreground">
                Claim the profile to respond to reviews and correct details.
              </div>
            </div>
            <Button asChild>
              <Link href={`/landlords/${entityId}/claim`}>Claim profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Reviews ({entity.review_count})</TabsTrigger>
          <TabsTrigger value="buildings">
            Buildings ({entity.portfolio_size})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-3">
          {reviewsQ.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (reviewsQ.data?.reviews ?? []).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No reviews yet.
              </CardContent>
            </Card>
          ) : (
            reviewsQ.data!.reviews.map((r) => (
              <ReviewCard key={r.id} review={r} showLandlordLink={false} />
            ))
          )}
        </TabsContent>
        <TabsContent value="buildings">
          {portfolioQ.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <PortfolioGrid buildings={portfolioQ.data?.buildings ?? []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
