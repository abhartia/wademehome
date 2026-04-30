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

const SLUG = "the-vine";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Vine Apartments Hoboken (2026) | 900 Monroe St LEED Platinum | Wade Me Home",
  description:
    "The Vine at 900 Monroe — Bijou Properties' 2014 LEED Platinum midtown Hoboken rental. 2026 rents, rooftop pool, fitness, light rail access, no-fee leasing.",
  keywords: [
    "the vine hoboken",
    "the vine apartments",
    "900 monroe street",
    "bijou properties vine",
    "hoboken leed platinum",
    "the vine rent",
    "midtown hoboken apartments",
  ],
  openGraph: {
    title: "The Vine Hoboken Apartments (2026) — 900 Monroe St",
    description:
      "Bijou Properties' LEED Platinum midtown Hoboken rental with rooftop pool, sky lounge, and on-site light rail access.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheVinePage() {
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
