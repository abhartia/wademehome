import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  getOtherTowers,
  getTowerBySlug,
} from "@/lib/buildings/hudsonYardsTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

// Re-fetch live building/listings data every 5 minutes; SEO crawlers see a
// cached static page, real users see near-fresh listings + review aggregates.
export const revalidate = 300;

const SLUG = "lantern-house";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "Lantern House Chelsea Apartments (2026) | 515 W 18th St | Wade Me Home",
  description:
    "Lantern House at 515 W 18th St — Heatherwick-designed High Line rental in West Chelsea. 2026 rents, 75-ft pool, amenities, transit, no-fee FARE Act details.",
  keywords: [
    "lantern house chelsea",
    "lantern house apartments",
    "515 west 18th street",
    "high line apartments",
    "west chelsea rentals",
    "heatherwick lantern house",
    "related lantern house",
    "lantern house rent prices",
  ],
  openGraph: {
    title: "Lantern House Chelsea Apartments (2026) — 515 W 18th St",
    description:
      "Heatherwick-designed High Line rental tower in West Chelsea. 2026 rents, amenities, transit, and FARE Act no-fee details.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function LanternHousePage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate tower={tower} others={others} liveData={liveData} />
  );
}
