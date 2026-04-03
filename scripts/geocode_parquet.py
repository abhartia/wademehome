#!/usr/bin/env python3
"""
Batch-geocode a units.parquet file that has addresses but missing lat/lng.

Uses the US Census Bureau Geocoder (free, no API key, no rate limit for batch).
Falls back to single-address mode via their REST API.

Usage:
  ./api/.venv/bin/python scripts/geocode_parquet.py \
    --parquet appfolio_scraper/env=local/.../units.parquet \
    --output appfolio_scraper/env=local/.../units_geocoded.parquet \
    --filter-states NY,NJ,CT

The output parquet can then be loaded with load_listings_from_parquet.py.
"""
from __future__ import annotations

import argparse
import io
import os
import sys
import time
from pathlib import Path

import pandas as pd
import requests

CENSUS_BATCH_URL = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch"
CENSUS_SINGLE_URL = "https://geocoding.geo.census.gov/geocoder/locations/address"
BATCH_SIZE = 1000  # Census API max batch size


def log(msg: str) -> None:
    print(msg, flush=True)


def geocode_batch_census(df: pd.DataFrame) -> pd.DataFrame:
    """
    Geocode a DataFrame using the Census Bureau batch geocoder.
    Expects columns: address, city, state, zipcode
    Returns the DataFrame with latitude/longitude filled in where possible.
    """
    needs_geocoding = df["latitude"].isna() | df["longitude"].isna()
    has_address = df["address"].notna() & (df["address"].str.strip() != "")
    to_geocode = df[needs_geocoding & has_address].copy()

    if to_geocode.empty:
        log("No rows need geocoding.")
        return df

    log(f"Geocoding {len(to_geocode)} rows via Census Bureau batch API...")

    total_matched = 0
    for batch_start in range(0, len(to_geocode), BATCH_SIZE):
        batch = to_geocode.iloc[batch_start:batch_start + BATCH_SIZE]
        log(f"  Batch {batch_start // BATCH_SIZE + 1}: {len(batch)} addresses...")

        # Build CSV for Census batch API
        # Format: Unique ID, Street address, City, State, ZIP
        csv_lines = []
        idx_map = {}
        for i, (idx, row) in enumerate(batch.iterrows()):
            uid = str(i)
            idx_map[uid] = idx
            addr = str(row.get("address", "") or "").strip()
            city = str(row.get("city", "") or "").strip()
            state = str(row.get("state", "") or "").strip()
            zipcode = str(row.get("zipcode", "") or "").strip()
            csv_lines.append(f"{uid},{addr},{city},{state},{zipcode}")

        csv_content = "\n".join(csv_lines)

        try:
            resp = requests.post(
                CENSUS_BATCH_URL,
                data={"benchmark": "Public_AR_Current", "vintage": "Current_Current"},
                files={"addressFile": ("addresses.csv", csv_content, "text/csv")},
                timeout=120,
            )
            resp.raise_for_status()

            # Parse response CSV
            # Format: ID, Input Address, Match, Match Type, Matched Address, Coordinates, TIGER ID, Side
            for line in resp.text.strip().split("\n"):
                if not line.strip():
                    continue
                parts = line.split('","')
                parts = [p.strip('"') for p in parts]
                if len(parts) < 6:
                    continue
                uid = parts[0].strip('"')
                match_flag = parts[2].strip() if len(parts) > 2 else ""
                coords = parts[5].strip() if len(parts) > 5 else ""

                if match_flag.lower() in ("match", "exact") and "," in coords:
                    lon_str, lat_str = coords.split(",", 1)
                    try:
                        lon = float(lon_str.strip())
                        lat = float(lat_str.strip())
                        if uid in idx_map:
                            orig_idx = idx_map[uid]
                            df.at[orig_idx, "latitude"] = lat
                            df.at[orig_idx, "longitude"] = lon
                            total_matched += 1
                    except ValueError:
                        pass

        except Exception as exc:
            log(f"  Batch geocoding failed: {exc}")
            log("  Falling back to single-address mode for this batch...")
            matched = _geocode_singles(batch, df, idx_map)
            total_matched += matched

        time.sleep(1)  # Be nice to the Census API

    log(f"Geocoded {total_matched}/{len(to_geocode)} addresses successfully.")
    return df


