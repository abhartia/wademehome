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

const SLUG = "newport-tower";
const tower = getNewportTowerBySlug(SLUG)!;
const others = getOtherNewportTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Newport Tower Apartments Jersey City (2026) | 525 Washington Blvd | Wade Me Home",
  description:
    "Newport Tower at 525 Washington Blvd — LeFrak's original 1986 Newport JC waterfront rental. 2026 rents, amenities, PATH commute, no-fee leasing details.",
  keywords: [
    "newport tower jersey city",
    "newport tower apartments",
    "525 washington blvd",
    "lefrak newport",
    "newport jersey city rentals",
    "newport tower rent",
    "newport jc apartments",
  ],
  openGraph: {
    title: "Newport Tower Jersey City Apartments (2026) — 525 Washington Blvd",
    description:
      "LeFrak's original 1986 Newport waterfront tower with PATH access, indoor pool, and Manhattan-skyline views.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function NewportTowerPage() {
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
