"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";
import { getListingsWithoutAmenitiesAdminListingsWithoutAmenitiesGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import { getListingsWithoutAmenitiesAdminListingsWithoutAmenitiesGet } from "@/lib/api/generated/sdk.gen";
import type { ListingsWithoutAmenitiesResponse } from "@/lib/api/generated/types.gen";

const PAGE_SIZE = 100;

function isAdminRole(role: unknown): boolean {
  if (role === undefined || role === null) return false;
  return String(role).trim().toLowerCase() === "admin";
}

export default function AdminListingsWithoutAmenitiesPage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
  }, [queryClient]);

  const query = useQuery({
    queryKey: getListingsWithoutAmenitiesAdminListingsWithoutAmenitiesGetQueryKey({
      query: { limit: PAGE_SIZE, offset },
    }),
    queryFn: async ({ signal }) => {
      const r = await getListingsWithoutAmenitiesAdminListingsWithoutAmenitiesGet({
        throwOnError: false,
        signal,
        query: { limit: PAGE_SIZE, offset },
      });
      if (!r.response?.ok) {
        throw new Error(
          r.response?.status === 403
            ? "Forbidden"
            : `HTTP ${String(r.response?.status ?? "?")}`,
        );
      }
      return r.data as ListingsWithoutAmenitiesResponse;
    },
    enabled: isAdmin,
    retry: 1,
  });

  const { hasPrev, hasNext } = useMemo(() => {
    const total = query.data?.total ?? 0;
    const end = offset + (query.data?.items?.length ?? 0);
    return {
      hasPrev: offset > 0,
      hasNext: end < total,
    };
  }, [query.data?.items?.length, query.data?.total, offset]);

  if (authLoading) {
    return <div className="mx-auto max-w-6xl p-8 text-muted-foreground">Checking session…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-semibold">Listings without amenities</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view this page.</p>
        <Link href="/login" className="mt-4 inline-block text-teal-600 underline">
          Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    const reported =
      user?.role === undefined || user?.role === null || String(user.role).trim() === ""
        ? "not returned by the server (check API /auth/me)"
        : String(user.role);
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-semibold">Admin only</h1>
        <p className="mt-2 text-muted-foreground">
          This page requires database role <code className="text-xs">admin</code>. Your session
          reports role: {reported}.
        </p>
        <Link href="/" className="mt-4 inline-block text-teal-600 underline">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 pb-16">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Listings without amenities</h1>
          <p className="text-sm text-muted-foreground">
            Inventory rows with no rows in <code className="text-xs">{query.data?.amenities_table ?? "listing_amenities"}</code>.
            Open the source URL to verify the listing page or debug the scrape pipeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            Refresh
          </Button>
        </div>
      </header>

      {query.isLoading ? <p className="text-muted-foreground">Loading…</p> : null}
      {query.isError ? (
        <p className="text-destructive">{(query.error as Error)?.message ?? "Failed to load"}</p>
      ) : null}

      {query.data ? (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Results</CardTitle>
            <CardDescription className="space-y-1">
              <span className="block">
                <span className="tabular-nums">{query.data.total.toLocaleString()}</span> listings
                match (table <code className="text-xs">{query.data.listings_table}</code>
                ). Showing offset{" "}
                <span className="tabular-nums">{query.data.offset.toLocaleString()}</span>–
                <span className="tabular-nums">
                  {(query.data.offset + query.data.items.length).toLocaleString()}
                </span>
                .
              </span>
              {query.data.computed_at ? (
                <span className="block text-xs">
                  Computed {new Date(query.data.computed_at).toLocaleString()}
                </span>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasPrev || query.isFetching}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasNext || query.isFetching}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 font-medium">Listing ID</th>
                    <th className="px-3 py-2 font-medium">Property</th>
                    <th className="px-3 py-2 font-medium">Address</th>
                    <th className="px-3 py-2 font-medium">Source URL</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                        No rows in this page.
                      </td>
                    </tr>
                  ) : (
                    query.data.items.map((row) => (
                      <tr key={row.listing_id} className="border-b last:border-0">
                        <td className="px-3 py-2 align-top font-mono text-xs">{row.listing_id}</td>
                        <td className="px-3 py-2 align-top text-muted-foreground">
                          {row.property_name ?? "—"}
                        </td>
                        <td className="px-3 py-2 align-top text-muted-foreground">
                          {row.address ?? "—"}
                        </td>
                        <td className="px-3 py-2 align-top">
                          {row.listing_url ? (
                            <a
                              href={row.listing_url}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-teal-600 underline hover:text-teal-700"
                            >
                              Open listing
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
