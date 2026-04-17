"use client";

import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePropertyFavorites } from "@/lib/properties/api";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";

export default function SavedPage() {
  const activeGroupId = useActiveGroupId();
  const favoritesQuery = usePropertyFavorites({ groupId: activeGroupId });
  const groupsQuery = useMyGroups();

  const favorites = favoritesQuery.data?.favorites ?? [];
  const activeGroup = activeGroupId
    ? groupsQuery.data?.groups.find((g) => g.id === activeGroupId)
    : undefined;

  const heading = activeGroup
    ? `Saved in ${activeGroup.name}`
    : "Saved properties";
  const subheading = activeGroup
    ? "Properties you and your group have bookmarked."
    : "Properties you've bookmarked for later.";

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
        <div>
          <h1 className="text-lg font-semibold">{heading}</h1>
          <p className="text-xs text-muted-foreground">{subheading}</p>
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
              <Link
                key={f.property_key}
                href={`/properties/${encodeURIComponent(f.property_key)}`}
                className="block"
              >
                <Card className="h-full transition-colors hover:bg-accent/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-sm">
                      {f.property_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-xs text-muted-foreground">
                    <p className="line-clamp-2">{f.property_address}</p>
                    {f.added_by_email && activeGroup && (
                      <p className="text-[10px]">
                        Saved by {f.added_by_email}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
