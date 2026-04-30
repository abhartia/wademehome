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

const SLUG = "astoria-west";
const tower = getAstoriaTowerBySlug(SLUG)!;
const others = getOtherAstoriaTowers(SLUG);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Astoria West Apartments (2026) | 30-77 Vernon Blvd | Wade Me Home",
  description:
    "Astoria West — 28-story Cape Advisors rental at 30-77 Vernon Blvd. 244 mixed-income residences, 2018, with Manhattan skyline views and 9-min walk to the 30 Av N/W subway.",
  keywords: [
    "astoria west",
    "astoria west apartments",
    "30-77 vernon",
    "vernon boulevard astoria",
    "cape advisors astoria",
    "astoria luxury rentals",
    "astoria 1 bedroom rent",
    "no fee astoria",
  ],
  openGraph: {
    title:
      "Astoria West Apartments (2026) — 30-77 Vernon Blvd, Astoria Waterfront",
    description:
      "Cape Advisors' 28-story Astoria rental — 244 residences with Manhattan skyline views and a 9-minute walk to the 30 Av N/W station.",
    url: `${baseUrl}/buildings/${SLUG}`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/buildings/${SLUG}` },
};

export default async function AstoriaWestPage() {
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
