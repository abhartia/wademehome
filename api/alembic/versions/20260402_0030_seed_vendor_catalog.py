"""seed vendor catalog with real US providers

Revision ID: 20260402_0030
Revises: 20260402_0029
Create Date: 2026-04-02

Populates vendor_catalog and vendor_catalog_plans with real US utility
providers (electric, gas, internet) and national moving companies.
Vendors are tagged with serves_states or serves_nationwide so users only
see providers relevant to where they are moving.
"""

from __future__ import annotations

import uuid
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260402_0030"
down_revision: Union[str, Sequence[str], None] = "20260402_0029"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _id() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Vendor + plan data
# ---------------------------------------------------------------------------

VENDORS: list[dict] = []
PLANS: list[dict] = []


def _add(vendor: dict, plans: list[dict]) -> None:
    vid = _id()
    vendor["id"] = vid
    vendor.setdefault("rating", None)
    vendor.setdefault("review_count", None)
    vendor.setdefault("phone", None)
    vendor.setdefault("website", None)
    vendor.setdefault("coverage_area", None)
    vendor.setdefault("serves_nationwide", False)
    vendor.setdefault("serves_states", None)
    VENDORS.append(vendor)
    for p in plans:
        p["id"] = _id()
        p["vendor_id"] = vid
        p.setdefault("popular", False)
        PLANS.append(p)


# ── INTERNET ──────────────────────────────────────────────────────────────

_add(
    {
        "vendor_key": "xfinity",
        "name": "Xfinity",
        "category": "internet",
        "initials": "XF",
        "phone": "1-800-934-6489",
        "website": "xfinity.com",
        "coverage_area": "40 states",
        "serves_states": [
            "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
            "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI",
            "MN", "MO", "MS", "NC", "NH", "NJ", "NM", "NY", "OH", "OR",
            "PA", "SC", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV",
        ],
    },
    [
        {
            "plan_key": "xfinity-connect",
            "name": "Connect",
            "price": "$30",
            "price_unit": "/mo",
            "features": ["75 Mbps download", "No contract required"],
        },
        {
            "plan_key": "xfinity-connect-more",
            "name": "Connect More",
            "price": "$50",
            "price_unit": "/mo",
            "features": ["200 Mbps download", "No contract required"],
            "popular": True,
        },
        {
            "plan_key": "xfinity-fast",
            "name": "Fast",
            "price": "$65",
            "price_unit": "/mo",
            "features": ["400 Mbps download", "No contract required"],
        },
        {
            "plan_key": "xfinity-superfast",
            "name": "Superfast",
            "price": "$75",
            "price_unit": "/mo",
            "features": ["800 Mbps download", "No contract required"],
        },
        {
            "plan_key": "xfinity-gigabit",
            "name": "Gigabit",
            "price": "$90",
            "price_unit": "/mo",
            "features": ["1 Gbps download", "Unlimited data", "No contract"],
        },
    ],
)

_add(
    {
        "vendor_key": "att-fiber",
        "name": "AT&T Fiber",
        "category": "internet",
        "initials": "AT",
        "phone": "1-855-220-5211",
        "website": "att.com",
        "coverage_area": "21 states",
        "serves_states": [
            "AL", "AR", "CA", "FL", "GA", "IL", "IN", "KS", "KY", "LA",
            "MI", "MO", "MS", "NC", "NV", "OH", "OK", "SC", "TN", "TX", "WI",
        ],
    },
    [
        {
            "plan_key": "att-fiber-300",
            "name": "Internet 300",
            "price": "$55",
            "price_unit": "/mo",
            "features": ["300 Mbps", "No data cap", "No annual contract"],
            "popular": True,
        },
        {
            "plan_key": "att-fiber-500",
            "name": "Internet 500",
            "price": "$65",
            "price_unit": "/mo",
            "features": ["500 Mbps", "No data cap", "No annual contract"],
        },
        {
            "plan_key": "att-fiber-1000",
            "name": "Internet 1000",
            "price": "$80",
            "price_unit": "/mo",
            "features": ["1 Gbps symmetric", "No data cap", "Wi-Fi gateway included"],
        },
        {
            "plan_key": "att-fiber-2000",
            "name": "Internet 2000",
            "price": "$110",
            "price_unit": "/mo",
            "features": ["2 Gbps", "No data cap", "Wi-Fi 6E gateway"],
        },
    ],
)

_add(
    {
        "vendor_key": "verizon-fios",
        "name": "Verizon Fios",
        "category": "internet",
        "initials": "VF",
        "phone": "1-800-837-4966",
        "website": "verizon.com/fios",
        "coverage_area": "Northeast US",
        "serves_states": ["CT", "DC", "DE", "MA", "MD", "NJ", "NY", "PA", "RI", "VA"],
    },
    [
        {
            "plan_key": "fios-300",
            "name": "300 Mbps",
            "price": "$50",
            "price_unit": "/mo",
            "features": ["300/300 Mbps symmetric", "No data cap", "No contract"],
        },
        {
            "plan_key": "fios-500",
            "name": "500 Mbps",
            "price": "$70",
            "price_unit": "/mo",
            "features": ["500/500 Mbps symmetric", "No data cap", "No contract"],
            "popular": True,
        },
        {
            "plan_key": "fios-gigabit",
            "name": "1 Gig",
            "price": "$90",
            "price_unit": "/mo",
            "features": ["940/880 Mbps", "No data cap", "Router included"],
        },
    ],
)

