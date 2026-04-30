import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  HOBOKEN_REGION,
  getHobokenTowerBySlug,
  getOtherHobokenTowers,
} from "@/lib/buildings/hobokenTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "1100-maxwell";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "1100 Maxwell Apartments Hoboken (2026) | 1100 Maxwell Ln Waterfront | Wade Me Home",
  description:
    "1100 Maxwell at 1100 Maxwell Ln — Toll Brothers' first-phase Hoboken waterfront tower (2007). 2026 rents, shared Maxwell Place pool + gym, 14th St ferry.",
  keywords: [
    "1100 maxwell hoboken",
    "1100 maxwell apartments",
    "1100 maxwell lane",
    "maxwell place 1100",
    "toll brothers hoboken",
    "hoboken waterfront rentals",
    "1100 maxwell rent",
  ],
  openGraph: {
    title: "1100 Maxwell Hoboken Apartments (2026) — 1100 Maxwell Ln",
    description:
      "First-phase Maxwell Place building (Toll Brothers, 2007) on the Hoboken waterfront, sharing the Maxwell Place amenity package with 1125 Maxwell.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function ElevenHundredMaxwellPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={HOBOKEN_REGION}
      liveData={liveData}
    />
  );
}
