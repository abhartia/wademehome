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

const SLUG = "184-kent";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "184 Kent Apartments (2026) | Cass Gilbert Loft Conversion Williamsburg | Wade Me Home",
  description:
    "184 Kent — 338-unit pre-war loft conversion of the 1913 Austin, Nichols & Co. warehouse by Cass Gilbert. 11-13 ft ceilings, oversized windows, 2026 rents.",
  keywords: [
    "184 kent",
    "184 kent ave",
    "austin nichols warehouse",
    "cass gilbert williamsburg",
    "williamsburg lofts",
    "184 kent rent",
    "cayuga capital williamsburg",
  ],
  openGraph: {
    title: "184 Kent Lofts (2026) — Cass Gilbert Williamsburg Conversion",
    description:
      "338-unit pre-war factory conversion of the 1913 Austin, Nichols warehouse — 11-13 ft ceilings, oversized industrial windows, river views.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function OneEightFourKentPage() {
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