_add(
    {
        "vendor_key": "spectrum",
        "name": "Spectrum",
        "category": "internet",
        "initials": "SP",
        "phone": "1-833-267-6094",
        "website": "spectrum.com",
        "coverage_area": "44 states",
        "serves_states": [
            "AL", "AZ", "CA", "CO", "CT", "FL", "GA", "HI", "ID", "IL",
            "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO",
            "MS", "MT", "NC", "NE", "NH", "NJ", "NM", "NV", "NY", "OH",
            "OK", "OR", "PA", "SC", "SD", "TN", "TX", "UT", "VA", "VT",
            "WA", "WI", "WV", "WY",
        ],
    },
    [
        {
            "plan_key": "spectrum-internet",
            "name": "Internet",
            "price": "$50",
            "price_unit": "/mo",
            "features": ["300 Mbps", "No data caps", "Free modem"],
            "popular": True,
        },
        {
            "plan_key": "spectrum-ultra",
            "name": "Internet Ultra",
            "price": "$70",
            "price_unit": "/mo",
            "features": ["500 Mbps", "No data caps", "Free modem"],
        },
        {
            "plan_key": "spectrum-gig",
            "name": "Internet Gig",
            "price": "$90",
            "price_unit": "/mo",
            "features": ["1 Gbps", "No data caps", "Free modem"],
        },
    ],
)

_add(
    {
        "vendor_key": "google-fiber",
        "name": "Google Fiber",
        "category": "internet",
        "initials": "GF",
        "website": "fiber.google.com",
        "coverage_area": "Select cities in 18 states",
        "serves_states": [
            "AL", "AZ", "CA", "CO", "FL", "GA", "IA", "KS", "MO", "NC",
            "NE", "NV", "OK", "OR", "SC", "TN", "TX", "UT",
        ],
    },
    [
        {
            "plan_key": "gf-1gig",
            "name": "1 Gig",
            "price": "$70",
            "price_unit": "/mo",
            "features": ["1 Gbps symmetric", "No data cap", "No contract"],
            "popular": True,
        },
        {
            "plan_key": "gf-2gig",
            "name": "2 Gig",
            "price": "$100",
            "price_unit": "/mo",
            "features": ["2 Gbps", "No data cap", "Wi-Fi 6E router included"],
        },
        {
            "plan_key": "gf-5gig",
            "name": "5 Gig",
            "price": "$125",
            "price_unit": "/mo",
            "features": ["5 Gbps", "No data cap", "10G fiber router"],
        },
        {
            "plan_key": "gf-8gig",
            "name": "8 Gig",
            "price": "$150",
            "price_unit": "/mo",
            "features": ["8 Gbps", "No data cap", "10G fiber router"],
        },
    ],
)

_add(
    {
        "vendor_key": "tmobile-home",
        "name": "T-Mobile 5G Home Internet",
        "category": "internet",
        "initials": "TM",
        "phone": "1-844-275-9310",
        "website": "t-mobile.com/home-internet",
        "coverage_area": "Nationwide (5G coverage areas)",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "tm-home-lite",
            "name": "Lite",
            "price": "$40",
            "price_unit": "/mo",
            "features": ["33-100 Mbps typical", "No annual contract", "No data cap"],
        },
        {
            "plan_key": "tm-home-all-in",
            "name": "All-In",
            "price": "$50",
            "price_unit": "/mo",
            "features": ["72-245 Mbps typical", "No annual contract", "No data cap"],
            "popular": True,
        },
        {
            "plan_key": "tm-home-relay",
            "name": "Rely",
            "price": "$45",
            "price_unit": "/mo",
            "features": ["100+ Mbps typical", "Price lock guarantee", "No data cap"],
        },
    ],
)

_add(
    {
        "vendor_key": "cox",
        "name": "Cox",
        "category": "internet",
        "initials": "CX",
        "phone": "1-800-234-3993",
        "website": "cox.com",
        "coverage_area": "18 states",
        "serves_states": [
            "AR", "AZ", "CA", "CT", "FL", "GA", "ID", "IA", "KS", "LA",
            "NE", "NV", "OH", "OK", "RI", "TX", "VA", "VA",
        ],
    },
    [
        {
            "plan_key": "cox-go-fast",
            "name": "Go Fast",
            "price": "$50",
            "price_unit": "/mo",
            "features": ["250 Mbps", "1.25 TB data cap", "No contract"],
        },
        {
            "plan_key": "cox-go-faster",
            "name": "Go Faster",
            "price": "$70",
            "price_unit": "/mo",
            "features": ["500 Mbps", "1.25 TB data cap", "No contract"],
            "popular": True,
        },
        {
            "plan_key": "cox-go-super-fast",
            "name": "Go Super Fast",
            "price": "$90",
            "price_unit": "/mo",
            "features": ["1 Gbps", "1.25 TB data cap", "No contract"],
        },
    ],
)

