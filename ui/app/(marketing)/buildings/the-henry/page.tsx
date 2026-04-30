import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  HUDSON_YARDS_REGION,
  getOtherTowers,
  getTowerBySlug,
} from "@/lib/buildings/hudsonYardsTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "the-henry";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Henry Hudson Yards Apartments (2026) | 515 W 38th St | Wade Me Home",
  description:
    "The Henry at 515 W 38th St — Algin Management's 21-story Hudson Yards rental. 2026 rents, value-tier amenities, FARE Act no-fee, transit and unit mix.",
  keywords: [
    "the henry apartments",
    "the henry hudson yards",
    "515 west 38th street",
    "algin management",
    "hudson yards value rentals",
    "the henry rent prices",
    "the henry nyc",
  ],
  openGraph: {
    title: "The Henry Hudson Yards Apartments (2026) — 515 W 38th St",
    description:
      "Algin Management's 21-story Hudson Yards rental, positioned as the value option below 555TEN and The Eugene.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheHenryPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={HUDSON_YARDS_REGION}
      liveData={liveData}
    />
  );
}
