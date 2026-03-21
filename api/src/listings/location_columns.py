"""
Resolve city / state / ZIP column names on the dynamic listings table.

Aliases match listings_inventory_schema.json and nearby_mapper._address_from_row.
"""

from __future__ import annotations

# Order = preferred canonical name first (matches Greystar units.parquet).
ZIP_COLUMN_KEYS = ("zipcode", "zip", "postal_code")
CITY_COLUMN_KEYS = ("city", "locality")
STATE_COLUMN_KEYS = ("state", "state_code", "region")


def first_column_present(cols_lower: set[str], candidates: tuple[str, ...]) -> str | None:
    for key in candidates:
        if key in cols_lower:
            return key
    return None


def resolve_zip_column(cols_lower: set[str]) -> str | None:
    return first_column_present(cols_lower, ZIP_COLUMN_KEYS)


def resolve_city_column(cols_lower: set[str]) -> str | None:
    return first_column_present(cols_lower, CITY_COLUMN_KEYS)


def resolve_state_column(cols_lower: set[str]) -> str | None:
    return first_column_present(cols_lower, STATE_COLUMN_KEYS)


def quote_ident(name: str) -> str:
    """Double-quote a known-safe lowercase identifier from information_schema."""
    return f'"{name}"'
