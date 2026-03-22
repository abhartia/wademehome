"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { Building2 } from "lucide-react";
import { useState } from "react";

type Variant = "page" | "sheet";

const heroHeights: Record<Variant, string> = {
  page: "h-80",
  sheet: "h-56",
};

/** Hero + thumbnail grid for listing image URLs (arbitrary CDNs — use `<img>`, not `next/image`). */
export function PropertyImageGallery({
  property,
  variant = "page",
}: {
  property: PropertyDataItem;
  variant?: Variant;
}) {
  const urls = property.images_urls?.filter(Boolean) ?? [];
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  if (urls.length === 0) {
    return (
      <div
        className={`relative flex ${heroHeights[variant]} w-full items-center justify-center overflow-hidden rounded-lg border bg-muted`}
      >
        <Building2 className="h-16 w-16 text-muted-foreground/40" aria-hidden />
      </div>
    );
  }

  const [hero, ...rest] = urls;

  return (
    <div className="space-y-3">
      <div
        className={`relative ${heroHeights[variant]} w-full overflow-hidden rounded-lg border bg-muted`}
      >
        {!failed[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary listing CDNs
          <img
            src={hero}
            alt={property.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading={variant === "page" ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed((f) => ({ ...f, 0: true }))}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Building2 className="h-14 w-14 opacity-40" />
          </div>
        )}
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {rest.map((src, i) => {
            const idx = i + 1;
            return (
              <div
                key={`${src}-${idx}`}
                className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted"
              >
                {!failed[idx] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed((f) => ({ ...f, [idx]: true }))}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground/35" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
