"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, CalendarPlus, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePropertyFavorites } from "@/lib/properties/api";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";
import { AddPropertyModal } from "@/components/tours/AddPropertyModal";
import { ScheduleTourSheet } from "@/components/tours/ScheduleTourSheet";
import { TourProperty } from "@/lib/types/tours";
import { getListingByPropertyKeyListingsByPropertyKeyGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

// Build a TourProperty from the full listing row. Falls back to minimal favorite
// fields — a manually-added listing may have blank rent/beds/image if the paste
// didn't yield them, and that's OK: the schedule sheet still works with just
// name + address.
function tourPropertyFrom(
  propertyKey: string,
  favoriteName: string,
  favoriteAddress: string,
  detail: PropertyDataItem | null,
): TourProperty {
  return {
    id: propertyKey,
    name: detail?.name || favoriteName,
    address: detail?.address || favoriteAddress,
    rent: detail?.rent_range || "",
    beds: detail?.bedroom_range || "",
    image: detail?.images_urls?.[0] || "",
    tags: (detail?.main_amenities || []).slice(0, 3),
  };
}

export default function SavedPage() {
  const activeGroupId = useActiveGroupId();
  const favoritesQuery = usePropertyFavorites({ groupId: activeGroupId });
  const groupsQuery = useMyGroups();
  const qc = useQueryClient();

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleProperty, setScheduleProperty] = useState<TourProperty | undefined>();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const favorites = favoritesQuery.data?.favorites ?? [];
  const activeGroup = activeGroupId
    ? groupsQuery.data?.groups.find((g) => g.id === activeGroupId)
    : undefined;

  // User-added and scraper-ingested listings both live in the shared listings
  // table under the same property_key scheme — so one fetch works for either.
  const openSchedule = async (f: (typeof favorites)[number]) => {
    setPendingKey(f.property_key);
    let detail: PropertyDataItem | null = null;
    try {
      const row = await qc.fetchQuery({
        ...getListingByPropertyKeyListingsByPropertyKeyGetOptions({
          query: { property_key: f.property_key },
        }),
        staleTime: 5 * 60_000,
      });
      detail = normalizePropertyDataItem(row);
    } catch {
      // 404 or network — fall back to the minimal favorite row. Happens when a
      // user-added listing has visibility quirks or the row has been removed.
    }
    setScheduleProperty(
      tourPropertyFrom(f.property_key, f.property_name, f.property_address, detail),
    );
    setPendingKey(null);
    setScheduleOpen(true);
  };

  const heading = activeGroup
    ? `Saved in ${activeGroup.name}`
    : "Saved properties";
  const subheading = activeGroup
    ? "Properties you and your group have bookmarked."
    : "Properties you've bookmarked for later.";

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{heading}</h1>
            <p className="text-xs text-muted-foreground">{subheading}</p>
          </div>
          <AddPropertyModal />
        </div>

        {favoritesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground/50" />
            <h3 className="text-sm font-semibold">No saved properties yet</h3>
            <p className="max-w-xs text-xs text-muted-foreground">
              Find listings through search and tap Save to bookmark them here.
            </p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 gap-1.5 text-xs"
            >
              <Link href="/search">
                <Search className="h-3.5 w-3.5" />
                Go to Search
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <Card
                key={f.property_key}
                className="flex h-full flex-col transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-sm">
                    <Link
                      href={`/properties/${encodeURIComponent(f.property_key)}`}
                      className="hover:underline"
                    >
                      {f.property_name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-2 text-xs">
                  <p className="line-clamp-2 text-muted-foreground">
                    {f.property_address}
                  </p>
                  {f.added_by_email && activeGroup && (
                    <p className="text-[10px] text-muted-foreground">
                      Saved by {f.added_by_email}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-7 text-[11px]"
                    >
                      <Link
                        href={`/properties/${encodeURIComponent(f.property_key)}`}
                      >
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 gap-1 text-[11px]"
                      onClick={() => void openSchedule(f)}
                      disabled={pendingKey === f.property_key}
                    >
                      {pendingKey === f.property_key ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CalendarPlus className="h-3 w-3" />
                      )}
                      Schedule tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ScheduleTourSheet
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        preSelectedProperty={scheduleProperty}
      />
    </div>
  );
}
