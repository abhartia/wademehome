export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  avatarInitials: string;
  sleepSchedule: "early-bird" | "night-owl" | "flexible";
  cleanlinessLevel: "very-tidy" | "tidy" | "relaxed";
  noiseLevel: "quiet" | "moderate" | "social";
  guestPolicy: "rarely" | "sometimes" | "often";
  smoking: "no" | "outside-only" | "yes";
  languagesSpoken: string[];
  targetCity: string;
  maxBudget: string;
  moveTimeline: string;
  bedroomsWanted: string;
  hasPets: boolean;
  petDetails: string;
  interests: string[];
  university?: string;
  /** Present when restored from a saved connection / match */
  compatibilityScore?: number;
  compatibilityReasons?: string[];
}

export interface RoommateMatch extends RoommateProfile {
  compatibilityScore: number;
  compatibilityReasons: string[];
}

export interface MyRoommateProfile {
  name: string;
  age: number;
  occupation: string;
  sleepSchedule: string;
  cleanlinessLevel: string;
  noiseLevel: string;
  guestPolicy: string;
  smoking: string;
  languagesSpoken: string[];
  preferredLanguages: string[];
  mustHavePreferredLanguages: boolean;
  interests: string[];
  bio: string;
  profileCompleted: boolean;
}

export const defaultMyRoommateProfile: MyRoommateProfile = {
  name: "",
  age: 0,
  occupation: "",
  sleepSchedule: "",
  cleanlinessLevel: "",
  noiseLevel: "",
  guestPolicy: "",
  smoking: "",
  languagesSpoken: [],
  preferredLanguages: [],
  mustHavePreferredLanguages: false,
  interests: [],
  bio: "",
  profileCompleted: false,
};

export interface RoommateMessage {
  role: "user" | "them";
  content: string;
  time: string;
}

export interface RoommateConnection {
  roommate: RoommateProfile;
  connectedAt: string;
  messages: RoommateMessage[];
}
