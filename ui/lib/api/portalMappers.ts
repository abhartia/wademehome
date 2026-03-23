import type {
  MyRoommateProfilePayload,
  ProfileOut,
  ProfilePatch,
} from "@/lib/api/generated/types.gen";
import type { UserProfile } from "@/lib/types/userProfile";
import type { Tour, TourNote, TourProperty, TourStatus } from "@/lib/types/tours";
import type {
  GuarantorRequest,
  LeaseInfo,
  SavedGuarantor,
} from "@/lib/types/guarantor";
import type {
  ChecklistItem,
  MoveInPlan,
  VendorOrder,
} from "@/lib/types/movein";
import type {
  MyRoommateProfile,
  RoommateConnection,
  RoommateMessage,
  RoommateProfile,
} from "@/lib/types/roommate";

export function profileFromApi(row: ProfileOut): UserProfile {
  return {
    hasCurrentLease: row.has_current_lease ?? false,
    searchTrigger: (row.search_trigger as UserProfile["searchTrigger"]) ?? null,
    triggerReason: row.trigger_reason ?? "",
    moveTimeline: row.move_timeline ?? "",
    currentCity: row.current_city ?? "",
    workLocation: row.work_location ?? "",
    preferredCities: row.preferred_cities ?? [],
    neighbourhoodPriorities: row.neighbourhood_priorities ?? [],
    dealbreakers: row.dealbreakers ?? [],
    maxMonthlyRent: row.max_monthly_rent ?? "",
    creditScoreRange: row.credit_score_range ?? "",
    livingArrangement: (row.living_arrangement as UserProfile["livingArrangement"]) ?? null,
    roommateSearchEnabled: row.roommate_search_enabled ?? false,
    bedroomsNeeded: row.bedrooms_needed ?? "",
    hasPets: row.has_pets ?? false,
    petDetails: row.pet_details ?? "",
    journeyStageOverride: (row.journey_stage_override as UserProfile["journeyStageOverride"]) ?? null,
    onboardingCompleted: row.onboarding_completed ?? false,
    onboardingStep: row.onboarding_step ?? 0,
    lastUpdated: row.last_updated ?? "",
  };
}

export function partialUserProfileToPatch(partial: Partial<UserProfile>): ProfilePatch {
  const body: ProfilePatch = {};
  if (partial.hasCurrentLease !== undefined)
    body.has_current_lease = partial.hasCurrentLease;
  if (partial.searchTrigger !== undefined) body.search_trigger = partial.searchTrigger;
  if (partial.triggerReason !== undefined) body.trigger_reason = partial.triggerReason;
  if (partial.moveTimeline !== undefined) body.move_timeline = partial.moveTimeline;
  if (partial.currentCity !== undefined) body.current_city = partial.currentCity;
  if (partial.workLocation !== undefined) body.work_location = partial.workLocation;
  if (partial.preferredCities !== undefined) body.preferred_cities = partial.preferredCities;
  if (partial.neighbourhoodPriorities !== undefined)
    body.neighbourhood_priorities = partial.neighbourhoodPriorities;
  if (partial.dealbreakers !== undefined) body.dealbreakers = partial.dealbreakers;
  if (partial.maxMonthlyRent !== undefined) body.max_monthly_rent = partial.maxMonthlyRent;
  if (partial.creditScoreRange !== undefined) body.credit_score_range = partial.creditScoreRange;
  if (partial.livingArrangement !== undefined) body.living_arrangement = partial.livingArrangement;
  if (partial.roommateSearchEnabled !== undefined)
    body.roommate_search_enabled = partial.roommateSearchEnabled;
  if (partial.bedroomsNeeded !== undefined) body.bedrooms_needed = partial.bedroomsNeeded;
  if (partial.hasPets !== undefined) body.has_pets = partial.hasPets;
  if (partial.petDetails !== undefined) body.pet_details = partial.petDetails;
  if (partial.journeyStageOverride !== undefined)
    body.journey_stage_override = partial.journeyStageOverride;
  if (partial.onboardingCompleted !== undefined)
    body.onboarding_completed = partial.onboardingCompleted;
  if (partial.onboardingStep !== undefined) body.onboarding_step = partial.onboardingStep;
  return body;
}

