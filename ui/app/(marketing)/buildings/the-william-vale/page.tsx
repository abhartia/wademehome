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

const SLUG = "the-william-vale";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The William Vale Apartments (2026) | 111 N 12th St North Williamsburg | Wade Me Home",
  description:
    "The William Vale — Riverside's mixed-use 22-story North Williamsburg tower with NYC's largest hotel rooftop pool, Westlight bar, Leuca, ~60 condo residences.",
  keywords: [
    "the william vale",
    "william vale apartments",
    "111 n 12th st",
    "westlight williamsburg",
    "north williamsburg luxury",
    "william vale rent",
    "arlo hotels williamsburg",
  ],
  openGraph: {
    title: "The William Vale (2026) — 111 N 12th St North Williamsburg",
    description:
      "Riverside's mixed-use hotel + condo tower with NYC's largest hotel rooftop pool, Westlight bar, and Leuca by Andrew Carmellini.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheWilliamValePage() {
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
