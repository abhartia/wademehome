import type { Metadata } from "next";
import {
  BuildingLandingTemplate,
} from "@/components/buildings/BuildingLandingTemplate";
import {
  ASTORIA_REGION,
  getAstoriaTowerBySlug,
  getOtherAstoriaTowers,
} from "@/lib/buildings/astoriaTowers";
import { fetchBuildingLiveData } from "@/lib/buildings/serverBuildingData";

export const revalidate = 300;

const SLUG = "astoria-lights";
const tower = getAstoriaTowerBySlug(SLUG)!;
const others = getOtherAstoriaTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Astoria Lights Apartments (2026) | 30-21 12th St Astoria | Wade Me Home",
  description:
    "Astoria Lights — Heatherwood's 4-building Astoria Heights rental community. ~480 residences across mid-rise courtyard buildings, 7-min walk to the Astoria Blvd N/W subway.",
  keywords: [
    "astoria lights",
    "astoria lights apartments",
    "30-21 12th st",
    "heatherwood astoria",
    "astoria heights apartments",
    "astoria courtyard rentals",
    "astoria pool apartments",
    "no fee astoria",
  ],
  openGraph: {
    title:
      "Astoria Lights Apartments (2026) — 30-21 12th St, Astoria Heights",
    description:
      "Heatherwood's 4-building Astoria Heights rental community — ~480 residences and a courtyard amenity core, 7 minutes from the Astoria Blvd N/W station.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function AstoriaLightsPage() {
  const liveData = await fetchBuildingLiveData({
    buildingId: tower.buildingId,
    latitude: tower.latitude,
    longitude: tower.longitude,
  });
  return (
    <BuildingLandingTemplate
      tower={tower}
      others={others}
      region={ASTORIA_REGION}
      liveData={liveData}
    />
  );
}
