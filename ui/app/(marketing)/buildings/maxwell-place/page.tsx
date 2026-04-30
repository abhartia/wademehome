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

const SLUG = "maxwell-place";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Maxwell Place Apartments Hoboken (2026) | 1125 Maxwell Ln Waterfront | Wade Me Home",
  description:
    "Maxwell Place at 1125 Maxwell Ln — Toll Brothers' Hoboken waterfront community on the Maxwell House site. 2026 rents, pools, ferry, gym, no-fee leasing.",
  keywords: [
    "maxwell place hoboken",
    "maxwell place apartments",
    "1125 maxwell lane",
    "toll brothers hoboken",
    "hoboken waterfront rentals",
    "maxwell place rent",
    "hoboken ferry apartments",
  ],
  openGraph: {
    title: "Maxwell Place Hoboken Apartments (2026) — 1125 Maxwell Ln",
    description:
      "Toll Brothers' largest Hoboken waterfront community, on the former Maxwell House coffee plant site, with 14th Street ferry access.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function MaxwellPlacePage() {
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
