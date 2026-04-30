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

const SLUG = "northside-piers";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Northside Piers Apartments (2026) | Toll Brothers Williamsburg Waterfront | Wade Me Home",
  description:
    "Northside Piers — Toll Brothers / L+M's three 30-story Williamsburg waterfront towers (2009-2014). 449 residences, 30,000+ sq ft amenity, 2026 rents.",
  keywords: [
    "northside piers",
    "northside piers williamsburg",
    "1 n 4th place",
    "2 n 6th st williamsburg",
    "toll brothers williamsburg",
    "lm development williamsburg",
    "northside piers rent",
    "north williamsburg luxury",
  ],
  openGraph: {
    title: "Northside Piers (2026) — Toll Brothers Williamsburg Waterfront",
    description:
      "Toll Brothers / L+M's three 30-story towers built 2009-2014 — the first major waterfront luxury complex post-Williamsburg rezoning.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function NorthsidePiersPage() {
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
