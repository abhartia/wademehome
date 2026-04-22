"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import {
  TRANSIT_SYSTEM_COLORS,
  TRANSIT_SYSTEM_LABELS,
  useTransitStations,
  type TransitSystem,
} from "@/lib/listings/useTransitStations";
import { useEffect, useMemo, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PROPERTY_MAP_TRANSIT_SYSTEMS: TransitSystem[] = [
  "path",
  "hblr",
  "nyc_subway",
  "lirr",
  "nj_transit_rail",
  "nj_transit_bus",
  "ferry",
];

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
  const transitMarkersRef = useRef<MMarker[]>([]);
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

  const transitBbox = useMemo(() => {
    if (!Number.isFinite(primaryLat) || !Number.isFinite(primaryLng)) return undefined;
    const dLat = 0.018;
    const dLng = 0.024;
    return {
      west: primaryLng - dLng,
      east: primaryLng + dLng,
      south: primaryLat - dLat,
      north: primaryLat + dLat,
    };
  }, [primaryLat, primaryLng]);

  const transitQuery = useTransitStations({
    enabled: !!transitBbox,
    systems: PROPERTY_MAP_TRANSIT_SYSTEMS,
    bbox: transitBbox,
    limit: 500,
  });
  const transitStations = transitQuery.data?.stations;

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
      transitMarkersRef.current.forEach((m) => m.remove());
      transitMarkersRef.current = [];
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

  useEffect(() => {
    if (!mapReady) return;
    const mapInstance = mapRef.current;
    const mapboxglRef = mapboxRef.current;
    if (!mapInstance || !mapboxglRef) return;

    transitMarkersRef.current.forEach((m) => m.remove());
    transitMarkersRef.current = [];

    if (!transitStations || transitStations.length === 0) return;

    for (const station of transitStations) {
      if (!Number.isFinite(station.latitude) || !Number.isFinite(station.longitude)) {
        continue;
      }
      const color = TRANSIT_SYSTEM_COLORS[station.system] ?? "#334155";
      const systemLabel = TRANSIT_SYSTEM_LABELS[station.system] ?? station.system;
      const isBus = station.system === "nj_transit_bus";
      const size = isBus ? 6 : 10;
      const borderWidth = isBus ? 1 : 1.5;

      // Mapbox sets `transform` on the marker element to position it, so we
      // must NOT change `transform` on that same node — doing so would clobber
      // the positioning and the marker would snap to (0,0). Use an inner dot
      // that handles the hover scale instead.
      const el = document.createElement("div");
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `${station.station_name} (${systemLabel})`);
      el.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;cursor:pointer;`;

      const dot = document.createElement("div");
      dot.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        "border-radius:50%",
        `background:${color}`,
        `border:${borderWidth}px solid #ffffff`,
        "box-shadow:0 0 0 1px rgba(15,23,42,0.25)",
        "transition:transform 120ms ease",
        isBus ? "opacity:0.8" : "opacity:1",
        "transform-origin:center",
      ].join(";");
      el.appendChild(dot);

      el.onmouseenter = () => {
        dot.style.transform = "scale(1.6)";
      };
      el.onmouseleave = () => {
        dot.style.transform = "scale(1)";
      };

      const lineBadges = (station.lines ?? [])
        .slice(0, 8)
        .map(
          (ln) =>
            `<span style="display:inline-block;padding:1px 5px;border-radius:10px;background:${color};color:#fff;font-size:10px;font-weight:600;margin-right:3px;">${escapeHtml(ln)}</span>`,
        )
        .join("");
      const popupHtml = `
        <div style="font-family:ui-sans-serif,system-ui;min-width:180px;">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">${escapeHtml(station.station_name)}</div>
          <div style="font-size:10px;color:#64748b;margin-top:2px;">${escapeHtml(systemLabel)}</div>
          ${lineBadges ? `<div style="margin-top:6px;">${lineBadges}</div>` : ""}
        </div>`;
      const popup = new mapboxglRef.Popup({
        offset: 10,
        maxWidth: "240px",
        closeButton: false,
      }).setHTML(popupHtml);

      const marker = new mapboxglRef.Marker({ element: el, anchor: "center" })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(mapInstance as MMap);
      transitMarkersRef.current.push(marker);
    }
  }, [mapReady, transitStations]);

  useEffect(() => {
    return () => {
      transitMarkersRef.current.forEach((m) => m.remove());
      transitMarkersRef.current = [];
    };
  }, []);

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
