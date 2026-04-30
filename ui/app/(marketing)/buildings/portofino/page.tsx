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

const SLUG = "portofino";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Portofino Apartments Newport JC (2026) | 1 2nd St Waterfront | Wade Me Home",
  description:
    "Portofino at 1 2nd St — Roseland's 36-story Newport waterfront rental on the Hudson with unobstructed Lower Manhattan views. 2026 rents, pool, fitness.",
  keywords: [
    "portofino jersey city",
    "portofino apartments",
    "1 2nd street jersey city",
    "roseland portofino",
    "newport waterfront rentals",
    "portofino rent jc",
    "veris residential portofino",
  ],
  openGraph: {
    title: "Portofino Newport Jersey City Apartments (2026) — 1 2nd St",
    description:
      "Roseland's 36-story Newport waterfront rental directly on the Hudson with unobstructed Manhattan-skyline views.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function PortofinoPage() {
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
