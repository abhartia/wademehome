import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  WILLIAMSBURG_REGION,
  getWilliamsburgTowerBySlug,
  getOtherWilliamsburgTowers,
} from "@/lib/buildings/williamsburgTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "the-edge";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Edge Apartments (2026) | 22 N 6th St / 34 N 7th St Williamsburg | Wade Me Home",
  description:
    "The Edge — Douglaston's twin 40-story North Williamsburg waterfront towers (2010), 1,031+ residences, indoor pool, ferry, FARE Act no-fee. 2026 rents.",
  keywords: [
    "the edge williamsburg",
    "the edge apartments",
    "22 n 6th st",
    "34 n 7th st",
    "douglaston williamsburg",
    "the edge tower 1",
    "the edge tower 2",
    "north williamsburg luxury",
  ],
  openGraph: {
    title: "The Edge (2026) — Douglaston Twin 40-Story Williamsburg Towers",
    description:
      "Douglaston's twin 40-story North Williamsburg waterfront towers, completed 2010 with ~1,031 residences across both towers.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheEdgePage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={WILLIAMSBURG_REGION}
      liveData={liveData}
    />
  );
}