def _geocode_singles(batch: pd.DataFrame, df: pd.DataFrame, idx_map: dict) -> int:
    """Fallback: geocode one address at a time via Census REST API."""
    matched = 0
    for i, (idx, row) in enumerate(batch.iterrows()):
        addr = str(row.get("address", "") or "").strip()
        city = str(row.get("city", "") or "").strip()
        state = str(row.get("state", "") or "").strip()
        zipcode = str(row.get("zipcode", "") or "").strip()

        if not addr:
            continue

        try:
            resp = requests.get(
                CENSUS_SINGLE_URL,
                params={
                    "street": addr,
                    "city": city,
                    "state": state,
                    "zip": zipcode,
                    "benchmark": "Public_AR_Current",
                    "format": "json",
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()

            matches = (data.get("result", {}).get("addressMatches") or [])
            if matches:
                coords = matches[0].get("coordinates", {})
                lat = coords.get("y")
                lon = coords.get("x")
                if lat is not None and lon is not None:
                    df.at[idx, "latitude"] = float(lat)
                    df.at[idx, "longitude"] = float(lon)
                    matched += 1

        except Exception:
            pass

        if i > 0 and i % 50 == 0:
            time.sleep(0.5)

    return matched


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--parquet", required=True, help="Input parquet file")
    parser.add_argument("--output", default=None, help="Output parquet (default: overwrites input)")
    parser.add_argument("--filter-states", default=None,
                        help="Comma-separated state codes to keep (e.g., NY,NJ,CT)")
    parser.add_argument("--dry-run", action="store_true", help="Show stats without writing")
    args = parser.parse_args()

    parquet_path = Path(args.parquet)
    if not parquet_path.exists():
        log(f"ERROR: {parquet_path} not found")
        return 1

    df = pd.read_parquet(parquet_path)
    log(f"Loaded {len(df)} rows from {parquet_path}")

    # Ensure lat/lng columns exist
    if "latitude" not in df.columns:
        df["latitude"] = None
    if "longitude" not in df.columns:
        df["longitude"] = None

    # Filter by state if requested
    if args.filter_states:
        states = {s.strip().upper() for s in args.filter_states.split(",")}
        if "state" in df.columns:
            before = len(df)
            df = df[df["state"].str.upper().isin(states)].copy()
            log(f"Filtered to states {states}: {before} → {len(df)} rows")
        else:
            log("WARNING: no 'state' column, skipping state filter")

    if df.empty:
        log("No rows to process.")
        return 0

    needs = (df["latitude"].isna() | df["longitude"].isna()).sum()
    has = len(df) - needs
    log(f"Rows with lat/lng: {has}, need geocoding: {needs}")

    if needs == 0:
        log("All rows already geocoded.")
        if args.output and args.output != args.parquet:
            df.to_parquet(args.output, index=False, engine="pyarrow")
            log(f"Copied to {args.output}")
        return 0

    if args.dry_run:
        log("Dry run: would geocode %d rows. Exiting." % needs)
        return 0

    df = geocode_batch_census(df)

    # Report results
    still_missing = (df["latitude"].isna() | df["longitude"].isna()).sum()
    log(f"After geocoding: {len(df) - still_missing} with coordinates, {still_missing} still missing")

    # Drop rows still missing lat/lng (can't load into DB without them)
    if still_missing > 0:
        before = len(df)
        df = df[df["latitude"].notna() & df["longitude"].notna()].copy()
        log(f"Dropped {before - len(df)} rows without coordinates. {len(df)} remaining.")

    output_path = args.output or str(parquet_path)
    df.to_parquet(output_path, index=False, engine="pyarrow")
    log(f"Wrote {len(df)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
