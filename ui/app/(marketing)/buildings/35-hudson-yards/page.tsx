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

const SLUG = "35-hudson-yards";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "35 Hudson Yards Apartments (2026) | 535 W 33rd St | Wade Me Home",
  description:
    "35 Hudson Yards — the tallest residential tower in Hudson Yards (1,009 ft). 2026 rents, Equinox Hotel amenities, SOM-designed luxury condos and rentals.",
  keywords: [
    "35 hudson yards apartments",
    "35 hudson yards rentals",
    "535 west 33rd street",
    "related 35 hudson yards",
    "equinox hotel hudson yards",
    "hudson yards luxury condos",
    "35 hudson yards rent",
  ],
  openGraph: {
    title: "35 Hudson Yards Apartments (2026) — 535 W 33rd St",
    description:
      "The tallest residential tower in Hudson Yards, with the Equinox flagship gym and hotel on lower floors and ultra-luxury homes above.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function ThirtyFiveHudsonYardsPage() {
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
