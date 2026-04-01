import { JourneyStage } from "./types/userProfile";

/**
 * Primary app route for each journey stage — must stay in sync with AppSidebar emphasis.
 */
export const JOURNEY_STAGE_DEFAULT_PATH: Partial<Record<JourneyStage, string>> = {
  searching: "/search",
  touring: "/tours",
  applying: "/profile",
  "lease-signed": "/move-in",
  moving: "/move-in",
  "moved-in": "/profile",
};

export function defaultAppLandingPath(journeyStage: JourneyStage | null): string {
  if (!journeyStage) return "/app";
  return JOURNEY_STAGE_DEFAULT_PATH[journeyStage] ?? "/app";
}
