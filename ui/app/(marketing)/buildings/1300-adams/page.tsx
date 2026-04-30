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

const SLUG = "1300-adams";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "1300 Adams Apartments Hoboken (2026) | 1300 Adams St Midtown | Wade Me Home",
  description:
    "1300 Adams at 1300 Adams St — Bijou Properties' 2018 midtown Hoboken rental with rooftop pool. 2026 rents, fitness, light rail and PATH access.",
  keywords: [
    "1300 adams hoboken",
    "1300 adams apartments",
    "1300 adams street",
    "bijou properties hoboken",
    "hoboken midtown rentals",
    "1300 adams rent",
    "hoboken rooftop pool",
  ],
  openGraph: {
    title: "1300 Adams Hoboken Apartments (2026) — 1300 Adams St",
    description:
      "Bijou Properties' 2018 contemporary midtown Hoboken rental with rooftop pool, sky lounge, and light rail access.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function ThirteenHundredAdamsPage() {
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
