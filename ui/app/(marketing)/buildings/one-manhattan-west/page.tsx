import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  getOtherTowers,
  getTowerBySlug,
} from "@/lib/buildings/hudsonYardsTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "one-manhattan-west";
const tower = getTowerBySlug(SLUG)!;
const others = getOtherTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "One Manhattan West (2026) | 401 9th Ave Hudson Yards | Wade Me Home",
  description:
    "One Manhattan West at 401 9th Ave — Brookfield's 67-story Hudson Yards office tower. Residential at The Eugene next door. Plaza, Penn Station, transit guide.",
  keywords: [
    "one manhattan west",
    "401 9th ave",
    "manhattan west plaza",
    "brookfield manhattan west",
    "hudson yards office",
    "manhattan west apartments",
    "one manhattan west rent",
  ],
  openGraph: {
    title: "One Manhattan West (2026) — 401 9th Ave Hudson Yards",
    description:
      "Brookfield's 67-story Class-A office tower anchoring the Manhattan West plaza, with The Eugene rental tower next door.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function OneManhattanWestPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate tower={tower} others={others} liveData={liveData} />
  );
}
