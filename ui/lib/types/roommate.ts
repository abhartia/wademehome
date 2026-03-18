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
  targetCity: string;
  maxBudget: string;
  moveTimeline: string;
  bedroomsWanted: string;
  hasPets: boolean;
  petDetails: string;
  interests: string[];
  university?: string;
}

export interface RoommateMatch extends RoommateProfile {
  compatibilityScore: number;
  compatibilityReasons: string[];
}

export interface MyRoommateProfile {
  sleepSchedule: string;
  cleanlinessLevel: string;
  noiseLevel: string;
  guestPolicy: string;
  smoking: string;
  interests: string[];
  bio: string;
  profileCompleted: boolean;
}

export const defaultMyRoommateProfile: MyRoommateProfile = {
  sleepSchedule: "",
  cleanlinessLevel: "",
  noiseLevel: "",
  guestPolicy: "",
  smoking: "",
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
