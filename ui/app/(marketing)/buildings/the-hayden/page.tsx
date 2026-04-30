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

const SLUG = "the-hayden";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "The Hayden Apartments (2026) | 43-25 Hunter St LIC | Wade Me Home",
  description:
    "The Hayden — Tishman Speyer's 50-story Hunters Point rental at 43-25 Hunter St. 974 residences, completed 2017. 2026 asking rents, FARE Act no-fee, 7 train.",
  keywords: [
    "the hayden lic",
    "hayden apartments",
    "43-25 hunter street",
    "tishman speyer lic",
    "hunters point apartments",
    "hayden rent",
    "tishman lic",
  ],
  openGraph: {
    title: "The Hayden Apartments (2026) — 43-25 Hunter St Long Island City",
    description:
      "Tishman Speyer's 50-story Hunters Point rental — Tishman Speyer's first LIC delivery, predecessor to Jackson Park.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function TheHaydenPage() {
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
