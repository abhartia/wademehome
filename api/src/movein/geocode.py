"""Resolve move-in addresses to a US state (ISO 3166-2 code) via Mapbox."""

from __future__ import annotations

from core.config import Config
from listings.mapbox_client import forward_geocode_us_state

__all__ = ["resolve_target_state_from_address"]


def resolve_target_state_from_address(address: str) -> str | None:
    """Return two-letter US state code or None when unset, non-US, or geocoding fails."""
    q = (address or "").strip()
    if not q:
        return None
    token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not token:
        return None
    return forward_geocode_us_state(q, token)
