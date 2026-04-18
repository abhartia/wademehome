"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTours } from "@/components/providers/ToursProvider";
import { TourCard } from "@/components/tours/TourCard";
import { ScheduleTourSheet } from "@/components/tours/ScheduleTourSheet";
import { TourNotesSheet } from "@/components/tours/TourNotesSheet";
import { LogTourModal } from "@/components/tours/LogTourModal";
import { Tour, TourProperty } from "@/lib/types/tours";
import { CalendarPlus, Search, Bookmark, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/components/providers/UserProfileProvider";

const VALID_TABS = new Set(["upcoming", "completed", "saved"]);

export default function ToursPage() {
  const { tours, isReadOnly, updateTour, removeTour } = useTours();
  const { journeyStage } = useUserProfile();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab =
    requestedTab && VALID_TABS.has(requestedTab) ? requestedTab : "upcoming";

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleProperty, setScheduleProperty] = useState<
    TourProperty | undefined
  >();
  const [scheduleTourId, setScheduleTourId] = useState<string | undefined>();

  const [notesOpen, setNotesOpen] = useState(false);
  const [notesTour, setNotesTour] = useState<Tour | null>(null);
  const [notesReadOnly, setNotesReadOnly] = useState(false);
  const [removingTourIds, setRemovingTourIds] = useState<Set<string>>(new Set());

  const upcoming = tours
    .filter((t) => t.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );

  const completed = tours
    .filter((t) => t.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime(),
    );

  const saved = tours.filter((t) => t.status === "saved");

  const openSchedule = (property?: TourProperty, tourId?: string) => {
    setScheduleProperty(property);
    setScheduleTourId(tourId);
    setScheduleOpen(true);
  };

  const openNotes = (tour: Tour, readOnly = false) => {
    setNotesTour(tour);
    setNotesReadOnly(readOnly);
    setNotesOpen(true);
  };

  const handleRemoveTour = async (tourId: string) => {
    setRemovingTourIds((prev) => {
      const next = new Set(prev);
      next.add(tourId);
      return next;
    });
    try {
      await removeTour(tourId);
    } finally {
      setRemovingTourIds((prev) => {
        const next = new Set(prev);
        next.delete(tourId);
        return next;
      });
    }
  };

  const allCompleted =
    tours.length > 0 &&
    tours.every((t) => t.status === "completed" || t.status === "cancelled");
  const showStagePrompt = allCompleted && journeyStage === "touring";

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {showStagePrompt && (
        <div className="flex items-center gap-2 border-b bg-amber-50/50 px-4 py-2">
          <p className="flex-1 text-xs text-amber-700">
            All tours completed! Update your journey stage to keep the platform relevant.
          </p>
          <Button variant="outline" size="sm" asChild className="h-6 gap-1 px-2 text-[10px]">
            <Link href="/profile">
              Update stage
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </Button>
        </div>
      )}
      <Tabs defaultValue={initialTab} className="flex h-full flex-col">
        {isReadOnly && (
          <div className="border-b bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            Sign in to create and manage tours.
          </div>
        )}
        <div className="shrink-0 border-b px-4 pt-3 pb-0">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-1.5">
              Upcoming
              {upcoming.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {upcoming.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1.5">
              Completed
              {completed.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {completed.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-1.5">
              Requested
              {saved.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {saved.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Upcoming tours */}
        <TabsContent value="upcoming" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Upcoming Tours</h2>
                <p className="text-xs text-muted-foreground">
                  Your scheduled apartment tours, nearest first.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isReadOnly && <LogTourModal />}
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => openSchedule()}
                  disabled={isReadOnly}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Schedule a Tour
                </Button>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarPlus className="h-8 w-8 text-muted-foreground/50" />}
                title="No upcoming tours"
                description="Schedule a tour to get started, or save properties from search."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => openSchedule()}
                    disabled={isReadOnly}
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Schedule a Tour
                  </Button>
                }
              />
            ) : (
              upcoming.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onEditNotes={() => openNotes(tour)}
                  onMarkComplete={() =>
                    updateTour(tour.id, { status: "completed" })
                  }
                  onCancel={() =>
                    updateTour(tour.id, { status: "cancelled" })
                  }
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* Completed tours */}
        <TabsContent value="completed" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold">Completed Tours</h2>
                <p className="text-xs text-muted-foreground">
                  Review your notes and ratings from past tours.
                </p>
              </div>
              {!isReadOnly && <LogTourModal />}
            </div>

            {completed.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />}
                title="No completed tours yet"
                description="Once you&#39;ve finished a tour, it&#39;ll appear here with your notes and ratings."
              />
            ) : (
              completed.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onViewNotes={() => openNotes(tour, true)}
                  onEditNotes={() => openNotes(tour)}
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* Requested tour properties */}
        <TabsContent value="saved" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-3 p-4">
            <div>
              <h2 className="text-base font-semibold">Requested Tours</h2>
              <p className="text-xs text-muted-foreground">
                Pending tour requests awaiting a confirmed date. For bookmarks, see{" "}
                <Link href="/saved" className="underline">
                  Saved
                </Link>
                .
              </p>
            </div>

            {saved.length === 0 ? (
              <EmptyState
                icon={<Bookmark className="h-8 w-8 text-muted-foreground/50" />}
                title="No pending tour requests"
                description="Request a tour from a property page — it&apos;ll show up here until scheduled."
                action={
                  <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs">
                    <Link href="/search">
                      <Search className="h-3.5 w-3.5" />
                      Go to Search
                    </Link>
                  </Button>
                }
              />
            ) : (
              saved.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onSchedule={() =>
                    openSchedule(tour.property, tour.id)
                  }
                  onRemove={() => handleRemoveTour(tour.id)}
                  isRemoving={removingTourIds.has(tour.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ScheduleTourSheet
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        preSelectedProperty={scheduleProperty}
        tourId={scheduleTourId}
      />

      <TourNotesSheet
        open={notesOpen}
        onOpenChange={setNotesOpen}
        tour={notesTour}
        readOnly={notesReadOnly}
      />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon}
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
