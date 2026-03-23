export type JourneyStage =
  | "searching"
  | "touring"
  | "applying"
  | "lease-signed"
  | "moving"
  | "moved-in";

export const JOURNEY_STAGES: { value: JourneyStage; label: string }[] = [
  { value: "searching", label: "Searching" },
  { value: "touring", label: "Touring" },
  { value: "applying", label: "Applying" },
  { value: "lease-signed", label: "Lease Signed" },
  { value: "moving", label: "Moving" },
  { value: "moved-in", label: "Moved In" },
];

export interface UserProfile {
  /** Shown in sidebar as "My lease" when true; set in onboarding or Profile. */
  hasCurrentLease: boolean;
  // Stage 1: Search trigger
  searchTrigger: "reactive" | "proactive" | null;
  triggerReason: string;
  moveTimeline: string;
  // Stage 2: City preferences
  currentCity: string;
  workLocation: string;
  preferredCities: string[];
  // Stage 3: Neighbourhood preferences
  neighbourhoodPriorities: string[];
  dealbreakers: string[];
  // Stage 4: Budget
  maxMonthlyRent: string;
  creditScoreRange: string;
  // Stage 5: Living situation
  livingArrangement: "solo" | "roommates" | "partner" | "family" | null;
  /** Show Roommates nav + routes; set from onboarding (roommates) or Profile toggle. */
  roommateSearchEnabled: boolean;
  bedroomsNeeded: string;
  hasPets: boolean;
  petDetails: string;
  // Journey stage
  journeyStageOverride: JourneyStage | null;
  // Meta
  onboardingCompleted: boolean;
  onboardingStep: number;
  lastUpdated: string;
}

export const defaultProfile: UserProfile = {
  hasCurrentLease: false,
  searchTrigger: null,
  triggerReason: "",
  moveTimeline: "",
  currentCity: "",
  workLocation: "",
  preferredCities: [],
  neighbourhoodPriorities: [],
  dealbreakers: [],
  maxMonthlyRent: "",
  creditScoreRange: "",
  livingArrangement: null,
  roommateSearchEnabled: false,
  bedroomsNeeded: "",
  hasPets: false,
  petDetails: "",
  journeyStageOverride: null,
  onboardingCompleted: false,
  onboardingStep: 0,
  lastUpdated: "",
};
