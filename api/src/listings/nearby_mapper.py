"""
Map dynamic listings table rows (from units.parquet → Postgres) to PropertyDataItem.

Column names vary by pipeline; we try common aliases used in rental inventory exports.
Canonical Greystar-style names are documented in listings_inventory_schema.json.
"""

from __future__ import annotations

import json
import re
from collections.abc import Mapping
from decimal import Decimal
from typing import Any

from workflow.events import PropertyDataItem, PropertyDataList


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


# Lines that often carry move-in / promo language after amenities were normalized to tokens.
_CONCESSION_AMENITY_LINE = re.compile(
    r"(?i)(month|week|weeks|mos|mo)s?.{0,8}free"
    r"|free.{0,8}(month|rent)"
    r"|concession|special.{0,12}offer|move-?in|look.{0,6}lease"
    r"|waived|no.{0,4}deposit|\$\s*[\d,]+"
)


def _infer_concessions_from_amenity_lines(lines: list[str]) -> str | None:
    hits: list[str] = []
    for line in lines:
        t = line.strip()
        if not t:
            continue
        if _CONCESSION_AMENITY_LINE.search(t):
            hits.append(t)
    if not hits:
        return None
    out: list[str] = []
    seen: set[str] = set()
    for h in hits:
        k = h.casefold()
        if k not in seen:
            seen.add(k)
            out.append(h)
    return "; ".join(out[:10])


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


def _urls_from_greystar_images_value(raw: Any) -> list[str]:
    """Greystar `images` cell: JSON array of URL strings and/or objects with url/photoUrl/src."""
    if raw is None or raw == "":
        return []
    if isinstance(raw, list):
        arr = raw
    elif isinstance(raw, str) and raw.strip():
        s = raw.strip()
        if not s.startswith("["):
            return []
        try:
            data = json.loads(s)
        except json.JSONDecodeError:
            return []
        if not isinstance(data, list):
            return []
        arr = data
    else:
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in arr:
        url: str | None = None
        if isinstance(item, str):
            t = item.strip()
            if t.startswith("http"):
                url = t
        elif isinstance(item, dict):
            for key in ("url", "photoUrl", "src", "imageUrl", "image_url"):
                v = item.get(key)
                if isinstance(v, str) and v.strip().startswith("http"):
                    url = v.strip()
                    break
        if url and url not in seen:
            seen.add(url)
            out.append(url)
    return out


def _images_from_row(row: Mapping[str, Any]) -> list[str]:
    # 1) Denormalized column from loader / ETL
    raw_list = _get_ci(row, "images_urls", "image_urls")
    if isinstance(raw_list, list):
        out = [str(x).strip() for x in raw_list if str(x).strip()]
        if out:
            return out
    if isinstance(raw_list, str) and raw_list.strip():
        s = raw_list.strip()
        if s.startswith("["):
            try:
                data = json.loads(s)
                if isinstance(data, list):
                    out = [str(x).strip() for x in data if str(x).strip()]
                    if out:
                        return out
            except json.JSONDecodeError:
                pass

    # 2) Greystar `images` JSON (often richer than image_url alone)
    raw_im = _get_ci(row, "images")
    from_images = _urls_from_greystar_images_value(raw_im)
    if from_images:
        return from_images

    # 3) Legacy `photos` column (list or JSON string)
    raw_photos = _get_ci(row, "photos")
    if isinstance(raw_photos, list):
        out = [str(x).strip() for x in raw_photos if str(x).strip()]
        if out:
            return out
    if isinstance(raw_photos, str) and raw_photos.strip():
        ps = raw_photos.strip()
        if ps.startswith("["):
            try:
                data = json.loads(ps)
                if isinstance(data, list):
                    out = [str(x).strip() for x in data if str(x).strip()]
                    if out:
                        return out
            except json.JSONDecodeError:
                pass
        if ps.startswith("http"):
            return [ps]

    # 4) Single thumbnail / primary URL
    url = _get_ci(row, "image_url", "primary_image_url", "photo_url", "thumbnail_url")
    if isinstance(url, str) and url.strip():
        return [url.strip()]

    return []


