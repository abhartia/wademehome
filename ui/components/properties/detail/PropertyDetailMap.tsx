"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { useEffect, useMemo, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapboxModule = typeof import("mapbox-gl").default;
type MMap = InstanceType<MapboxModule["Map"]>;
type MMarker = InstanceType<MapboxModule["Marker"]>;

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

interface PropertyDetailMapProps {
  primary: PropertyDataItem;
  /** Other listings to show as secondary pins (e.g. nearby inventory). */
  nearby?: PropertyDataItem[];
  /** When primary has no coordinates, use this center (e.g. from geocode). */
  center: { latitude: number; longitude: number };
}

export function PropertyDetailMap({ primary, nearby = [], center }: PropertyDetailMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MMap | null>(null);
  const mapboxRef = useRef<MapboxModule | null>(null);
  const markersRef = useRef<MMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const primaryKey = useMemo(() => buildPropertyKey(primary), [primary]);

  const secondary = useMemo(() => {
    const out: PropertyDataItem[] = [];
    for (const p of nearby) {
      if (buildPropertyKey(p) === primaryKey) continue;
      const lat = toFiniteNumber(p.latitude);
      const lng = toFiniteNumber(p.longitude);
      if (lat === null || lng === null) continue;
      out.push({ ...p, latitude: lat, longitude: lng });
    }
    return out;
  }, [nearby, primaryKey]);

  const primaryLat = toFiniteNumber(primary.latitude) ?? center.latitude;
  const primaryLng = toFiniteNumber(primary.longitude) ?? center.longitude;

  const camera = useMemo(() => {
    if (secondary.length === 0) {
      return { latitude: primaryLat, longitude: primaryLng, zoom: 14 };
    }
    const lats = [primaryLat, ...secondary.map((p) => p.latitude as number)];
    const lngs = [primaryLng, ...secondary.map((p) => p.longitude as number)];
    const midLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const midLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    return { latitude: midLat, longitude: midLng, zoom: 12.2 };
  }, [primaryLat, primaryLng, secondary]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    const el = mapContainerRef.current;
    if (!el) return;

    let cancelled = false;
    let mapInstance: MMap | null = null;

    void (async () => {
      const mapboxglModule = await import("mapbox-gl");
      if (cancelled || !mapContainerRef.current) return;

      const mapboxglRef = (mapboxglModule.default ?? mapboxglModule) as unknown as MapboxModule;
      mapboxglRef.accessToken = MAPBOX_TOKEN as string;

      mapInstance = new mapboxglRef.Map({
        container: mapContainerRef.current as HTMLDivElement,
        style: "mapbox://styles/bhartiaa/clmjaeebd01qt01qx0qsv1dng",
        center: [center.longitude, center.latitude],
        zoom: 13,
      });

      mapRef.current = mapInstance;
      mapboxRef.current = mapboxglRef;

      mapInstance.once("load", () => {
        if (cancelled) return;
        mapInstance?.resize();
        setMapReady(true);
      });
    })();

    return () => {
      cancelled = true;
      setMapReady(false);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapInstance?.remove();
      mapRef.current = null;
      mapboxRef.current = null;
    };
  }, [center.latitude, center.longitude]);

  useEffect(() => {
    if (!mapReady) return;
    const mapInstance = mapRef.current;
    const mapboxglRef = mapboxRef.current;
    if (!mapInstance || !mapboxglRef) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    mapInstance.jumpTo({
      center: [camera.longitude, camera.latitude],
      zoom: camera.zoom,
    });
    mapInstance.resize();

    const addMarker = (lat: number, lng: number, isPrimary: boolean, prop: PropertyDataItem) => {
      const dot = document.createElement("div");
      if (isPrimary) {
        dot.style.width = "22px";
        dot.style.height = "22px";
        dot.style.borderRadius = "999px";
        dot.style.background = "#f59e0b";
        dot.style.border = "3px solid #fff";
        dot.style.boxShadow = "0 4px 14px rgba(0,0,0,.35)";
      } else {
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "999px";
        dot.style.background = "#64748b";
        dot.style.border = "2px solid #fff";
        dot.style.opacity = "0.9";
      }
      const popupHtml = `
        <div style="font-family:system-ui,sans-serif;min-width:180px;max-width:240px;padding:2px;">
          <div style="font-size:12px;font-weight:600;">${prop.name}</div>
          <div style="font-size:11px;color:#64748b;margin:4px 0;">${prop.address}</div>
          <div style="font-size:11px;font-weight:600;">${formatPropertyRangeLabel(prop.rent_range)} · ${formatPropertyRangeLabel(prop.bedroom_range)}</div>
        </div>`;
      const popup = new mapboxglRef.Popup({ offset: isPrimary ? 18 : 12 }).setHTML(popupHtml);
      const marker = new mapboxglRef.Marker({ element: dot })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapInstance as MMap);
      markersRef.current.push(marker);
    };

    addMarker(primaryLat, primaryLng, true, primary);
    for (const p of secondary) {
      addMarker(p.latitude as number, p.longitude as number, false, p);
    }
  }, [mapReady, primary, primaryLat, primaryLng, secondary, camera]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        Add <code className="mx-1 rounded bg-muted px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to show the map.
      </div>
    );
  }

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg border md:h-80">
      <div ref={mapContainerRef} className="h-full w-full" />
      {secondary.length > 0 ? (
        <p className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-md border bg-background/90 px-2 py-1 text-center text-[11px] text-muted-foreground shadow-sm">
          Amber pin = this listing. Gray pins = other rentals nearby.
        </p>
      ) : null}
    </div>
  );
}
