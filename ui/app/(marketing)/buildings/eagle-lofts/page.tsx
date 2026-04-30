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

const SLUG = "eagle-lofts";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Eagle Lofts Apartments (2026) | 43-22 Queens St LIC | Wade Me Home",
  description:
    "Eagle Lofts — Rockrose's 55-story Court Square rental atop the converted Eagle Electric factory. ~790 residences, completed 2018. Original-brick lofts + glass tower above.",
  keywords: [
    "eagle lofts",
    "eagle lofts lic",
    "43-22 queens street",
    "rockrose development lic",
    "court square loft",
    "eagle electric building",
    "eagle lofts rent",
  ],
  openGraph: {
    title: "Eagle Lofts Apartments (2026) — 43-22 Queens St Long Island City",
    description:
      "Rockrose's 55-story Court Square rental — converted Eagle Electric factory base topped by a glass tower, 790 residences.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function EagleLoftsPage() {
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
