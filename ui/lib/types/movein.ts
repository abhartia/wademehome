export type VendorCategory = "electric" | "gas" | "internet" | "movers";

export interface VendorPlan {
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  features: string[];
  popular?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  initials: string;
  /** Present only when sourced from real review data */
  rating?: number | null;
  reviewCount?: number | null;
  phone: string;
  website: string;
  coverageArea: string;
  plans: VendorPlan[];
}

export type OrderStatus =
  | "researching"
  | "requested"
  | "confirmed"
  | "active"
  | "cancelled";

export interface VendorOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  planId: string;
  planName: string;
  category: VendorCategory;
  status: OrderStatus;
  scheduledDate: string;
  accountNumber: string;
  notes: string;
  monthlyCost: string;
  createdAt: string;
}

export interface MoveInPlan {
  targetAddress: string;
  /** Two-letter US state from server geocode when available */
  targetState: string;
  moveDate: string;
  moveFromAddress: string;
}

export type ChecklistCategory =
  | "pre-move"
  | "address"
  | "insurance"
  | "moving-day"
  | "post-move";

export const CHECKLIST_CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  "pre-move": "Pre-move Setup",
  address: "Address Changes",
  insurance: "Insurance",
  "moving-day": "Moving Day",
  "post-move": "Post-move Inspection",
};

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  completed: boolean;
}

export const VENDOR_CATEGORY_META: Record<
  VendorCategory,
  { label: string; icon: string }
> = {
  electric: { label: "Electricity", icon: "Zap" },
  gas: { label: "Gas", icon: "Flame" },
  internet: { label: "Internet", icon: "Wifi" },
  movers: { label: "Movers", icon: "Truck" },
};

/* ── Photo Documentation types ── */

export type PhotoRoomType =
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "hallway"
  | "closet"
  | "other";

export const PHOTO_ROOM_META: Record<PhotoRoomType, { label: string; icon: string }> = {
  living_room: { label: "Living Room", icon: "Sofa" },
  bedroom: { label: "Bedroom", icon: "Bed" },
  kitchen: { label: "Kitchen", icon: "CookingPot" },
  bathroom: { label: "Bathroom", icon: "Bath" },
  hallway: { label: "Hallway", icon: "DoorOpen" },
  closet: { label: "Closet", icon: "Archive" },
  other: { label: "Other", icon: "LayoutGrid" },
};

export interface PhotoRoom {
  id: string;
  roomType: PhotoRoomType;
  roomLabel: string;
  sortOrder: number;
  photoCount: number;
  firstPhotoUrl: string | null;
}

export interface MoveInPhoto {
  id: string;
  roomId: string;
  photoUrl: string;
  thumbnailUrl: string | null;
  note: string | null;
  capturedAt: string | null;
  latitude: number | null;
  longitude: number | null;
  fileSizeBytes: number | null;
  createdAt: string;
}

export interface PhotoDocumentationSummary {
  roomCount: number;
  totalPhotos: number;
  rooms: PhotoRoom[];
}
