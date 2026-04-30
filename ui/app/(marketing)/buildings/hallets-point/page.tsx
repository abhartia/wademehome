import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  ASTORIA_REGION,
  getAstoriaTowerBySlug,
  getOtherAstoriaTowers,
} from "@/lib/buildings/astoriaTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "hallets-point";
const tower = getAstoriaTowerBySlug(SLUG)!;
const others = getOtherAstoriaTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Hallets Point Apartments (2026) | 10 Halletts Point Astoria | Wade Me Home",
  description:
    "Hallets Point — Durst's 7-building Astoria waterfront master plan. Phase 1 (Eagle West, 22 stories, 405 units) opened 2018. 2026 rents, FARE Act no-fee, ferry + N/W transit.",
  keywords: [
    "hallets point",
    "hallets point astoria",
    "halletts point apartments",
    "10 halletts point",
    "durst astoria",
    "astoria waterfront apartments",
    "astoria ferry apartments",
    "no fee astoria luxury",
  ],
  openGraph: {
    title:
      "Hallets Point Apartments (2026) — 10 Halletts Point, Astoria Waterfront",
    description:
      "Durst's 7-building Astoria waterfront master plan. Phase 1 (Eagle West) — 22 stories, 405 residences, on-site NYC Ferry stop.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function HalletsPointPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={ASTORIA_REGION}
      liveData={liveData}
    />
  );
}
