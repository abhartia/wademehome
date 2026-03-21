"""
Map dynamic listings table rows (from units.parquet → Postgres) to PropertyDataItem.

Column names vary by pipeline; we try common aliases used in rental inventory exports.
Canonical Greystar-style names are documented in listings_inventory_schema.json.
"""

from __future__ import annotations

import json
import re
from decimal import Decimal
from typing import Any, Mapping

from workflow.events import PropertyDataItem


def _get_ci(row: Mapping[str, Any], *keys: str) -> Any:
    """First non-missing value for any key, case-insensitive match on row keys."""
    row_l = {str(k).lower(): v for k, v in row.items()}
    for k in keys:
        if k.lower() in row_l:
            v = row_l[k.lower()]
            if v is not None and v != "":
                return v
    return None


def _to_float(v: Any) -> float | None:
    if v is None:
        return None
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (int, float)):
        if isinstance(v, float) and (v != v):  # NaN
            return None
        return float(v)
    try:
        return float(str(v).strip())
    except (TypeError, ValueError):
        return None


def _format_money(n: float) -> str:
    if n == int(n):
        return f"${int(n):,}"
    return f"${n:,.0f}"


def _rent_range_from_row(row: Mapping[str, Any]) -> str:
    direct = _get_ci(row, "rent_range", "rental_range", "price_range", "list_price_range")
    if isinstance(direct, str) and direct.strip():
        return direct.strip()

    min_r = _to_float(_get_ci(row, "min_rent", "min_monthly_rent", "rent_min", "price_min"))
    max_r = _to_float(_get_ci(row, "max_rent", "max_monthly_rent", "rent_max", "price_max"))
    rent = _to_float(
        _get_ci(
            row,
            "monthly_rent",
            "rent_price",
            "rent",
            "price",
            "list_price",
        )
    )

    if min_r is not None and max_r is not None:
        if abs(min_r - max_r) < 1:
            return _format_money(min_r)
        return f"{_format_money(min_r)}-{_format_money(max_r)}"
    if rent is not None:
        return _format_money(rent)
    return "Rent on request"


def _bedroom_range_from_row(row: Mapping[str, Any]) -> str:
    direct = _get_ci(row, "bedroom_range", "bedrooms_display", "beds_range")
    if isinstance(direct, str) and direct.strip():
        return direct.strip()

    beds = _get_ci(row, "bedrooms", "bedroom_count", "beds", "num_bedrooms", "n_bedrooms")
    n = _to_float(beds)
    if n is None and beds is not None:
        s = str(beds).strip()
        if s:
            return s if "br" in s.lower() or "bed" in s.lower() else f"{s} BR"
    if n is not None:
        if n == int(n):
            return f"{int(n)} BR" if int(n) != 1 else "1 BR"
        return f"{n:g} BR"
    return "Studio–multi BR"


def _parse_amenities(raw: Any) -> list[str]:
    if raw is None or raw == "":
        return []
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    if isinstance(raw, str):
        s = raw.strip()
        if not s:
            return []
        if s.startswith("[") or s.startswith("{"):
            try:
                data = json.loads(s)
                if isinstance(data, list):
                    return [str(x).strip() for x in data if str(x).strip()]
                if isinstance(data, dict):
                    return [str(v).strip() for v in data.values() if str(v).strip()]
            except json.JSONDecodeError:
                pass
        return [p.strip() for p in re.split(r"[,;|]", s) if p.strip()]
    return [str(raw).strip()] if str(raw).strip() else []


def _name_from_row(row: Mapping[str, Any]) -> str:
    for key in (
        "building_name",
        "property_name",
        "name",
        "title",
        "building",
        "community_name",
    ):
        v = _get_ci(row, key)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return "Listing"


def _address_from_row(row: Mapping[str, Any]) -> str:
    for key in (
        "full_address",
        "formatted_address",
        "address",
        "street_address",
        "location",
    ):
        v = _get_ci(row, key)
        if isinstance(v, str) and v.strip():
            line1 = v.strip()
            city = _get_ci(row, "city", "locality")
            state = _get_ci(row, "state", "state_code", "region")
            zipc = _get_ci(row, "zipcode", "zip", "postal_code")
            tail_parts = [p for p in (city, state, zipc) if isinstance(p, str) and p.strip()]
            if tail_parts and not any(p in line1 for p in tail_parts if len(p) > 2):
                return f"{line1}, {', '.join(tail_parts)}"
            return line1
    city = _get_ci(row, "city", "locality")
    state = _get_ci(row, "state", "state_code", "region")
    zipc = _get_ci(row, "zipcode", "zip", "postal_code")
    parts = [p for p in (city, state, zipc) if isinstance(p, str) and p.strip()]
    if parts:
        return ", ".join(parts)
    return "Address on request"


def _amenities_merged(row: Mapping[str, Any]) -> list[str]:
    """Greystar-style and generic inventory columns."""
    chunks: list[list[str]] = []
    for col in (
        "amenities",
        "amenity_list",
        "features",
        "apartment_amenities",
        "community_amenities",
        "building_amenities",
    ):
        raw = _get_ci(row, col)
        if raw is not None and raw != "":
            chunks.append(_parse_amenities(raw))
    seen: set[str] = set()
    out: list[str] = []
    for group in chunks:
        for a in group:
            k = a.casefold()
            if k not in seen:
                seen.add(k)
                out.append(a)
    return out


def _images_from_row(row: Mapping[str, Any]) -> list[str]:
    url = _get_ci(row, "image_url", "primary_image_url", "photo_url", "thumbnail_url")
    if isinstance(url, str) and url.strip():
        return [url.strip()]
    raw = _get_ci(row, "images_urls", "image_urls", "photos")
    if isinstance(raw, list):
        out = [str(x).strip() for x in raw if str(x).strip()]
        if out:
            return out
    if isinstance(raw, str) and raw.strip():
        s = raw.strip()
        if s.startswith("["):
            try:
                data = json.loads(s)
                if isinstance(data, list):
                    out = [str(x).strip() for x in data if str(x).strip()]
                    if out:
                        return out
            except json.JSONDecodeError:
                pass
        if s.startswith("http"):
            return [s]
    return []


def row_to_property_data_item(row: Mapping[str, Any]) -> PropertyDataItem:
    """Build a PropertyDataItem from a listings table row (dict-like)."""
    amenities = _amenities_merged(row)
    main = amenities[:4] if amenities else []

    lat = _to_float(_get_ci(row, "latitude", "lat"))
    lng = _to_float(_get_ci(row, "longitude", "lng", "lon"))

    city_v = _get_ci(row, "city", "locality")
    state_v = _get_ci(row, "state", "state_code", "region")
    zip_v = _get_ci(row, "zipcode", "zip", "postal_code")
    city_s = city_v.strip() if isinstance(city_v, str) and city_v.strip() else None
    state_s = state_v.strip() if isinstance(state_v, str) and state_v.strip() else None
    zip_s = zip_v.strip() if isinstance(zip_v, str) and zip_v.strip() else None

    return PropertyDataItem(
        name=_name_from_row(row),
        address=_address_from_row(row),
        city=city_s,
        state=state_s,
        zip_code=zip_s,
        latitude=lat,
        longitude=lng,
        rent_range=_rent_range_from_row(row),
        bedroom_range=_bedroom_range_from_row(row),
        images_urls=_images_from_row(row),
        main_amenities=main,
        amenities=amenities,
        match_reason=None,
    )
