"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/generated/client.gen";
import type {
  VendorCatalogListResponse,
  VendorCatalogOut,
} from "@/lib/api/generated/types.gen";
import type { VendorCategory } from "@/lib/types/movein";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Phone,
  MapPin,
  Zap,
  Flame,
  Wifi,
  Truck,
  UserPlus,
} from "lucide-react";

const US_STATES = [
  { code: "NY", name: "New York" },
  { code: "CA", name: "California" },
  { code: "FL", name: "Florida" },
  { code: "TX", name: "Texas" },
  { code: "IL", name: "Illinois" },
  { code: "PA", name: "Pennsylvania" },
  { code: "NJ", name: "New Jersey" },
  { code: "MA", name: "Massachusetts" },
  { code: "CT", name: "Connecticut" },
  { code: "VA", name: "Virginia" },
  { code: "MD", name: "Maryland" },
  { code: "GA", name: "Georgia" },
  { code: "NC", name: "North Carolina" },
  { code: "OH", name: "Ohio" },
  { code: "MI", name: "Michigan" },
  { code: "CO", name: "Colorado" },
  { code: "WA", name: "Washington" },
  { code: "AZ", name: "Arizona" },
  { code: "MN", name: "Minnesota" },
  { code: "OR", name: "Oregon" },
] as const;

const CATEGORY_META: Record<
  VendorCategory,
  { label: string; icon: React.ReactNode }
> = {
  electric: {
    label: "Electricity",
    icon: <Zap className="h-4 w-4 text-amber-500" />,
  },
  gas: {
    label: "Gas",
    icon: <Flame className="h-4 w-4 text-orange-500" />,
  },
  internet: {
    label: "Internet",
    icon: <Wifi className="h-4 w-4 text-blue-500" />,
  },
  movers: {
    label: "Movers",
    icon: <Truck className="h-4 w-4 text-green-600" />,
  },
};

const CATEGORY_ORDER: VendorCategory[] = [
  "electric",
  "gas",
  "internet",
  "movers",
];

function VendorPlanCards({ plans }: { plans: VendorCatalogOut["plans"] }) {
  if (!plans || plans.length === 0) return null;
  return (
    <div className="space-y-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex items-start gap-3 rounded-lg border p-2.5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">{plan.name}</span>
              {plan.popular && (
                <Badge
                  variant="secondary"
                  className="px-1 py-0 text-[10px]"
                >
                  Popular
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm font-semibold">
              {plan.price}
              <span className="text-xs font-normal text-muted-foreground">
                {plan.price_unit}
              </span>
            </p>
            {plan.features && plan.features.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground"
                  >
                    <Check className="h-2.5 w-2.5 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: VendorCatalogOut }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="py-0">
      <CardContent className="p-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3 p-3 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {vendor.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium">{vendor.name}</span>
              {vendor.rating != null &&
                vendor.review_count != null &&
                vendor.review_count > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {vendor.rating}
                    <span className="text-[10px] text-muted-foreground">
                      ({vendor.review_count.toLocaleString()})
                    </span>
                  </span>
                )}
            </div>
            {vendor.coverage_area?.trim() && (
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  {vendor.coverage_area}
                </span>
              </div>
            )}
            {vendor.phone?.trim() && (
              <div className="mt-0.5 flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Phone className="h-2.5 w-2.5" />
                {vendor.phone}
              </div>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="border-t px-3 pb-3 pt-2">
            <VendorPlanCards plans={vendor.plans} />
            {(!vendor.plans || vendor.plans.length === 0) && (
              <p className="text-xs text-muted-foreground">
                No plans listed for this provider. Contact them directly for
                pricing.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function GuestVendorBrowser() {
  const [selectedState, setSelectedState] = useState("NY");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendors-public", selectedState],
    queryFn: async () => {
      const res = await client.get({
        url: `/move-in/vendors/public?state=${encodeURIComponent(selectedState)}` as never,
        throwOnError: true,
      });
      return (res as { data: VendorCatalogListResponse }).data;
    },
  });

  const vendors = data?.vendors ?? [];

  const grouped = CATEGORY_ORDER.reduce<
    Record<VendorCategory, VendorCatalogOut[]>
  >(
    (acc, cat) => {
      acc[cat] = vendors.filter(
        (v) => v.category === cat,
      );
      return acc;
    },
    { electric: [], gas: [], internet: [], movers: [] },
  );

  const hasAnyVendors = vendors.length > 0;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="shrink-0">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Browse vendors by state
        </label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name} ({s.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading vendors...
          </p>
        )}

        {isError && (
          <p className="py-8 text-center text-sm text-destructive">
            Failed to load vendors. Please try again.
          </p>
        )}

        {!isLoading && !isError && !hasAnyVendors && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No vendors available for{" "}
              {US_STATES.find((s) => s.code === selectedState)?.name ??
                selectedState}{" "}
              yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              We are expanding coverage regularly. Check back soon.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          hasAnyVendors &&
          CATEGORY_ORDER.map((cat) => {
            const catVendors = grouped[cat];
            if (catVendors.length === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="mb-4">
                <div className="mb-2 flex items-center gap-1.5">
                  {meta.icon}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {meta.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className="ml-auto px-1.5 py-0 text-[10px]"
                  >
                    {catVendors.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {catVendors.map((v) => (
                    <VendorCard key={v.id} vendor={v} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      <Separator />

      <Card className="shrink-0 border-primary/30 bg-primary/5">
        <CardHeader className="p-3 pb-1.5">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <UserPlus className="h-4 w-4" />
            Save your selections
          </CardTitle>
          <CardDescription className="text-xs">
            Sign up free to save your vendor selections and track setup
            progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <Button asChild size="sm" className="w-full">
            <Link href="/signup">Sign up free</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
