'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { groupPropertiesByBuilding } from "@/lib/properties/groupPropertiesByBuilding";
import { buildingGroupKey } from "@/lib/properties/groupPropertiesByBuilding";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import { cacheProperty } from "@/lib/properties/propertyStorage";
import type { PropertyDataItem } from "../UIEventsTypes";
import type { BrowseMapViewport } from "@/lib/map/approximateBrowseBounds";
import {
  TRANSIT_SYSTEM_COLORS,
  TRANSIT_SYSTEM_LABELS,
  type TransitStationPoint,
} from "@/lib/listings/useTransitStations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SEEN_MAP_BUILDING_KEYS_STORAGE = "wademehome_map_seen_building_keys";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadSeenBuildingKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_MAP_BUILDING_KEYS_STORAGE);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function persistSeenBuildingKeys(keys: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SEEN_MAP_BUILDING_KEYS_STORAGE,
      JSON.stringify([...keys]),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/** Update pill styles without replacing the marker node (so Mapbox can open the popup on first click). */
function applyMarkerSeenVisual(markerRoot: HTMLButtonElement, seen: boolean) {
  const pill = markerRoot.firstElementChild as HTMLElement | null;
  if (!pill) return;
  pill.style.background = seen ? "#475569" : "#0f172a";
  pill.style.boxShadow = seen
    ? "0 4px 14px rgba(71,85,105,0.35)"
    : "0 6px 20px rgba(15,23,42,0.45)";
  pill.style.opacity = seen ? "0.72" : "1";
  pill.style.filter = seen ? "saturate(0.55)" : "none";

  const countEl = pill.querySelector("[data-marker-count]") as HTMLElement | null;
  if (countEl) {
    countEl.style.background = seen ? "#94a3b8" : "#22c55e";
  }

  const textCol = pill.querySelector("[data-marker-text]") as HTMLElement | null;
  if (textCol) {
    const bed = textCol.children[0] as HTMLElement | undefined;
    const rent = textCol.children[1] as HTMLElement | undefined;
    if (bed) bed.style.color = seen ? "#cbd5e1" : "#e5e7eb";
    if (rent) rent.style.color = seen ? "#fcd34d" : "#fbbf24";
  }
}

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

interface PropertyListingsMapProps {
  properties: PropertyDataItem[];
  /** When there are no mappable pins yet, center the map here (e.g. user / fallback location). */
  fallbackCenter: { latitude: number; longitude: number };
  /**
   * When true (default), camera jumps to fit pins / fallback when data changes.
   * When false, pan/zoom is preserved while markers refresh (guest browse + map-driven nearby SQL).
   */
  followDataCamera?: boolean;
  /**
   * Browse mode only: called (debounced) after the user pans/zooms, and once when leaving
   * follow-data mode so the parent can refetch listings for the visible area.
   */
  onBrowseCenterChange?: (viewport: BrowseMapViewport) => void;
  /** API returned nearest inventory rows because nothing matched the search radius. */
  globalNearestFallback?: boolean;
  onSelectProperty?: (property: PropertyDataItem) => void;
  onMarkerClick?: (property: PropertyDataItem) => void;
  highlightedProperty?: PropertyDataItem | null;
  focusedProperty?: PropertyDataItem | null;
  focusRequestVersion?: number;
  /**
   * When true (default), marker click also invokes `onSelectProperty` (e.g. sheet).
   * When false, only the map popup opens; use listing links inside the popup for details.
   */
  openPropertySheetOnMarkerClick?: boolean;
  /** Transit stations to render as small colored dots on the map. */
  transitStations?: TransitStationPoint[];
  /** When true, render the transit overlay. Defaults to false. */
  showTransit?: boolean;
}

type MapboxModule = typeof mapboxgl;

