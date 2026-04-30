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

const SLUG = "linc-lic";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Linc LIC Apartments (2026) | 43-10 Crescent St | Wade Me Home",
  description:
    "Linc LIC — Related Companies' 41-story Court Square rental at 43-10 Crescent St. 709 residences, completed 2013. 2026 asking rents, FARE Act no-fee, 7/E/M/G access.",
  keywords: [
    "linc lic",
    "linc lic apartments",
    "43-10 crescent street",
    "related companies lic",
    "court square apartments",
    "linc lic rent",
    "lic crescent street",
  ],
  openGraph: {
    title: "Linc LIC Apartments (2026) — 43-10 Crescent St Long Island City",
    description:
      "Related's 41-story Court Square rental — completed 2013 as one of LIC's earliest post-rezoning luxury towers, 709 residences.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function LincLicPage() {
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
