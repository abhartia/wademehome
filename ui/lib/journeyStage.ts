import { JourneyStage } from "./types/userProfile";

/**
 * Infers the journey stage by reading localStorage directly from each provider's
 * persisted state. This avoids circular dependencies since UserProfileProvider
 * wraps all other providers.
 */
export function inferJourneyStage(
  override: JourneyStage | null,
): JourneyStage | null {
  if (override) return override;

  try {
    const moveIn = localStorage.getItem("wademehome_movein");
    if (moveIn) {
      const parsed = JSON.parse(moveIn);
      const hasOrders =
        parsed.orders?.some(
          (o: { status: string }) => o.status !== "cancelled",
        ) ?? false;
      const hasChecked =
        parsed.checklist?.some((c: { completed: boolean }) => c.completed) ??
        false;
      if (hasOrders || hasChecked) return "moving";
    }

    const guarantor = localStorage.getItem("wademehome_guarantor");
    if (guarantor) {
      const parsed = JSON.parse(guarantor);
      const hasSentRequest = parsed.requests?.some(
        (r: { status: string }) =>
          r.status === "sent" ||
          r.status === "viewed" ||
          r.status === "signed",
      );
      if (hasSentRequest) return "applying";
    }

    const tours = localStorage.getItem("wademehome_tours");
    if (tours) {
      const parsed = JSON.parse(tours);
      const hasActiveTours = parsed.some?.(
        (t: { status: string }) =>
          t.status === "scheduled" || t.status === "completed",
      );
      if (hasActiveTours) return "touring";
    }

    const profile = localStorage.getItem("wademehome_user_profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.onboardingCompleted) return "searching";
    }
  } catch {
    // graceful fallback
  }

  return null;
}
