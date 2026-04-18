import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

export type AgentAnnotationType =
  | "agent_step"
  | "agent_tool_call"
  | "agent_tool_result"
  | "agent_error"
  | "property_results"
  | "tours_results"
  | "favorites_results"
  | "profile_summary"
  | "navigation_action"
  | "roommate_matches"
  | "roommate_connections"
  | "group_list"
  | "lease_summary"
  | "lease_answer"
  | "movein_checklist"
  | "movein_orders"
  | "guarantor_summary"
  | "building_profile"
  | "landlord_profile"
  // Carried forward from the existing /listings/chat vocabulary so the
  // search agent can reuse the same backend events.
  | "property_listings"
  | "search_plan"
  | "search_summary"
  | "search_hint"
  | "search_stats";

export interface AgentStepAnnotation {
  type: "agent_step";
  data: {
    agent: string;
    label: string;
    state?: "start" | "running" | "done" | "error";
    detail?: string | null;
  };
}

export interface AgentToolCallAnnotation {
  type: "agent_tool_call";
  data: {
    tool_id: string;
    tool_name: string;
    tool_kwargs: Record<string, unknown>;
  };
}

export interface AgentToolResultAnnotation {
  type: "agent_tool_result";
  data: {
    tool_id: string;
    tool_name: string;
    ok: boolean;
    summary: string;
  };
}

export interface AgentErrorAnnotation {
  type: "agent_error";
  data: { message: string };
}

export interface PropertyResultsAnnotation {
  type: "property_results";
  data: {
    title: string;
    query?: string | null;
    properties: PropertyDataItem[];
  };
}

export interface TourCardItem {
  id: string;
  property_name: string;
  property_address: string;
  status: string;
  scheduled_date?: string;
  scheduled_time?: string;
  image?: string;
  rent?: string;
  beds?: string;
}

export interface ToursResultsAnnotation {
  type: "tours_results";
  data: {
    title: string;
    tours: TourCardItem[];
    empty_message?: string | null;
  };
}

export interface FavoriteCardItem {
  property_key: string;
  property_name: string;
  property_address: string;
  created_at?: string | null;
}

export interface FavoritesResultsAnnotation {
  type: "favorites_results";
  data: {
    title: string;
    favorites: FavoriteCardItem[];
    empty_message?: string | null;
  };
}

export interface ProfileSummaryAnnotation {
  type: "profile_summary";
  data: {
    title: string;
    cities: string[];
    move_timeline?: string | null;
    max_monthly_rent?: string | null;
    bedrooms_needed?: string | null;
    has_pets?: boolean | null;
    dealbreakers: string[];
    neighbourhood_priorities: string[];
    onboarding_completed: boolean;
    updated_fields: string[];
  };
}

export interface NavigationActionAnnotation {
  type: "navigation_action";
  data: {
    title: string;
    description?: string | null;
    href: string;
    cta?: string;
  };
}

// ── Phase 2 payloads ────────────────────────────────────────────────────────

export interface RoommateMatchItem {
  id: string;
  name: string;
  age?: number | null;
  occupation?: string | null;
  avatar_initials?: string;
  bio?: string | null;
  target_city?: string | null;
  max_budget?: string | null;
  bedrooms_wanted?: string | null;
  compatibility_score?: number | null;
  compatibility_reasons?: string[];
}

export interface RoommateMatchesAnnotation {
  type: "roommate_matches";
  data: {
    title: string;
    matches: RoommateMatchItem[];
    empty_message?: string | null;
  };
}

export interface RoommateConnectionItem {
  id: string;
  roommate_name: string;
  roommate_initials?: string;
  last_message?: string | null;
  last_message_time?: string | null;
  connected_at?: string | null;
  message_count?: number;
}

export interface RoommateConnectionsAnnotation {
  type: "roommate_connections";
  data: {
    title: string;
    connections: RoommateConnectionItem[];
    empty_message?: string | null;
  };
}

export interface GroupMemberItem {
  user_id: string;
  role: string;
}

