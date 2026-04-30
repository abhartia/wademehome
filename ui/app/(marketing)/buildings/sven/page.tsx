import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  LIC_REGION,
  getLicTowerBySlug,
  getOtherLicTowers,
} from "@/lib/buildings/licTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "sven";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Sven Apartments (2026) | 29-59 Northern Blvd LIC | Wade Me Home",
  description:
    "Sven — Durst Organization's 64-story Queens Plaza rental at 29-59 Northern Blvd. 762 ft, 958 residences, completed 2021. 2026 asking rents, FARE Act no-fee.",
  keywords: [
    "sven lic",
    "sven queens plaza",
    "29-59 northern blvd",
    "durst organization lic",
    "queens plaza apartments",
    "sven park",
    "sven rent",
  ],
  openGraph: {
    title: "Sven Apartments (2026) — 29-59 Northern Blvd Long Island City",
    description:
      "Durst's 64-story Queens Plaza rental — 762 ft, 958 residences, 22,000 sq ft public park at the base.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function SvenPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={LIC_REGION}
      liveData={liveData}
    />
  );
}
