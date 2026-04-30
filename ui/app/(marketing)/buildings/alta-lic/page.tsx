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

const SLUG = "alta-lic";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "ALTA LIC Apartments (2026) | 29-22 Northern Blvd | Wade Me Home",
  description:
    "ALTA LIC — Sky Management's 44-story Northern Blvd rental at 29-22 Northern Blvd. 485 ft, 467 residences, completed 2018. 2026 asking rents, FARE Act no-fee.",
  keywords: [
    "alta lic",
    "alta lic apartments",
    "29-22 northern blvd",
    "sky management lic",
    "queens plaza apartments",
    "alta lic rent",
    "northern blvd apartments",
  ],
  openGraph: {
    title: "ALTA LIC Apartments (2026) — 29-22 Northern Blvd Long Island City",
    description:
      "Sky Management's 44-story Northern Boulevard rental — 485 ft, 467 residences, completed 2018.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function AltaLicPage() {
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
