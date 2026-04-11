import type { ComponentType } from "react";
import ChoosingARentalMarket from "@/components/blog/articles/choosing-a-rental-market";
import NeighborhoodResearchForRenters from "@/components/blog/articles/neighborhood-research-for-renters";
import RentBudgetFromTakeHomePay from "@/components/blog/articles/rent-budget-from-take-home-pay";
import RoommateVsSoloLiving from "@/components/blog/articles/roommate-vs-solo-living";
import RentalListingsFeesNetEffectiveRent from "@/components/blog/articles/rental-listings-fees-net-effective-rent";
import ApartmentSearchTips from "@/components/blog/articles/apartment-search-tips";
import ApartmentTourChecklist from "@/components/blog/articles/apartment-tour-checklist";
import RentalApplicationScreeningBasics from "@/components/blog/articles/rental-application-screening-basics";
import CreditAndRentalApplications from "@/components/blog/articles/credit-and-rental-applications";
import RentersInsuranceBasics from "@/components/blog/articles/renters-insurance-basics";
import GuarantorsAndCoSigners from "@/components/blog/articles/guarantors-and-co-signers";
import NegotiatingRentAndLeaseTerms from "@/components/blog/articles/negotiating-rent-and-lease-terms";
import SecurityDepositsMoveInFees from "@/components/blog/articles/security-deposits-move-in-fees";
import LeaseSigningKeyClauses from "@/components/blog/articles/lease-signing-key-clauses";
import UtilitiesInternetMoveIn from "@/components/blog/articles/utilities-internet-move-in";
import MoveInDayDocumentation from "@/components/blog/articles/move-in-day-documentation";
import MaintenanceHabitabilityRequests from "@/components/blog/articles/maintenance-habitability-requests";
import SharedLeasesAndRoommates from "@/components/blog/articles/shared-leases-and-roommates";
import LeaseRenewalVsMoving from "@/components/blog/articles/lease-renewal-vs-moving";
import MoveOutSecurityDepositReturn from "@/components/blog/articles/move-out-security-deposit-return";
import BrokerFeesAndUpfrontCosts from "@/components/blog/articles/broker-fees-and-upfront-costs";
import ConditionalApprovalHigherDeposit from "@/components/blog/articles/conditional-approval-higher-deposit";
import MonthToMonthAfterLease from "@/components/blog/articles/month-to-month-after-lease";
import NycFareActBrokerFeeBan from "@/components/blog/articles/nyc-fare-act-broker-fee-ban";
import NycRentStabilizationGuide from "@/components/blog/articles/nyc-rent-stabilization-guide";
import NycApartmentScams from "@/components/blog/articles/nyc-apartment-scams";
import NoiseNeighborsAndBuildingRules from "@/components/blog/articles/noise-neighbors-and-building-rules";

export const articleBodies: Record<string, ComponentType> = {
  "choosing-a-rental-market": ChoosingARentalMarket,
  "neighborhood-research-for-renters": NeighborhoodResearchForRenters,
  "rent-budget-from-take-home-pay": RentBudgetFromTakeHomePay,
  "roommate-vs-solo-living": RoommateVsSoloLiving,
  "rental-listings-fees-net-effective-rent": RentalListingsFeesNetEffectiveRent,
  "apartment-search-tips": ApartmentSearchTips,
  "apartment-tour-checklist": ApartmentTourChecklist,
  "rental-application-screening-basics": RentalApplicationScreeningBasics,
  "credit-and-rental-applications": CreditAndRentalApplications,
  "renters-insurance-basics": RentersInsuranceBasics,
  "guarantors-and-co-signers": GuarantorsAndCoSigners,
  "negotiating-rent-and-lease-terms": NegotiatingRentAndLeaseTerms,
  "security-deposits-move-in-fees": SecurityDepositsMoveInFees,
  "lease-signing-key-clauses": LeaseSigningKeyClauses,
  "utilities-internet-move-in": UtilitiesInternetMoveIn,
  "move-in-day-documentation": MoveInDayDocumentation,
  "maintenance-habitability-requests": MaintenanceHabitabilityRequests,
  "shared-leases-and-roommates": SharedLeasesAndRoommates,
  "lease-renewal-vs-moving": LeaseRenewalVsMoving,
  "move-out-security-deposit-return": MoveOutSecurityDepositReturn,
  "broker-fees-and-upfront-costs": BrokerFeesAndUpfrontCosts,
  "conditional-approval-higher-deposit": ConditionalApprovalHigherDeposit,
  "month-to-month-after-lease": MonthToMonthAfterLease,
  "nyc-fare-act-broker-fee-ban": NycFareActBrokerFeeBan,
  "nyc-rent-stabilization-guide": NycRentStabilizationGuide,
  "nyc-apartment-scams": NycApartmentScams,
  "noise-neighbors-and-building-rules": NoiseNeighborsAndBuildingRules,
};
