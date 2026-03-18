import {
  MyRoommateProfile,
  RoommateMatch,
  RoommateProfile,
} from "@/lib/types/roommate";
import { UserProfile } from "@/lib/types/userProfile";

export const MOCK_ROOMMATES: RoommateProfile[] = [
  {
    id: "r1",
    name: "Jordan Rivera",
    age: 24,
    occupation: "Software Engineer",
    bio: "Grad from NYU Tandon, working in fintech. I cook a lot and love having music on while I work. Looking for someone chill who keeps things reasonably clean.",
    avatarInitials: "JR",
    sleepSchedule: "night-owl",
    cleanlinessLevel: "tidy",
    noiseLevel: "moderate",
    guestPolicy: "sometimes",
    smoking: "no",
    targetCity: "New York",
    maxBudget: "$2,000 - $3,000",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Cooking", "Music", "Tech", "Fitness"],
    university: "NYU",
  },
  {
    id: "r2",
    name: "Priya Sharma",
    age: 22,
    occupation: "Graduate Student",
    bio: "Masters in Data Science at Columbia. Early riser, love morning runs in the park. Quiet during the week but enjoy going out on weekends.",
    avatarInitials: "PS",
    sleepSchedule: "early-bird",
    cleanlinessLevel: "very-tidy",
    noiseLevel: "quiet",
    guestPolicy: "rarely",
    smoking: "no",
    targetCity: "New York",
    maxBudget: "$1,500 - $2,000",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Fitness", "Reading", "Hiking", "Photography"],
    university: "Columbia",
  },
  {
    id: "r3",
    name: "Marcus Chen",
    age: 26,
    occupation: "UX Designer",
    bio: "Working at a startup in Austin. I'm a pretty social person -- love hosting game nights and trying new restaurants. I keep things tidy but I'm not obsessive about it.",
    avatarInitials: "MC",
    sleepSchedule: "flexible",
    cleanlinessLevel: "tidy",
    noiseLevel: "social",
    guestPolicy: "often",
    smoking: "no",
    targetCity: "Austin",
    maxBudget: "$1,000 - $1,500",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: true,
    petDetails: "Cat",
    interests: ["Gaming", "Art", "Cooking", "Movies"],
  },
  {
    id: "r4",
    name: "Aisha Johnson",
    age: 23,
    occupation: "Nursing Student",
    bio: "Second-year at Rutgers nursing program. I have odd hours because of clinicals, so I need someone who's understanding about that. Very clean and organised.",
    avatarInitials: "AJ",
    sleepSchedule: "flexible",
    cleanlinessLevel: "very-tidy",
    noiseLevel: "quiet",
    guestPolicy: "rarely",
    smoking: "no",
    targetCity: "New York",
    maxBudget: "$1,000 - $1,500",
    moveTimeline: "ASAP",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Fitness", "Reading", "Cooking", "Music"],
    university: "Rutgers",
  },
  {
    id: "r5",
    name: "Liam O'Brien",
    age: 25,
    occupation: "Marketing Analyst",
    bio: "Moved to Chicago for work last year. Big sports fan, you'll find me watching games on the weekend. I'm tidy in common areas, my room is another story.",
    avatarInitials: "LO",
    sleepSchedule: "night-owl",
    cleanlinessLevel: "relaxed",
    noiseLevel: "moderate",
    guestPolicy: "sometimes",
    smoking: "outside-only",
    targetCity: "Chicago",
    maxBudget: "$1,500 - $2,000",
    moveTimeline: "3-6 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Sports", "Gaming", "Movies", "Travel"],
  },
  {
    id: "r6",
    name: "Sofia Ramirez",
    age: 21,
    occupation: "Undergrad Student",
    bio: "Junior at UT Austin studying film. I'm creative, a little messy but I always clean up when asked. Love movie marathons and thrift shopping.",
    avatarInitials: "SR",
    sleepSchedule: "night-owl",
    cleanlinessLevel: "relaxed",
    noiseLevel: "social",
    guestPolicy: "often",
    smoking: "no",
    targetCity: "Austin",
    maxBudget: "Under $1,000",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Movies", "Art", "Photography", "Music"],
    university: "UT Austin",
  },
  {
    id: "r7",
    name: "Ethan Kim",
    age: 28,
    occupation: "Physical Therapist",
    bio: "Working at a clinic in Miami. Early mornings, gym after work, and I like keeping the apartment spotless. Looking for someone with a similar routine.",
    avatarInitials: "EK",
    sleepSchedule: "early-bird",
    cleanlinessLevel: "very-tidy",
    noiseLevel: "quiet",
    guestPolicy: "sometimes",
    smoking: "no",
    targetCity: "Miami",
    maxBudget: "$2,000 - $3,000",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Fitness", "Cooking", "Hiking", "Travel"],
  },
  {
    id: "r8",
    name: "Taylor Washington",
    age: 24,
    occupation: "Freelance Photographer",
    bio: "Based in LA, working with brands and events. My schedule is all over the place. I'm easygoing about most things -- just no smoking inside please.",
    avatarInitials: "TW",
    sleepSchedule: "flexible",
    cleanlinessLevel: "tidy",
    noiseLevel: "moderate",
    guestPolicy: "sometimes",
    smoking: "no",
    targetCity: "Los Angeles",
    maxBudget: "$2,000 - $3,000",
    moveTimeline: "3-6 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: true,
    petDetails: "Dog",
    interests: ["Photography", "Art", "Hiking", "Music"],
  },
  {
    id: "r9",
    name: "Nadia Petrov",
    age: 23,
    occupation: "Junior Accountant",
    bio: "Working my first job out of college in SF. Quiet during the week, love exploring the city on weekends. Big into fitness and cooking healthy meals.",
    avatarInitials: "NP",
    sleepSchedule: "early-bird",
    cleanlinessLevel: "tidy",
    noiseLevel: "quiet",
    guestPolicy: "rarely",
    smoking: "no",
    targetCity: "San Francisco",
    maxBudget: "$2,000 - $3,000",
    moveTimeline: "1-2 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: false,
    petDetails: "",
    interests: ["Fitness", "Cooking", "Reading", "Travel"],
  },
  {
    id: "r10",
    name: "Devon Carter",
    age: 27,
    occupation: "High School Teacher",
    bio: "Teaching English in Brooklyn. I'm an early bird because of work. Love reading, parks, and cooking elaborate Sunday dinners. Pets are welcome!",
    avatarInitials: "DC",
    sleepSchedule: "early-bird",
    cleanlinessLevel: "tidy",
    noiseLevel: "moderate",
    guestPolicy: "sometimes",
    smoking: "no",
    targetCity: "New York",
    maxBudget: "$1,500 - $2,000",
    moveTimeline: "3-6 months",
    bedroomsWanted: "2 bedrooms",
    hasPets: true,
    petDetails: "Cat",
    interests: ["Reading", "Cooking", "Hiking", "Movies"],
  },
];

