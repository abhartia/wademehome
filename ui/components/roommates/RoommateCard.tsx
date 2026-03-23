"use client";

import { RoommateMatch } from "@/lib/types/roommate";
import { avatarColor } from "@/lib/roommates/avatarColor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, UserPlus, Eye } from "lucide-react";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${color}`}
    >
      {score}% match
    </span>
  );
}

export function RoommateCard({
  match,
  isConnected,
  onConnect,
  onViewProfile,
}: {
  match: RoommateMatch;
  isConnected: boolean;
  onConnect: () => void;
  onViewProfile: () => void;
}) {
  const bgColor = avatarColor(match.name);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        {/* Header: avatar + name + score */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${bgColor}`}
          >
            {match.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{match.name}</h3>
              <ScoreBadge score={match.compatibilityScore} />
            </div>
            <p className="text-xs text-muted-foreground">
              {match.age} &middot; {match.occupation}
            </p>
          </div>
        </div>

        {/* Compatibility reasons */}
        {match.compatibilityReasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {match.compatibilityReasons.map((r) => (
              <Badge key={r} variant="secondary" className="text-[10px] font-normal">
                {r}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.targetCity}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {match.maxBudget}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {match.moveTimeline}
          </span>
        </div>

        {/* Bio excerpt */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {match.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1">
          {match.languagesSpoken.slice(0, 2).map((language) => (
            <Badge key={language} variant="secondary" className="text-[10px]">
              {language}
            </Badge>
          ))}
          {match.interests.slice(0, 4).map((i) => (
            <Badge key={i} variant="outline" className="text-[10px]">
              {i}
            </Badge>
          ))}
          {match.interests.length > 4 && (
            <Badge variant="outline" className="text-[10px]">
              +{match.interests.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={onViewProfile}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          {isConnected ? (
            <Button size="sm" className="flex-1 gap-1.5" disabled>
              <UserPlus className="h-3.5 w-3.5" />
              Connected
            </Button>
          ) : (
            <Button size="sm" className="flex-1 gap-1.5" onClick={onConnect}>
              <UserPlus className="h-3.5 w-3.5" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
