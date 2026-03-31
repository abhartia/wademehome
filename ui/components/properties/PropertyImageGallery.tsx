"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + urls.length) % urls.length);
  }, [urls.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % urls.length);
  }, [urls.length]);

  useEffect(() => {
    if (!lightboxOpen || urls.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, urls.length, goPrev, goNext]);

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
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in rounded-lg bg-transparent text-left ring-offset-background transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={() => openAt(0)}
          aria-label={`Enlarge photo 1 of ${urls.length}`}
        />
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
                <button
                  type="button"
                  className="absolute inset-0 z-10 cursor-zoom-in rounded-md bg-transparent ring-offset-background transition-colors hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => openAt(idx)}
                  aria-label={`Enlarge photo ${idx + 1} of ${urls.length}`}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-h-[95vh] w-[min(96vw,1200px)] max-w-[min(96vw,1200px)] gap-3 border-0 bg-transparent p-3 shadow-none sm:max-w-[min(96vw,1200px)]"
          showCloseButton
        >
          <DialogTitle className="sr-only">
            {property.name} — photo {activeIndex + 1} of {urls.length}
          </DialogTitle>
          <div className="relative flex min-h-[min(85vh,800px)] w-full items-center justify-center rounded-lg bg-black/20 p-2">
            {!failed[activeIndex] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urls[activeIndex]}
                alt=""
                className="max-h-[85vh] w-full object-contain"
                decoding="async"
                onError={() => setFailed((f) => ({ ...f, [activeIndex]: true }))}
              />
            ) : (
              <div className="flex min-h-[40vh] w-full items-center justify-center text-muted-foreground">
                <Building2 className="h-20 w-20 opacity-40" aria-hidden />
              </div>
            )}
            {urls.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </Button>
              </>
            ) : null}
          </div>
          {urls.length > 1 ? (
            <p className="text-center text-sm text-foreground drop-shadow-sm">
              {activeIndex + 1} / {urls.length}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
