'use client';

import { useEffect, useMemo, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import type { PropertyDataItem } from "../UIEventsTypes";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface PropertyListingsMapProps {
  properties: PropertyDataItem[];
  onSelectProperty?: (property: PropertyDataItem) => void;
}

const DEFAULT_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  zoom: 11,
};

export function PropertyListingsMap({
  properties,
  onSelectProperty,
}: PropertyListingsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mappableProperties = useMemo(
    () =>
      properties.filter(
        (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
      ),
    [properties],
  );

  const groupedProperties = useMemo(
    () => {
      const groups = new Map<
        string,
        {
          latitude: number;
          longitude: number;
          properties: PropertyDataItem[];
        }
      >();

      mappableProperties.forEach((property) => {
        const latitude = property.latitude as number;
        const longitude = property.longitude as number;

        const key = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
        const existing = groups.get(key);

        if (existing) {
          existing.properties.push(property);
        } else {
          groups.set(key, {
            latitude,
            longitude,
            properties: [property],
          });
        }
      });

      return Array.from(groups.values());
    },
    [mappableProperties],
  );

  const initialViewState = useMemo(() => {
    if (mappableProperties.length === 0) return DEFAULT_VIEW_STATE;

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
  }, [mappableProperties]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!mapContainerRef.current) return;
    if (groupedProperties.length === 0) return;

    let isCancelled = false;

    (async () => {
      const mapboxglModule = await import("mapbox-gl");
      if (isCancelled) return;

      const mapboxglRef = (mapboxglModule.default ??
        mapboxglModule) as unknown as typeof mapboxgl;

      mapboxglRef.accessToken = MAPBOX_TOKEN as string;

      const mapInstance = new mapboxglRef.Map({
        container: mapContainerRef.current as HTMLDivElement,
        style: "mapbox://styles/bhartiaa/clmjaeebd01qt01qx0qsv1dng",
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
      });

      mapRef.current = mapInstance;

      groupedProperties.forEach((group) => {
        const primary = group.properties[0];

        const popupUnitsHtml = group.properties
          .slice(0, 4)
          .map(
            (unit) => `
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:4px;">
                <div style="font-size:10px;color:#0f172a;">${unit.bedroom_range}</div>
                <div style="font-size:10px;font-weight:600;color:#0f172a;margin-left:8px;text-align:right;">
                  ${unit.rent_range}
                </div>
              </div>
            `,
          )
          .join("");

        const moreUnitsCount = group.properties.length - 4;

        const popupHtml = `
          <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif; min-width: 220px; max-width: 260px;">
            <div style="font-size:12px;font-weight:600;color:#0f172a;margin-bottom:2px;">
              ${primary.name}
            </div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">
              ${primary.address}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div style="font-size:11px;color:#0f172a;">
                ${group.properties.length} unit${group.properties.length > 1 ? "s" : ""}
              </div>
              <div style="font-size:11px;font-weight:600;color:#0f172a;">
                ${primary.rent_range}
              </div>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding-top:6px;margin-top:4px;">
              ${popupUnitsHtml}
              ${
                moreUnitsCount > 0
                  ? `<div style="margin-top:4px;font-size:10px;color:#94a3b8;">
                       +${moreUnitsCount} more unit${moreUnitsCount > 1 ? "s" : ""}
                     </div>`
                  : ""
              }
            </div>
          </div>
        `;

        const popup = new mapboxglRef.Popup({ offset: 24 }).setHTML(popupHtml);

        const markerEl = document.createElement("button");
        markerEl.type = "button";
        markerEl.style.cursor = "pointer";
        markerEl.style.border = "none";
        markerEl.style.background = "transparent";
        markerEl.style.padding = "0";

        markerEl.innerHTML = `
          <div style="
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:4px 10px;
            border-radius:999px;
            background:#0f172a;
            box-shadow:0 6px 20px rgba(15,23,42,0.45);
          ">
            <div style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:#22c55e;color:white;font-size:10px;font-weight:600;">
              ${group.properties.length}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-start;">
              <span style="font-size:10px;font-weight:600;color:#e5e7eb;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${primary.bedroom_range}
              </span>
              <span style="font-size:11px;font-weight:600;color:#fbbf24;">
                ${primary.rent_range}
              </span>
            </div>
          </div>
        `;
        markerEl.addEventListener("click", () => onSelectProperty?.(primary));

        new mapboxglRef.Marker({ element: markerEl })
          .setLngLat([group.longitude, group.latitude])
          .setPopup(popup)
          .addTo(mapInstance as mapboxgl.Map);
      });
    })();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialViewState, groupedProperties, onSelectProperty]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
        Map view is unavailable because the Mapbox token is not configured.
      </div>
    );
  }

  if (mappableProperties.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
        Map view is unavailable for these results.
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-md border">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}

