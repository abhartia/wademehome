"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UserProfile } from "@/lib/types/userProfile";

export type ProfileSectionId =
  | "searchTrigger"
  | "location"
  | "neighbourhood"
  | "budget"
  | "livingSituation";

const TIMELINE_OPTIONS = [
  "ASAP",
  "1-2 months",
  "3-6 months",
  "No rush, just exploring",
] as const;

const RENT_OPTIONS = [
  "Under $1,000",
  "$1,000 - $1,500",
  "$1,500 - $2,000",
  "$2,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000+",
] as const;

const CREDIT_OPTIONS = [
  "Excellent (750+)",
  "Good (700-749)",
  "Fair (650-699)",
  "Below 650",
  "Not sure",
  "Skip",
] as const;

const BEDROOM_OPTIONS = [
  "Studio",
  "1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4+ bedrooms",
] as const;

const SECTION_TITLES: Record<ProfileSectionId, string> = {
  searchTrigger: "Search trigger",
  location: "Location",
  neighbourhood: "Neighbourhood",
  budget: "Budget",
  livingSituation: "Living situation",
};

function splitList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function ToggleChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className="h-8 rounded-full text-xs"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export interface ProfileSectionEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: ProfileSectionId | null;
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
}

export function ProfileSectionEditor({
  open,
  onOpenChange,
  section,
  profile,
  updateProfile,
}: ProfileSectionEditorProps) {
  const [triggerReason, setTriggerReason] = useState("");
  const [moveTimeline, setMoveTimeline] = useState("");
  const [searchTriggerType, setSearchTriggerType] = useState<
    "reactive" | "proactive" | null
  >(null);

  const [citiesText, setCitiesText] = useState("");
  const [workLocation, setWorkLocation] = useState("");

  const [prioritiesText, setPrioritiesText] = useState("");
  const [dealbreakersText, setDealbreakersText] = useState("");

  const [maxRent, setMaxRent] = useState("");
  const [creditRange, setCreditRange] = useState("");

  const [livingArrangement, setLivingArrangement] = useState<
    UserProfile["livingArrangement"]
  >(null);
  const [bedroomsNeeded, setBedroomsNeeded] = useState("");
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState("");

  useEffect(() => {
    if (!open || !section) return;
    setTriggerReason(profile.triggerReason);
    setMoveTimeline(profile.moveTimeline);
    setSearchTriggerType(profile.searchTrigger);
    setCitiesText(profile.preferredCities.join(", "));
    setWorkLocation(profile.workLocation);
    setPrioritiesText(profile.neighbourhoodPriorities.join(", "));
    setDealbreakersText(profile.dealbreakers.join(", "));
    setMaxRent(profile.maxMonthlyRent);
    setCreditRange(profile.creditScoreRange);
    setLivingArrangement(profile.livingArrangement);
    setBedroomsNeeded(profile.bedroomsNeeded);
    setHasPets(profile.hasPets);
    setPetDetails(profile.petDetails);
  }, [open, section, profile]);

  const handleSave = () => {
    if (!section) return;
    switch (section) {
      case "searchTrigger":
        updateProfile({
          searchTrigger: searchTriggerType,
          triggerReason,
          moveTimeline,
        });
        break;
      case "location":
        updateProfile({
          preferredCities: splitList(citiesText),
          workLocation,
        });
        break;
      case "neighbourhood":
        updateProfile({
          neighbourhoodPriorities: splitList(prioritiesText),
          dealbreakers: splitList(dealbreakersText),
        });
        break;
      case "budget":
        updateProfile({
          maxMonthlyRent: maxRent,
          creditScoreRange: creditRange === "Skip" ? "" : creditRange,
        });
        break;
      case "livingSituation": {
        const roommateOn = livingArrangement === "roommates";
        updateProfile({
          livingArrangement,
          bedroomsNeeded,
          hasPets,
          petDetails: hasPets ? petDetails : "",
          roommateSearchEnabled: roommateOn,
        });
        break;
      }
      default:
        break;
    }
    onOpenChange(false);
  };

  const title = section ? SECTION_TITLES[section] : "Edit";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit {title}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
          {section === "searchTrigger" && (
            <>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Search type
                </p>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    active={searchTriggerType === "reactive"}
                    onClick={() => setSearchTriggerType("reactive")}
                  >
                    Reactive
                  </ToggleChip>
                  <ToggleChip
                    active={searchTriggerType === "proactive"}
                    onClick={() => setSearchTriggerType("proactive")}
                  >
                    Proactive
                  </ToggleChip>
                  <ToggleChip
                    active={searchTriggerType === null}
                    onClick={() => setSearchTriggerType(null)}
                  >
                    Not set
                  </ToggleChip>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Reason
                </label>
                <Input
                  value={triggerReason}
                  onChange={(e) => setTriggerReason(e.target.value)}
                  placeholder="What prompted your search?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Timeline
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((opt) => (
                    <ToggleChip
                      key={opt}
                      active={moveTimeline === opt}
                      onClick={() => setMoveTimeline(opt)}
                    >
                      {opt}
                    </ToggleChip>
                  ))}
                </div>
                <Input
                  value={moveTimeline}
                  onChange={(e) => setMoveTimeline(e.target.value)}
                  placeholder="Or type your timeline"
                />
              </div>
            </>
          )}

          {section === "location" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Target cities
                </label>
                <Input
                  value={citiesText}
                  onChange={(e) => setCitiesText(e.target.value)}
                  placeholder="e.g. Austin, Denver"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple cities with commas.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Work / study
                </label>
                <Input
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder="Commute anchor (optional)"
                />
              </div>
            </>
          )}

          {section === "neighbourhood" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Priorities
                </label>
                <Input
                  value={prioritiesText}
                  onChange={(e) => setPrioritiesText(e.target.value)}
                  placeholder="Walkable, Near transit, …"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Dealbreakers
                </label>
                <Input
                  value={dealbreakersText}
                  onChange={(e) => setDealbreakersText(e.target.value)}
                  placeholder="Comma-separated"
                />
              </div>
            </>
          )}

          {section === "budget" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Max monthly rent
                </label>
                <div className="flex flex-wrap gap-2">
                  {RENT_OPTIONS.map((opt) => (
                    <ToggleChip
                      key={opt}
                      active={maxRent === opt}
                      onClick={() => setMaxRent(opt)}
                    >
                      {opt}
                    </ToggleChip>
                  ))}
                </div>
                <Input
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  placeholder="Or enter your own"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Credit score range
                </label>
                <div className="flex flex-wrap gap-2">
                  {CREDIT_OPTIONS.map((opt) => (
                    <ToggleChip
                      key={opt}
                      active={
                        opt === "Skip"
                          ? creditRange === ""
                          : creditRange === opt
                      }
                      onClick={() =>
                        setCreditRange(opt === "Skip" ? "" : opt)
                      }
                    >
                      {opt}
                    </ToggleChip>
                  ))}
                </div>
              </div>
            </>
          )}

          {section === "livingSituation" && (
            <>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Arrangement
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["solo", "Just me"],
                      ["roommates", "Me + roommate(s)"],
                      ["partner", "Me + partner"],
                      ["family", "My family"],
                    ] as const
                  ).map(([val, label]) => (
                    <ToggleChip
                      key={val}
                      active={livingArrangement === val}
                      onClick={() => setLivingArrangement(val)}
                    >
                      {label}
                    </ToggleChip>
                  ))}
                  <ToggleChip
                    active={livingArrangement === null}
                    onClick={() => setLivingArrangement(null)}
                  >
                    Not set
                  </ToggleChip>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Bedrooms
                </p>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((opt) => (
                    <ToggleChip
                      key={opt}
                      active={bedroomsNeeded === opt}
                      onClick={() => setBedroomsNeeded(opt)}
                    >
                      {opt}
                    </ToggleChip>
                  ))}
                </div>
                <Input
                  value={bedroomsNeeded}
                  onChange={(e) => setBedroomsNeeded(e.target.value)}
                  placeholder="Or type (e.g. 2+)"
                />
              </div>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={hasPets}
                    onCheckedChange={(v) => {
                      const on = v === true;
                      setHasPets(on);
                      if (!on) setPetDetails("");
                    }}
                  />
                  I have pets
                </label>
                {hasPets && (
                  <Input
                    value={petDetails}
                    onChange={(e) => setPetDetails(e.target.value)}
                    placeholder="Dog, cat, other…"
                  />
                )}
              </div>
            </>
          )}
        </div>

        <SheetFooter className="flex-row gap-2 border-t pt-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
