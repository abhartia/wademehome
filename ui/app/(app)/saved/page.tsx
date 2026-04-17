"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarPlus,
  ExternalLink,
  Loader2,
  MessageSquareText,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCommentedProperties,
  usePropertyFavorites,
  useToggleFavorite,
} from "@/lib/properties/api";
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
  const commentedQuery = useCommentedProperties(activeGroupId);
  const groupsQuery = useMyGroups();
  const qc = useQueryClient();
  const toggleFavorite = useToggleFavorite({ groupId: activeGroupId });

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleProperty, setScheduleProperty] = useState<TourProperty | undefined>();
  const [schedulePendingKey, setSchedulePendingKey] = useState<string | null>(
    null,
  );
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  const favorites = favoritesQuery.data?.favorites ?? [];
  const commented = commentedQuery.data?.properties ?? [];
  const activeGroup = activeGroupId
    ? groupsQuery.data?.groups.find((g) => g.id === activeGroupId)
    : undefined;

  // User-added and scraper-ingested listings both live in the shared listings
  // table under the same property_key scheme — so one fetch works for either.
  const openSchedule = async (f: (typeof favorites)[number]) => {
    setSchedulePendingKey(f.property_key);
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
    setSchedulePendingKey(null);
    setScheduleOpen(true);
  };

  const removeFavorite = async (f: (typeof favorites)[number]) => {
    setRemovingKey(f.property_key);
    try {
      await toggleFavorite.mutateAsync({
        propertyKey: f.property_key,
        propertyName: f.property_name,
        propertyAddress: f.property_address,
      });
    } finally {
      setRemovingKey(null);
    }
  };

  const heading = activeGroup
    ? `Saved in ${activeGroup.name}`
    : "Saved properties";
  const subheading = activeGroup
    ? "Properties you and your group have bookmarked."
    : "Properties you've bookmarked for later.";

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
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
              Find listings through search and tap Save to bookmark them here,
              or add one manually above.
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
          <ul className="divide-y rounded-md border bg-card">
            {favorites.map((f) => {
              const isScheduling = schedulePendingKey === f.property_key;
              const isRemoving = removingKey === f.property_key;
              return (
                <li
                  key={f.property_key}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Link
                      href={`/properties/${encodeURIComponent(f.property_key)}`}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {f.property_name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.property_address}
                    </p>
                    {f.added_by_email && activeGroup && (
                      <p className="text-[10px] text-muted-foreground">
                        Saved by {f.added_by_email}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="h-7 gap-1 text-[11px]"
                    >
                      <Link
                        href={`/properties/${encodeURIComponent(f.property_key)}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-[11px]"
                      onClick={() => void openSchedule(f)}
                      disabled={isScheduling}
                    >
                      {isScheduling ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CalendarPlus className="h-3 w-3" />
                      )}
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => void removeFavorite(f)}
                      disabled={isRemoving}
                      aria-label="Remove from saved"
                      title="Remove from saved"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {activeGroup && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">
                Properties with group notes
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Only visible to members of {activeGroup.name}.
            </p>
            {commentedQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : commented.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  No notes yet. Open a saved property and post a note to your
                  group — it will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y rounded-md border bg-card">
                {commented.map((c) => {
                  const displayName = c.property_name || c.property_key;
                  const displayAddress = c.property_address || "";
                  return (
                    <li
                      key={c.property_key}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <Link
                          href={`/properties/${encodeURIComponent(c.property_key)}`}
                          className="truncate text-sm font-medium hover:underline"
                        >
                          {displayName}
                        </Link>
                        {displayAddress && (
                          <p className="truncate text-xs text-muted-foreground">
                            {displayAddress}
                          </p>
                        )}
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {c.latest_note_author_email}
                          </span>
                          : {c.latest_note_preview}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {c.note_count} note{c.note_count === 1 ? "" : "s"} ·{" "}
                          {new Date(c.latest_note_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-7 gap-1 text-[11px]"
                      >
                        <Link
                          href={`/properties/${encodeURIComponent(c.property_key)}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
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
