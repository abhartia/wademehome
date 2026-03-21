"""
Build and parse property keys — must stay in sync with ui/lib/properties/propertyKey.ts
(slugify + name--address--lat--lng, lat/lng fixed to 4 decimals or 'na').
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass

from workflow.events import PropertyDataItem

_SLUG_RE = re.compile(r"[^a-z0-9]+")


def slugify(value: str) -> str:
    s = (value or "").lower().strip()
    s = _SLUG_RE.sub("-", s)
    return s.strip("-")


def build_property_key(
    name: str,
    address: str,
    latitude: float | None,
    longitude: float | None,
) -> str:
    n = slugify(name or "property")
    a = slugify(address or "address")
    if latitude is not None and math.isfinite(latitude):
        lat_s = f"{latitude:.4f}"
    else:
        lat_s = "na"
    if longitude is not None and math.isfinite(longitude):
        lng_s = f"{longitude:.4f}"
    else:
        lng_s = "na"
    return f"{n}--{a}--{lat_s}--{lng_s}"


def property_key_from_item(item: PropertyDataItem) -> str:
    return build_property_key(item.name, item.address, item.latitude, item.longitude)


@dataclass(frozen=True)
class ParsedPropertyKey:
    raw: str
    name_slug: str
    address_slug: str
    lat_token: str
    lng_token: str


def parse_property_key(key: str) -> ParsedPropertyKey | None:
    raw = (key or "").strip()
    if not raw:
        return None
    parts = raw.split("--")
    if len(parts) < 4:
        return None
    lat_tok, lng_tok = parts[-2], parts[-1]
    name_slug = parts[0]
    address_slug = parts[1] if len(parts) == 4 else "--".join(parts[1:-2])
    return ParsedPropertyKey(
        raw=raw,
        name_slug=name_slug,
        address_slug=address_slug,
        lat_token=lat_tok,
        lng_token=lng_tok,
    )


def item_matches_property_key(raw_key: str, item: PropertyDataItem) -> bool:
    parsed = parse_property_key(raw_key)
    if parsed is None:
        return False
    if parsed.lat_token != "na" and parsed.lng_token != "na":
        return property_key_from_item(item) == raw_key
    return slugify(item.name) == parsed.name_slug and slugify(item.address) == parsed.address_slug
