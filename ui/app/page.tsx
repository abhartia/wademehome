import type { Metadata } from "next";
import { GuestHomeSearchClient } from "./GuestHomeSearchClient";
import {
  GuestHomeIntroDisclosure,
  GuestHomeStructuredData,
} from "@/components/landing/GuestHomeIndexableIntro";
import {
  GUEST_HOME_META_DESCRIPTION,
  guestHomeSiteOrigin,
} from "@/lib/landing/guestHomeCopy";

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(guestHomeSiteOrigin());
  const title = "Wade Me Home: Rental search & renter tools";
  return {
    metadataBase,
    title,
    description: GUEST_HOME_META_DESCRIPTION,
    alternates: {
      canonical: metadataBase.href,
    },
    openGraph: {
      title,
      description: GUEST_HOME_META_DESCRIPTION,
      url: metadataBase.href,
      siteName: "Wade Me Home",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: GUEST_HOME_META_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <GuestHomeStructuredData />
      <GuestHomeSearchClient intro={<GuestHomeIntroDisclosure />} />
    </div>
  );
}
