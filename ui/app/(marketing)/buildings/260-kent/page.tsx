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

const SLUG = "260-kent";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "260 Kent Apartments (2026) | Bjarke Ingels Williamsburg Waterfront | Wade Me Home",
  description:
    "260 Kent — Bjarke Ingels Group's 22-story Domino Park tower (2025). Sculptural balconies, river views, 1-2 month lease-up concessions, FARE Act no-fee.",
  keywords: [
    "260 kent",
    "260 kent ave",
    "bjarke ingels williamsburg",
    "big architects williamsburg",
    "two trees williamsburg",
    "domino park 260 kent",
    "260 kent rent",
  ],
  openGraph: {
    title: "260 Kent Apartments (2026) — BIG Williamsburg Waterfront",
    description:
      "Bjarke Ingels Group's 22-story Domino Park rental tower, completed 2025 with sculptural stepped facade and private balconies.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TwoSixZeroKentPage() {
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
