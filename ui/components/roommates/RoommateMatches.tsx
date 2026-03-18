"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { useRoommate } from "@/components/providers/RoommateProvider";
import { MOCK_ROOMMATES, computeCompatibility } from "@/lib/mock/roommates";
import { RoommateMatch } from "@/lib/types/roommate";
import { RoommateCard } from "./RoommateCard";
import { RoommateDetail } from "./RoommateDetail";
import { toast } from "sonner";

export function RoommateMatches() {
  const { profile } = useUserProfile();
  const { myProfile, isConnected, addConnection } = useRoommate();
  const [selectedMatch, setSelectedMatch] = useState<RoommateMatch | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const matches = useMemo(() => {
    const scored = MOCK_ROOMMATES.map((candidate) =>
      computeCompatibility(profile, myProfile, candidate),
    );
    return scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }, [profile, myProfile]);

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
