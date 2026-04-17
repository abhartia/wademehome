"use client";

import { useState } from "react";
import { Users2 } from "lucide-react";
import { useRoommate } from "@/components/providers/RoommateProvider";
import { RoommateMatch } from "@/lib/types/roommate";
import { RoommateCard } from "./RoommateCard";
import { RoommateDetail } from "./RoommateDetail";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { readRoommateMatchesRoommatesMatchesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";

export function RoommateMatches() {
  const { isConnected, addConnection } = useRoommate();
  const [selectedMatch, setSelectedMatch] = useState<RoommateMatch | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const activeGroupId = useActiveGroupId();
  const groupsQuery = useMyGroups({ enabled: Boolean(activeGroupId) });
  const activeGroupName = activeGroupId
    ? groupsQuery.data?.groups.find((g) => g.id === activeGroupId)?.name
    : null;

  const { data } = useQuery(
    readRoommateMatchesRoommatesMatchesGetOptions({
      query: activeGroupId ? { group_id: activeGroupId } : undefined,
    }),
  );
  const matches: RoommateMatch[] = (data?.matches ?? []).map((m) => ({
    id: m.id,
    name: m.name ?? "",
    age: m.age ?? 0,
    occupation: m.occupation ?? "",
    bio: m.bio ?? "",
    avatarInitials: m.avatar_initials ?? "",
    sleepSchedule: m.sleep_schedule as RoommateMatch["sleepSchedule"],
    cleanlinessLevel: m.cleanliness_level as RoommateMatch["cleanlinessLevel"],
    noiseLevel: m.noise_level as RoommateMatch["noiseLevel"],
    guestPolicy: m.guest_policy as RoommateMatch["guestPolicy"],
    smoking: m.smoking as RoommateMatch["smoking"],
    languagesSpoken: m.languages_spoken ?? [],
    targetCity: m.target_city ?? "",
    maxBudget: m.max_budget ?? "",
    moveTimeline: m.move_timeline ?? "",
    bedroomsWanted: m.bedrooms_wanted ?? "",
    hasPets: m.has_pets ?? false,
    petDetails: m.pet_details ?? "",
    interests: m.interests ?? [],
    university: m.university ?? undefined,
    compatibilityScore: m.compatibility_score ?? 0,
    compatibilityReasons: m.compatibility_reasons ?? [],
  }));

  const handleConnect = (match: RoommateMatch) => {
    addConnection(match);
    toast.success(`Connected with ${match.name.split(" ")[0]}! Check the Connections tab to chat.`);
  };

  const handleViewProfile = (match: RoommateMatch) => {
    setSelectedMatch(match);
    setDetailOpen(true);
  };

  return (
    <>
      {activeGroupId && activeGroupName && (
        <div className="mb-4 flex items-start gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <Users2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">
            Showing matches for{" "}
            <span className="font-medium text-foreground">{activeGroupName}</span>
            {" "}— compatible with all members.
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <RoommateCard
            key={match.id}
            match={match}
            isConnected={isConnected(match.id)}
            onConnect={() => handleConnect(match)}
            onViewProfile={() => handleViewProfile(match)}
          />
        ))}
      </div>

      <RoommateDetail
        match={selectedMatch}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isConnected={selectedMatch ? isConnected(selectedMatch.id) : false}
        onConnect={() => {
          if (selectedMatch) {
            handleConnect(selectedMatch);
            setDetailOpen(false);
          }
        }}
      />
    </>
  );
}
