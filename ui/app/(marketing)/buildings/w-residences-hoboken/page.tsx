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

const SLUG = "w-residences-hoboken";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "W Residences Hoboken (2026) | 225 River St Hotel-Condo | Wade Me Home",
  description:
    "W Residences at 225 River St — luxury hotel-condo tower steps from Hoboken Terminal. 2026 rents, hotel-tier amenities, fastest commute on the waterfront.",
  keywords: [
    "w residences hoboken",
    "w hotel hoboken residences",
    "225 river street hoboken",
    "applied development hoboken",
    "hoboken luxury condos",
    "w residences rent",
    "hoboken terminal apartments",
  ],
  openGraph: {
    title: "W Residences Hoboken (2026) — 225 River St",
    description:
      "Luxury hotel-condo tower at the foot of Hoboken Terminal — hotel-tier amenities, 2-minute walk to PATH/Light Rail/NJ Transit.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function WResidencesHobokenPage() {
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
