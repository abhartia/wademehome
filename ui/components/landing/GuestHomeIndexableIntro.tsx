import Link from "next/link";
import {
  GUEST_HOME_BULLETS,
  GUEST_HOME_H1,
  GUEST_HOME_LEAD,
  guestHomeSiteOrigin,
} from "@/lib/landing/guestHomeCopy";
import { cn } from "@/lib/utils";

export function GuestHomeStructuredData() {
  const origin = guestHomeSiteOrigin();
  const description = GUEST_HOME_LEAD;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Wade Me Home",
        url: origin,
        description,
      },
      {
        "@type": "SoftwareApplication",
        name: "Wade Me Home",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        url: origin,
      },
      {
        "@type": "Organization",
        name: "Wade Me Home",
        url: origin,
        description,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

const linkQuiet = cn(
  "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

/** Indexable H1 + body: lives in the top navbar next to the brand (native &lt;details&gt;). */
export function GuestHomeIntroDisclosure() {
  return (
    <details className="guest-home-intro relative z-40 min-w-0 flex-1 [&_summary::-webkit-details-marker]:hidden [&[open]>summary]:border-primary/30 [&[open]>summary]:bg-muted/55">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-2 rounded-md border border-border/80 bg-muted/40 px-2.5 py-1.5 shadow-sm",
          "transition-colors hover:bg-muted/55",
        )}
        aria-label={`About: ${GUEST_HOME_H1}`}
      >
        <span className="guest-home-intro-disclosure shrink-0 select-none text-muted-foreground" aria-hidden>
          ▸
        </span>
        <h1 className="min-w-0 flex-1 truncate text-left text-xs font-semibold leading-tight tracking-tight text-foreground sm:text-sm">
          {GUEST_HOME_H1}
        </h1>
        <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline">Details</span>
      </summary>
      <div
        className={cn(
          "absolute left-0 top-full z-[60] mt-1.5 min-w-full max-w-lg space-y-2 overflow-y-auto overscroll-contain rounded-lg border border-border/80 bg-background/98 p-3 shadow-xl backdrop-blur",
          "max-h-[min(50vh,24rem)] sm:p-3.5",
        )}
      >
        <p className="text-pretty text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {GUEST_HOME_LEAD}
        </p>
        <ul className="grid list-none gap-x-6 gap-y-1 text-xs leading-snug text-muted-foreground sm:grid-cols-2">
          {GUEST_HOME_BULLETS.map((item) => (
            <li
              key={item}
              className="relative pl-3.5 before:absolute before:left-0 before:top-[0.35em] before:h-1 before:w-1 before:rounded-full before:bg-primary/45 before:content-['']"
            >
              {item}
            </li>
          ))}
        </ul>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border/40 pt-2 text-xs"
          aria-label="More links"
        >
          <Link href="/search" className={linkQuiet}>
            Full search
          </Link>
          <Link href="/blog" className={linkQuiet}>
            Renter guides
          </Link>
          <Link href="/for-property-managers" className={linkQuiet}>
            Property managers
          </Link>
        </nav>
      </div>
    </details>
  );
}
