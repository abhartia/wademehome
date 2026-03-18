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
  rating: number;
  reviewCount: number;
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