export function userProfileToProfilePatch(p: UserProfile): ProfilePatch {
  return {
    has_current_lease: p.hasCurrentLease,
    search_trigger: p.searchTrigger,
    trigger_reason: p.triggerReason || null,
    move_timeline: p.moveTimeline || null,
    current_city: p.currentCity || null,
    work_location: p.workLocation || null,
    preferred_cities: p.preferredCities,
    neighbourhood_priorities: p.neighbourhoodPriorities,
    dealbreakers: p.dealbreakers,
    max_monthly_rent: p.maxMonthlyRent || null,
    credit_score_range: p.creditScoreRange || null,
    living_arrangement: p.livingArrangement,
    roommate_search_enabled: p.roommateSearchEnabled,
    bedrooms_needed: p.bedroomsNeeded || null,
    has_pets: p.hasPets,
    pet_details: p.petDetails || null,
    journey_stage_override: p.journeyStageOverride,
    onboarding_completed: p.onboardingCompleted,
    onboarding_step: p.onboardingStep,
  };
}

// --- Tours ---

type TourNoteApi = {
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  general_notes: string;
  would_apply: boolean | null;
  photo_checklist: string[];
  updated_at: string;
};

type TourApi = {
  id: string;
  property: {
    id: string;
    name: string;
    address: string;
    rent: string;
    beds: string;
    image: string;
    tags: string[];
  };
  status: TourStatus;
  scheduled_date: string;
  scheduled_time: string;
  note: TourNoteApi | null;
  created_at: string;
};

function tourNoteFromApi(n: TourNoteApi): TourNote {
  return {
    ratings: {
      overall: n.ratings?.overall ?? 0,
      cleanliness: n.ratings?.cleanliness ?? 0,
      naturalLight: n.ratings?.naturalLight ?? n.ratings?.natural_light ?? 0,
      noiseLevel: n.ratings?.noiseLevel ?? n.ratings?.noise_level ?? 0,
      condition: n.ratings?.condition ?? 0,
    },
    pros: n.pros ?? "",
    cons: n.cons ?? "",
    generalNotes: n.general_notes ?? "",
    wouldApply: n.would_apply ?? null,
    photoChecklist: n.photo_checklist ?? [],
    updatedAt: n.updated_at ?? "",
  };
}

function tourNoteToApi(n: TourNote): TourNoteApi {
  return {
    ratings: {
      overall: n.ratings.overall,
      cleanliness: n.ratings.cleanliness,
      naturalLight: n.ratings.naturalLight,
      noiseLevel: n.ratings.noiseLevel,
      condition: n.ratings.condition,
    },
    pros: n.pros,
    cons: n.cons,
    general_notes: n.generalNotes,
    would_apply: n.wouldApply,
    photo_checklist: n.photoChecklist,
    updated_at: n.updatedAt,
  };
}

export function toursFromApi(payload: unknown): Tour[] {
  const row = (payload ?? {}) as { tours?: TourApi[] };
  return (row.tours ?? []).map((t) => {
    const property: TourProperty = {
      id: t.property.id,
      name: t.property.name,
      address: t.property.address,
      rent: t.property.rent,
      beds: t.property.beds,
      image: t.property.image,
      tags: t.property.tags ?? [],
    };
    return {
      id: t.id,
      property,
      status: t.status,
      scheduledDate: t.scheduled_date ?? "",
      scheduledTime: t.scheduled_time ?? "",
      note: t.note ? tourNoteFromApi(t.note) : null,
      createdAt: t.created_at ?? "",
    };
  });
}

