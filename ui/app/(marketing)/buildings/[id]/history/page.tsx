"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { OwnershipTimeline } from "@/components/reviews/OwnershipTimeline";
import {
  readOwnershipHistoryBuildingsBuildingIdOwnershipHistoryGetOptions,
  readBuildingBuildingsBuildingIdGetOptions,
} from "@/lib/api/generated/@tanstack/react-query.gen";

export default function BuildingHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const buildingQ = useQuery(
    readBuildingBuildingsBuildingIdGetOptions({ path: { building_id: id } })
  );
  const historyQ = useQuery(
    readOwnershipHistoryBuildingsBuildingIdOwnershipHistoryGetOptions({
      path: { building_id: id },
    })
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/buildings/${id}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to building
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">Ownership history</h1>
      {buildingQ.data && (
        <div className="text-muted-foreground">
          {buildingQ.data.building.street_line1}
        </div>
      )}
      {historyQ.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <OwnershipTimeline periods={historyQ.data?.periods ?? []} />
      )}
    </div>
  );
}