// Deterministic avatar colour from name hash
export function avatarColor(name: string): string {
  const colors = [
    "bg-rose-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Budget ranges ordered for overlap comparison
const BUDGET_ORDER = [
  "Under $1,000",
  "$1,000 - $1,500",
  "$1,500 - $2,000",
  "$2,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000+",
];

function budgetDistance(a: string, b: string): number {
  const ia = BUDGET_ORDER.indexOf(a);
  const ib = BUDGET_ORDER.indexOf(b);
  if (ia === -1 || ib === -1) return 2;
  return Math.abs(ia - ib);
}

export function computeCompatibility(
  userProfile: UserProfile,
  myRoommate: MyRoommateProfile,
  candidate: RoommateProfile,
): RoommateMatch {
  let score = 50; // baseline
  const reasons: string[] = [];

  // City match (big factor)
  if (
    userProfile.preferredCities.length > 0 &&
    userProfile.preferredCities.some(
      (c) => c.toLowerCase() === candidate.targetCity.toLowerCase(),
    )
  ) {
    score += 15;
    reasons.push(`Both looking in ${candidate.targetCity}`);
  } else if (userProfile.preferredCities.length > 0) {
    score -= 10;
  }

  // Budget overlap
  const dist = budgetDistance(userProfile.maxMonthlyRent, candidate.maxBudget);
  if (dist === 0) {
    score += 10;
    reasons.push("Same budget range");
  } else if (dist === 1) {
    score += 5;
  } else if (dist >= 3) {
    score -= 10;
  }

  // Timeline alignment
  if (
    userProfile.moveTimeline &&
    userProfile.moveTimeline === candidate.moveTimeline
  ) {
    score += 8;
    reasons.push("Matching move timeline");
  }

  // Sleep schedule match
  if (myRoommate.sleepSchedule) {
    const userSleep = myRoommate.sleepSchedule.toLowerCase();
    const candSleep = candidate.sleepSchedule;
    if (
      userSleep.includes(candSleep) ||
      candSleep === "flexible" ||
      userSleep.includes("flexible")
    ) {
      score += 8;
      reasons.push("Compatible sleep schedules");
    } else if (
      (userSleep.includes("early") && candSleep === "night-owl") ||
      (userSleep.includes("night") && candSleep === "early-bird")
    ) {
      score -= 8;
    }
  }

  // Cleanliness alignment
  if (myRoommate.cleanlinessLevel) {
    const userClean = myRoommate.cleanlinessLevel.toLowerCase();
    const candClean = candidate.cleanlinessLevel;
    if (userClean.includes(candClean) || candClean === "tidy") {
      score += 6;
    } else if (
      (userClean.includes("very") && candClean === "relaxed") ||
      (userClean.includes("relaxed") && candClean === "very-tidy")
    ) {
      score -= 6;
    }
  }

  // Noise level match
  if (myRoommate.noiseLevel) {
    const userNoise = myRoommate.noiseLevel.toLowerCase();
    const candNoise = candidate.noiseLevel;
    if (userNoise.includes(candNoise) || candNoise === "moderate") {
      score += 5;
    } else if (
      (userNoise.includes("quiet") && candNoise === "social") ||
      (userNoise.includes("social") && candNoise === "quiet")
    ) {
      score -= 8;
    }
  }

  // Pet compatibility
  if (userProfile.hasPets && !candidate.hasPets) {
    // Fine — candidate doesn't have pets but user does; no issue
  } else if (!userProfile.hasPets && candidate.hasPets) {
    score -= 3;
  }

  // Shared interests
  if (myRoommate.interests.length > 0) {
    const shared = myRoommate.interests.filter((i) =>
      candidate.interests.includes(i),
    );
    if (shared.length >= 3) {
      score += 8;
      reasons.push(`${shared.length} shared interests`);
    } else if (shared.length >= 1) {
      score += 4;
      reasons.push(
        `Shared interests: ${shared.slice(0, 2).join(", ")}`,
      );
    }
  }

  // Smoking match
  if (myRoommate.smoking) {
    const userSmoke = myRoommate.smoking.toLowerCase();
    if (
      userSmoke.includes("no smoking") &&
      candidate.smoking !== "no"
    ) {
      score -= 10;
    }
  }

  // Clamp
  score = Math.max(15, Math.min(98, score));

  return {
    ...candidate,
    compatibilityScore: score,
    compatibilityReasons: reasons.slice(0, 3),
  };
}
