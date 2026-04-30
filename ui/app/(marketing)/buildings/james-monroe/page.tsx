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

const SLUG = "james-monroe";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The James Monroe Apartments Jersey City (2026) | 119 Christopher Columbus | Wade Me Home",
  description:
    "The James Monroe at 119 Christopher Columbus Dr — LeFrak's 38-story Newport JC value-tier rental near PATH. 2026 rents, pool, fitness, no-fee leasing.",
  keywords: [
    "james monroe jersey city",
    "james monroe apartments",
    "119 christopher columbus drive",
    "lefrak james monroe",
    "newport value rentals",
    "james monroe rent jc",
  ],
  openGraph: {
    title: "The James Monroe Newport Jersey City Apartments (2026)",
    description:
      "LeFrak's 38-story Newport rental with shared LeFrak amenity ecosystem, value-tier pricing, and PATH access.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function JamesMonroePage() {
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
