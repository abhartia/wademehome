"use client";

import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import posthog from "posthog-js";
import { useTours } from "@/components/providers/ToursProvider";
import { usePropertyFavorites } from "@/lib/properties/api";
import { TourProperty } from "@/lib/types/tours";
import { CalendarPlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/components/ui/property-image";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

interface ScheduleTourSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedProperty?: TourProperty;
  tourId?: string;
}

export function ScheduleTourSheet({
  open,
  onOpenChange,
  preSelectedProperty,
  tourId,
}: ScheduleTourSheetProps) {
  const { tours, isReadOnly, addTour, updateTour, getTourByPropertyId } = useTours();
  const favoritesQuery = usePropertyFavorites({ enabled: !isReadOnly });
  const [selectedProperty, setSelectedProperty] = useState<TourProperty | null>(
    preSelectedProperty ?? null,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedProperty(preSelectedProperty ?? null);
      setDate("");
      setTime("");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    if (isReadOnly || !selectedProperty || !date) return;

    if (tourId) {
      updateTour(tourId, {
        status: "scheduled",
        scheduledDate: date,
        scheduledTime: time,
      });
    } else {
      const existing = getTourByPropertyId(selectedProperty.id);
      if (existing) {
        updateTour(existing.id, {
          status: "scheduled",
          scheduledDate: date,
          scheduledTime: time,
        });
      } else {
        addTour(selectedProperty, "scheduled", date, time);
      }
    }

    posthog.capture("tour_scheduled", {
      property_id: selectedProperty.id,
      property_name: selectedProperty.name,
      scheduled_date: date,
      scheduled_time: time || null,
      is_reschedule: Boolean(tourId),
    });
    onOpenChange(false);
  };

  const availableProperties = useMemo(() => {
    const map = new Map<string, TourProperty>();
    for (const tour of tours) {
      map.set(tour.property.id, tour.property);
    }
    for (const favorite of favoritesQuery.data?.favorites ?? []) {
      map.set(favorite.property_key, {
        id: favorite.property_key,
        name: favorite.property_name,
        address: favorite.property_address,
        rent: "",
        beds: "",
        image: "",
        tags: [],
      });
    }
    return Array.from(map.values());
  }, [favoritesQuery.data?.favorites, tours]);

  const isValid = selectedProperty && date.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <CalendarPlus className="h-4 w-4 text-primary" />
            Schedule a Tour
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {!preSelectedProperty && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Select Property
              </label>
              <div className="grid max-h-56 gap-1.5 overflow-y-auto">
                {availableProperties.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProperty(p)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors",
                      selectedProperty?.id === p.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <PropertyImage
                      src={p.image}
                      alt={p.name}
                      className="h-9 w-9 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[p.rent, p.beds].filter(Boolean).join(" · ") || p.address}
                      </p>
                    </div>
                    {selectedProperty?.id === p.id && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {preSelectedProperty && (
            <div className="flex items-center gap-2.5 rounded-lg border p-2.5">
              <PropertyImage
                src={preSelectedProperty.image}
                alt={preSelectedProperty.name}
                className="h-9 w-9 shrink-0 rounded object-cover"
              />
              <div>
                <p className="text-sm font-medium">{preSelectedProperty.name}</p>
                <p className="text-xs text-muted-foreground">
                  {preSelectedProperty.rent} · {preSelectedProperty.beds}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Time
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TIME_SLOTS.map((slot) => (
                <Badge
                  key={slot}
                  variant={time === slot ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-2.5 py-1 text-xs transition-colors",
                    time !== slot && "hover:bg-muted",
                  )}
                  onClick={() => setTime(time === slot ? "" : slot)}
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            className="w-full gap-1.5"
            size="sm"
            disabled={!isValid || isReadOnly}
            onClick={handleSubmit}
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            {tourId ? "Reschedule" : "Schedule Tour"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