def mapping_from_raw_sql_row(
    row: Any,
    col_keys: list[str] | None,
) -> dict[str, Any] | None:
    """Turn a SQLAlchemy-style row + column names into a dict for `row_to_property_data_item`."""
    if isinstance(row, Mapping):
        return dict(row)
    if col_keys and isinstance(row, (list, tuple)):
        out: dict[str, Any] = {}
        for i, key in enumerate(col_keys):
            if i < len(row):
                out[str(key)] = row[i]
        return out
    return None


def property_list_from_sql_rows(
    rows: list[Any] | None,
    col_keys: list[str] | None,
) -> PropertyDataList:
    """Build PropertyDataList from raw SQL `result` + `col_keys` (LlamaIndex SQLRetriever metadata)."""
    if not rows:
        return PropertyDataList(properties=[])
    out: list[PropertyDataItem] = []
    for row in rows:
        m = mapping_from_raw_sql_row(row, col_keys)
        if not m:
            continue
        try:
            out.append(row_to_property_data_item(m))
        except Exception:
            continue
    return PropertyDataList(properties=out)


def row_to_property_data_item(row: Mapping[str, Any]) -> PropertyDataItem:
    """Build a PropertyDataItem from a listings table row (dict-like)."""
    amenities = _amenities_merged(row)
    main = amenities[:4] if amenities else []

    lat = _to_float(_get_ci(row, "latitude", "lat"))
    lng = _to_float(_get_ci(row, "longitude", "lng", "lon"))

    listing_url_raw = _get_ci(
        row,
        "listing_url",
        "listingUrl",
        "source_url",
        "sourceUrl",
        "url",
    )
    listing_url = (
        listing_url_raw if isinstance(listing_url_raw, str) and listing_url_raw.strip().startswith("http") else None
    )

    city_v = _get_ci(row, "city", "locality")
    state_v = _get_ci(row, "state", "state_code", "region")
    zip_v = _get_ci(row, "zipcode", "zip", "postal_code")
    city_s = city_v.strip() if isinstance(city_v, str) and city_v.strip() else None
    state_s = state_v.strip() if isinstance(state_v, str) and state_v.strip() else None
    zip_s = zip_v.strip() if isinstance(zip_v, str) and zip_v.strip() else None

    conc_raw = _get_ci(
        row,
        "concessions",
        "concession",
        "specials",
        "move_in_special",
        "special_offer",
        "special_offers",
        "leasing_special",
        "leasing_specials",
        "rent_special",
        "promotion",
        "promotions",
        "incentive",
        "incentives",
        "offer_text",
        "lease_concession",
    )
    if isinstance(conc_raw, str) and conc_raw.strip():
        concessions = conc_raw.strip()
    elif conc_raw not in (None, ""):
        concessions = str(conc_raw).strip() or None
    else:
        concessions = None

    if not concessions:
        from_amenities = _infer_concessions_from_amenity_lines(amenities)
        if from_amenities:
            concessions = from_amenities

    avail_raw = _get_ci(
        row,
        "available_date",
        "available_on",
        "available_at",
        "date_available",
        "move_in_date",
        "earliest_move_in",
    )
    if isinstance(avail_raw, str) and avail_raw.strip():
        available_date = avail_raw.strip()
    elif avail_raw not in (None, ""):
        available_date = str(avail_raw).strip() or None
    else:
        available_date = None

    if not available_date:
        status_raw = _get_ci(
            row,
            "availability_status",
            "unit_availability",
            "availability",
        )
        if isinstance(status_raw, str) and status_raw.strip():
            s = status_raw.strip()
            if s.lower() not in ("nan", "none", "null"):
                available_date = s

    return PropertyDataItem(
        name=_name_from_row(row),
        address=_address_from_row(row),
        listing_url=listing_url,
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
        concessions=concessions,
        available_date=available_date,
    )