export function toursToApiPayload(tours: Tour[]) {
  return {
    tours: tours.map((t) => ({
      id: t.id,
      property: {
        id: t.property.id,
        name: t.property.name,
        address: t.property.address,
        rent: t.property.rent,
        beds: t.property.beds,
        image: t.property.image,
        tags: t.property.tags,
      },
      status: t.status,
      scheduled_date: t.scheduledDate,
      scheduled_time: t.scheduledTime,
      note: t.note ? tourNoteToApi(t.note) : null,
      created_at: t.createdAt,
    })),
  };
}

// --- Guarantors ---

type GuarantorStateApi = {
  saved_guarantors?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    relationship: string;
    created_at: string;
  }[];
  requests?: {
    id: string;
    guarantor_id: string;
    guarantor_snapshot: { name: string; email: string };
    lease: {
      property_name: string;
      property_address: string;
      monthly_rent: string;
      lease_start: string;
      lease_term: string;
    };
    status: string;
    verification_status: string;
    created_at: string;
    sent_at: string;
    viewed_at: string;
    signed_at: string;
    expires_at: string;
    status_history: { status: string; timestamp: string; note: string }[];
  }[];
};

export function guarantorStateFromApi(data: unknown): {
  savedGuarantors: SavedGuarantor[];
  requests: GuarantorRequest[];
} {
  const row = data as GuarantorStateApi;
  const savedGuarantors: SavedGuarantor[] = (row.saved_guarantors ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    email: g.email,
    phone: g.phone,
    relationship: g.relationship as SavedGuarantor["relationship"],
    createdAt: g.created_at,
  }));
  const requests: GuarantorRequest[] = (row.requests ?? []).map((r) => ({
    id: r.id,
    guarantorId: r.guarantor_id,
    guarantorSnapshot: r.guarantor_snapshot,
    lease: {
      propertyName: r.lease.property_name,
      propertyAddress: r.lease.property_address,
      monthlyRent: r.lease.monthly_rent,
      leaseStart: r.lease.lease_start,
      leaseTerm: r.lease.lease_term,
    } as LeaseInfo,
    status: r.status as GuarantorRequest["status"],
    verificationStatus: r.verification_status as GuarantorRequest["verificationStatus"],
    createdAt: r.created_at,
    sentAt: r.sent_at,
    viewedAt: r.viewed_at,
    signedAt: r.signed_at,
    expiresAt: r.expires_at,
    statusHistory: (r.status_history ?? []).map((h) => ({
      status: h.status,
      timestamp: h.timestamp,
      note: h.note,
    })),
  }));
  return { savedGuarantors, requests };
}

export function guarantorStateToApiPayload(
  savedGuarantors: SavedGuarantor[],
  requests: GuarantorRequest[],
) {
  return {
    saved_guarantors: savedGuarantors.map((g) => ({
      id: g.id,
      name: g.name,
      email: g.email,
      phone: g.phone,
      relationship: g.relationship,
      created_at: g.createdAt,
    })),
    requests: requests.map((r) => ({
      id: r.id,
      guarantor_id: r.guarantorId,
      guarantor_snapshot: r.guarantorSnapshot,
      lease: {
        property_name: r.lease.propertyName,
        property_address: r.lease.propertyAddress,
        monthly_rent: r.lease.monthlyRent,
        lease_start: r.lease.leaseStart,
        lease_term: r.lease.leaseTerm,
      },
      status: r.status,
      verification_status: r.verificationStatus,
      created_at: r.createdAt,
      sent_at: r.sentAt,
      viewed_at: r.viewedAt,
      signed_at: r.signedAt,
      expires_at: r.expiresAt,
      status_history: r.statusHistory.map((h) => ({
        status: h.status,
        timestamp: h.timestamp,
        note: h.note,
      })),
    })),
  };
}

// --- Move-in ---

