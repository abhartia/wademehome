import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  getOtherTowers,
  getTowerBySlug,
} from "@/lib/buildings/hudsonYardsTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "555ten";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "555TEN Hudson Yards Apartments (2026) | 555 W 38th St | Wade Me Home",
  description:
    "555TEN at 555 W 38th St — Extell's 56-story Hudson Yards rental with 60K sq ft of amenities. 2026 rents, pool, basketball court, sky lounge, FARE Act no-fee.",
  keywords: [
    "555ten apartments",
    "555 ten hudson yards",
    "555 west 38th street",
    "extell hudson yards",
    "hudson yards rentals",
    "555ten rent prices",
    "555ten amenities",
  ],
  openGraph: {
    title: "555TEN Hudson Yards Apartments (2026) — 555 W 38th St",
    description:
      "Extell's 56-story Hudson Yards rental tower with 60K sq ft of amenities including pool, basketball, and sky lounge.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function FiveFiveFiveTenPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate tower={tower} others={others} liveData={liveData} />
  );
}
