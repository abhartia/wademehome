"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";
import { listingsFetch } from "@/lib/listings/listingsApi";

type ScrapeTargetRow = {
  platform: string;
  seed_url: string;
  host?: string | null;
  identifier?: string | null;
  notes?: string | null;
};

type ScrapeTargetsResponse = {
  computed_at: string;
  counts_by_platform: Record<string, number>;
  targets: ScrapeTargetRow[];
};

function isAdminRole(role: unknown): boolean {
  if (role === undefined || role === null) return false;
  return String(role).trim().toLowerCase() === "admin";
}

function normalizeText(s: string): string {
  return s.trim().toLowerCase();
}

export default function AdminPropertyManagersPage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [platform, setPlatform] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
  }, [queryClient]);

  const targetsQuery = useQuery({
    queryKey: ["admin", "scrape-targets"],
    queryFn: async ({ signal }) => {
      return await listingsFetch<ScrapeTargetsResponse>("/admin/scrape-targets", { signal });
    },
    enabled: isAdmin,
    retry: 1,
  });

  const platforms = useMemo(() => {
    const counts = targetsQuery.data?.counts_by_platform ?? {};
    const keys = Object.keys(counts).sort();
    return ["all", ...keys];
  }, [targetsQuery.data?.counts_by_platform]);

  const filtered = useMemo(() => {
    const data = targetsQuery.data?.targets ?? [];
    const qn = normalizeText(q);
    return data.filter((row) => {
      if (platform !== "all" && row.platform !== platform) return false;
      if (!qn) return true;
      const hay = normalizeText(
        [row.platform, row.host ?? "", row.identifier ?? "", row.seed_url, row.notes ?? ""].join(" "),
      );
      return hay.includes(qn);
    });
  }, [platform, q, targetsQuery.data?.targets]);

  if (authLoading) {
    return <div className="mx-auto max-w-6xl p-8 text-muted-foreground">Checking session…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-semibold">Property managers</h1>
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
      <header className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Property managers (scrape targets)</h1>
            <p className="text-sm text-muted-foreground">
              Deterministic list from repo seed files. Use this to contact operators for sales.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/inventory">Inventory analytics</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void targetsQuery.refetch()}
              disabled={targetsQuery.isFetching}
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle>Targets</CardTitle>
              <CardDescription>
                {targetsQuery.data?.targets?.length != null ? (
                  <>
                    {targetsQuery.data.targets.length.toLocaleString()} total ·{" "}
                    {filtered.length.toLocaleString()} shown
                  </>
                ) : (
                  "Load targets from the API"
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by platform, host, identifier, URL…"
                className="sm:w-[420px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={platform} onValueChange={setPlatform}>
              <TabsList className="flex flex-wrap h-auto">
                {platforms.map((p) => {
                  const count =
                    p === "all"
                      ? targetsQuery.data?.targets?.length ?? 0
                      : targetsQuery.data?.counts_by_platform?.[p] ?? 0;
                  return (
                    <TabsTrigger key={p} value={p} className="gap-2">
                      <span className="capitalize">{p}</span>
                      <Badge variant="secondary" className="tabular-nums">
                        {count.toLocaleString()}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <div className="text-xs text-muted-foreground">
              {targetsQuery.data?.computed_at ? (
                <>Computed {new Date(targetsQuery.data.computed_at).toLocaleString()}</>
              ) : null}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          {targetsQuery.isLoading ? <p className="text-muted-foreground">Loading…</p> : null}
          {targetsQuery.isError ? (
            <p className="text-destructive">
              {(targetsQuery.error as Error)?.message ?? "Failed to load scrape targets"}
            </p>
          ) : null}

          {targetsQuery.data ? (
            <div className="overflow-auto rounded-md border text-sm">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-muted/80">
                  <tr>
                    <th className="p-2">Platform</th>
                    <th className="p-2">Host</th>
                    <th className="p-2">Identifier</th>
                    <th className="p-2">Seed URL</th>
                    <th className="p-2">Notes</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={`${row.platform}-${row.seed_url}-${idx}`} className="border-t">
                      <td className="p-2">
                        <Badge variant="outline" className="capitalize">
                          {row.platform}
                        </Badge>
                      </td>
                      <td className="p-2 break-all">{row.host ?? "—"}</td>
                      <td className="p-2 break-all text-muted-foreground">{row.identifier ?? "—"}</td>
                      <td className="p-2 break-all">
                        <a
                          href={row.seed_url}
                          className="text-teal-700 underline dark:text-teal-300"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {row.seed_url}
                        </a>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground break-words">
                        {row.notes ?? "—"}
                      </td>
                      <td className="p-2 text-right">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(row.seed_url);
                              toast.success("Copied seed URL");
                            } catch {
                              toast.error("Copy failed");
                            }
                          }}
                        >
                          Copy URL
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? (
                    <tr className="border-t">
                      <td colSpan={6} className="p-4 text-muted-foreground">
                        No targets match your filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