type MoveInApi = {
  plan?: {
    target_address: string;
    move_date: string;
    move_from_address: string;
  };
  orders?: {
    id: string;
    vendor_id: string;
    vendor_name: string;
    plan_id: string;
    plan_name: string;
    category: string;
    status: string;
    scheduled_date: string;
    account_number: string;
    notes: string;
    monthly_cost: string;
    created_at: string;
  }[];
  checklist?: { id: string; category: string; label: string; completed: boolean }[];
};

export function moveInFromApi(data: unknown): {
  plan: MoveInPlan;
  orders: VendorOrder[];
  checklist: ChecklistItem[];
} {
  const row = data as MoveInApi;
  return {
    plan: {
      targetAddress: row.plan?.target_address ?? "",
      moveDate: row.plan?.move_date ?? "",
      moveFromAddress: row.plan?.move_from_address ?? "",
    },
    orders: (row.orders ?? []).map((o) => ({
      id: o.id,
      vendorId: o.vendor_id,
      vendorName: o.vendor_name,
      planId: o.plan_id,
      planName: o.plan_name,
      category: o.category as VendorOrder["category"],
      status: o.status as VendorOrder["status"],
      scheduledDate: o.scheduled_date,
      accountNumber: o.account_number,
      notes: o.notes,
      monthlyCost: o.monthly_cost,
      createdAt: o.created_at,
    })),
    checklist: (row.checklist ?? []).map((c) => ({
      id: c.id,
      category: c.category as ChecklistItem["category"],
      label: c.label,
      completed: c.completed,
    })),
  };
}

export function moveInToApiPayload(
  plan: MoveInPlan,
  orders: VendorOrder[],
  checklist: ChecklistItem[],
) {
  return {
    plan: {
      target_address: plan.targetAddress,
      move_date: plan.moveDate,
      move_from_address: plan.moveFromAddress,
    },
    orders: orders.map((o) => ({
      id: o.id,
      vendor_id: o.vendorId,
      vendor_name: o.vendorName,
      plan_id: o.planId,
      plan_name: o.planName,
      category: o.category,
      status: o.status,
      scheduled_date: o.scheduledDate,
      account_number: o.accountNumber,
      notes: o.notes,
      monthly_cost: o.monthlyCost,
      created_at: o.createdAt,
    })),
    checklist: checklist.map((c) => ({
      id: c.id,
      category: c.category,
      label: c.label,
      completed: c.completed,
    })),
  };
}

// --- Roommates ---

type RoommateApi = {
  my_profile?: {
    sleep_schedule: string;
    cleanliness_level: string;
    noise_level: string;
    guest_policy: string;
    smoking: string;
    interests: string[];
    bio: string;
    profile_completed: boolean;
  };
  connections?: {
    roommate: Record<string, unknown>;
    connected_at: string;
    messages: { role: string; content: string; time: string }[];
  }[];
};

function roommateProfileFromApi(r: Record<string, unknown>): RoommateProfile {
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    age: Number(r.age ?? 0),
    occupation: String(r.occupation ?? ""),
    bio: String(r.bio ?? ""),
    avatarInitials: String(r.avatar_initials ?? r.avatarInitials ?? ""),
    sleepSchedule: (r.sleep_schedule ?? r.sleepSchedule) as RoommateProfile["sleepSchedule"],
    cleanlinessLevel: (r.cleanliness_level ?? r.cleanlinessLevel) as RoommateProfile["cleanlinessLevel"],
    noiseLevel: (r.noise_level ?? r.noiseLevel) as RoommateProfile["noiseLevel"],
    guestPolicy: (r.guest_policy ?? r.guestPolicy) as RoommateProfile["guestPolicy"],
    smoking: r.smoking as RoommateProfile["smoking"],
    languagesSpoken: (r.languages_spoken as string[]) ?? [],
    targetCity: String(r.target_city ?? r.targetCity ?? ""),
    maxBudget: String(r.max_budget ?? r.maxBudget ?? ""),
    moveTimeline: String(r.move_timeline ?? r.moveTimeline ?? ""),
    bedroomsWanted: String(r.bedrooms_wanted ?? r.bedroomsWanted ?? ""),
    hasPets: Boolean(r.has_pets ?? r.hasPets),
    petDetails: String(r.pet_details ?? r.petDetails ?? ""),
    interests: (r.interests as string[]) ?? [],
    university: r.university as string | undefined,
    compatibilityScore: (r.compatibility_score ?? r.compatibilityScore) as number | undefined,
    compatibilityReasons: (r.compatibility_reasons ?? r.compatibilityReasons) as string[],
  };
}

