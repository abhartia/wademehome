"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ClipboardList, History } from "lucide-react";

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

import { ReviewCard } from "@/components/reviews/ReviewCard";
import { StarRating } from "@/components/reviews/StarRating";

import {
  readBuildingBuildingsBuildingIdGetOptions,
  readBuildingReviewsBuildingsBuildingIdReviewsGetOptions,
  readHpdViolationsBuildingsBuildingIdHpdViolationsGetOptions,
  readDobComplaintsBuildingsBuildingIdDobComplaintsGetOptions,
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

export default function BuildingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const buildingQ = useQuery(
    readBuildingBuildingsBuildingIdGetOptions({ path: { building_id: id } })
  );
  const reviewsQ = useQuery(
    readBuildingReviewsBuildingsBuildingIdReviewsGetOptions({
      path: { building_id: id },
      query: { limit: 50, offset: 0 },
    })
  );
  const hpdQ = useQuery(
    readHpdViolationsBuildingsBuildingIdHpdViolationsGetOptions({
      path: { building_id: id },
      query: { limit: 50 },
    })
  );
  const dobQ = useQuery(
    readDobComplaintsBuildingsBuildingIdDobComplaintsGetOptions({
      path: { building_id: id },
      query: { limit: 50 },
    })
  );

  if (buildingQ.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (buildingQ.isError || !buildingQ.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="font-medium">Building not found.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const detail = buildingQ.data;
  const { building, current_owner, current_manager, aggregates } = detail;

  const avg = aggregates.avg_overall_rating
    ? Number(aggregates.avg_overall_rating)
    : null;

  const hpdOpenCount = (hpdQ.data?.violations ?? []).filter(
    (v) => (v.status ?? "").toLowerCase().includes("open")
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {building.bbl && <Badge variant="outline">BBL {building.bbl}</Badge>}
          {building.bin && <Badge variant="outline">BIN {building.bin}</Badge>}
          {building.unit_count != null && (
            <Badge variant="outline">{building.unit_count} units</Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold">{building.street_line1}</h1>
        <div className="text-muted-foreground">
          {building.city}, {building.state} {building.postal_code ?? ""}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Current owner</div>
            <div className="font-medium">
              {current_owner ? (
                <Link
                  href={`/landlords/${current_owner.id}`}
                  className="underline-offset-2 hover:underline"
                >
                  {current_owner.canonical_name}
                </Link>
              ) : (
                <span className="text-muted-foreground">Unknown</span>
              )}
            </div>
            {current_owner && (
              <div className="text-xs text-muted-foreground">
                Portfolio: {current_owner.portfolio_size_cached}{" "}
                building{current_owner.portfolio_size_cached === 1 ? "" : "s"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Management</div>
            <div className="font-medium">
              {current_manager ? (
                <Link
                  href={`/landlords/${current_manager.id}`}
                  className="underline-offset-2 hover:underline"
                >
                  {current_manager.canonical_name}
                </Link>
              ) : (
                <span className="text-muted-foreground">Not on file</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1 p-4">
            <div className="text-xs text-muted-foreground">Tenant reviews</div>
            <div className="flex items-center gap-2">
              {avg !== null ? (
                <>
                  <StarRating value={Math.round(avg)} size="sm" />
                  <span className="font-medium">{avg.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-muted-foreground">No reviews yet</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {aggregates.review_count} total ·{" "}
              {aggregates.verified_tenant_review_count} verified
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={`/buildings/${id}/write-review`}>Write a review</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/buildings/${id}/history`}>
            <History className="mr-2 h-4 w-4" />
            Ownership history
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">
            Reviews ({aggregates.review_count})
          </TabsTrigger>
          <TabsTrigger value="hpd">
            <AlertTriangle className="mr-1 h-3 w-3" />
            HPD ({hpdOpenCount})
          </TabsTrigger>
          <TabsTrigger value="dob">
            <ClipboardList className="mr-1 h-3 w-3" />
            DOB ({dobQ.data?.total ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-3">
          {Object.keys(aggregates.dimension_averages).length > 0 && (
            <Card>
              <CardContent className="grid grid-cols-2 gap-x-6 gap-y-1 p-4 text-sm sm:grid-cols-3">
                {Object.entries(aggregates.dimension_averages).map(
                  ([dim, score]) => (
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
                  )
                )}
              </CardContent>
            </Card>
          )}
          {reviewsQ.isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (reviewsQ.data?.reviews ?? []).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No reviews yet. Be the first to share your experience.
              </CardContent>
            </Card>
          ) : (
            reviewsQ.data!.reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))
          )}
        </TabsContent>

        <TabsContent value="hpd" className="space-y-2">
          {(hpdQ.data?.violations ?? []).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No HPD violations on file. (Ingested from NYC OpenData.)
              </CardContent>
            </Card>
          ) : (
            (hpdQ.data?.violations ?? []).map((v) => (
              <Card key={v.violation_id}>
                <CardContent className="space-y-1 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">
                      Class {v.violation_class ?? "?"}
                    </Badge>
                    <Badge
                      variant={
                        (v.status ?? "").toLowerCase().includes("open")
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {v.status ?? "unknown"}
                    </Badge>
                  </div>
                  <div className="text-sm">{v.description}</div>
                  <div className="text-xs text-muted-foreground">
                    Issued {v.novissued_date ?? "?"} · Apt {v.apartment ?? "—"}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="dob" className="space-y-2">
          {(dobQ.data?.complaints ?? []).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No DOB complaints on file.
              </CardContent>
            </Card>
          ) : (
            (dobQ.data?.complaints ?? []).map((c) => (
              <Card key={c.complaint_number}>
                <CardContent className="space-y-1 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{c.category ?? "?"}</Badge>
                    <Badge variant="outline">{c.status ?? "unknown"}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entered {c.date_entered ?? "?"}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