_add(
    {
        "vendor_key": "centurylink",
        "name": "CenturyLink / Quantum Fiber",
        "category": "internet",
        "initials": "CL",
        "phone": "1-855-228-4527",
        "website": "centurylink.com",
        "coverage_area": "36 states",
        "serves_states": [
            "AL", "AR", "AZ", "CO", "FL", "GA", "IA", "ID", "IL", "IN",
            "KS", "LA", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE",
            "NJ", "NM", "NV", "OH", "OK", "OR", "PA", "SC", "SD", "TN",
            "TX", "UT", "VA", "WA", "WI", "WY",
        ],
    },
    [
        {
            "plan_key": "cl-200",
            "name": "Internet 200",
            "price": "$45",
            "price_unit": "/mo",
            "features": ["200 Mbps", "No data cap", "Price for life guarantee"],
        },
        {
            "plan_key": "cl-500",
            "name": "Internet 500",
            "price": "$55",
            "price_unit": "/mo",
            "features": ["500 Mbps", "No data cap", "Price for life guarantee"],
        },
        {
            "plan_key": "cl-940",
            "name": "Fiber Gigabit",
            "price": "$65",
            "price_unit": "/mo",
            "features": ["940 Mbps", "No data cap", "Price for life guarantee"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "frontier-fiber",
        "name": "Frontier Fiber",
        "category": "internet",
        "initials": "FR",
        "phone": "1-855-558-5014",
        "website": "frontier.com",
        "coverage_area": "25 states",
        "serves_states": [
            "AL", "AZ", "CA", "CT", "FL", "GA", "IL", "IN", "IA", "MN",
            "MS", "NC", "NE", "NV", "NY", "OH", "OK", "PA", "SC", "TN",
            "TX", "UT", "VA", "WI", "WV",
        ],
    },
    [
        {
            "plan_key": "frontier-essential",
            "name": "Fiber 500",
            "price": "$40",
            "price_unit": "/mo",
            "features": ["500 Mbps", "No data cap", "No contract"],
            "popular": True,
        },
        {
            "plan_key": "frontier-1gig",
            "name": "Fiber 1 Gig",
            "price": "$60",
            "price_unit": "/mo",
            "features": ["1 Gbps", "No data cap", "No contract"],
        },
        {
            "plan_key": "frontier-2gig",
            "name": "Fiber 2 Gig",
            "price": "$85",
            "price_unit": "/mo",
            "features": ["2 Gbps", "No data cap", "Wi-Fi 6E router"],
        },
    ],
)


# ── ELECTRIC ──────────────────────────────────────────────────────────────

_add(
    {
        "vendor_key": "duke-energy",
        "name": "Duke Energy",
        "category": "electric",
        "initials": "DE",
        "phone": "1-800-777-9898",
        "website": "duke-energy.com",
        "coverage_area": "NC, SC, FL, IN, OH, KY",
        "serves_states": ["NC", "SC", "FL", "IN", "OH", "KY"],
    },
    [
        {
            "plan_key": "duke-residential",
            "name": "Residential Standard",
            "price": "~$0.12",
            "price_unit": "/kWh",
            "features": ["No enrollment fee", "Standard regulated rate"],
            "popular": True,
        },
        {
            "plan_key": "duke-time-of-use",
            "name": "Time-of-Use",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Lower off-peak rates", "Smart meter required"],
        },
    ],
)

_add(
    {
        "vendor_key": "coned",
        "name": "Con Edison",
        "category": "electric",
        "initials": "CE",
        "phone": "1-800-752-6633",
        "website": "coned.com",
        "coverage_area": "New York City & Westchester",
        "serves_states": ["NY"],
    },
    [
        {
            "plan_key": "coned-standard",
            "name": "Standard Service",
            "price": "~$0.22",
            "price_unit": "/kWh",
            "features": ["Regulated delivery rate", "No enrollment required"],
            "popular": True,
        },
        {
            "plan_key": "coned-time-of-use",
            "name": "Time-of-Use",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Lower overnight rates", "Smart meter required"],
        },
    ],
)

_add(
    {
        "vendor_key": "pge",
        "name": "Pacific Gas & Electric (PG&E)",
        "category": "electric",
        "initials": "PG",
        "phone": "1-800-743-5000",
        "website": "pge.com",
        "coverage_area": "Northern & Central California",
        "serves_states": ["CA"],
    },
    [
        {
            "plan_key": "pge-e1",
            "name": "E-1 Residential",
            "price": "~$0.30",
            "price_unit": "/kWh",
            "features": ["Flat rate", "Tiered pricing by usage"],
            "popular": True,
        },
        {
            "plan_key": "pge-ev2a",
            "name": "EV2-A Time-of-Use",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["EV-friendly off-peak rates", "Peak/off-peak pricing"],
        },
        {
            "plan_key": "pge-etou-c",
            "name": "E-TOU-C Time-of-Use",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Lower 4-9pm avoidance", "Good for solar customers"],
        },
    ],
)

_add(
    {
        "vendor_key": "sce",
        "name": "Southern California Edison (SCE)",
        "category": "electric",
        "initials": "SC",
        "phone": "1-800-655-4555",
        "website": "sce.com",
        "coverage_area": "Southern California",
        "serves_states": ["CA"],
    },
    [
        {
            "plan_key": "sce-d",
            "name": "Domestic (D)",
            "price": "~$0.27",
            "price_unit": "/kWh",
            "features": ["Standard tiered rate", "Default plan"],
            "popular": True,
        },
        {
            "plan_key": "sce-tou-d-prime",
            "name": "TOU-D-PRIME",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Time-of-use rates", "EV & heat pump discount"],
        },
    ],
)

_add(
    {
        "vendor_key": "fpl",
        "name": "Florida Power & Light (FPL)",
        "category": "electric",
        "initials": "FP",
        "phone": "1-800-468-8243",
        "website": "fpl.com",
        "coverage_area": "Eastern & southern Florida",
        "serves_states": ["FL"],
    },
    [
        {
            "plan_key": "fpl-residential",
            "name": "Residential Standard",
            "price": "~$0.12",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment fee"],
            "popular": True,
        },
        {
            "plan_key": "fpl-budget-billing",
            "name": "Budget Billing",
            "price": "Averaged",
            "price_unit": "/mo",
            "features": ["Fixed monthly payment", "Based on 12-mo avg usage"],
        },
    ],
)

_add(
    {
        "vendor_key": "peco",
        "name": "PECO Energy",
        "category": "electric",
        "initials": "PE",
        "phone": "1-800-494-4000",
        "website": "peco.com",
        "coverage_area": "Southeast Pennsylvania",
        "serves_states": ["PA"],
    },
    [
        {
            "plan_key": "peco-default",
            "name": "Default Service",
            "price": "~$0.10",
            "price_unit": "/kWh",
            "features": ["Regulated default rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "comed",
        "name": "ComEd",
        "category": "electric",
        "initials": "CM",
        "phone": "1-800-334-7661",
        "website": "comed.com",
        "coverage_area": "Northern Illinois",
        "serves_states": ["IL"],
    },
    [
        {
            "plan_key": "comed-standard",
            "name": "Standard Residential",
            "price": "~$0.10",
            "price_unit": "/kWh",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
        {
            "plan_key": "comed-hourly",
            "name": "Hourly Pricing",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Real-time wholesale pricing", "Smart meter required"],
        },
    ],
)

_add(
    {
        "vendor_key": "dominion-energy",
        "name": "Dominion Energy",
        "category": "electric",
        "initials": "DO",
        "phone": "1-866-366-4357",
        "website": "dominionenergy.com",
        "coverage_area": "VA, NC, SC",
        "serves_states": ["VA", "NC", "SC"],
    },
    [
        {
            "plan_key": "dominion-residential",
            "name": "Residential Standard",
            "price": "~$0.13",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "oncor-txu",
        "name": "TXU Energy",
        "category": "electric",
        "initials": "TX",
        "phone": "1-800-818-6132",
        "website": "txu.com",
        "coverage_area": "Texas (deregulated areas)",
        "serves_states": ["TX"],
    },
    [
        {
            "plan_key": "txu-simple-12",
            "name": "Simple Rate 12",
            "price": "$0.13",
            "price_unit": "/kWh",
            "features": ["12-month fixed rate", "No hidden fees"],
            "popular": True,
        },
        {
            "plan_key": "txu-simple-24",
            "name": "Simple Rate 24",
            "price": "$0.12",
            "price_unit": "/kWh",
            "features": ["24-month fixed rate", "Price stability"],
        },
        {
            "plan_key": "txu-free-nights",
            "name": "Free Nights",
            "price": "$0.15",
            "price_unit": "/kWh (day)",
            "features": ["Free electricity 9pm-6am", "Great for EV charging"],
        },
    ],
)

_add(
    {
        "vendor_key": "reliant-energy",
        "name": "Reliant Energy",
        "category": "electric",
        "initials": "RE",
        "phone": "1-866-222-7100",
        "website": "reliant.com",
        "coverage_area": "Texas (deregulated areas)",
        "serves_states": ["TX"],
    },
    [
        {
            "plan_key": "reliant-secure-12",
            "name": "Secure Advantage 12",
            "price": "$0.12",
            "price_unit": "/kWh",
            "features": ["12-month fixed rate", "No cancellation fee"],
            "popular": True,
        },
        {
            "plan_key": "reliant-truly-free",
            "name": "Truly Free Weekends",
            "price": "$0.14",
            "price_unit": "/kWh (weekday)",
            "features": ["Free electricity Sat & Sun", "12-month term"],
        },
    ],
)

_add(
    {
        "vendor_key": "eversource",
        "name": "Eversource",
        "category": "electric",
        "initials": "ES",
        "phone": "1-800-592-2000",
        "website": "eversource.com",
        "coverage_area": "CT, MA, NH",
        "serves_states": ["CT", "MA", "NH"],
    },
    [
        {
            "plan_key": "eversource-standard",
            "name": "Standard Service",
            "price": "~$0.13",
            "price_unit": "/kWh",
            "features": ["Regulated delivery + supply rate", "No enrollment"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "consumers-energy",
        "name": "Consumers Energy",
        "category": "electric",
        "initials": "CN",
        "phone": "1-800-477-5050",
        "website": "consumersenergy.com",
        "coverage_area": "Lower Michigan",
        "serves_states": ["MI"],
    },
    [
        {
            "plan_key": "consumers-standard",
            "name": "Residential Standard",
            "price": "~$0.18",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "aps",
        "name": "Arizona Public Service (APS)",
        "category": "electric",
        "initials": "AP",
        "phone": "1-602-371-7171",
        "website": "aps.com",
        "coverage_area": "Arizona",
        "serves_states": ["AZ"],
    },
    [
        {
            "plan_key": "aps-saver-choice",
            "name": "Saver Choice",
            "price": "~$0.11",
            "price_unit": "/kWh",
            "features": ["Time-of-use plan", "Lower off-peak rates"],
            "popular": True,
        },
        {
            "plan_key": "aps-saver-choice-plus",
            "name": "Saver Choice Plus",
            "price": "~$0.10",
            "price_unit": "/kWh",
            "features": ["Demand-based pricing", "Lowest off-peak rates"],
        },
    ],
)

_add(
    {
        "vendor_key": "xcel-energy",
        "name": "Xcel Energy",
        "category": "electric",
        "initials": "XE",
        "phone": "1-800-895-4999",
        "website": "xcelenergy.com",
        "coverage_area": "CO, MN, WI, NM, ND, SD, TX, MI",
        "serves_states": ["CO", "MN", "WI", "NM", "ND", "SD", "TX", "MI"],
    },
    [
        {
            "plan_key": "xcel-residential",
            "name": "Residential Standard",
            "price": "~$0.11",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
        {
            "plan_key": "xcel-time-of-use",
            "name": "Time-of-Use",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Lower overnight rates", "Smart thermostat rebate"],
        },
    ],
)

_add(
    {
        "vendor_key": "entergy",
        "name": "Entergy",
        "category": "electric",
        "initials": "EN",
        "phone": "1-800-368-3749",
        "website": "entergy.com",
        "coverage_area": "AR, LA, MS, TX",
        "serves_states": ["AR", "LA", "MS", "TX"],
    },
    [
        {
            "plan_key": "entergy-residential",
            "name": "Residential Standard",
            "price": "~$0.10",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment fee"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "georgia-power",
        "name": "Georgia Power",
        "category": "electric",
        "initials": "GP",
        "phone": "1-888-660-5890",
        "website": "georgiapower.com",
        "coverage_area": "Georgia",
        "serves_states": ["GA"],
    },
    [
        {
            "plan_key": "gp-standard",
            "name": "Standard Residential",
            "price": "~$0.13",
            "price_unit": "/kWh",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
        {
            "plan_key": "gp-nights-weekends",
            "name": "Nights & Weekends",
            "price": "Varies",
            "price_unit": "/kWh",
            "features": ["Lower off-peak rates", "Smart meter required"],
        },
    ],
)

_add(
    {
        "vendor_key": "pseg",
        "name": "PSE&G",
        "category": "electric",
        "initials": "PS",
        "phone": "1-800-436-7734",
        "website": "pseg.com",
        "coverage_area": "New Jersey",
        "serves_states": ["NJ"],
    },
    [
        {
            "plan_key": "pseg-residential",
            "name": "Residential Standard",
            "price": "~$0.11",
            "price_unit": "/kWh",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "pppl",
        "name": "PPL Electric",
        "category": "electric",
        "initials": "PP",
        "phone": "1-800-342-5775",
        "website": "pplelectric.com",
        "coverage_area": "Eastern & Central Pennsylvania",
        "serves_states": ["PA"],
    },
    [
        {
            "plan_key": "ppl-default",
            "name": "Default Service",
            "price": "~$0.10",
            "price_unit": "/kWh",
            "features": ["Regulated default rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)


# ── GAS ───────────────────────────────────────────────────────────────────

_add(
    {
        "vendor_key": "national-grid-gas",
        "name": "National Grid",
        "category": "gas",
        "initials": "NG",
        "phone": "1-800-930-5003",
        "website": "nationalgridus.com",
        "coverage_area": "NY, MA, RI",
        "serves_states": ["NY", "MA", "RI"],
    },
    [
        {
            "plan_key": "ng-residential",
            "name": "Residential Standard",
            "price": "~$1.50",
            "price_unit": "/therm",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "socalgas",
        "name": "SoCalGas",
        "category": "gas",
        "initials": "SG",
        "phone": "1-800-427-2200",
        "website": "socalgas.com",
        "coverage_area": "Southern California",
        "serves_states": ["CA"],
    },
    [
        {
            "plan_key": "socalgas-residential",
            "name": "Residential Standard",
            "price": "~$1.80",
            "price_unit": "/therm",
            "features": ["Regulated rate", "Baseline allowance"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "pge-gas",
        "name": "PG&E Gas",
        "category": "gas",
        "initials": "PG",
        "phone": "1-800-743-5000",
        "website": "pge.com",
        "coverage_area": "Northern & Central California",
        "serves_states": ["CA"],
    },
    [
        {
            "plan_key": "pge-gas-residential",
            "name": "Residential Gas",
            "price": "~$1.75",
            "price_unit": "/therm",
            "features": ["Regulated rate", "Tiered by usage"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "coned-gas",
        "name": "Con Edison Gas",
        "category": "gas",
        "initials": "CE",
        "phone": "1-800-752-6633",
        "website": "coned.com",
        "coverage_area": "NYC & Westchester",
        "serves_states": ["NY"],
    },
    [
        {
            "plan_key": "coned-gas-standard",
            "name": "Standard Gas Service",
            "price": "~$1.60",
            "price_unit": "/therm",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "pseg-gas",
        "name": "PSE&G Gas",
        "category": "gas",
        "initials": "PS",
        "phone": "1-800-436-7734",
        "website": "pseg.com",
        "coverage_area": "New Jersey",
        "serves_states": ["NJ"],
    },
    [
        {
            "plan_key": "pseg-gas-standard",
            "name": "Gas Standard Service",
            "price": "~$1.20",
            "price_unit": "/therm",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "peoples-gas",
        "name": "Peoples Gas",
        "category": "gas",
        "initials": "PG",
        "phone": "1-866-556-6001",
        "website": "peoplesgasdelivery.com",
        "coverage_area": "Chicago, IL",
        "serves_states": ["IL"],
    },
    [
        {
            "plan_key": "peoples-gas-standard",
            "name": "Standard Service",
            "price": "~$0.85",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "nicor-gas",
        "name": "Nicor Gas",
        "category": "gas",
        "initials": "NI",
        "phone": "1-888-642-6748",
        "website": "nicorgas.com",
        "coverage_area": "Northern Illinois (excl. Chicago)",
        "serves_states": ["IL"],
    },
    [
        {
            "plan_key": "nicor-standard",
            "name": "Standard Service",
            "price": "~$0.70",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "atmos-energy",
        "name": "Atmos Energy",
        "category": "gas",
        "initials": "AE",
        "phone": "1-888-286-6700",
        "website": "atmosenergy.com",
        "coverage_area": "CO, KS, KY, LA, MS, TN, TX, VA",
        "serves_states": ["CO", "KS", "KY", "LA", "MS", "TN", "TX", "VA"],
    },
    [
        {
            "plan_key": "atmos-residential",
            "name": "Residential Standard",
            "price": "~$0.80",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "centerpoint-gas",
        "name": "CenterPoint Energy",
        "category": "gas",
        "initials": "CP",
        "phone": "1-800-992-7552",
        "website": "centerpointenergy.com",
        "coverage_area": "TX, IN, OH, MN, MS, LA",
        "serves_states": ["TX", "IN", "OH", "MN", "MS", "LA"],
    },
    [
        {
            "plan_key": "centerpoint-residential",
            "name": "Residential Standard",
            "price": "~$0.90",
            "price_unit": "/therm",
            "features": ["Regulated delivery rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "dominion-gas",
        "name": "Dominion Energy Gas",
        "category": "gas",
        "initials": "DO",
        "phone": "1-800-543-8911",
        "website": "dominionenergy.com",
        "coverage_area": "OH, WV, NC, UT",
        "serves_states": ["OH", "WV", "NC", "UT"],
    },
    [
        {
            "plan_key": "dominion-gas-standard",
            "name": "Residential Standard",
            "price": "~$1.00",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "spire-gas",
        "name": "Spire",
        "category": "gas",
        "initials": "SP",
        "phone": "1-800-887-4173",
        "website": "spireenergy.com",
        "coverage_area": "MO, AL, MS",
        "serves_states": ["MO", "AL", "MS"],
    },
    [
        {
            "plan_key": "spire-standard",
            "name": "Residential Standard",
            "price": "~$0.75",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "columbia-gas",
        "name": "Columbia Gas",
        "category": "gas",
        "initials": "CG",
        "phone": "1-800-344-4077",
        "website": "columbiagasoh.com",
        "coverage_area": "OH, PA, VA, KY, MD",
        "serves_states": ["OH", "PA", "VA", "KY", "MD"],
    },
    [
        {
            "plan_key": "columbia-standard",
            "name": "Residential Standard",
            "price": "~$0.90",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "washington-gas",
        "name": "Washington Gas",
        "category": "gas",
        "initials": "WG",
        "phone": "1-844-927-4427",
        "website": "washingtongas.com",
        "coverage_area": "DC, MD, VA",
        "serves_states": ["DC", "MD", "VA"],
    },
    [
        {
            "plan_key": "washgas-standard",
            "name": "Residential Standard",
            "price": "~$1.10",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "new-england-gas",
        "name": "New England Gas (Eversource)",
        "category": "gas",
        "initials": "NE",
        "phone": "1-800-592-2000",
        "website": "eversource.com",
        "coverage_area": "CT, MA",
        "serves_states": ["CT", "MA"],
    },
    [
        {
            "plan_key": "ne-gas-standard",
            "name": "Residential Standard",
            "price": "~$1.40",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "piedmont-gas",
        "name": "Piedmont Natural Gas",
        "category": "gas",
        "initials": "PN",
        "phone": "1-800-752-7504",
        "website": "piedmontng.com",
        "coverage_area": "NC, SC, TN",
        "serves_states": ["NC", "SC", "TN"],
    },
    [
        {
            "plan_key": "piedmont-standard",
            "name": "Residential Standard",
            "price": "~$0.85",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "consumers-gas",
        "name": "Consumers Energy Gas",
        "category": "gas",
        "initials": "CN",
        "phone": "1-800-477-5050",
        "website": "consumersenergy.com",
        "coverage_area": "Lower Michigan",
        "serves_states": ["MI"],
    },
    [
        {
            "plan_key": "consumers-gas-standard",
            "name": "Residential Standard",
            "price": "~$0.80",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "sw-gas",
        "name": "Southwest Gas",
        "category": "gas",
        "initials": "SW",
        "phone": "1-877-860-6020",
        "website": "swgas.com",
        "coverage_area": "AZ, NV, CA",
        "serves_states": ["AZ", "NV", "CA"],
    },
    [
        {
            "plan_key": "swgas-standard",
            "name": "Residential Standard",
            "price": "~$1.10",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "xcel-gas",
        "name": "Xcel Energy Gas",
        "category": "gas",
        "initials": "XE",
        "phone": "1-800-895-4999",
        "website": "xcelenergy.com",
        "coverage_area": "CO, MN, WI, ND, MI",
        "serves_states": ["CO", "MN", "WI", "ND", "MI"],
    },
    [
        {
            "plan_key": "xcel-gas-standard",
            "name": "Residential Standard",
            "price": "~$0.75",
            "price_unit": "/therm",
            "features": ["Regulated rate", "No enrollment needed"],
            "popular": True,
        },
    ],
)


# ── MOVERS ────────────────────────────────────────────────────────────────

_add(
    {
        "vendor_key": "two-men-and-a-truck",
        "name": "Two Men and a Truck",
        "category": "movers",
        "initials": "2M",
        "phone": "1-800-345-1070",
        "website": "twomenandatruck.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "2m-local",
            "name": "Local Move",
            "price": "From $150",
            "price_unit": "/hr (2 movers)",
            "features": ["2 movers + truck", "Furniture protection", "Loading & unloading"],
            "popular": True,
        },
        {
            "plan_key": "2m-long-distance",
            "name": "Long Distance Move",
            "price": "Custom quote",
            "price_unit": "",
            "features": ["Dedicated truck", "GPS tracking", "Full valuation coverage"],
        },
    ],
)

_add(
    {
        "vendor_key": "united-van-lines",
        "name": "United Van Lines",
        "category": "movers",
        "initials": "UV",
        "phone": "1-877-744-5446",
        "website": "unitedvanlines.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "uv-full-service",
            "name": "Full-Service Move",
            "price": "Custom quote",
            "price_unit": "",
            "features": ["Packing & unpacking", "Furniture disassembly", "Full valuation"],
            "popular": True,
        },
        {
            "plan_key": "uv-self-pack",
            "name": "Self-Pack Move",
            "price": "Custom quote",
            "price_unit": "",
            "features": ["You pack, they transport", "Loading & unloading", "Basic valuation"],
        },
    ],
)

_add(
    {
        "vendor_key": "mayflower",
        "name": "Mayflower",
        "category": "movers",
        "initials": "MF",
        "phone": "1-877-462-4535",
        "website": "mayflower.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "mf-full-service",
            "name": "Full-Service Move",
            "price": "Custom quote",
            "price_unit": "",
            "features": ["Door-to-door service", "Professional packing", "Full valuation"],
            "popular": True,
        },
        {
            "plan_key": "mf-container",
            "name": "Container / Portable Move",
            "price": "Custom quote",
            "price_unit": "",
            "features": ["Flexible delivery dates", "You load, they drive", "Storage option"],
        },
    ],
)

_add(
    {
        "vendor_key": "pods",
        "name": "PODS",
        "category": "movers",
        "initials": "PD",
        "phone": "1-877-770-7637",
        "website": "pods.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "pods-8ft",
            "name": "8-foot Container",
            "price": "From $230",
            "price_unit": "/mo",
            "features": ["Studio / 1BR", "You load on your schedule", "Pickup & delivery"],
        },
        {
            "plan_key": "pods-12ft",
            "name": "12-foot Container",
            "price": "From $260",
            "price_unit": "/mo",
            "features": ["1-2 BR apartment", "You load on your schedule", "Pickup & delivery"],
        },
        {
            "plan_key": "pods-16ft",
            "name": "16-foot Container",
            "price": "From $300",
            "price_unit": "/mo",
            "features": ["2-3 BR home", "You load on your schedule", "Pickup & delivery"],
            "popular": True,
        },
    ],
)

_add(
    {
        "vendor_key": "uhaul",
        "name": "U-Haul",
        "category": "movers",
        "initials": "UH",
        "phone": "1-800-468-4285",
        "website": "uhaul.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "uhaul-10ft",
            "name": "10' Truck",
            "price": "From $20",
            "price_unit": "/day + mileage",
            "features": ["Studio / small 1BR", "Ramp included", "Insurance available"],
        },
        {
            "plan_key": "uhaul-15ft",
            "name": "15' Truck",
            "price": "From $30",
            "price_unit": "/day + mileage",
            "features": ["1-2 BR apartment", "Ramp included", "Insurance available"],
            "popular": True,
        },
        {
            "plan_key": "uhaul-20ft",
            "name": "20' Truck",
            "price": "From $40",
            "price_unit": "/day + mileage",
            "features": ["2-3 BR home", "Ramp + dolly available", "Insurance available"],
        },
        {
            "plan_key": "uhaul-26ft",
            "name": "26' Truck",
            "price": "From $50",
            "price_unit": "/day + mileage",
            "features": ["3-4+ BR home", "Ramp + dolly available", "Insurance available"],
        },
    ],
)

_add(
    {
        "vendor_key": "penske",
        "name": "Penske Truck Rental",
        "category": "movers",
        "initials": "PK",
        "phone": "1-888-996-5415",
        "website": "penske.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "penske-12ft",
            "name": "12' Truck",
            "price": "From $30",
            "price_unit": "/day + mileage",
            "features": ["Studio / 1BR", "Liftgate available", "Unlimited mileage on one-way"],
        },
        {
            "plan_key": "penske-16ft",
            "name": "16' Truck",
            "price": "From $40",
            "price_unit": "/day + mileage",
            "features": ["1-2 BR apartment", "Liftgate available", "Unlimited mileage on one-way"],
            "popular": True,
        },
        {
            "plan_key": "penske-22ft",
            "name": "22' Truck",
            "price": "From $50",
            "price_unit": "/day + mileage",
            "features": ["2-3 BR home", "Liftgate available", "Unlimited mileage on one-way"],
        },
        {
            "plan_key": "penske-26ft",
            "name": "26' Truck",
            "price": "From $60",
            "price_unit": "/day + mileage",
            "features": ["3-4+ BR home", "Liftgate available", "Unlimited mileage on one-way"],
        },
    ],
)

_add(
    {
        "vendor_key": "budget-truck",
        "name": "Budget Truck Rental",
        "category": "movers",
        "initials": "BT",
        "phone": "1-800-462-8343",
        "website": "budgettruck.com",
        "coverage_area": "Nationwide",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "budget-12ft",
            "name": "12' Truck",
            "price": "From $25",
            "price_unit": "/day + mileage",
            "features": ["Studio / small 1BR", "Ramp included"],
        },
        {
            "plan_key": "budget-16ft",
            "name": "16' Truck",
            "price": "From $35",
            "price_unit": "/day + mileage",
            "features": ["1-2 BR apartment", "Ramp included"],
            "popular": True,
        },
        {
            "plan_key": "budget-26ft",
            "name": "26' Truck",
            "price": "From $50",
            "price_unit": "/day + mileage",
            "features": ["3-4+ BR home", "Ramp included"],
        },
    ],
)

_add(
    {
        "vendor_key": "college-hunks",
        "name": "College Hunks Hauling Junk & Moving",
        "category": "movers",
        "initials": "CH",
        "phone": "1-800-586-5872",
        "website": "collegehunkshaulingjunk.com",
        "coverage_area": "Nationwide (franchise)",
        "serves_nationwide": True,
    },
    [
        {
            "plan_key": "ch-local",
            "name": "Local Move",
            "price": "From $140",
            "price_unit": "/hr (2 movers)",
            "features": ["2 movers + truck", "Furniture protection", "Loading & unloading"],
            "popular": True,
        },
        {
            "plan_key": "ch-labor-only",
            "name": "Labor Only",
            "price": "From $100",
            "price_unit": "/hr (2 movers)",
            "features": ["Loading / unloading only", "No truck needed", "Great for PODS / containers"],
        },
    ],
)


# ---------------------------------------------------------------------------
# Migration
# ---------------------------------------------------------------------------

def upgrade() -> None:
    vendor_table = sa.table(
        "vendor_catalog",
        sa.column("id", sa.dialects.postgresql.UUID),
        sa.column("vendor_key", sa.String),
        sa.column("name", sa.String),
        sa.column("category", sa.String),
        sa.column("initials", sa.String),
        sa.column("rating", sa.Numeric),
        sa.column("review_count", sa.Integer),
        sa.column("phone", sa.String),
        sa.column("website", sa.String),
        sa.column("coverage_area", sa.String),
        sa.column("serves_nationwide", sa.Boolean),
        sa.column("serves_states", sa.dialects.postgresql.ARRAY(sa.String)),
    )
    plan_table = sa.table(
        "vendor_catalog_plans",
        sa.column("id", sa.dialects.postgresql.UUID),
        sa.column("vendor_id", sa.dialects.postgresql.UUID),
        sa.column("plan_key", sa.String),
        sa.column("name", sa.String),
        sa.column("price", sa.String),
        sa.column("price_unit", sa.String),
        sa.column("features", sa.JSON),
        sa.column("popular", sa.Boolean),
    )
    op.bulk_insert(vendor_table, VENDORS)
    op.bulk_insert(plan_table, PLANS)


def downgrade() -> None:
    op.execute(sa.text("TRUNCATE TABLE vendor_catalog_plans"))
    op.execute(sa.text("TRUNCATE TABLE vendor_catalog"))
