export interface SavedGuarantor {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: "parent" | "relative" | "employer" | "other";
  createdAt: string;
}

export type GuarantorRequestStatus =
  | "draft"
  | "invited"
  | "opened"
  | "consented"
  | "signed"
  | "submitted"
  | "verified"
  | "failed"
  | "expired"
  | "declined"
  | "revoked";

export interface LeaseInfo {
  propertyName: string;
  propertyAddress: string;
  monthlyRent: string;
  leaseStart: string;
  leaseTerm: string;
}

export interface StatusHistoryEntry {
  eventType: string;
  actor: string;
  timestamp: string;
  note: string;
}

export interface GuarantorRequest {
  id: string;
  guarantorId: string;
  guarantorSnapshot: { name: string; email: string };
  lease: LeaseInfo;
  status: GuarantorRequestStatus;
  verificationStatus: "pending" | "verified" | "failed";
  createdAt: string;
  sentAt: string;
  viewedAt: string;
  signedAt: string;
  expiresAt: string;
  statusHistory: StatusHistoryEntry[];
}

export const RELATIONSHIP_OPTIONS: {
  value: SavedGuarantor["relationship"];
  label: string;
}[] = [
  { value: "parent", label: "Parent" },
  { value: "relative", label: "Relative" },
  { value: "employer", label: "Employer" },
  { value: "other", label: "Other" },
];

export const LEASE_TERM_OPTIONS = [
  "6 months",
  "12 months",
  "18 months",
  "24 months",
];
