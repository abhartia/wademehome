"""Server-side Mapbox calls (geocoding, directions matrix). Uses stdlib urllib only."""

from __future__ import annotations

import json
import math
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

_MATRIX_BASE = "https://api.mapbox.com/directions-matrix/v1/mapbox/driving"
_GEOCODE_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places"
_SEARCH_BOX_BASE = "https://api.mapbox.com/search/searchbox/v1"


def forward_geocode(address: str, token: str, *, timeout: float = 12.0) -> tuple[float, float] | None:
    """Return (latitude, longitude) for the best Mapbox feature, or None."""
    q = (address or "").strip()
    if not q:
        return None
    path = urllib.parse.quote(q, safe="")
    url = f"{_GEOCODE_BASE}/{path}.json?{urllib.parse.urlencode({'access_token': token, 'limit': 1})}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, OSError):
        return None
    feats = data.get("features") or []
    if not feats:
        return None
    center = feats[0].get("center")
    if not isinstance(center, list) or len(center) < 2:
        return None
    lng, lat = float(center[0]), float(center[1])
    if not (math.isfinite(lat) and math.isfinite(lng)):
        return None
    return lat, lng


def _feature_us_state_code(feature: dict[str, Any]) -> str | None:
    """
    Extract US state abbreviation from a Mapbox Geocoding feature's context
    (region short_code like US-NY → NY). Requires country us in context.
    """
    ctx = feature.get("context")
    country_lower: str | None = None
    region_code: str | None = None
    if isinstance(ctx, list):
        for item in ctx:
            if not isinstance(item, dict):
                continue
            iid = item.get("id")
            if not isinstance(iid, str):
                continue
            short = item.get("short_code")
            if not isinstance(short, str):
                continue
            s = short.strip().lower()
            if iid.startswith("country."):
                country_lower = s
            elif iid.startswith("region."):
                region_code = short.strip().upper()
    if country_lower != "us" or not region_code:
        return None
    if region_code.startswith("US-"):
        st = region_code[3:]
        if len(st) == 2 and st.isalpha():
            return st.upper()
    if len(region_code) == 2 and region_code.isalpha():
        return region_code.upper()
    return None


def forward_geocode_us_state(address: str, token: str, *, timeout: float = 12.0) -> str | None:
    """Return US state abbreviation from Mapbox's best feature, or None."""
    q = (address or "").strip()
    if not q:
        return None
    path = urllib.parse.quote(q, safe="")
    url = f"{_GEOCODE_BASE}/{path}.json?{urllib.parse.urlencode({'access_token': token, 'limit': 1})}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, OSError):
        return None
    feats = data.get("features") or []
    if not feats or not isinstance(feats[0], dict):
        return None
    return _feature_us_state_code(feats[0])


def driving_durations_minutes(
    origin_lat: float,
    origin_lng: float,
    dest_latlng: list[tuple[float, float]],
    token: str,
    *,
    timeout: float = 15.0,
) -> list[float | None]:
    """
    One origin → many destinations. Returns minutes (driving), None when unavailable.
    Mapbox returns durations in seconds (matrix row 0 -> each dest).
    """
    if not dest_latlng:
        return []
    coords: list[str] = [f"{origin_lng},{origin_lat}"]
    for dlat, dlng in dest_latlng:
        coords.append(f"{dlng},{dlat}")
    coord_path = ";".join(coords)
    n = len(coords) - 1
    dest_idx = ";".join(str(i) for i in range(1, len(coords)))
    qs = urllib.parse.urlencode(
        {
            "access_token": token,
            "sources": "0",
            "destinations": dest_idx,
            "annotations": "duration",
        }
    )
    url = f"{_MATRIX_BASE}/{coord_path}?{qs}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, OSError, ValueError):
        return [None] * len(dest_latlng)

    durations = data.get("durations")
    if not isinstance(durations, list) or not durations:
        return [None] * len(dest_latlng)
    row0 = durations[0] if isinstance(durations[0], list) else None
    if not isinstance(row0, list) or len(row0) < len(dest_latlng) + 1:
        return [None] * len(dest_latlng)
    # row0[0] is origin->origin; row0[1:] are origin->dest
    out: list[float | None] = []
    for i in range(len(dest_latlng)):
        cell = row0[i + 1] if i + 1 < len(row0) else None
        if cell is None:
            out.append(None)
        else:
            try:
                out.append(round(float(cell) / 60.0, 1))
            except (TypeError, ValueError):
                out.append(None)
    return out


def _haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance on a spherical Earth model (meters)."""
    r = 6371000.0
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlng / 2) ** 2
    c = 2 * math.asin(min(1.0, math.sqrt(max(0.0, a))))
    return r * c


def search_category_nearby(
    lat: float,
    lng: float,
    canonical_category_id: str,
    token: str,
    *,
    limit: int = 5,
    language: str = "en",
    timeout: float = 12.0,
) -> list[dict[str, Any]]:
    """
    POIs near a point via Search Box category search (not Geocoding forward).
    canonical_category_id must be a Mapbox Search Box category id (e.g. supermarket, pharmacy).
    """
    cid = (canonical_category_id or "").strip()
    if not cid:
        return []
    cap = max(1, min(int(limit), 25))
    # Do not pass types=poi: on /category it filters to zero features (Mapbox still returns POIs).
    qs = urllib.parse.urlencode(
        {
            "access_token": token,
            "proximity": f"{lng},{lat}",
            "limit": str(cap),
            "language": (language or "en").strip() or "en",
        }
    )
    path = urllib.parse.quote(cid, safe="")
    url = f"{_SEARCH_BOX_BASE}/category/{path}?{qs}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, OSError, ValueError):
        return []
    feats = data.get("features") or []
    out: list[dict[str, Any]] = []
    for f in feats[:cap]:
        if not isinstance(f, dict):
            continue
        props = f.get("properties") if isinstance(f.get("properties"), dict) else {}
        geom = f.get("geometry") if isinstance(f.get("geometry"), dict) else {}
        coords = geom.get("coordinates")
        flng = flat = None
        if isinstance(coords, list) and len(coords) >= 2:
            try:
                flng, flat = float(coords[0]), float(coords[1])
            except (TypeError, ValueError):
                flng = flat = None
        if flng is None and isinstance(props.get("coordinates"), dict):
            c = props["coordinates"]
            try:
                flat = float(c.get("latitude")) if c.get("latitude") is not None else None
                flng = float(c.get("longitude")) if c.get("longitude") is not None else None
            except (TypeError, ValueError):
                flng = flat = None
        if flng is None or flat is None or not (math.isfinite(flng) and math.isfinite(flat)):
            continue
        name = props.get("name_preferred") or props.get("name")
        place = props.get("full_address") or props.get("place_formatted")
        dist_m: float | None = None
        raw_dist = props.get("distance")
        if isinstance(raw_dist, (int, float)) and math.isfinite(float(raw_dist)) and float(raw_dist) >= 0:
            dist_m = float(raw_dist)
        else:
            dist_m = _haversine_meters(lat, lng, flat, flng)
        out.append(
            {
                "name": name if isinstance(name, str) else None,
                "place_name": place if isinstance(place, str) else None,
                "longitude": flng,
                "latitude": flat,
                "distance_meters": round(dist_m, 1) if dist_m is not None else None,
            }
        )
    return out
