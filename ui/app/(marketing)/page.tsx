import type { Metadata } from "next";
import { LoggedInHomeRedirect } from "@/components/auth/LoggedInHomeRedirect";
import { GuestHomeStructuredData } from "@/components/landing/GuestHomeIndexableIntro";
import {
  GUEST_HOME_META_DESCRIPTION,
  guestHomeSiteOrigin,
} from "@/lib/landing/guestHomeCopy";
import { GuestHomeTabs } from "./GuestHomeTabs";

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(guestHomeSiteOrigin());
  const title = "Wade Me Home: Rental search & renter tools";
  const socialImage = {
    url: "/opengraph-image.png?v=20260323-1",
    width: 1200,
    height: 630,
    alt: "Wade Me Home rental search and renter tools",
  };
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
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: GUEST_HOME_META_DESCRIPTION,
      images: [socialImage.url],
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
      <LoggedInHomeRedirect />
      <GuestHomeStructuredData />
      <GuestHomeTabs />
    </div>
  );
}
