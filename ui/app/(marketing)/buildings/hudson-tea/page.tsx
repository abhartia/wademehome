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

const SLUG = "hudson-tea";
const tower = getHobokenTowerBySlug(SLUG)!;
const others = getOtherHobokenTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Hudson Tea Apartments Hoboken (2026) | 1500 Hudson St Loft Conversion | Wade Me Home",
  description:
    "Hudson Tea at 1500 Hudson St — the Lipton Tea factory loft conversion in uptown Hoboken. 2026 rents, exposed brick lofts, pool, gym, ferry access.",
  keywords: [
    "hudson tea hoboken",
    "hudson tea apartments",
    "1500 hudson street",
    "lipton tea hoboken loft",
    "hoboken loft rentals",
    "hudson tea rent",
    "uptown hoboken apartments",
  ],
  openGraph: {
    title: "Hudson Tea Hoboken Apartments (2026) — 1500 Hudson St",
    description:
      "The Lipton Tea factory converted to 524 lofts in 2002 — exposed brick, 12-foot ceilings, and oversized windows on the uptown Hoboken waterfront.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function HudsonTeaPage() {
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
