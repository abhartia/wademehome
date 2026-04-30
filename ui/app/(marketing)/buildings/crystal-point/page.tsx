import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  NEWPORT_REGION,
  getNewportTowerBySlug,
  getOtherNewportTowers,
} from "@/lib/buildings/newportTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "crystal-point";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Crystal Point Apartments Jersey City (2026) | 2 2nd St Newport | Wade Me Home",
  description:
    "Crystal Point at 2 2nd St — Fisher Development's 42-story Newport waterfront condo-rental tower with Hudson River views. 2026 rents, pool, fitness, marina.",
  keywords: [
    "crystal point jersey city",
    "crystal point apartments",
    "2 2nd street jersey city",
    "newport waterfront condo rental",
    "crystal point rent",
    "newport jc luxury",
  ],
  openGraph: {
    title: "Crystal Point Newport Jersey City Apartments (2026) — 2 2nd St",
    description:
      "Fisher Development's 42-story Newport waterfront condo-rental tower with floor-to-ceiling glass and direct Hudson River views.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function CrystalPointPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={NEWPORT_REGION}
      liveData={liveData}
    />
  );
}
