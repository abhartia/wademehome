export interface TourProperty {
  id: string;
  name: string;
  address: string;
  rent: string;
  beds: string;
  image: string;
  tags: string[];
}

export type TourStatus = "saved" | "scheduled" | "completed" | "cancelled";

export interface TourRatings {
  overall: number;
  cleanliness: number;
  naturalLight: number;
  noiseLevel: number;
  condition: number;
}

export interface TourNote {
  ratings: TourRatings;
  pros: string;
  cons: string;
  generalNotes: string;
  wouldApply: boolean | null;
  photoChecklist: string[];
  updatedAt: string;
}

export interface Tour {
  id: string;
  property: TourProperty;
  status: TourStatus;
  scheduledDate: string;
  scheduledTime: string;
  note: TourNote | null;
  createdAt: string;
}

export const defaultRatings: TourRatings = {
  overall: 0,
  cleanliness: 0,
  naturalLight: 0,
  noiseLevel: 0,
  condition: 0,
};

export const defaultNote: TourNote = {
  ratings: { ...defaultRatings },
  pros: "",
  cons: "",
  generalNotes: "",
  wouldApply: null,
  photoChecklist: [],
  updatedAt: "",
};
