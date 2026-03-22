"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Crosshair,
  MapPin,
  Building2,
  DollarSign,
  Home,
  Code,
  Pencil,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { JourneyStageSelector } from "@/components/journey/JourneyStageSelector";
import { Checkbox } from "@/components/ui/checkbox";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">No profile yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Complete the onboarding flow to build your memory bank. It only takes
          a couple of minutes.
        </p>
      </div>
      <Button asChild className="gap-1.5">
        <Link href="/onboarding">
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, updateProfile } = useUserProfile();
  const [showJson, setShowJson] = useState(false);

  if (!profile.onboardingCompleted) return <EmptyState />;

  const sections = [
    {
      title: "Search Trigger",
      icon: Crosshair,
      items: [
        { label: "Type", value: profile.searchTrigger ?? "—" },
        { label: "Reason", value: profile.triggerReason || "—" },
        { label: "Timeline", value: profile.moveTimeline || "—" },
      ],
    },
    {
      title: "Location",
      icon: MapPin,
      items: [
        {
          label: "Target cities",
          value: profile.preferredCities.length
            ? profile.preferredCities.join(", ")
            : "—",
        },
        { label: "Work / Study", value: profile.workLocation || "—" },
      ],
    },
    {
      title: "Neighbourhood",
      icon: Building2,
      items: [
        {
          label: "Priorities",
          value: profile.neighbourhoodPriorities.length
            ? profile.neighbourhoodPriorities.join(", ")
            : "—",
        },
        {
          label: "Dealbreakers",
          value: profile.dealbreakers.length
            ? profile.dealbreakers.join(", ")
            : "None",
        },
      ],
    },
    {
      title: "Budget",
      icon: DollarSign,
      items: [
        { label: "Max rent", value: profile.maxMonthlyRent || "—" },
        {
          label: "Credit score",
          value: profile.creditScoreRange || "—",
        },
      ],
    },
    {
      title: "Living Situation",
      icon: Home,
      items: [
        { label: "Arrangement", value: profile.livingArrangement ?? "—" },
        { label: "Bedrooms", value: profile.bedroomsNeeded || "—" },
        {
          label: "Pets",
          value: profile.hasPets ? profile.petDetails : "None",
        },
      ],
    },
  ];

  // API payload preview -- strip meta fields
  const apiPayload = { ...profile };
  delete (apiPayload as Record<string, unknown>).onboardingCompleted;
  delete (apiPayload as Record<string, unknown>).onboardingStep;
  delete (apiPayload as Record<string, unknown>).lastUpdated;

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Your Memory Bank
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preferences captured during onboarding. Used to personalise every
              search.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/onboarding">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
        </div>

        {/* Journey stage */}
        <Card>
          <CardContent className="p-4">
            <JourneyStageSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Roommate search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Turn this on to show the Roommates section in the sidebar and use
              roommate matching. You can also enable it by choosing &quot;Me +
              roommate(s)&quot; during onboarding.
            </p>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
              <Checkbox
                checked={profile.roommateSearchEnabled}
                onCheckedChange={(v) =>
                  updateProfile({ roommateSearchEnabled: v === true })
                }
                className="mt-0.5"
              />
              <span className="text-sm font-medium leading-snug">
                Show roommate tools in the app
              </span>
            </label>
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <section.icon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-3 text-sm">
                    <span className="w-28 shrink-0 text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Neighbourhood tags */}
        {profile.neighbourhoodPriorities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.neighbourhoodPriorities.map((p) => (
              <Badge key={p} variant="secondary">
                {p}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Quick links */}
        <div className="space-y-2">
          <Link
            href="/guarantor"
            className="flex items-center gap-2.5 rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Guarantor Signing</p>
              <p className="text-xs text-muted-foreground">
                Manage co-signer agreements for your lease applications
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/move-in"
            className="flex items-center gap-2.5 rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <Package className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Move-in Hub</p>
              <p className="text-xs text-muted-foreground">
                Vendors, checklists, and move-in tasks
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        <Separator />

        {/* API payload preview */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 gap-1.5"
            onClick={() => setShowJson(!showJson)}
          >
            <Code className="h-3.5 w-3.5" />
            {showJson ? "Hide" : "Show"} API Payload
          </Button>
          {showJson && (
            <pre className="max-h-80 overflow-auto rounded-lg border bg-muted p-4 text-xs">
              {JSON.stringify(apiPayload, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
