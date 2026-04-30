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

const SLUG = "aquablu";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Aquablu Apartments Jersey City (2026) | 155 Bay St Newport | Wade Me Home",
  description:
    "The Aquablu at 155 Bay St — LeFrak's 2017 Newport JC tower, the most contemporary in the portfolio. 2026 rents, rooftop pool, sky lounge, no-fee leasing.",
  keywords: [
    "aquablu jersey city",
    "aquablu apartments",
    "155 bay street",
    "lefrak aquablu",
    "newport jc luxury rentals",
    "aquablu rent",
    "exchange place apartments",
  ],
  openGraph: {
    title: "The Aquablu Newport Jersey City Apartments (2026) — 155 Bay St",
    description:
      "LeFrak's newest Newport rental (2017) with rooftop pool, sky lounge, and the most contemporary finishes in the LeFrak portfolio.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function AquabluPage() {
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
