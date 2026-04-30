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

const SLUG = "the-eugene";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Eugene Hudson Yards Apartments (2026) | 435 W 31st St | Wade Me Home",
  description:
    "The Eugene at 435 W 31st St — Brookfield's 62-story, 844-unit Manhattan West rental near Penn Station. 2026 rents, amenities, transit, and FARE Act no-fee.",
  keywords: [
    "the eugene apartments",
    "the eugene hudson yards",
    "435 west 31st street",
    "brookfield the eugene",
    "manhattan west apartments",
    "the eugene rent prices",
    "penn station apartments",
  ],
  openGraph: {
    title: "The Eugene Hudson Yards Apartments (2026) — 435 W 31st St",
    description:
      "Brookfield's 62-story, 844-unit Hudson Yards rental at Manhattan West, steps from Penn Station and Moynihan Train Hall.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheEugenePage() {
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
