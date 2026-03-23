export type LandlordProfile = {
  display_name: string;
  company_name: string;
  phone_number: string;
  verification_status: string;
};

export type LandlordProperty = {
  id: string;
  title: string;
  description: string;
  street_line1: string;
  street_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  amenities: string[];
  publish_status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export type LandlordMedia = {
  id: string;
  media_url: string;
  media_type: string;
  caption: string;
  sort_order: number;
};

export type LandlordUnit = {
  id: string;
  label: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  monthly_rent: string;
  security_deposit: string | null;
  lease_term_months: number | null;
  available_on: string | null;
  is_available: boolean;
};

export type LandlordLead = {
  id: string;
  property_id: string;
  unit_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
};

export type LandlordTourSlot = {
  id: string;
  property_id: string;
  unit_id: string;
  start_time: string;
  end_time: string;
  is_blocked: boolean;
};

export type LandlordTourBooking = {
  id: string;
  slot_id: string;
  lead_id: string | null;
  guest_name: string;
  guest_email: string;
  status: string;
  notes: string;
  created_at: string;
};

export type LandlordApplication = {
  id: string;
  property_id: string;
  unit_id: string | null;
  lead_id: string | null;
  applicant_name: string;
  applicant_email: string;
  annual_income: string | null;
  credit_score: number | null;
  status: string;
  notes: string;
  created_at: string;
};

export type LandlordLeaseOffer = {
  id: string;
  property_id: string;
  unit_id: string | null;
  application_id: string | null;
  tenant_name: string;
  tenant_email: string;
  monthly_rent: string;
  lease_start: string;
  lease_end: string;
  terms_text: string;
  status: string;
  created_at: string;
};

export type LandlordLeaseSignature = {
  id: string;
  lease_offer_id: string;
  signer_role: string;
  signer_name: string;
  signer_email: string;
  status: string;
  signed_at: string | null;
};
