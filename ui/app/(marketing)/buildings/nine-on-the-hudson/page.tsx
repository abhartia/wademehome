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

const SLUG = "nine-on-the-hudson";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Nine on the Hudson Apartments (2026) | Port Imperial Luxury Tower | Wade Me Home",
  description:
    "Nine on the Hudson at 9 Avenue at Port Imperial — K. Hovnanian's 2019 luxury condo-rental tower. 2026 rents, 60K sq ft amenities, 1-min ferry to NYC.",
  keywords: [
    "nine on the hudson",
    "nine on the hudson apartments",
    "9 avenue at port imperial",
    "port imperial rentals",
    "k hovnanian port imperial",
    "nine on the hudson rent",
    "west new york luxury",
  ],
  openGraph: {
    title: "Nine on the Hudson Apartments (2026) — Port Imperial",
    description:
      "K. Hovnanian's 2019 Port Imperial luxury tower with 60K sq ft of amenities and 1-minute walk to the NYC ferry.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function NineOnTheHudsonPage() {
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
