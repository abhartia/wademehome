"""NYC Geosupport / GeoClient BBL lookup.

Given a building with lat/lng but no BBL/BIN, call NYC's GeoClient search API
to resolve the canonical BBL + BIN. Runs opportunistically after
`/buildings/resolve` and as a catch-up job via `run_backfill()`.

Requires `NYC_GEOCLIENT_SUBSCRIPTION_KEY` in the environment. If unset, the
job is a no-op — we log once and move on rather than break review creation.
"""

from __future__ import annotations

import os
from typing import Any

import requests
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.config import Config
from db.models import Buildings, IngestSource
from db.session import get_session_local
from ingest.runs import run_tracked

GEOCLIENT_BASE = "https://api.nyc.gov/geo/geoclient/v1/search.json"


def _subscription_key() -> str | None:
    return Config.get(
        "NYC_GEOCLIENT_SUBSCRIPTION_KEY",
        os.environ.get("NYC_GEOCLIENT_SUBSCRIPTION_KEY"),
    )


def lookup_bbl_bin(building: Buildings) -> dict[str, Any] | None:
    key = _subscription_key()
    if not key:
        return None

    query = f"{building.street_line1}, {building.city}, {building.state} {building.postal_code or ''}"
    resp = requests.get(
        GEOCLIENT_BASE,
        params={"input": query.strip()},
        headers={"Ocp-Apim-Subscription-Key": key},
        timeout=20,
    )
    if resp.status_code != 200:
        return None
    data = resp.json()
    results = data.get("results") or []
    if not results:
        return None
    first = results[0].get("response") or {}
    return {
        "bbl": first.get("bbl") or first.get("boroughBlockLot"),
        "bin": first.get("buildingIdentificationNumber"),
        "borough": first.get("boroughCode1In"),
    }


def enrich_building(db: Session, building: Buildings) -> bool:
    """Returns True if any field was filled in."""
    if building.bbl and building.bin:
        return False
    info = lookup_bbl_bin(building)
    if info is None:
        return False
    changed = False
    if info.get("bbl") and not building.bbl:
        building.bbl = str(info["bbl"]).strip()[:10]
        changed = True
    if info.get("bin") and not building.bin:
        building.bin = str(info["bin"]).strip()[:7]
        changed = True
    if info.get("borough") and building.borough is None:
        try:
            building.borough = int(info["borough"])
            changed = True
        except (TypeError, ValueError):
            pass
    if changed:
        db.commit()
    return changed


def run_backfill(batch_size: int = 200) -> int:
    db: Session = get_session_local()()
    try:

        def work(_watermark) -> int:
            rows = (
                db.execute(
                    select(Buildings).where((Buildings.bbl.is_(None)) | (Buildings.bin.is_(None))).limit(batch_size)
                )
                .scalars()
                .all()
            )
            enriched = 0
            for b in rows:
                if enrich_building(db, b):
                    enriched += 1
            return enriched

        run = run_tracked(db, IngestSource.geosupport, work)
        return run.rows_upserted
    finally:
        db.close()


if __name__ == "__main__":
    print(f"Geosupport backfill: {run_backfill()} buildings enriched.")
