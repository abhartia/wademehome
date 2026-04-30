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

const SLUG = "one-domino-square";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "One Domino Square Apartments (2026) | 8 Domino Sq Williamsburg | Wade Me Home",
  description:
    "One Domino Square — Two Trees' SHoP-designed 41-story Williamsburg waterfront tower (2024). 2026 rents, rooftop pool, Domino Park, FARE Act no-fee.",
  keywords: [
    "one domino square",
    "8 domino sq",
    "two trees williamsburg",
    "shop architects williamsburg",
    "domino park apartments",
    "williamsburg waterfront luxury",
    "one domino square rent",
  ],
  openGraph: {
    title: "One Domino Square Williamsburg (2026) — 8 Domino Sq",
    description:
      "Two Trees' SHoP-designed 41-story tower at the heart of the Domino Park master-plan, completed 2024.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function OneDominoSquarePage() {
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
