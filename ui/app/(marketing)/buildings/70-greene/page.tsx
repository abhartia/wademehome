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

const SLUG = "70-greene";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "70 Greene Apartments Jersey City (2026) | 70 Greene St Newport | Wade Me Home",
  description:
    "70 Greene at 70 Greene St — LeFrak's 47-story Newport JC rental between Newport and Exchange Place PATH. 2026 rents, indoor pool, fitness, no-fee leasing.",
  keywords: [
    "70 greene jersey city",
    "70 greene apartments",
    "70 greene street",
    "lefrak 70 greene",
    "newport jersey city rentals",
    "70 greene rent",
    "exchange place apartments",
  ],
  openGraph: {
    title: "70 Greene Newport Jersey City Apartments (2026) — 70 Greene St",
    description:
      "LeFrak's 47-story Newport rental between Newport and Exchange Place PATH stations, with skyline-facing units and indoor pool.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function SeventyGreenePage() {
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
