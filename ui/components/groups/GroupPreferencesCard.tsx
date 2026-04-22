"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGroup,
  useUpdateGroupPreferences,
  type GroupPreferences,
  type GroupPreferencesUpdate,
} from "@/lib/groups/api";
import { PriceRangeFilter } from "@/components/search/PriceRangeFilter";

type FormState = {
  minBeds: string;
  maxBeds: string;
  minRent: number | null;
  maxRent: number | null;
  cities: string;
  neighborhoods: string;
  dealbreakers: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  minBeds: "",
  maxBeds: "",
  minRent: null,
  maxRent: null,
  cities: "",
  neighborhoods: "",
  dealbreakers: "",
  notes: "",
};

function prefsToForm(p: GroupPreferences | null | undefined): FormState {
  if (!p) return EMPTY_FORM;
  return {
    minBeds: p.min_beds === null || p.min_beds === undefined ? "" : String(p.min_beds),
    maxBeds: p.max_beds === null || p.max_beds === undefined ? "" : String(p.max_beds),
    minRent:
      p.min_rent_usd === null || p.min_rent_usd === undefined ? null : p.min_rent_usd,
    maxRent:
      p.max_rent_usd === null || p.max_rent_usd === undefined ? null : p.max_rent_usd,
    cities: (p.preferred_cities ?? []).join(", "),
    neighborhoods: (p.preferred_neighborhoods ?? []).join(", "),
    dealbreakers: (p.dealbreakers ?? []).join(", "),
    notes: p.notes ?? "",
  };
}

function formatRentRange(
  minRent: number | null | undefined,
  maxRent: number | null | undefined,
): string | null {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  const hasMin = typeof minRent === "number";
  const hasMax = typeof maxRent === "number";
  if (hasMin && hasMax) return `${fmt(minRent!)} – ${fmt(maxRent!)}/mo`;
  if (hasMin) return `≥ ${fmt(minRent!)}/mo`;
  if (hasMax) return `≤ ${fmt(maxRent!)}/mo`;
  return null;
}

function parseIntOrNull(s: string, field: string): number | null | undefined {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
    throw new Error(`${field} must be a whole number ≥ 0`);
  }
  return n;
}

