"""Generalized bootstrap: ensure named-tower rows exist in the ``buildings``
table for every regional registry that drives the ``/buildings/<slug>`` SEO
landing pages.

Currently bootstraps three regions:
  - Hudson Yards / West Chelsea (Manhattan, NY)  — 6 towers
  - Newport (Jersey City, NJ)                    — 6 towers
  - Hoboken waterfront (Hoboken / Port Imperial, NJ) — 7 towers

Idempotent — uses ``resolve_or_create_building`` which dedupes by (bbl, bin)
or normalized address. Safe to re-run.

Run from repo root with the same env that the API uses, e.g.::

    cd api && uv run python scripts/bootstrap_named_towers.py

Prints TS object literals at the end mapping slug → UUID for each registry.
Paste each into the corresponding ``ui/lib/buildings/<region>Towers.ts`` as
the ``buildingId`` for each tower record.

Replaces the older ``bootstrap_hudson_yards_buildings.py`` (still safe to
re-run if needed; both scripts target the same dedupe keys so concurrent
or repeated runs converge on identical state).
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


# NYC PLUTO borough codes. Manhattan = 1, Brooklyn = 3, Queens = 4.
# NJ has no borough.
MANHATTAN = 1
BROOKLYN = 3
QUEENS = 4


# Hudson Yards / West Chelsea — replicated from
# ``bootstrap_hudson_yards_buildings.py`` so a single run of this script
# bootstraps everything. The dedupe step in ``resolve_or_create_building``
# means re-running is a no-op for already-present towers.
HUDSON_YARDS: list[dict[str, object]] = [
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


# Newport, Jersey City, NJ — LeFrak waterfront portfolio + Roseland Portofino
# + Crystal Point. Borough = None (NJ buildings have no PLUTO borough code).
NEWPORT: list[dict[str, object]] = [
    {
        "slug": "newport-tower",
        "street_line1": "525 Washington Blvd",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07310",
        "latitude": Decimal("40.7256"),
        "longitude": Decimal("-74.0335"),
        "borough": None,
        "unit_count": 480,
    },
    {
        "slug": "70-greene",
        "street_line1": "70 Greene St",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07302",
        "latitude": Decimal("40.7193"),
        "longitude": Decimal("-74.0345"),
        "borough": None,
        "unit_count": 480,
    },
    {
        "slug": "portofino",
        "street_line1": "1 2nd St",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07302",
        "latitude": Decimal("40.7235"),
        "longitude": Decimal("-74.0359"),
        "borough": None,
        "unit_count": 264,
    },
    {
        "slug": "james-monroe",
        "street_line1": "119 Christopher Columbus Dr",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07302",
        "latitude": Decimal("40.7202"),
        "longitude": Decimal("-74.0364"),
        "borough": None,
        "unit_count": 286,
    },
    {
        "slug": "crystal-point",
        "street_line1": "2 2nd St",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07302",
        "latitude": Decimal("40.7237"),
        "longitude": Decimal("-74.0361"),
        "borough": None,
        "unit_count": 269,
    },
    {
        "slug": "aquablu",
        "street_line1": "155 Bay St",
        "city": "Jersey City",
        "state": "NJ",
        "postal_code": "07302",
        "latitude": Decimal("40.7172"),
        "longitude": Decimal("-74.0345"),
        "borough": None,
        "unit_count": 421,
    },
]


# Hoboken / Port Imperial waterfront, NJ. Note: Nine on the Hudson is
# administratively in West New York, NJ but is part of the Hoboken/Port
# Imperial waterfront cluster for tenant-search intent.
HOBOKEN: list[dict[str, object]] = [
    {
        "slug": "maxwell-place",
        "street_line1": "1125 Maxwell Ln",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7544"),
        "longitude": Decimal("-74.0247"),
        "borough": None,
        "unit_count": 832,
    },
    {
        "slug": "hudson-tea",
        "street_line1": "1500 Hudson St",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7556"),
        "longitude": Decimal("-74.0259"),
        "borough": None,
        "unit_count": 524,
    },
    {
        "slug": "1100-maxwell",
        "street_line1": "1100 Maxwell Ln",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7541"),
        "longitude": Decimal("-74.0250"),
        "borough": None,
        "unit_count": 387,
    },
    {
        "slug": "1300-adams",
        "street_line1": "1300 Adams St",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7445"),
        "longitude": Decimal("-74.0316"),
        "borough": None,
        "unit_count": 102,
    },
    {
        "slug": "the-vine",
        "street_line1": "900 Monroe St",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7470"),
        "longitude": Decimal("-74.0345"),
        "borough": None,
        "unit_count": 135,
    },
    {
        "slug": "w-residences-hoboken",
        "street_line1": "225 River St",
        "city": "Hoboken",
        "state": "NJ",
        "postal_code": "07030",
        "latitude": Decimal("40.7374"),
        "longitude": Decimal("-74.0291"),
        "borough": None,
        "unit_count": 40,
    },
    {
        "slug": "nine-on-the-hudson",
        "street_line1": "9 Avenue at Port Imperial",
        "city": "West New York",
        "state": "NJ",
        "postal_code": "07093",
        "latitude": Decimal("40.7717"),
        "longitude": Decimal("-74.0146"),
        "borough": None,
        "unit_count": 278,
    },
]


# Williamsburg waterfront, Brooklyn, NY. Domino Park master-plan (Two Trees:
# One Domino Square, 325 Kent, 260 Kent), North Williamsburg luxury wave
# (The William Vale, The Edge, Northside Piers), and the signature pre-war
# factory conversion (184 Kent / Austin, Nichols & Co. warehouse).
WILLIAMSBURG: list[dict[str, object]] = [
    {
        "slug": "one-domino-square",
        "street_line1": "8 Domino Sq",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11211",
        "latitude": Decimal("40.7136"),
        "longitude": Decimal("-73.9683"),
        "borough": BROOKLYN,
        "unit_count": 374,
    },
    {
        "slug": "325-kent",
        "street_line1": "325 Kent Ave",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7142"),
        "longitude": Decimal("-73.9678"),
        "borough": BROOKLYN,
        "unit_count": 522,
    },
    {
        "slug": "260-kent",
        "street_line1": "260 Kent Ave",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7152"),
        "longitude": Decimal("-73.9659"),
        "borough": BROOKLYN,
        "unit_count": 250,
    },
    {
        "slug": "the-william-vale",
        "street_line1": "111 N 12th St",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7220"),
        "longitude": Decimal("-73.9605"),
        "borough": BROOKLYN,
        "unit_count": 60,
    },
    {
        "slug": "184-kent",
        "street_line1": "184 Kent Ave",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7180"),
        "longitude": Decimal("-73.9617"),
        "borough": BROOKLYN,
        "unit_count": 338,
    },
    {
        "slug": "the-edge",
        "street_line1": "22 N 6th St",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7193"),
        "longitude": Decimal("-73.9648"),
        "borough": BROOKLYN,
        "unit_count": 565,
    },
    {
        "slug": "northside-piers",
        "street_line1": "1 N 4th Pl",
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11249",
        "latitude": Decimal("40.7172"),
        "longitude": Decimal("-73.9637"),
        "borough": BROOKLYN,
        "unit_count": 449,
    },
]


# Long Island City named towers, Queens, NY. Court Square + Queens Plaza
# + Hunters Point luxury rental + condo stock referenced (or implied) by the
# content agent's `/nyc/long-island-city` hub page. Jackson Park is modeled
# as a single row at the canonical Tower 1 address (28-10 Jackson Ave); the
# 3-tower complex is described in body text. The Hayden is a separate
# Tishman Speyer building four blocks east at 43-25 Hunter St.
LIC: list[dict[str, object]] = [
    {
        "slug": "skyline-tower",
        "street_line1": "23-15 44th Dr",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7475"),
        "longitude": Decimal("-73.9462"),
        "borough": QUEENS,
        "unit_count": 802,
    },
    {
        "slug": "sven",
        "street_line1": "29-59 Northern Blvd",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7508"),
        "longitude": Decimal("-73.9408"),
        "borough": QUEENS,
        "unit_count": 958,
    },
    {
        "slug": "jackson-park",
        "street_line1": "28-10 Jackson Ave",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7472"),
        "longitude": Decimal("-73.9446"),
        "borough": QUEENS,
        "unit_count": 1871,
    },
    {
        "slug": "the-hayden",
        "street_line1": "43-25 Hunter St",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7456"),
        "longitude": Decimal("-73.9532"),
        "borough": QUEENS,
        "unit_count": 974,
    },
    {
        "slug": "linc-lic",
        "street_line1": "43-10 Crescent St",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7497"),
        "longitude": Decimal("-73.9436"),
        "borough": QUEENS,
        "unit_count": 709,
    },
    {
        "slug": "eagle-lofts",
        "street_line1": "43-22 Queens St",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7491"),
        "longitude": Decimal("-73.9442"),
        "borough": QUEENS,
        "unit_count": 790,
    },
    {
        "slug": "alta-lic",
        "street_line1": "29-22 Northern Blvd",
        "city": "Long Island City",
        "state": "NY",
        "postal_code": "11101",
        "latitude": Decimal("40.7546"),
        "longitude": Decimal("-73.9329"),
        "borough": QUEENS,
        "unit_count": 467,
    },
]


# Astoria, Queens, NY. Halletts Point waterfront master plan (Durst), the
# Astoria West tower (Cape Advisors), and the Astoria Lights mid-rise
# rental community (Heatherwood). Multi-tower complexes (Hallets Point,
# Astoria Lights) modeled as one row at the canonical Phase 1 / building 1
# address per S6/S8 multi-tower precedent.
ASTORIA: list[dict[str, object]] = [
    {
        "slug": "hallets-point",
        "street_line1": "10 Halletts Point",
        "city": "Astoria",
        "state": "NY",
        "postal_code": "11102",
        "latitude": Decimal("40.7798"),
        "longitude": Decimal("-73.9293"),
        "borough": QUEENS,
        "unit_count": 405,
    },
    {
        "slug": "astoria-west",
        "street_line1": "30-77 Vernon Blvd",
        "city": "Astoria",
        "state": "NY",
        "postal_code": "11102",
        "latitude": Decimal("40.7689"),
        "longitude": Decimal("-73.9356"),
        "borough": QUEENS,
        "unit_count": 244,
    },
    {
        "slug": "astoria-lights",
        "street_line1": "30-21 12th St",
        "city": "Astoria",
        "state": "NY",
        "postal_code": "11102",
        "latitude": Decimal("40.7789"),
        "longitude": Decimal("-73.9377"),
        "borough": QUEENS,
        "unit_count": 480,
    },
]


REGISTRIES: dict[str, list[dict[str, object]]] = {
    "Hudson Yards / West Chelsea (NYC)": HUDSON_YARDS,
    "Newport (Jersey City, NJ)": NEWPORT,
    "Hoboken / Port Imperial waterfront (NJ)": HOBOKEN,
    "Williamsburg waterfront (Brooklyn, NY)": WILLIAMSBURG,
    "Long Island City (Queens, NY)": LIC,
    "Astoria (Queens, NY)": ASTORIA,
}


REGISTRY_DEST_FILE: dict[str, str] = {
    "Hudson Yards / West Chelsea (NYC)": "ui/lib/buildings/hudsonYardsTowers.ts",
    "Newport (Jersey City, NJ)": "ui/lib/buildings/newportTowers.ts",
    "Hoboken / Port Imperial waterfront (NJ)": "ui/lib/buildings/hobokenTowers.ts",
    "Williamsburg waterfront (Brooklyn, NY)": "ui/lib/buildings/williamsburgTowers.ts",
    "Long Island City (Queens, NY)": "ui/lib/buildings/licTowers.ts",
    "Astoria (Queens, NY)": "ui/lib/buildings/astoriaTowers.ts",
}


def bootstrap_one(
    db, label: str, registry: list[dict[str, object]]
) -> dict[str, str]:
    """Run resolve-or-create for every entry in `registry`. Backfill borough
    + unit_count on first creation. Return a slug -> uuid dict for the
    final TS-object dump."""
    print(f"\n=== {label} ({len(registry)} towers) ===")
    out: dict[str, str] = {}
    for tower in registry:
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
            if (
                building.borough is None
                and tower.get("borough") is not None
            ):
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

        out[str(tower["slug"])] = str(building.id)
        print(
            f"  {'NEW ' if is_new else 'OK  '}{str(tower['slug']):>22}  "
            f"{building.id}  ({building.street_line1}, {building.postal_code})"
        )
    return out


def main() -> int:
    session_factory = get_session_local()
    all_results: dict[str, dict[str, str]] = {}

    with session_factory() as db:
        for label, registry in REGISTRIES.items():
            all_results[label] = bootstrap_one(db, label, registry)

    print("\n")
    for label, slug_to_uuid in all_results.items():
        dest = REGISTRY_DEST_FILE[label]
        print(f"// {label}")
        print(f"// Paste each UUID into {dest} as `buildingId` for the matching slug:")
        print(json.dumps(slug_to_uuid, indent=2))
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
