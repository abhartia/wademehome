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

const SLUG = "325-kent";
const tower = getWilliamsburgTowerBySlug(SLUG)!;
const others = getOtherWilliamsburgTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "325 Kent Apartments (2026) | 325 Kent Ave Williamsburg | Wade Me Home",
  description:
    "325 Kent — Two Trees' first SHoP-designed Domino Park rental, completed 2018. Copper-clad, 522 residences. 2026 asking rents, FARE Act no-fee, MIH affordable.",
  keywords: [
    "325 kent",
    "325 kent ave",
    "two trees williamsburg",
    "shop architects williamsburg",
    "domino park apartments",
    "325 kent rent",
    "williamsburg waterfront 2018",
  ],
  openGraph: {
    title: "325 Kent Apartments (2026) — 325 Kent Ave Williamsburg",
    description:
      "Two Trees' first SHoP-designed Domino Park rental — copper-clad, 16-story, 522 residences, completed 2018.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function ThreeTwoFiveKentPage() {
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
