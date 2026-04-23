"""US Census Bureau ACS 5-Year API client for demographic enrichment."""

from __future__ import annotations

from typing import Any

import httpx

from core.logger import get_logger

logger = get_logger(__name__)

_ACS_BASE = "https://api.census.gov/data/2022/acs/acs5"
_TIMEOUT = 10.0

# Income bracket boundaries used by table B19001 (16 brackets).
# Each tuple: (variable suffix "002"–"017", lower_bound, upper_bound).
_INCOME_BRACKETS: list[tuple[str, int, int]] = [
    ("002", 0, 9_999),
    ("003", 10_000, 14_999),
    ("004", 15_000, 19_999),
    ("005", 20_000, 24_999),
    ("006", 25_000, 29_999),
    ("007", 30_000, 34_999),
    ("008", 35_000, 39_999),
    ("009", 40_000, 44_999),
    ("010", 45_000, 49_999),
    ("011", 50_000, 59_999),
    ("012", 60_000, 74_999),
    ("013", 75_000, 99_999),
    ("014", 100_000, 124_999),
    ("015", 125_000, 149_999),
    ("016", 150_000, 199_999),
    ("017", 200_000, 300_000),  # open-ended; use 300k as upper proxy
]


class CensusDemographics:
    """Container for Census-derived demographic data for a ZIP."""

    __slots__ = (
        "affordability_ceiling",
        "affordable_pct",
        "census_median_rent",
        "median_household_income",
        "population",
        "renter_pct",
        "renter_pool_size",
        "zip_code",
    )

    def __init__(
        self,
        *,
        zip_code: str,
        median_household_income: float | None,
        population: int | None,
        renter_pct: float | None,
        census_median_rent: float | None,
        affordability_ceiling: float | None,
        affordable_pct: float | None,
        renter_pool_size: int | None,
    ):
        self.zip_code = zip_code
        self.median_household_income = median_household_income
        self.population = population
        self.renter_pct = renter_pct
        self.census_median_rent = census_median_rent
        self.affordability_ceiling = affordability_ceiling
        self.affordable_pct = affordable_pct
        self.renter_pool_size = renter_pool_size


def _safe_int(val: Any) -> int | None:
    if val is None:
        return None
    try:
        n = int(val)
        return n if n >= 0 else None
    except (TypeError, ValueError):
        return None


def _safe_float(val: Any) -> float | None:
    if val is None:
        return None
    try:
        n = float(val)
        return n if n >= 0 else None
    except (TypeError, ValueError):
        return None


def _compute_affordable_pct(
    bracket_counts: list[tuple[int, int, int]],
    area_median_rent: float,
) -> float | None:
    """What % of households can afford `area_median_rent` at the 30% rule?

    Each entry in bracket_counts is (lower_bound, upper_bound, household_count).
    A household can afford the rent if (bracket_midpoint * 0.30 / 12) >= area_median_rent.
    """
    total = sum(c for _, _, c in bracket_counts)
    if total == 0:
        return None

    annual_rent_needed = area_median_rent * 12
    income_needed = annual_rent_needed / 0.30

    can_afford = 0
    for lower, upper, count in bracket_counts:
        midpoint = (lower + upper) / 2
        if midpoint >= income_needed:
            can_afford += count

    return round(can_afford / total * 100, 1)


def fetch_census_demographics(
    zip_code: str,
    area_median_rent: float | None = None,
) -> CensusDemographics | None:
    """Fetch ACS 5-Year demographics for a US ZIP code.

    Returns None on any failure (network, parsing, missing data).
    `area_median_rent` is optional; when provided, affordable_pct is computed.
    """
    zip5 = (zip_code or "").strip()[:5]
    if len(zip5) != 5 or not zip5.isdigit():
        return None

    # Variables: median income, total occupied units, renter-occupied, population, median gross rent
    base_vars = "B19013_001E,B25003_001E,B25003_003E,B01003_001E,B25064_001E"
    # Income distribution brackets for affordability calc
    bracket_vars = ",".join(f"B19001_{b[0]}E" for b in _INCOME_BRACKETS)
    all_vars = f"{base_vars},{bracket_vars}"

    url = f"{_ACS_BASE}?get={all_vars}&for=zip%20code%20tabulation%20area:{zip5}"

    try:
        with httpx.Client(timeout=_TIMEOUT) as client:
            resp = client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        logger.warning("Census API request failed for ZIP %s", zip5)
        return None

    if not isinstance(data, list) or len(data) < 2:
        return None

    header = data[0]
    values = data[1]
    row: dict[str, Any] = {}
    for i, h in enumerate(header):
        if i < len(values):
            row[h] = values[i]

    median_income = _safe_float(row.get("B19013_001E"))
    total_occupied = _safe_int(row.get("B25003_001E"))
    renter_occupied = _safe_int(row.get("B25003_003E"))
    population = _safe_int(row.get("B01003_001E"))
    census_median_rent = _safe_float(row.get("B25064_001E"))

    renter_pct: float | None = None
    if total_occupied and renter_occupied is not None:
        renter_pct = round(renter_occupied / total_occupied * 100, 1)

    affordability_ceiling: float | None = None
    if median_income is not None and median_income > 0:
        affordability_ceiling = round(median_income * 0.30 / 12, 0)

    renter_pool_size: int | None = None
    if population and renter_pct is not None:
        renter_pool_size = round(population * renter_pct / 100)

    # Affordability %
    affordable_pct: float | None = None
    rent_for_calc = area_median_rent or census_median_rent
    if rent_for_calc and rent_for_calc > 0:
        bracket_counts: list[tuple[int, int, int]] = []
        for suffix, lo, hi in _INCOME_BRACKETS:
            c = _safe_int(row.get(f"B19001_{suffix}E"))
            if c is not None:
                bracket_counts.append((lo, hi, c))
        if bracket_counts:
            affordable_pct = _compute_affordable_pct(bracket_counts, rent_for_calc)

    return CensusDemographics(
        zip_code=zip5,
        median_household_income=median_income,
        population=population,
        renter_pct=renter_pct,
        census_median_rent=census_median_rent,
        affordability_ceiling=affordability_ceiling,
        affordable_pct=affordable_pct,
        renter_pool_size=renter_pool_size,
    )