export interface GroupInviteItem {
  email?: string | null;
  accept_url?: string | null;
  status: string;
}

export interface GroupSummaryItem {
  id: string;
  name: string;
  role: string;
  member_count?: number;
  members?: GroupMemberItem[];
  invites?: GroupInviteItem[];
  saved_count?: number;
}

export interface GroupListAnnotation {
  type: "group_list";
  data: {
    title: string;
    groups: GroupSummaryItem[];
    empty_message?: string | null;
  };
}

export interface LeaseSummaryAnnotation {
  type: "lease_summary";
  data: {
    title: string;
    has_document: boolean;
    original_filename?: string | null;
    updated_at?: string | null;
    premises_address?: string | null;
    char_count?: number;
  };
}

export interface LeaseAnswerAnnotation {
  type: "lease_answer";
  data: {
    title: string;
    question: string;
    answer: string;
  };
}

export interface MoveInTaskItem {
  id: string;
  category: string;
  label: string;
  completed: boolean;
}

export interface MoveInChecklistAnnotation {
  type: "movein_checklist";
  data: {
    title: string;
    target_address?: string | null;
    move_date?: string | null;
    tasks: MoveInTaskItem[];
    empty_message?: string | null;
  };
}

export interface MoveInOrderItem {
  id: string;
  vendor_name: string;
  plan_name?: string | null;
  category: string;
  status: string;
  scheduled_date?: string | null;
  monthly_cost?: string | null;
}

export interface MoveInOrdersAnnotation {
  type: "movein_orders";
  data: {
    title: string;
    orders: MoveInOrderItem[];
    empty_message?: string | null;
  };
}

export interface GuarantorItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  relationship?: string | null;
}

export interface GuarantorRequestItem {
  id: string;
  guarantor_name: string;
  guarantor_email: string;
  property_name?: string | null;
  property_address?: string | null;
  monthly_rent?: string | null;
  status: string;
  verification_status?: string | null;
  invite_url?: string | null;
}

export interface GuarantorSummaryAnnotation {
  type: "guarantor_summary";
  data: {
    title: string;
    saved: GuarantorItem[];
    requests: GuarantorRequestItem[];
    empty_message?: string | null;
  };
}

export interface BuildingReviewSnippet {
  id: string;
  author: string;
  rating: number;
  title?: string | null;
  body: string;
  verified_tenant?: boolean;
}

export interface BuildingProfileAnnotation {
  type: "building_profile";
  data: {
    id: string;
    title: string;
    address: string;
    city?: string | null;
    state?: string | null;
    landlord_name?: string | null;
    avg_rating?: number | null;
    review_count?: number;
    hpd_open_count?: number;
    dob_open_count?: number;
    recent_reviews: BuildingReviewSnippet[];
  };
}

export interface LandlordProfileAnnotation {
  type: "landlord_profile";
  data: {
    id: string;
    canonical_name: string;
    portfolio_size?: number;
    avg_rating?: number | null;
    review_count?: number;
    verified_tenant_review_count?: number;
    recent_reviews: BuildingReviewSnippet[];
  };
}

export type AgentAnnotation =
  | AgentStepAnnotation
  | AgentToolCallAnnotation
  | AgentToolResultAnnotation
  | AgentErrorAnnotation
  | PropertyResultsAnnotation
  | ToursResultsAnnotation
  | FavoritesResultsAnnotation
  | ProfileSummaryAnnotation
  | NavigationActionAnnotation
  | RoommateMatchesAnnotation
  | RoommateConnectionsAnnotation
  | GroupListAnnotation
  | LeaseSummaryAnnotation
  | LeaseAnswerAnnotation
  | MoveInChecklistAnnotation
  | MoveInOrdersAnnotation
  | GuarantorSummaryAnnotation
  | BuildingProfileAnnotation
  | LandlordProfileAnnotation
  | { type: string; data: Record<string, unknown> };

export function isAgentAnnotation(value: unknown): value is AgentAnnotation {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
