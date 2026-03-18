"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { JourneyStage, JOURNEY_STAGES } from "@/lib/types/userProfile";
import { JourneyStageIndicator } from "./JourneyStageIndicator";

export function JourneyStageSelector() {
  const { profile, journeyStage, updateProfile } = useUserProfile();
  const hasOverride = profile.journeyStageOverride !== null;

  function selectStage(stage: JourneyStage) {
    updateProfile({ journeyStageOverride: stage });
  }

  function clearOverride() {
    updateProfile({ journeyStageOverride: null });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Journey stage
        </span>
        <JourneyStageIndicator stage={journeyStage} />
        {hasOverride && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 gap-0.5 px-1 text-[10px] text-muted-foreground"
            onClick={clearOverride}
          >
            <X className="h-2.5 w-2.5" />
            Auto-detect
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {JOURNEY_STAGES.map((s) => (
          <Badge
            key={s.value}
            variant={journeyStage === s.value ? "default" : "outline"}
            className="cursor-pointer px-2 py-0.5 text-xs"
            onClick={() => selectStage(s.value)}
          >
            {s.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
