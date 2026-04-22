"use client";

import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { useNearbyListings } from "@/lib/listings/useNearbyListings";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { groupPropertiesByBuilding } from "@/lib/properties/groupPropertiesByBuilding";
import { buildPropertyKey } from "@/lib/properties/propertyKey";

interface NeighborhoodLiveListingsProps {
  neighborhoodName: string;
  latitude: number;
  longitude: number;
  radiusMiles?: number;
  limit?: number;
  searchQuery?: string;
  maxRent?: number;
  minRent?: number;
}

function ListingThumb({ src, alt }: { src: string | undefined; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <Building2 className="h-10 w-10 opacity-40" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary property image hosts
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
  );
}

function ListingCardLink({ property }: { property: PropertyDataItem }) {
  const href = `/properties/${encodeURIComponent(buildPropertyKey(property))}`;
  const imageUrl = property.images_urls?.[0];
  const amenities = property.main_amenities?.slice(0, 3).join(" · ");

  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="flex h-full flex-col overflow-hidden py-0 transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <ListingThumb src={imageUrl} alt={property.name} />
          {property.concessions ? (
            <Badge
              variant="secondary"
              className="absolute left-2 top-2 bg-background/90 text-[10px] font-medium shadow-sm"
            >
              {property.concessions}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
          <h3 className="line-clamp-1 text-sm font-semibold leading-tight group-hover:text-primary">
            {property.name}
          </h3>
          <div className="flex items-start gap-1 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
            <p className="line-clamp-1 min-w-0">{property.address}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPropertyRangeLabel(property.bedroom_range)}
          </p>
          {amenities ? (
            <p className="line-clamp-1 text-[11px] text-muted-foreground/80">
              {amenities}
            </p>
          ) : null}
          <div className="mt-auto pt-1 text-sm font-bold text-foreground">
            {formatPropertyRangeLabel(property.rent_range)}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ListingSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden py-0">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 px-3 py-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  );
}

export function NeighborhoodLiveListings({
  neighborhoodName,
  latitude,
  longitude,
  radiusMiles = 1.2,
  limit = 6,
  searchQuery,
  maxRent,
  minRent,
}: NeighborhoodLiveListingsProps) {
  const nearbyQuery = useNearbyListings({
    mode: "radius",
    latitude,
    longitude,
    radiusMiles,
    limit: Math.max(limit * 3, 18),
    maxRent,
    minRent,
  });

  const baseSearch = searchQuery ?? `${neighborhoodName} apartments`;
  const priceSuffix = maxRent ? ` under $${maxRent.toLocaleString()}` : "";
  const searchHref = `/search?q=${encodeURIComponent(baseSearch + priceSuffix)}`;

  const groups = nearbyQuery.data?.properties
    ? groupPropertiesByBuilding(nearbyQuery.data.properties)
    : [];
  const representatives = groups.map((g) => g.units[0]).slice(0, limit);
  const totalInRadius = nearbyQuery.data?.properties?.length ?? 0;

  if (nearbyQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live {neighborhoodName} Listings</CardTitle>
          <CardDescription>
            Real apartments for rent in {neighborhoodName} right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (nearbyQuery.isError || representatives.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live {neighborhoodName} Listings</CardTitle>
          <CardDescription>
            Real apartments for rent in {neighborhoodName} right now
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No live {neighborhoodName} listings are loaded in your area right
            now. Our assistant can pull current inventory for you in seconds —
            just tell it what you&apos;re looking for.
          </p>
          <Button asChild>
            <Link href={searchHref}>
              Search {neighborhoodName} apartments
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Live {neighborhoodName} Listings</CardTitle>
          <CardDescription>
            Real apartments for rent in {neighborhoodName} right now
            {totalInRadius > representatives.length
              ? ` · ${totalInRadius} more within ${radiusMiles} miles`
              : null}
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={searchHref}>See all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {representatives.map((property) => (
            <ListingCardLink
              key={buildPropertyKey(property)}
              property={property}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Showing {representatives.length} of {totalInRadius} apartments within{" "}
          {radiusMiles} miles of {neighborhoodName}. Rent ranges are live from
          landlords and refresh continuously.
        </p>
      </CardContent>
    </Card>
  );
}
