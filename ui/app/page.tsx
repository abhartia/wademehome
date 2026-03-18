"use client";

import Link from "next/link";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Search,
  MapPin,
  DollarSign,
  Home,
  Users,
  Users2,
  ArrowRight,
  CalendarCheck,
  Calendar,
  Clock,
  ShieldCheck,
  Package,
  PartyPopper,
  CheckCircle2,
} from "lucide-react";
import { useTours } from "@/components/providers/ToursProvider";
import { useGuarantor } from "@/components/providers/GuarantorProvider";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import { PropertyImage } from "@/components/ui/property-image";
import { JourneyStageIndicator } from "@/components/journey/JourneyStageIndicator";

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "The Rivington",
    address: "123 Rivington St, New York, NY",
    rent: "$2,850/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Walkable", "Near transit"],
  },
  {
    id: 2,
    name: "Avalon at Edgewater",
    address: "1000 Ave at Port Imperial, Weehawken, NJ",
    rent: "$3,200/mo",
    beds: "2 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Parking", "Gym"],
  },
  {
    id: 3,
    name: "The Lofts at Canal Walk",
    address: "100 Canal Walk Blvd, New Brunswick, NJ",
    rent: "$2,100/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Safe & quiet", "Parks"],
  },
];

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { profile, journeyStage } = useUserProfile();
  const { tours } = useTours();
  const { requests: guarantorRequests } = useGuarantor();
  const { progress } = useMoveIn();
  const onboarded = profile.onboardingCompleted;

  const stage = journeyStage;

  const showGuarantorCta =
    onboarded &&
    ["Below 650", "Fair (650-699)", "Not sure"].includes(
      profile.creditScoreRange ?? "",
    );
  const hasVerifiedGuarantor = guarantorRequests.some(
    (r) => r.status === "signed" && r.verificationStatus === "verified",
  );

  const upcomingTours = tours
    .filter((t) => t.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    )
    .slice(0, 2);

  const showMoveIn =
    stage === "lease-signed" || stage === "moving" || stage === "moved-in";
  const showListings =
    stage !== "moving" && stage !== "moved-in" && stage !== "lease-signed";
  const showTours =
    stage !== "moved-in";

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        {/* Greeting + stage */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {onboarded ? "Welcome back" : "Welcome to brightplace"}
              </h1>
              {onboarded && <JourneyStageIndicator stage={stage} />}
            </div>
            <p className="mt-1 text-muted-foreground">
              {stage === "moving"
                ? "Your move-in is underway. Here\u2019s your progress."
                : stage === "lease-signed"
                  ? "Congratulations on signing! Time to prepare your move."
                  : stage === "moved-in"
                    ? "You\u2019re all moved in. Welcome home!"
                    : onboarded
                      ? "Here\u2019s a snapshot of your rental search."
                      : "Let\u2019s find your perfect place."}
            </p>
          </div>
        </div>

        {/* Onboarding CTA (if not completed) */}
        {!onboarded && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Complete your profile</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Answer a few quick questions so I can personalise your
                    search. Takes about 2 minutes.
                  </p>
                  {profile.onboardingStep > 0 && (
                    <div className="mt-2 w-48">
                      <Progress
                        value={(profile.onboardingStep / 5) * 100}
                        className="h-1.5"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Step {profile.onboardingStep} of 5 completed
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button asChild className="shrink-0 gap-1.5">
                <Link href="/onboarding">
                  {profile.onboardingStep > 0 ? "Continue" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lease signed congratulations banner */}
        {stage === "lease-signed" && (
          <Card className="border-green-200/50 bg-gradient-to-r from-green-50/50 to-transparent">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <PartyPopper className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-green-800">
                  Lease signed!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Set up your utilities, hire movers, and track everything for a
                  smooth move.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 gap-1.5">
                <Link href="/move-in">
                  Set up Move-in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Move-in progress (when moving or moved-in) */}
        {(stage === "moving" || stage === "moved-in") && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {stage === "moved-in" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Package className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">
                  {stage === "moved-in"
                    ? "Move-in complete"
                    : "Move-in progress"}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {progress.vendorsSetUp}/{progress.vendorsTotal} vendors
                  </span>
                  <span>
                    {progress.checklistDone}/{progress.checklistTotal} tasks
                  </span>
                </div>
                <Progress
                  value={
                    ((progress.checklistDone + progress.vendorsSetUp) /
                      (progress.checklistTotal + progress.vendorsTotal)) *
                    100
                  }
                  className="mt-1.5 h-1.5"
                />
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 gap-1.5">
                <Link href="/move-in">
                  {stage === "moved-in" ? "Review" : "View Hub"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick actions -- adapt based on stage */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {showMoveIn ? (
            <Button
              variant="outline"
              asChild
              className="h-auto min-w-0 justify-start gap-3 border-primary/30 bg-primary/5 p-4 text-left"
            >
              <Link href="/move-in" className="min-w-0 flex-1">
                <Package className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 whitespace-normal">
                  <div className="font-medium">Move-in Hub</div>
                  <div className="text-xs text-muted-foreground">
                    Vendors, checklists, and tasks
                  </div>
                </div>
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="h-auto min-w-0 justify-start gap-3 p-4 text-left"
            >
              <Link href="/search" className="min-w-0 flex-1">
                <Search className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 whitespace-normal">
                  <div className="font-medium">Start a Search</div>
                  <div className="text-xs text-muted-foreground">
                    Chat with our AI to find listings
                  </div>
                </div>
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            asChild
            className="h-auto min-w-0 justify-start gap-3 p-4 text-left"
          >
            <Link href="/tours" className="min-w-0 flex-1">
              <CalendarCheck className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 whitespace-normal">
                <div className="font-medium">My Tours</div>
                <div className="text-xs text-muted-foreground">
                  Schedule tours and take notes
                </div>
              </div>
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className={`h-auto min-w-0 justify-start gap-3 p-4 text-left ${
              profile.livingArrangement === "roommates"
                ? "border-primary/30 bg-primary/5"
                : ""
            }`}
          >
            <Link href="/roommates" className="min-w-0 flex-1">
              <Users2 className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 whitespace-normal">
                <div className="font-medium">Find Roommates</div>
                <div className="text-xs text-muted-foreground">
                  AI-matched roommates for your lifestyle
                </div>
              </div>
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-auto min-w-0 justify-start gap-3 p-4 text-left"
          >
            <Link
              href={onboarded ? "/profile" : "/onboarding"}
              className="min-w-0 flex-1"
            >
              <Users className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 whitespace-normal">
                <div className="font-medium">
                  {onboarded ? "Edit Preferences" : "Set Preferences"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {onboarded
                    ? "View and update your memory bank"
                    : "Tell us what you\u2019re looking for"}
                </div>
              </div>
            </Link>
          </Button>
        </div>

        {/* Preference summary (if onboarded, not in late stages) */}
        {onboarded && showListings && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {profile.preferredCities.join(", ") || "\u2014"}
                </p>
                {profile.workLocation && (
                  <p className="text-xs text-muted-foreground">
                    Work: {profile.workLocation}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {profile.maxMonthlyRent || "\u2014"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.moveTimeline}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-1">
                <Home className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">Living</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {profile.bedroomsNeeded || "\u2014"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile.livingArrangement ?? "\u2014"}
                  {profile.hasPets ? ` + ${profile.petDetails}` : ""}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Guarantor CTA (credit-score gated) */}
        {showGuarantorCta && (
          <Card className="border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-transparent">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                {hasVerifiedGuarantor ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-green-800">
                        Guarantor verified
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your co-signer agreement is in place.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold">
                      Need a guarantor?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      If your application needs a co-signer, we can handle the
                      signing process for you.
                    </p>
                  </>
                )}
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 gap-1.5">
                <Link href="/guarantor">
                  {hasVerifiedGuarantor ? "Manage" : "Get Started"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming tours */}
        {onboarded && showTours && upcomingTours.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Tours</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tours">View all</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {upcomingTours.map((tour) => (
                <Card key={tour.id}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <PropertyImage
                      src={tour.property.image}
                      alt={tour.property.name}
                      className="h-12 w-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {tour.property.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(tour.scheduledDate)}
                        </span>
                        {tour.scheduledTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tour.scheduledTime}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="default" className="shrink-0 text-[10px]">
                      Scheduled
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommended listings (hidden in late stages) */}
        {onboarded && showListings && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search">View all</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {MOCK_LISTINGS.map((listing) => (
                <Card
                  key={listing.id}
                  className="gap-0 overflow-hidden p-0"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <PropertyImage
                      src={listing.image}
                      alt={listing.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium">{listing.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {listing.address}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {listing.rent}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {listing.beds}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listing.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
