"""One-shot: ensure the 6 Hudson Yards / West Chelsea towers exist in the
``buildings`` table so the SEO landing pages at ``/buildings/<slug>`` can
fetch live review aggregates, listings, and compliance data via the public
GET /buildings/{id} endpoint.

Idempotent — uses ``resolve_or_create_building`` which dedupes by (bbl, bin)
or normalized address. Safe to re-run.

Run from repo root with the same env that the API uses, e.g.::

    cd api && uv run python scripts/bootstrap_hudson_yards_buildings.py

Prints a TS object literal at the end that should be pasted into
``ui/lib/buildings/hudsonYardsTowers.ts`` as the ``buildingId`` for each
tower.
"""

from __future__ import annotations

import json
import sys
from decimal import Decimal
from pathlib import Path

# Make ``api/src`` importable when run from ``api/`` or repo root.
HERE = Path(__file__).resolve()
SRC = HERE.parent.parent / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from buildings.schemas import BuildingResolveRequest  # noqa: E402
from buildings.service import resolve_or_create_building  # noqa: E402
from db.session import get_session_local  # noqa: E402


# Manhattan = borough code 1 per NYC PLUTO convention.
MANHATTAN = 1

TOWERS: list[dict[str, object]] = [
    {
        "slug": "lantern-house",
        "street_line1": "515 W 18th St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10011",
        "latitude": Decimal("40.7449"),
        "longitude": Decimal("-74.0067"),
        "borough": MANHATTAN,
        "unit_count": 181,
    },
    {
        "slug": "555ten",
        "street_line1": "555 W 38th St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10018",
        "latitude": Decimal("40.7589"),
        "longitude": Decimal("-74.0011"),
        "borough": MANHATTAN,
        "unit_count": 598,
    },
    {
        "slug": "the-eugene",
        "street_line1": "435 W 31st St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "latitude": Decimal("40.7530"),
        "longitude": Decimal("-74.0017"),
        "borough": MANHATTAN,
        "unit_count": 844,
    },
    {
        "slug": "35-hudson-yards",
        "street_line1": "535 W 33rd St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "latitude": Decimal("40.7544"),
        "longitude": Decimal("-74.0010"),
        "borough": MANHATTAN,
        "unit_count": 143,
    },
    {
        "slug": "one-manhattan-west",
        "street_line1": "401 9th Ave",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "latitude": Decimal("40.7552"),
        "longitude": Decimal("-73.9988"),
        "borough": MANHATTAN,
        "unit_count": 0,  # office tower — no residential units
    },
    {
        "slug": "the-henry",
        "street_line1": "515 W 38th St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10018",
        "latitude": Decimal("40.7585"),
        "longitude": Decimal("-74.0006"),
        "borough": MANHATTAN,
        "unit_count": 232,
    },
]


def main() -> int:
    session_factory = get_session_local()
    results: list[dict[str, object]] = []

    with session_factory() as db:
        for tower in TOWERS:
            payload = BuildingResolveRequest(
                street_line1=str(tower["street_line1"]),
                city=str(tower["city"]),
                state=str(tower["state"]),
                postal_code=str(tower["postal_code"]),
                latitude=tower["latitude"],  # type: ignore[arg-type]
                longitude=tower["longitude"],  # type: ignore[arg-type]
            )
            building, is_new = resolve_or_create_building(db, payload)

            # Backfill optional fields (borough, unit_count) on first creation
            # only — never overwrite values an admin may have curated later.
            mutated = False
            if is_new:
                if building.borough is None and tower.get("borough") is not None:
                    building.borough = int(tower["borough"])  # type: ignore[arg-type]
                    mutated = True
                uc = tower.get("unit_count")
                if building.unit_count is None and uc is not None:
                    building.unit_count = int(uc)  # type: ignore[arg-type]
                    mutated = True
                if mutated:
                    db.add(building)
                    db.commit()
                    db.refresh(building)

            results.append(
                {
                    "slug": tower["slug"],
                    "id": str(building.id),
                    "street_line1": building.street_line1,
                    "postal_code": building.postal_code,
                    "is_new": is_new,
                    "borough": building.borough,
                    "unit_count": building.unit_count,
                }
            )
            print(
                f"  {'NEW ' if is_new else 'OK  '}{tower['slug']:>22}  {building.id}  "
                f"({building.street_line1}, {building.postal_code})"
            )

    print()
    print("// Paste into ui/lib/buildings/hudsonYardsTowers.ts as `buildingId`:")
    print(json.dumps({r["slug"]: r["id"] for r in results}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
