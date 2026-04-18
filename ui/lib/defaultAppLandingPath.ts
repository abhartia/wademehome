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

export function defaultAppLandingPath(_journeyStage: JourneyStage | null): string {
  // The home tab is now a chat-first concierge that covers every journey
  // stage, so authenticated users always land there. The journey-stage map
  // above is still consumed by AppSidebar for nav emphasis.
  return "/app";
}
