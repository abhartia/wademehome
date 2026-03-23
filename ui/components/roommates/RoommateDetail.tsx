"use client";

import { RoommateMatch } from "@/lib/types/roommate";
import { avatarColor } from "@/lib/roommates/avatarColor";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Clock,
  Moon,
  Sparkles as SparklesIcon,
  Volume2,
  Users,
  Cigarette,
  PawPrint,
  UserPlus,
  BedDouble,
  Languages,
} from "lucide-react";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-semibold ${color}`}
    >
      {score}% match
    </span>
  );
}

const lifestyleItems = (match: RoommateMatch) => [
  { icon: Moon, label: "Sleep", value: match.sleepSchedule },
  { icon: SparklesIcon, label: "Tidiness", value: match.cleanlinessLevel },
  { icon: Volume2, label: "Noise", value: match.noiseLevel },
  { icon: Users, label: "Guests", value: match.guestPolicy },
  { icon: Cigarette, label: "Smoking", value: match.smoking },
  {
    icon: Languages,
    label: "Languages",
    value: match.languagesSpoken.join(", ") || "Not specified",
  },
  { icon: PawPrint, label: "Pets", value: match.hasPets ? match.petDetails : "None" },
  { icon: BedDouble, label: "Bedrooms", value: match.bedroomsWanted },
];

export function RoommateDetail({
  match,
  open,
  onOpenChange,
  isConnected,
  onConnect,
}: {
  match: RoommateMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isConnected: boolean;
  onConnect: () => void;
}) {
  if (!match) return null;

  const bgColor = avatarColor(match.name);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="sr-only">{match.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-2">
          {/* Profile header */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${bgColor}`}
            >
              {match.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{match.name}</h2>
              <p className="text-sm text-muted-foreground">
                {match.age} &middot; {match.occupation}
              </p>
              {match.university && (
                <p className="text-xs text-muted-foreground">
                  {match.university}
                </p>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3">
            <ScoreBadge score={match.compatibilityScore} />
            {match.compatibilityReasons.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {match.compatibilityReasons.map((r) => (
                  <Badge
                    key={r}
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Bio */}
          <div>
            <h3 className="mb-1 text-sm font-semibold">About</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {match.bio}
            </p>
          </div>

          <Separator />

          {/* Key details */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border p-2">
              <MapPin className="mx-auto mb-1 h-4 w-4 text-primary" />
              <p className="text-xs font-medium">{match.targetCity}</p>
            </div>
            <div className="rounded-lg border p-2">
              <DollarSign className="mx-auto mb-1 h-4 w-4 text-primary" />
              <p className="text-xs font-medium">{match.maxBudget}</p>
            </div>
            <div className="rounded-lg border p-2">
              <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
              <p className="text-xs font-medium">{match.moveTimeline}</p>
            </div>
          </div>

          <Separator />

          {/* Lifestyle */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Lifestyle</h3>
            <div className="space-y-2">
              {lifestyleItems(match).map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="w-20 text-muted-foreground">{item.label}</span>
                  <span className="font-medium capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Interests */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {match.interests.map((i) => (
                <Badge key={i} variant="outline">
                  {i}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            {isConnected ? (
              <Button className="w-full gap-1.5" disabled>
                <UserPlus className="h-4 w-4" />
                Already Connected
              </Button>
            ) : (
              <Button className="w-full gap-1.5" onClick={onConnect}>
                <UserPlus className="h-4 w-4" />
                Connect with {match.name.split(" ")[0]}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
