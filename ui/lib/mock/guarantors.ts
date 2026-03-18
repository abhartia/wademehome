import { GuarantorRequest, SavedGuarantor } from "@/lib/types/guarantor";

export const SEED_GUARANTORS: SavedGuarantor[] = [
  {
    id: "gtor-1",
    name: "Margaret Chen",
    email: "margaret.chen@email.com",
    phone: "(212) 555-0198",
    relationship: "parent",
    createdAt: "2026-01-15T10:00:00Z",
  },
];

export const SEED_REQUESTS: GuarantorRequest[] = [
  {
    id: "greq-1",
    guarantorId: "gtor-1",
    guarantorSnapshot: { name: "Margaret Chen", email: "margaret.chen@email.com" },
    lease: {
      propertyName: "Avalon at Edgewater",
      propertyAddress: "1000 Ave at Port Imperial, Weehawken, NJ",
      monthlyRent: "$3,200",
      leaseStart: "2026-04-01",
      leaseTerm: "12 months",
    },
    status: "signed",
    verificationStatus: "verified",
    createdAt: "2026-01-20T09:00:00Z",
    sentAt: "2026-01-20T09:05:00Z",
    viewedAt: "2026-01-20T14:30:00Z",
    signedAt: "2026-01-21T11:00:00Z",
    expiresAt: "2026-01-27T09:05:00Z",
    statusHistory: [
      { status: "draft", timestamp: "2026-01-20T09:00:00Z", note: "Request created" },
      { status: "sent", timestamp: "2026-01-20T09:05:00Z", note: "Sent to margaret.chen@email.com" },
      { status: "viewed", timestamp: "2026-01-20T14:30:00Z", note: "Opened by guarantor" },
      { status: "signed", timestamp: "2026-01-21T11:00:00Z", note: "Agreement signed" },
    ],
  },
  {
    id: "greq-2",
    guarantorId: "gtor-1",
    guarantorSnapshot: { name: "Margaret Chen", email: "margaret.chen@email.com" },
    lease: {
      propertyName: "The Rivington",
      propertyAddress: "123 Rivington St, New York, NY",
      monthlyRent: "$2,850",
      leaseStart: "2026-05-01",
      leaseTerm: "12 months",
    },
    status: "sent",
    verificationStatus: "pending",
    createdAt: "2026-02-25T10:00:00Z",
    sentAt: "2026-02-25T10:02:00Z",
    viewedAt: "",
    signedAt: "",
    expiresAt: "2026-03-04T10:02:00Z",
    statusHistory: [
      { status: "draft", timestamp: "2026-02-25T10:00:00Z", note: "Request created" },
      { status: "sent", timestamp: "2026-02-25T10:02:00Z", note: "Sent to margaret.chen@email.com" },
    ],
  },
  {
    id: "greq-3",
    guarantorId: "gtor-1",
    guarantorSnapshot: { name: "Margaret Chen", email: "margaret.chen@email.com" },
    lease: {
      propertyName: "The Ashton",
      propertyAddress: "250 Ashland Pl, Brooklyn, NY",
      monthlyRent: "$3,450",
      leaseStart: "",
      leaseTerm: "12 months",
    },
    status: "draft",
    verificationStatus: "pending",
    createdAt: "2026-02-27T08:00:00Z",
    sentAt: "",
    viewedAt: "",
    signedAt: "",
    expiresAt: "",
    statusHistory: [
      { status: "draft", timestamp: "2026-02-27T08:00:00Z", note: "Request created" },
    ],
  },
];
