"use client";

import { Badge } from "@/components/ui/badge";
import {
  Search,
  CalendarCheck,
  FileText,
  PenTool,
  Package,
  Home,
} from "lucide-react";
import { JourneyStage } from "@/lib/types/userProfile";

const STAGE_CONFIG: Record<
  JourneyStage,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  searching: {
    label: "Searching",
    icon: Search,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  touring: {
    label: "Touring",
    icon: CalendarCheck,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  applying: {
    label: "Applying",
    icon: FileText,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "lease-signed": {
    label: "Lease Signed",
    icon: PenTool,
    className: "border-green-200 bg-green-50 text-green-700",
  },
  moving: {
    label: "Moving",
    icon: Package,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "moved-in": {
    label: "Moved In",
    icon: Home,
    className: "border-green-200 bg-green-50 text-green-700",
  },
};

interface JourneyStageIndicatorProps {
  stage: JourneyStage | null;
}

export function JourneyStageIndicator({ stage }: JourneyStageIndicatorProps) {
  if (!stage) return null;

  const cfg = STAGE_CONFIG[stage];
  const Icon = cfg.icon;

  return (
    <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-xs ${cfg.className}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}
