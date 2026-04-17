"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ReviewForm } from "@/components/reviews/ReviewForm";
import { readBuildingBuildingsBuildingIdGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

export default function WriteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const buildingQ = useQuery(
    readBuildingBuildingsBuildingIdGetOptions({ path: { building_id: id } })
  );

  if (buildingQ.isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!buildingQ.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">Building not found.</div>
    );
  }

  const { building, current_owner } = buildingQ.data;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/buildings/${id}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">Write a review</h1>
      <ReviewForm
        buildingId={id}
        buildingLabel={`${building.street_line1}, ${building.city} ${building.postal_code ?? ""}`}
        currentOwnerName={current_owner?.canonical_name ?? null}
      />
    </div>
  );
}