export function PropertyListingsMap({
  properties,
  fallbackCenter,
  followDataCamera = true,
  onBrowseCenterChange,
  globalNearestFallback = false,
  onSelectProperty,
  onMarkerClick,
  highlightedProperty = null,
  focusedProperty = null,
  focusRequestVersion = 0,
  openPropertySheetOnMarkerClick = true,
  transitStations,
  showTransit = false,
}: PropertyListingsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxRef = useRef<MapboxModule | null>(null);
  /** First-render center only — avoids remounting the map when browse center updates from panning. */
  const mapBootstrapCenterRef = useRef<{ latitude: number; longitude: number } | null>(null);
  if (mapBootstrapCenterRef.current === null) {
    mapBootstrapCenterRef.current = {
      latitude: fallbackCenter.latitude,
      longitude: fallbackCenter.longitude,
    };
  }
  const prevFollowDataCameraRef = useRef(followDataCamera);
  const lastAppliedCameraRef = useRef<{
    latitude: number;
    longitude: number;
    zoom: number;
  } | null>(null);
  /** When followDataCamera is false, sync map center only when fallbackCenter changes (e.g. geolocation). Never override user zoom. */
  const lastAppliedBrowseFallbackCenterRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectRef = useRef(onSelectProperty);
  onSelectRef.current = onSelectProperty;
  const openSheetOnMarkerRef = useRef(openPropertySheetOnMarkerClick);
  openSheetOnMarkerRef.current = openPropertySheetOnMarkerClick;
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;
  const markerByGroupKeyRef = useRef<
    Map<string, { marker: mapboxgl.Marker; markerEl: HTMLButtonElement; seen: boolean; coords: [number, number] }>
  >(new Map());

  /** Mutated on marker click; do not tie to React state or marker rebuilds will cancel popup open. */
  const seenBuildingKeysRef = useRef<Set<string>>(new Set());

  const [mapReady, setMapReady] = useState(false);
  const highlightedGroupKey = useMemo(
    () => (highlightedProperty ? buildingGroupKey(highlightedProperty) : null),
    [highlightedProperty],
  );
  const focusedGroupKey = useMemo(
    () => (focusedProperty ? buildingGroupKey(focusedProperty) : null),
    [focusedProperty],
  );

  useLayoutEffect(() => {
    seenBuildingKeysRef.current = loadSeenBuildingKeys();
  }, []);

  const mappableProperties = useMemo(() => {
    const out: PropertyDataItem[] = [];
    for (const p of properties) {
      const lat = toFiniteNumber(p.latitude);
      const lng = toFiniteNumber(p.longitude);
      if (lat === null || lng === null) continue;
      out.push({ ...p, latitude: lat, longitude: lng });
    }
    return out;
  }, [properties]);

  const groupedProperties = useMemo(
    () => groupPropertiesByBuilding(mappableProperties),
    [mappableProperties],
  );

  /**
   * Rebuilding every Mapbox marker clears popups and feels like a full map refresh. Grouped props
   * often get new array references while the mappable set is unchanged (e.g. parent re-renders on
   * list hover). Key only when pin layout / labels should change.
   */
  const markerLayoutKey = useMemo(() => {
    const rows: string[] = [];
    for (const p of properties) {
      const lat = toFiniteNumber(p.latitude);
      const lng = toFiniteNumber(p.longitude);
      if (lat === null || lng === null) continue;
      rows.push(
        `${buildPropertyKey(p)}|${lat.toFixed(5)}|${lng.toFixed(5)}|${p.bedroom_range}|${p.rent_range}`,
      );
    }
    rows.sort();
    return rows.join("\n");
  }, [properties]);

  const cameraView = useMemo(() => {
    if (mappableProperties.length === 0) {
      return {
        latitude: fallbackCenter.latitude,
        longitude: fallbackCenter.longitude,
        zoom: 11,
      };
    }

    if (globalNearestFallback) {
      return {
        latitude: fallbackCenter.latitude,
        longitude: fallbackCenter.longitude,
        zoom: 4,
      };
    }

    const avgLat =
      mappableProperties.reduce((sum, p) => sum + (p.latitude as number), 0) /
      mappableProperties.length;
    const avgLng =
      mappableProperties.reduce((sum, p) => sum + (p.longitude as number), 0) /
      mappableProperties.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
      zoom: mappableProperties.length === 1 ? 13 : 11,
    };
  }, [
    mappableProperties,
    globalNearestFallback,
    fallbackCenter.latitude,
    fallbackCenter.longitude,
  ]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    const el = mapContainerRef.current;
    if (!el) return;

    let cancelled = false;
    let mapInstance: mapboxgl.Map | null = null;

    (async () => {
      const mapboxglModule = await import("mapbox-gl");
      if (cancelled || !mapContainerRef.current) return;

      const mapboxglRef = (mapboxglModule.default ??
        mapboxglModule) as unknown as MapboxModule;

      mapboxglRef.accessToken = MAPBOX_TOKEN as string;

      const boot = mapBootstrapCenterRef.current;
      if (!boot) return;
      mapInstance = new mapboxglRef.Map({
        container: mapContainerRef.current as HTMLDivElement,
        style: "mapbox://styles/bhartiaa/clmjaeebd01qt01qx0qsv1dng",
        center: [boot.longitude, boot.latitude],
        zoom: 11,
      });

      mapRef.current = mapInstance;
      mapboxRef.current = mapboxglRef;

      mapInstance.once("load", () => {
        if (cancelled) return;
        mapInstance?.resize();
        setMapReady(true);
      });
    })();

    // Snapshot the ref map so cleanup uses the same Map instance we just mutated —
    // by the time cleanup fires, the ref may point at a new map.
    const markerByGroupKeyAtMount = markerByGroupKeyRef.current;

    return () => {
      cancelled = true;
      setMapReady(false);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      markerByGroupKeyAtMount.clear();
      mapInstance?.remove();
      mapRef.current = null;
      mapboxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount map only when token env changes
  }, [MAPBOX_TOKEN]);

  useEffect(() => {
    if (!followDataCamera) {
      lastAppliedCameraRef.current = null;
    }
  }, [followDataCamera]);

  useEffect(() => {
    if (!mapReady) return;
    const mapInstance = mapRef.current;
    if (!mapInstance) return;
    if (!followDataCamera) return;

    const { latitude, longitude, zoom } = cameraView;
    const prev = lastAppliedCameraRef.current;
    if (
      prev &&
      Math.abs(prev.latitude - latitude) < 1e-7 &&
      Math.abs(prev.longitude - longitude) < 1e-7 &&
      Math.abs(prev.zoom - zoom) < 1e-4
    ) {
      return;
    }
    lastAppliedCameraRef.current = { latitude, longitude, zoom };

    mapInstance.jumpTo({
      center: [longitude, latitude],
      zoom,
    });
    mapInstance.resize();
  }, [mapReady, followDataCamera, cameraView]);

  useEffect(() => {
    if (!mapReady) return;
    if (followDataCamera) return;
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const { latitude, longitude } = fallbackCenter;
    const prev = lastAppliedBrowseFallbackCenterRef.current;
    if (
      prev &&
      Math.abs(prev.latitude - latitude) < 1e-7 &&
      Math.abs(prev.longitude - longitude) < 1e-7
    ) {
      return;
    }
    lastAppliedBrowseFallbackCenterRef.current = { latitude, longitude };

    const z = mapInstance.getZoom();
    mapInstance.jumpTo({
      center: [longitude, latitude],
      zoom: z,
    });
    mapInstance.resize();
    // fallbackCenter is a prop object; we depend on its lat/lng scalars to avoid
    // re-running on every render when the parent allocates a fresh wrapper object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, followDataCamera, fallbackCenter.latitude, fallbackCenter.longitude]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;
    const observer = new ResizeObserver(() => {
      map.resize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const prev = prevFollowDataCameraRef.current;
    prevFollowDataCameraRef.current = followDataCamera;
    if (
      onBrowseCenterChange &&
      prev === true &&
      followDataCamera === false &&
      mapRef.current
    ) {
      const map = mapRef.current;
      const c = map.getCenter();
      const b = map.getBounds();
      if (!b) return;
      onBrowseCenterChange({
        latitude: c.lat,
        longitude: c.lng,
        zoom: map.getZoom(),
        west: b.getWest(),
        south: b.getSouth(),
        east: b.getEast(),
        north: b.getNorth(),
      });
    }
  }, [mapReady, followDataCamera, onBrowseCenterChange]);

  useEffect(() => {
    if (!mapReady) return;
    const markers = markerByGroupKeyRef.current;
    for (const [groupKey, meta] of markers.entries()) {
      const isHighlighted = highlightedGroupKey === groupKey;
      applyMarkerSeenVisual(meta.markerEl, meta.seen);
      const pill = meta.markerEl.firstElementChild as HTMLElement | null;
      if (!pill) continue;
      pill.style.outline = isHighlighted ? "2px solid #38bdf8" : "none";
      pill.style.transform = isHighlighted ? "scale(1.06)" : "scale(1)";
      pill.style.transition = "transform 0.18s ease, outline-color 0.18s ease";
      pill.style.opacity = isHighlighted ? "1" : pill.style.opacity;
    }
  }, [mapReady, highlightedGroupKey]);

  useEffect(() => {
    if (!mapReady || !focusedGroupKey) return;
    const map = mapRef.current;
    const meta = markerByGroupKeyRef.current.get(focusedGroupKey);
    if (!map || !meta) return;
    map.flyTo({
      center: meta.coords,
      zoom: Math.max(map.getZoom(), 13),
      duration: 450,
      essential: true,
    });
  }, [mapReady, focusedGroupKey, focusRequestVersion]);

  useEffect(() => {
    if (!mapReady || followDataCamera || !onBrowseCenterChange) return;
    const map = mapRef.current;
    if (!map) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const c = map.getCenter();
        const b = map.getBounds();
        if (!b) return;
        onBrowseCenterChange({
          latitude: c.lat,
          longitude: c.lng,
          zoom: map.getZoom(),
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        });
      }, 450);
    };
    map.on("moveend", schedule);
    schedule();
    return () => {
      map.off("moveend", schedule);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [mapReady, followDataCamera, onBrowseCenterChange]);

  useEffect(() => {
    if (!mapReady) return;
    const mapInstance = mapRef.current;
    const mapboxglRef = mapboxRef.current;
    if (!mapInstance || !mapboxglRef) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    markerByGroupKeyRef.current.clear();

    for (const group of groupedProperties) {
      const primary = group.units[0];
      const latitude = group.latitude as number;
      const longitude = group.longitude as number;
      const seen = seenBuildingKeysRef.current.has(group.key);

      const unitByPropertyKey = new Map<string, PropertyDataItem>();
      for (const unit of group.units) {
        unitByPropertyKey.set(buildPropertyKey(unit), unit);
      }

      const photoUrls: string[] = [];
      const seenUrl = new Set<string>();
      for (const unit of group.units) {
        const u = unit.images_urls?.find((x) => typeof x === "string" && x.trim() !== "");
        if (u && !seenUrl.has(u)) {
          seenUrl.add(u);
          photoUrls.push(u);
        }
        if (photoUrls.length >= 4) break;
      }

      const photosHtml =
        photoUrls.length > 0
          ? `<div style="display:flex;gap:6px;overflow-x:auto;margin:0 0 8px 0;padding-bottom:2px;">
              ${photoUrls
                .map(
                  (src) =>
                    `<div style="flex:0 0 auto;width:72px;height:52px;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;background:#f1f5f9;">
                      <img src="${escapeHtml(src)}" alt="" width="72" height="52" style="display:block;width:72px;height:52px;object-fit:cover;" loading="lazy" decoding="async" />
                    </div>`,
                )
                .join("")}
            </div>`
          : "";

      const popupUnitsHtml = group.units
        .slice(0, 4)
        .map((unit) => {
          const pk = buildPropertyKey(unit);
          const href = `/properties/${encodeURIComponent(pk)}`;
          const thumb = unit.images_urls?.find((x) => typeof x === "string" && x.trim() !== "");
          const thumbBlock = thumb
            ? `<div style="flex:0 0 auto;width:40px;height:40px;border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;background:#f1f5f9;">
                 <img src="${escapeHtml(thumb)}" alt="" width="40" height="40" style="display:block;width:40px;height:40px;object-fit:cover;" loading="lazy" decoding="async" />
               </div>`
            : `<div style="flex:0 0 auto;width:40px;height:40px;border-radius:6px;background:#e2e8f0;"></div>`;
          return `
              <a href="${href}" target="_blank" rel="noopener noreferrer" data-wmh-pk="${escapeHtml(pk)}" style="display:flex;align-items:flex-start;gap:8px;margin-top:6px;padding:6px 4px;border-radius:8px;text-decoration:none;color:inherit;outline:none;"
                 onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                ${thumbBlock}
                <div style="flex:1;min-width:0;">
                  <div style="font-size:10px;font-weight:600;color:#0f172a;line-height:1.25;">
                    ${escapeHtml(formatPropertyRangeLabel(unit.bedroom_range))}
                  </div>
                  <div style="font-size:10px;font-weight:600;color:#0f172a;margin-top:2px;text-align:left;">
                    ${escapeHtml(formatPropertyRangeLabel(unit.rent_range))}
                  </div>
                  <div style="font-size:9px;color:#64748b;margin-top:2px;">Open details →</div>
                </div>
              </a>
            `;
        })
        .join("");

      const moreUnitsCount = group.units.length - 4;

      const popupHtml = `
          <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif; min-width:240px; max-width:280px;">
            ${photosHtml}
            <div style="font-size:12px;font-weight:600;color:#0f172a;margin-bottom:2px;">
              ${escapeHtml(primary.name)}
            </div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">
              ${escapeHtml(primary.address)}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div style="font-size:11px;color:#0f172a;">
                ${group.units.length} unit${group.units.length > 1 ? "s" : ""}
              </div>
              <div style="font-size:11px;font-weight:600;color:#0f172a;">
                ${escapeHtml(formatPropertyRangeLabel(primary.rent_range))}
              </div>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding-top:4px;margin-top:4px;">
              ${popupUnitsHtml}
              ${
                moreUnitsCount > 0
                  ? `<div style="margin-top:6px;font-size:10px;color:#94a3b8;">
                       +${moreUnitsCount} more unit${moreUnitsCount > 1 ? "s" : ""}
                     </div>`
                  : ""
              }
            </div>
          </div>
        `;

      const popup = new mapboxglRef.Popup({ offset: 24, maxWidth: "320px" }).setHTML(popupHtml);

      popup.on("open", () => {
        const root = popup.getElement();
        if (!root || root.dataset.wmhCacheDelegated === "1") return;
        root.dataset.wmhCacheDelegated = "1";
        const closeButton = root.querySelector(".mapboxgl-popup-close-button") as HTMLButtonElement | null;
        if (closeButton) {
          closeButton.style.top = "6px";
          closeButton.style.right = "6px";
          closeButton.style.width = "24px";
          closeButton.style.height = "24px";
          closeButton.style.borderRadius = "999px";
          closeButton.style.background = "rgba(255,255,255,0.92)";
          closeButton.style.border = "1px solid #e2e8f0";
          closeButton.style.color = "#334155";
          closeButton.style.display = "grid";
          closeButton.style.placeItems = "center";
          closeButton.style.lineHeight = "1";
          closeButton.style.padding = "0";
        }
        root.addEventListener("click", (e) => {
          const t = e.target as HTMLElement | null;
          const a = t?.closest?.("a[data-wmh-pk]") as HTMLAnchorElement | null;
          if (!a) return;
          const pk = a.getAttribute("data-wmh-pk");
          if (!pk) return;
          const prop = unitByPropertyKey.get(pk);
          if (prop) cacheProperty(pk, prop);
        });
      });

      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.style.cursor = "pointer";
      markerEl.style.border = "none";
      markerEl.style.background = "transparent";
      markerEl.style.padding = "0";

      const pillBg = seen ? "#475569" : "#0f172a";
      const pillShadow = seen ? "0 4px 14px rgba(71,85,105,0.35)" : "0 6px 20px rgba(15,23,42,0.45)";
      const countBg = seen ? "#94a3b8" : "#22c55e";
      const labelMuted = seen ? "#cbd5e1" : "#e5e7eb";
      const rentColor = seen ? "#fcd34d" : "#fbbf24";
      const showUnitCount = group.units.length > 1;
      const markerGap = showUnitCount ? "6px" : "0";
      const countPillHtml = showUnitCount
        ? `<div data-marker-count="1" style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:${countBg};color:white;font-size:10px;font-weight:600;">
              ${group.units.length}
            </div>`
        : "";

      markerEl.innerHTML = `
          <div style="
            display:inline-flex;
            align-items:center;
            gap:${markerGap};
            padding:4px 10px;
            border-radius:999px;
            background:${pillBg};
            box-shadow:${pillShadow};
            opacity:${seen ? "0.72" : "1"};
            filter:${seen ? "saturate(0.55)" : "none"};
            transition:opacity 0.2s ease, filter 0.2s ease, background 0.2s ease;
          ">
            ${countPillHtml}
            <div data-marker-text="1" style="display:flex;flex-direction:column;align-items:flex-start;">
              <span style="font-size:10px;font-weight:600;color:${labelMuted};max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(formatPropertyRangeLabel(primary.bedroom_range))}
              </span>
              <span style="font-size:11px;font-weight:600;color:${rentColor};">
                ${escapeHtml(formatPropertyRangeLabel(primary.rent_range))}
              </span>
            </div>
          </div>
        `;
      markerEl.addEventListener("click", () => {
        if (!seenBuildingKeysRef.current.has(group.key)) {
          const next = new Set(seenBuildingKeysRef.current);
          next.add(group.key);
          seenBuildingKeysRef.current = next;
          persistSeenBuildingKeys(next);
          applyMarkerSeenVisual(markerEl, true);
          const markerMeta = markerByGroupKeyRef.current.get(group.key);
          if (markerMeta) markerMeta.seen = true;
        }
        onMarkerClickRef.current?.(primary);
        if (openSheetOnMarkerRef.current) {
          onSelectRef.current?.(primary);
        }
      });

      const marker = new mapboxglRef.Marker({ element: markerEl })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(mapInstance as mapboxgl.Map);

      markersRef.current.push(marker);
      markerByGroupKeyRef.current.set(group.key, {
        marker,
        markerEl,
        seen,
        coords: [longitude, latitude],
      });
    }
    // groupedProperties is read from this render; markerLayoutKey bumps only when pin rows change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- groupedProperties intentionally omitted (identity churn)
  }, [mapReady, markerLayoutKey]);

  // ── Transit station overlay (PATH / HBLR / NYC subway / ferry) ──────
  const transitMarkersRef = useRef<mapboxgl.Marker[]>([]);
  useEffect(() => {
    if (!mapReady) return;
    const mapInstance = mapRef.current;
    const mapboxglRef = mapboxRef.current;
    if (!mapInstance || !mapboxglRef) return;

    transitMarkersRef.current.forEach((m) => m.remove());
    transitMarkersRef.current = [];

    if (!showTransit || !transitStations || transitStations.length === 0) {
      return;
    }

    for (const station of transitStations) {
      if (!Number.isFinite(station.latitude) || !Number.isFinite(station.longitude)) {
        continue;
      }
      const color = TRANSIT_SYSTEM_COLORS[station.system] ?? "#334155";
      const systemLabel = TRANSIT_SYSTEM_LABELS[station.system] ?? station.system;

      const el = document.createElement("div");
      el.setAttribute("role", "img");
      el.setAttribute(
        "aria-label",
        `${station.station_name} (${systemLabel})`,
      );
      const isBus = station.system === "nj_transit_bus";
      const size = isBus ? 6 : 10;
      const borderWidth = isBus ? 1 : 1.5;
      el.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        "border-radius:50%",
        `background:${color}`,
        `border:${borderWidth}px solid #ffffff`,
        "box-shadow:0 0 0 1px rgba(15,23,42,0.25)",
        "cursor:pointer",
        "transition:transform 120ms ease",
        isBus ? "opacity:0.8" : "opacity:1",
      ].join(";");
      el.onmouseenter = () => {
        el.style.transform = "scale(1.6)";
      };
      el.onmouseleave = () => {
        el.style.transform = "scale(1)";
      };

      const lineBadges = station.lines
        .slice(0, 8)
        .map(
          (ln) =>
            `<span style="display:inline-block;padding:1px 5px;border-radius:10px;background:${color};color:#fff;font-size:10px;font-weight:600;margin-right:3px;">${escapeHtml(
              ln,
            )}</span>`,
        )
        .join("");
      const popupHtml = `
        <div style="font-family:ui-sans-serif,system-ui;min-width:180px;">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">${escapeHtml(
            station.station_name,
          )}</div>
          <div style="font-size:10px;color:#64748b;margin-top:2px;">${escapeHtml(
            systemLabel,
          )}${station.borough ? ` · ${escapeHtml(station.borough)}` : ""}</div>
          ${lineBadges ? `<div style="margin-top:6px;">${lineBadges}</div>` : ""}
        </div>
      `;
      const popup = new mapboxglRef.Popup({
        offset: 10,
        maxWidth: "240px",
        closeButton: false,
      }).setHTML(popupHtml);

      const marker = new mapboxglRef.Marker({ element: el, anchor: "center" })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(mapInstance);
      transitMarkersRef.current.push(marker);
    }
    return () => {
      // Component-level cleanup happens in the main init effect; this return
      // runs before the next effect pass and is already handled by the top
      // of this effect. Left empty intentionally.
    };
  }, [mapReady, showTransit, transitStations]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
        Map view is unavailable because the Mapbox token is not configured.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border">
      <div ref={mapContainerRef} className="h-full w-full" />
      {mappableProperties.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center px-2">
          <p className="rounded-md border border-border/60 bg-background/90 px-2 py-1 text-center text-[11px] text-muted-foreground shadow-sm backdrop-blur">
            No map pins for the current results.
          </p>
        </div>
      ) : globalNearestFallback ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center px-2">
          <p className="max-w-md rounded-md border border-amber-500/35 bg-background/90 px-2 py-1 text-center text-[11px] text-muted-foreground shadow-sm backdrop-blur">
            Pins are the closest listings to map center — none were inside your
            radius.
          </p>
        </div>
      ) : null}
    </div>
  );
}
