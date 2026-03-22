"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  Sparkles,
  UserCircle,
  Users2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { JOURNEY_STAGES, UserProfile } from "@/lib/types/userProfile";

function firstNameFromEmail(email: string | undefined): string | null {
  if (!email) return null;
  const local = email.split("@")[0]?.trim();
  if (!local) return null;
  const word = local.split(/[._-]/)[0];
  if (!word) return null;
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}

function glanceRows(profile: UserProfile): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (profile.moveTimeline) {
    rows.push({ label: "Move timeline", value: profile.moveTimeline });
  }
  if (profile.preferredCities.length > 0) {
    rows.push({
      label: "Cities",
      value: profile.preferredCities.join(", "),
    });
  }
  if (profile.maxMonthlyRent) {
    rows.push({ label: "Rent budget", value: profile.maxMonthlyRent });
  }
  if (profile.bedroomsNeeded) {
    rows.push({ label: "Bedrooms", value: profile.bedroomsNeeded });
  }
  return rows;
}

export default function AppHomePage() {
  const { profile, journeyStage } = useUserProfile();
  const { user } = useAuth();

  const greetingName = firstNameFromEmail(user?.email);
  const glance = useMemo(() => glanceRows(profile), [profile]);
  const journeyLabel = journeyStage
    ? JOURNEY_STAGES.find((s) => s.value === journeyStage)?.label
    : null;

  const subtitle = useMemo(() => {
    if (profile.preferredCities.length > 0) {
      return `You're focused on ${profile.preferredCities.slice(0, 2).join(" & ")}${profile.preferredCities.length > 2 ? ", and more" : ""}. Pick up where you left off or adjust your profile anytime.`;
    }
    if (profile.moveTimeline) {
      return `Your timeline: ${profile.moveTimeline}. Add cities in your profile to tailor search and tours.`;
    }
    return "Search listings, manage tours, and keep your renter profile up to date — all in one place.";
  }, [profile.moveTimeline, profile.preferredCities]);

  return (
    <div className="min-h-[calc(100vh-3rem)] overflow-y-auto p-6 pb-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back{greetingName ? `, ${greetingName}` : ""}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{subtitle}</p>
          {journeyLabel && (
            <p className="text-sm text-muted-foreground">
              Journey stage:{" "}
              <span className="font-medium text-foreground">{journeyLabel}</span>
            </p>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                The main things you&apos;ll use while you hunt for a place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="justify-between sm:justify-center">
                  <Link href="/search" className="gap-2">
                    <Search className="h-4 w-4" />
                    Search listings
                    <ArrowRight className="h-4 w-4 opacity-70" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-between sm:justify-center">
                  <Link href="/tours" className="gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    View tours
                    <ArrowRight className="h-4 w-4 opacity-70" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-between sm:justify-center">
                  <Link href="/profile" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    Profile & preferences
                    <ArrowRight className="h-4 w-4 opacity-70" />
                  </Link>
                </Button>
              </div>
              {!profile.onboardingCompleted && (
                <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      Finish onboarding to capture your full preferences.
                    </span>
                    <Button variant="secondary" size="sm" asChild className="ml-auto">
                      <Link href="/onboarding">Continue</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>At a glance</CardTitle>
              <CardDescription>
                Pulled from your profile — update anytime under Profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {glance.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No preferences saved yet. Complete{" "}
                  <Link href="/onboarding" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Get Started
                  </Link>{" "}
                  or add details in{" "}
                  <Link href="/profile" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Profile
                  </Link>
                  .
                </p>
              ) : (
                <dl className="space-y-3 text-sm">
                  {glance.map((row) => (
                    <div key={row.label} className="flex gap-3">
                      <dt className="w-32 shrink-0 text-muted-foreground">{row.label}</dt>
                      <dd className="font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </CardContent>
          </Card>
        </div>

        <Card
          className={
            profile.roommateSearchEnabled
              ? "border-primary/25 bg-primary/[0.03]"
              : undefined
          }
        >
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-primary" />
                  Roommate matching
                </CardTitle>
                <CardDescription>
                  {profile.roommateSearchEnabled
                    ? "Roommate matching is on. Build your roommate profile and browse people who fit your lifestyle."
                    : "Looking for a roommate? Enable the matching platform in Profile — it adds Roommates to your sidebar so you can complete a roommate profile and connect with others."}
                </CardDescription>
              </div>
              {profile.roommateSearchEnabled ? (
                <Button asChild>
                  <Link href="/roommates">Open Roommates</Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/profile">Enable in Profile</Link>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
