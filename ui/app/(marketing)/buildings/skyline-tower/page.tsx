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

const SLUG = "skyline-tower";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Skyline Tower Apartments (2026) | 23-15 44th Dr LIC | Wade Me Home",
  description:
    "Skyline Tower — 67-story Court Square condo at 23-15 44th Dr, 778 ft, 802 residences, completed 2021. 2026 asking rents, FARE Act no-fee, transit, amenities.",
  keywords: [
    "skyline tower",
    "skyline tower lic",
    "23-15 44th drive",
    "court square apartments",
    "tallest building queens",
    "skyline tower rent",
    "fsa capital lic",
  ],
  openGraph: {
    title: "Skyline Tower Apartments (2026) — 23-15 44th Dr Long Island City",
    description:
      "67-story Court Square condominium tower — at 778 ft, the tallest residential building in Queens. 802 residences, completed 2021.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function SkylineTowerPage() {
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
