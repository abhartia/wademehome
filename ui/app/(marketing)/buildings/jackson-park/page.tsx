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

const SLUG = "jackson-park";
const tower = getLicTowerBySlug(SLUG)!;
const others = getOtherLicTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Jackson Park Apartments (2026) | 28-10 Jackson Ave LIC | Wade Me Home",
  description:
    "Jackson Park — Tishman Speyer's 3-tower Court Square rental complex with 1,871 residences. 47/53/54 stories, completed 2018-2019. 2026 asking rents, FARE Act no-fee.",
  keywords: [
    "jackson park lic",
    "jackson park apartments",
    "28-10 jackson ave",
    "tishman speyer lic",
    "court square rentals",
    "1,871 units",
    "jackson park rent",
  ],
  openGraph: {
    title: "Jackson Park Apartments (2026) — 28-10 Jackson Ave Long Island City",
    description:
      "Tishman Speyer's 3-tower Court Square rental complex — 1,871 residences across 47-, 53-, and 54-story towers, completed 2018-2019.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function JacksonParkPage() {
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