function roommateProfileToApi(r: RoommateProfile): Record<string, unknown> {
  return {
    id: r.id,
    name: r.name,
    age: r.age,
    occupation: r.occupation,
    bio: r.bio,
    avatar_initials: r.avatarInitials,
    sleep_schedule: r.sleepSchedule,
    cleanliness_level: r.cleanlinessLevel,
    noise_level: r.noiseLevel,
    guest_policy: r.guestPolicy,
    smoking: r.smoking,
    languages_spoken: r.languagesSpoken,
    target_city: r.targetCity,
    max_budget: r.maxBudget,
    move_timeline: r.moveTimeline,
    bedrooms_wanted: r.bedroomsWanted,
    has_pets: r.hasPets,
    pet_details: r.petDetails,
    interests: r.interests,
    university: r.university,
    compatibility_score: r.compatibilityScore ?? null,
    compatibility_reasons: r.compatibilityReasons ?? [],
  };
}

export function roommatesFromApi(data: unknown): {
  myProfile: MyRoommateProfile;
  connections: RoommateConnection[];
} {
  const row = data as RoommateApi;
  const mp: MyRoommateProfilePayload = row.my_profile ?? {};
  const myProfile: MyRoommateProfile = {
    sleepSchedule: String(mp.sleep_schedule ?? ""),
    cleanlinessLevel: String(mp.cleanliness_level ?? ""),
    noiseLevel: String(mp.noise_level ?? ""),
    guestPolicy: String(mp.guest_policy ?? ""),
    smoking: String(mp.smoking ?? ""),
    languagesSpoken: (mp.languages_spoken as string[]) ?? [],
    preferredLanguages: (mp.preferred_languages as string[]) ?? [],
    mustHavePreferredLanguages: Boolean(mp.must_have_preferred_languages),
    interests: (mp.interests as string[]) ?? [],
    bio: String(mp.bio ?? ""),
    profileCompleted: Boolean(mp.profile_completed),
  };
  const connections: RoommateConnection[] = (row.connections ?? []).map((c) => ({
    roommate: roommateProfileFromApi(c.roommate),
    connectedAt: c.connected_at,
    messages: (c.messages ?? []).map(
      (m): RoommateMessage => ({
        role: m.role as RoommateMessage["role"],
        content: m.content,
        time: m.time,
      }),
    ),
  }));
  return { myProfile, connections };
}

export function roommatesToApiPayload(
  myProfile: MyRoommateProfile,
  connections: RoommateConnection[],
) {
  return {
    my_profile: {
      sleep_schedule: myProfile.sleepSchedule,
      cleanliness_level: myProfile.cleanlinessLevel,
      noise_level: myProfile.noiseLevel,
      guest_policy: myProfile.guestPolicy,
      smoking: myProfile.smoking,
      languages_spoken: myProfile.languagesSpoken,
      preferred_languages: myProfile.preferredLanguages,
      must_have_preferred_languages: myProfile.mustHavePreferredLanguages,
      interests: myProfile.interests,
      bio: myProfile.bio,
      profile_completed: myProfile.profileCompleted,
    },
    connections: connections.map((c) => ({
      roommate: roommateProfileToApi(c.roommate) as unknown as Record<string, unknown>,
      connected_at: c.connectedAt,
      messages: c.messages.map((m) => ({
        role: m.role,
        content: m.content,
        time: m.time,
      })),
    })),
  };
}