function splitList(s: string): string[] {
  return s
    .split(/[,\n]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatBedRange(
  minBeds: number | null | undefined,
  maxBeds: number | null | undefined,
): string | null {
  const fmt = (n: number) => (n === 0 ? "studio" : `${n} bed`);
  if (minBeds !== null && minBeds !== undefined && maxBeds !== null && maxBeds !== undefined) {
    if (minBeds === maxBeds) return fmt(minBeds);
    return `${fmt(minBeds)} – ${fmt(maxBeds)}`;
  }
  if (minBeds !== null && minBeds !== undefined) return `${fmt(minBeds)}+`;
  if (maxBeds !== null && maxBeds !== undefined) return `up to ${fmt(maxBeds)}`;
  return null;
}

export function GroupPreferencesCard({ groupId }: { groupId: string }) {
  const router = useRouter();
  const groupQuery = useGroup(groupId);
  const updateMutation = useUpdateGroupPreferences(groupId);

  const prefs = groupQuery.data?.preferences;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => prefsToForm(prefs));

  useEffect(() => {
    if (open) {
      setForm(prefsToForm(prefs));
    }
  }, [open, prefs]);

  const bedRange = formatBedRange(prefs?.min_beds, prefs?.max_beds);
  const rentRange = formatRentRange(prefs?.min_rent_usd, prefs?.max_rent_usd);
  const hasAnyPrefs = useMemo(() => {
    if (!prefs) return false;
    return Boolean(
      bedRange ||
        rentRange ||
        (prefs.preferred_cities && prefs.preferred_cities.length > 0) ||
        (prefs.preferred_neighborhoods && prefs.preferred_neighborhoods.length > 0) ||
        (prefs.dealbreakers && prefs.dealbreakers.length > 0) ||
        (prefs.notes && prefs.notes.trim().length > 0),
    );
  }, [prefs, bedRange, rentRange]);

  const histogramScope = useMemo(() => {
    const cities = prefs?.preferred_cities ?? [];
    const city = cities[0]?.trim();
    if (city) {
      return { mode: "city" as const, city };
    }
    return { mode: "none" as const };
  }, [prefs?.preferred_cities]);

  const formMinBedsNum = (() => {
    const n = Number(form.minBeds.trim());
    return form.minBeds.trim() && Number.isFinite(n) ? n : undefined;
  })();
  const formMaxBedsNum = (() => {
    const n = Number(form.maxBeds.trim());
    return form.maxBeds.trim() && Number.isFinite(n) ? n : undefined;
  })();

  async function handleSave() {
    try {
      const body: GroupPreferencesUpdate = {
        min_beds: parseIntOrNull(form.minBeds, "Min beds"),
        max_beds: parseIntOrNull(form.maxBeds, "Max beds"),
        min_rent_usd: form.minRent,
        max_rent_usd: form.maxRent,
        preferred_cities: splitList(form.cities),
        preferred_neighborhoods: splitList(form.neighborhoods),
        dealbreakers: splitList(form.dealbreakers),
        notes: form.notes.trim() || null,
      };
      if (
        typeof body.min_beds === "number" &&
        typeof body.max_beds === "number" &&
        body.min_beds > body.max_beds
      ) {
        toast.error("Min beds can't exceed max beds");
        return;
      }
      if (
        typeof body.min_rent_usd === "number" &&
        typeof body.max_rent_usd === "number" &&
        body.min_rent_usd > body.max_rent_usd
      ) {
        toast.error("Min rent can't exceed max rent");
        return;
      }
      await updateMutation.mutateAsync(body);
      toast.success("Preferences saved");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save preferences");
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Search preferences</CardTitle>
        <CardDescription>
          These filters seed the group&apos;s search so everyone looks at the same listings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAnyPrefs ? (
          <div className="flex flex-wrap gap-2">
            {bedRange ? <Badge variant="secondary">{bedRange}</Badge> : null}
            {rentRange ? <Badge variant="secondary">{rentRange}</Badge> : null}
            {(prefs?.preferred_cities ?? []).map((c) => (
              <Badge key={`c-${c}`} variant="secondary">
                {c}
              </Badge>
            ))}
            {(prefs?.preferred_neighborhoods ?? []).map((n) => (
              <Badge key={`n-${n}`} variant="outline">
                ❤ {n}
              </Badge>
            ))}
            {(prefs?.dealbreakers ?? []).map((d) => (
              <Badge key={`d-${d}`} variant="destructive">
                ✕ {d}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No preferences set yet. Add bedroom count, budget, and neighborhoods so
            search only shows matching places.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Edit preferences
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/groups/${groupId}/search`)}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search with these filters
          </Button>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit search preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="gp-minbeds">Min beds (0 = studio)</Label>
                <Input
                  id="gp-minbeds"
                  type="number"
                  min={0}
                  max={20}
                  value={form.minBeds}
                  onChange={(e) => setForm({ ...form, minBeds: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gp-maxbeds">Max beds</Label>
                <Input
                  id="gp-maxbeds"
                  type="number"
                  min={0}
                  max={20}
                  value={form.maxBeds}
                  onChange={(e) => setForm({ ...form, maxBeds: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Monthly rent range (USD)</Label>
              <div>
                <PriceRangeFilter
                  valueMin={form.minRent}
                  valueMax={form.maxRent}
                  onApply={(next) =>
                    setForm((prev) => ({
                      ...prev,
                      minRent: next.min,
                      maxRent: next.max,
                    }))
                  }
                  scope={histogramScope}
                  minBeds={formMinBedsNum}
                  maxBeds={formMaxBedsNum}
                  placeholder="Any rent"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="gp-cities">Cities (comma-separated)</Label>
              <Input
                id="gp-cities"
                value={form.cities}
                onChange={(e) => setForm({ ...form, cities: e.target.value })}
                placeholder="New York"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gp-hoods">Preferred neighborhoods</Label>
              <Input
                id="gp-hoods"
                value={form.neighborhoods}
                onChange={(e) =>
                  setForm({ ...form, neighborhoods: e.target.value })
                }
                placeholder="Park Slope, Astoria, LIC"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gp-avoid">Dealbreakers</Label>
              <Input
                id="gp-avoid"
                value={form.dealbreakers}
                onChange={(e) =>
                  setForm({ ...form, dealbreakers: e.target.value })
                }
                placeholder="walk-up, no laundry"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gp-notes">Notes (optional)</Label>
              <Textarea
                id="gp-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything else the search should know"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
