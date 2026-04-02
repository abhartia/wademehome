#!/usr/bin/env python3
"""Emit scripts/sql/vendor_catalog_seed.sql. Run from repo root: python scripts/build_vendor_catalog_seed.py"""

from __future__ import annotations

import json
from pathlib import Path

US = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "DC",
]


def arr(sts: list[str]) -> str:
    return "ARRAY[" + ",".join(f"'{s}'" for s in sts) + "]::varchar(2)[]"


def esc(s: str) -> str:
    return s.replace("'", "''")


def vendor_sql(
    key: str,
    name: str,
    category: str,
    initials: str,
    rating: float,
    reviews: int,
    phone: str,
    web: str,
    area: str,
    nationwide: bool,
    states: list[str] | None,
) -> str:
    sn = "true" if nationwide else "false"
    ss = "NULL" if states is None else arr(states)
    return f"""
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), '{key}', '{esc(name)}', '{category}', '{initials}', {rating}, {reviews},
  '{esc(phone)}', '{esc(web)}', '{esc(area)}', {sn}, {ss}
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
""".strip()


def plan_sql(vkey: str, pkey: str, pname: str, price: str, unit: str, feats: list[str], popular: bool) -> str:
    fj = json.dumps(feats)
    pop = "true" if popular else "false"
    return f"""
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, '{pkey}', '{esc(pname)}', '{esc(price)}', '{esc(unit)}', '{esc(fj)}'::json, {pop}
FROM vendor_catalog v WHERE v.vendor_key = '{vkey}'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
""".strip()


def main() -> None:
    out: list[str] = [
        "-- Vendor catalog seed (UPSERT by vendor_key / plan_key).",
        "-- Run after Alembic includes serves_nationwide, serves_states, user_movein_plans.target_state.",
        "-- Example: psql \"$DATABASE_URL\" -f scripts/sql/vendor_catalog_seed.sql",
        "BEGIN;",
    ]

    def add_vendor_plans(
        key: str,
        name: str,
        cat: str,
        initials: str,
        rating: float,
        rev: int,
        phone: str,
        web: str,
        area: str,
        nationwide: bool,
        states: list[str] | None,
        plan_suffix: str = "std",
        plan_name: str = "Representative option (confirm with provider)",
        price: str = "Varies",
        unit: str = "/mo",
        feats: list[str] | None = None,
    ) -> None:
        out.append(vendor_sql(key, name, cat, initials, rating, rev, phone, web, area, nationwide, states))
        f = feats or [
            "Pricing varies by address and credit",
            "Verify with utility or ISP before signing",
            "Informational only — not a live quote",
        ]
        out.append(
            plan_sql(
                key,
                f"p-{key}-{plan_suffix}",
                plan_name,
                price,
                unit,
                f,
                True,
            )
        )

    # ---- Internet ----
    internet: list[tuple] = [
        (
            "v-net-comcast",
            "Xfinity (Comcast)",
            "XF",
            3.9,
            52000,
            "(800) 934-6489",
            "xfinity.com",
            "Cable/fiber — multi-state footprint",
            False,
            [
                "AL", "AR", "AZ", "CA", "CO", "CT", "FL", "GA", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "MI",
                "MN", "MO", "MS", "NJ", "NM", "NH", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "SC", "TN", "TX",
                "UT", "VT", "VA", "WA", "WV", "WI",
            ],
        ),
        (
            "v-net-spectrum",
            "Spectrum (Charter)",
            "SP",
            3.7,
            41000,
            "(833) 694-9259",
            "spectrum.com",
            "Cable/fiber — Charter footprint",
            False,
            [
                "AL", "AZ", "CA", "CO", "CT", "FL", "GA", "HI", "ID", "IL", "IN", "KS", "KY", "LA", "ME", "MA",
                "MI", "MN", "MO", "NC", "NE", "NH", "NJ", "NM", "NY", "OH", "OR", "PA", "SC", "TN", "TX", "VT",
                "VA", "WA", "WI", "WV", "WY",
            ],
        ),
        (
            "v-net-cox",
            "Cox Communications",
            "CX",
            3.8,
            22000,
            "(855) 349-9313",
            "cox.com",
            "Cable/fiber — select states",
            False,
            ["AR", "AZ", "CA", "CT", "FL", "GA", "ID", "KS", "LA", "MO", "NE", "NV", "OH", "OK", "RI", "VA"],
        ),
        (
            "v-net-optimum",
            "Optimum (Altice)",
            "OP",
            3.6,
            18000,
            "(866) 200-7153",
            "optimum.com",
            "NY/NJ/CT and select markets",
            False,
            ["NY", "NJ", "CT", "LA", "NC", "AR"],
        ),
        (
            "v-net-fios",
            "Verizon Fios",
            "VF",
            4.2,
            19000,
            "(800) 837-4966",
            "verizon.com/fiber",
            "Fiber Northeast/Mid-Atlantic",
            False,
            ["NY", "NJ", "PA", "DE", "MD", "VA", "DC", "MA", "RI"],
        ),
        (
            "v-net-att",
            "AT&T Internet / Fiber",
            "AT",
            3.8,
            67000,
            "(800) 288-2020",
            "att.com/internet",
            "DSL/fiber footprint varies",
            False,
            [
                "AL", "AR", "AZ", "CA", "FL", "GA", "IL", "IN", "KS", "KY", "LA", "MI", "MS", "MO", "NC", "NV",
                "OH", "OK", "SC", "TN", "TX", "WI", "WV",
            ],
        ),
        (
            "v-net-frontier",
            "Frontier Communications",
            "FR",
            3.4,
            28000,
            "(877) 600-1511",
            "frontier.com",
            "DSL/fiber multi-state",
            False,
            [
                "AL", "AZ", "CA", "CT", "FL", "GA", "IL", "IN", "MN", "MS", "NC", "NM", "NY", "OH", "PA", "SC",
                "TN", "TX", "WI", "WV",
            ],
        ),
        (
            "v-net-lumen",
            "Quantum Fiber (Lumen)",
            "LU",
            3.5,
            14000,
            "(866) 642-0444",
            "lumen.com",
            "Metro fiber clusters",
            False,
            ["AZ", "CO", "FL", "IA", "ID", "MN", "MO", "NM", "NC", "OR", "TN", "TX", "UT", "WA", "WI"],
        ),
        (
            "v-net-windstream",
            "Kinetic by Windstream",
            "WK",
            3.3,
            11000,
            "(800) 347-1991",
            "windstream.com",
            "DSL/fiber rural",
            False,
            ["AL", "AR", "FL", "GA", "IA", "KY", "MS", "MO", "NC", "NE", "NM", "NY", "OH", "OK", "PA", "SC", "TX"],
        ),
        (
            "v-net-google",
            "Google Fiber",
            "GF",
            4.3,
            9000,
            "(866) 777-7550",
            "fiber.google.com",
            "Select metros",
            False,
            ["AL", "AZ", "CO", "FL", "GA", "IA", "ID", "KS", "MO", "NC", "NE", "TN", "TX", "UT", "WA"],
        ),
        (
            "v-net-tmobile",
            "T-Mobile Home Internet",
            "TM",
            4.0,
            25000,
            "(844) 275-9310",
            "t-mobile.com",
            "5G fixed wireless",
            True,
            US,
        ),
        (
            "v-net-vz5g",
            "Verizon 5G Home Internet",
            "V5",
            4.1,
            19000,
            "(800) 922-0204",
            "verizon.com/home",
            "5G fixed wireless",
            True,
            US,
        ),
        (
            "v-net-starlink",
            "Starlink",
            "ST",
            4.0,
            31000,
            "(888) 886-6790",
            "starlink.com",
            "Satellite broadband",
            True,
            US,
        ),
        (
            "v-net-hughes",
            "Hughesnet",
            "HU",
            3.2,
            22000,
            "(866) 347-3292",
            "hughesnet.com",
            "Satellite broadband",
            True,
            US,
        ),
        (
            "v-net-viasat",
            "Viasat Internet",
            "VS",
            3.1,
            15000,
            "(855) 463-9333",
            "viasat.com",
            "Satellite broadband",
            True,
            US,
        ),
        (
            "v-net-metronet",
            "Metronet",
            "ME",
            4.2,
            4500,
            "(855) 769-0936",
            "metronet.com",
            "Fiber Midwest/Southeast",
            False,
            ["IL", "IN", "IA", "KY", "MI", "MN", "MO", "OH", "NC", "FL", "TX", "WI"],
        ),
        (
            "v-net-wow",
            "WOW! Internet",
            "WW",
            3.6,
            8000,
            "(855) 969-4249",
            "wowway.com",
            "Cable Midwest/Southeast",
            False,
            ["AL", "FL", "GA", "IL", "IN", "MI", "SC", "TN"],
        ),
        (
            "v-net-ziply",
            "Ziply Fiber",
            "ZF",
            4.3,
            6000,
            "(866) 947-8439",
            "ziplyfiber.com",
            "Pacific Northwest fiber",
            False,
            ["WA", "OR", "ID", "MT"],
        ),
        (
            "v-net-rise",
            "Rise Broadband",
            "RB",
            3.5,
            5200,
            "(877) 910-6201",
            "risebroadband.com",
            "Fixed wireless / rural",
            False,
            ["CO", "IA", "ID", "IL", "IN", "KS", "NE", "NV", "OK", "TX", "WY"],
        ),
        (
            "v-net-mediacom",
            "Mediacom",
            "MC",
            3.4,
            9000,
            "(855) 633-4226",
            "mediacomcable.com",
            "Cable Midwest/South",
            False,
            ["AL", "AZ", "GA", "IA", "IL", "IN", "KS", "MN", "MO", "MS", "TN", "WI"],
        ),
    ]

    for t in internet:
        key, name, ini, rat, rev, ph, web, area, nat, sts = t
        add_vendor_plans(key, name, "internet", ini, rat, rev, ph, web, area, nat, sts)

    movers = [
        ("v-mv-united", "United Van Lines", "UV", 4.1, 7800, "(800) 348-4887", "unitedvanlines.com", "National full-service", True, US),
        ("v-mv-mayflower", "Mayflower Transit", "MY", 4.0, 5600, "(877) 720-7725", "mayflower.com", "National van line", True, US),
        ("v-mv-allied", "Allied Van Lines", "AD", 4.0, 6200, "(988) 507-4624", "allied.com", "National van line", True, US),
        ("v-mv-northam", "North American Van Lines", "NA", 4.0, 5100, "(800) 228-3092", "northamerican.com", "National van line", True, US),
        ("v-mv-atlas", "Atlas Van Lines", "AT", 4.1, 4800, "(800) 638-9797", "atlasvanlines.com", "National agent network", True, US),
        ("v-mv-twomen", "Two Men and a Truck", "2M", 4.3, 14000, "(800) 263-0044", "twomenandatruck.com", "Franchise network", True, US),
        ("v-mv-upack", "U-Pack (ABF)", "UP", 4.5, 12000, "(844) 594-3077", "upack.com", "DIY container long-distance", True, US),
        ("v-mv-pods", "PODS Moving & Storage", "PD", 4.2, 17000, "(855) 706-4758", "pods.com", "Portable containers", True, US),
        ("v-mv-packrat", "1-800-PACK-RAT", "PR", 4.1, 9800, "(800) 722-5728", "1800packrat.com", "Portable storage", True, US),
        ("v-mv-bellhops", "Bellhop Moving", "BH", 4.0, 7200, "(800) 373-8393", "getbellhops.com", "Local booking platform", True, US),
        ("v-mv-flatrate", "FlatRate Moving", "FR", 4.4, 3200, "(212) 988-1543", "flatrate.com", "NYC metro", False, ["NY", "NJ", "CT"]),
        ("v-mv-piece", "Piece of Cake Moving", "PC", 4.6, 4100, "(212) 651-7273", "pieceofcakemoving.com", "NYC focused", False, ["NY", "NJ"]),
        ("v-mv-roadway", "Roadway Moving", "RW", 4.5, 2800, "(212) 780-4564", "roadwaymoving.com", "NYC tri-state", False, ["NY", "NJ", "CT"]),
    ]

    for t in movers:
        key, name, ini, rat, rev, ph, web, area, nat, sts = t
        add_vendor_plans(
            key,
            name,
            "movers",
            ini,
            rat,
            rev,
            ph,
            web,
            area,
            nat,
            sts,
            plan_suffix="quote",
            plan_name="Binding or non-binding quote (varies)",
            price="Quote",
            unit=" total",
            feats=[
                "Inventory-based pricing",
                "Confirm valuation and insurance",
                "Informational — not a firm quote",
            ],
        )

    electric = [
        ("v-el-coned", "Con Edison", "CE", 3.8, 12400, "(800) 752-6633", "coned.com", "NYC + Westchester", ["NY"]),
        ("v-el-ngrid", "National Grid (US)", "NG", 3.7, 9800, "(800) 322-3223", "nationalgridus.com", "NY/MA/RI/NH", ["NY", "MA", "RI", "NH"]),
        ("v-el-eversource", "Eversource Energy", "EV", 3.7, 8600, "(800) 592-2000", "eversource.com", "CT/MA/NH", ["CT", "MA", "NH"]),
        ("v-el-pseg", "PSEG", "PS", 3.6, 7200, "(800) 490-0025", "pseg.com", "NJ / Long Island", ["NJ", "NY"]),
        ("v-el-peco", "PECO (Exelon)", "PE", 3.7, 6500, "(800) 494-4000", "peco.com", "Southeast PA", ["PA"]),
        ("v-el-ppl", "PPL Electric", "PP", 3.6, 5400, "(800) 342-5775", "pplelectric.com", "Central/Eastern PA", ["PA"]),
        ("v-el-pge", "Pacific Gas & Electric", "PG", 3.5, 21000, "(800) 743-5000", "pge.com", "Northern/Central CA", ["CA"]),
        ("v-el-sce", "Southern California Edison", "SC", 3.6, 19000, "(800) 974-2356", "sce.com", "Southern CA", ["CA"]),
        ("v-el-sdge", "San Diego Gas & Electric", "SD", 3.7, 8200, "(800) 411-7343", "sdge.com", "San Diego region", ["CA"]),
        ("v-el-ladwp", "LADWP", "LW", 3.9, 5600, "(800) 342-5397", "ladwp.com", "Los Angeles municipal", ["CA"]),
        ("v-el-fpl", "Florida Power & Light", "FP", 3.8, 15000, "(800) 226-3547", "fpl.com", "Florida IOU", ["FL"]),
        ("v-el-duke", "Duke Energy", "DK", 3.7, 24000, "(800) 777-9898", "duke-energy.com", "Carolinas/Midwest/FL", ["NC", "SC", "FL", "IN", "OH", "KY", "TN"]),
        ("v-el-dominion", "Dominion Energy", "DM", 3.6, 11000, "(866) 366-4357", "dominionenergy.com", "VA/NC/SC/UT/WY (regional)", ["VA", "NC", "SC", "UT", "WY", "ID"]),
        ("v-el-southern", "Southern Company", "SO", 3.7, 13000, "(888) 660-5890", "southerncompany.com", "AL/GA/MS", ["AL", "GA", "MS"]),
        ("v-el-tva", "Tennessee Valley region distributors", "TV", 3.8, 4000, "(865) 632-2101", "tva.com", "TVA power region", ["TN", "AL", "KY", "MS", "NC", "GA", "VA"]),
        ("v-el-xcel", "Xcel Energy", "XE", 3.7, 9000, "(800) 895-4999", "xcelenergy.com", "Upper Midwest / Plains / TX / NM", ["MN", "WI", "MI", "ND", "SD", "CO", "NM", "TX"]),
        ("v-el-bge", "BGE (Exelon)", "BG", 3.6, 4800, "(800) 685-0123", "bge.com", "Central Maryland", ["MD"]),
        ("v-el-we", "WEC Energy Group", "WE", 3.7, 4500, "(800) 242-9137", "wecenergygroup.com", "WI/MI", ["WI", "MI"]),
        ("v-el-aps", "Arizona Public Service", "AP", 3.8, 6200, "(800) 253-9405", "aps.com", "Arizona IOU", ["AZ"]),
        ("v-el-srp", "Salt River Project", "SR", 4.0, 5100, "(602) 236-8888", "srpnet.com", "Arizona public power", ["AZ"]),
        ("v-el-nve", "NV Energy", "NV", 3.7, 4900, "(702) 402-5555", "nvenergy.com", "Nevada IOU", ["NV"]),
        ("v-el-pnmp", "Rocky Mountain Power (PacifiCorp)", "RM", 3.6, 4300, "(888) 221-7070", "rockymountainpower.net", "UT/WY/ID/OR/WA", ["UT", "WY", "ID", "OR", "WA"]),
        ("v-el-pnm", "PNM", "PM", 3.6, 3200, "(888) 342-5766", "pnm.com", "New Mexico", ["NM"]),
        ("v-el-oge", "OG&E", "OG", 3.7, 3800, "(800) 627-8321", "oge.com", "Oklahoma", ["OK"]),
        ("v-el-aep", "American Electric Power", "AE", 3.6, 8900, "(866) 258-3782", "aep.com", "Multi-state service", ["AR", "IN", "KY", "LA", "MI", "OH", "OK", "TN", "TX", "VA", "WV"]),
        ("v-el-ent", "Entergy", "EN", 3.6, 6700, "(800) 368-3749", "entergy.com", "AR/LA/MS/TX", ["AR", "LA", "MS", "TX"]),
        ("v-el-ons", "Oncor (delivery)", "ON", 3.8, 7200, "(888) 313-6862", "oncor.com", "North/Central Texas wires", ["TX"]),
        ("v-el-cnp", "CenterPoint Energy (delivery)", "CP", 3.7, 6100, "(800) 332-7143", "centerpointenergy.com", "Houston area wires", ["TX"]),
        ("v-el-aus", "Austin Energy", "AU", 4.0, 2900, "(512) 494-9400", "austinenergy.com", "Austin municipal", ["TX"]),
        ("v-el-comed", "ComEd (Exelon)", "CD", 3.6, 9800, "(800) 334-7661", "comed.com", "Northern Illinois", ["IL"]),
        ("v-el-amern", "Ameren", "AM", 3.7, 7200, "(800) 755-5000", "ameren.com", "MO/IL", ["MO", "IL"]),
        ("v-el-nipsco", "NIPSCO", "NI", 3.5, 3500, "(800) 464-7726", "nipsco.com", "Northern Indiana", ["IN"]),
        ("v-el-dte", "DTE Energy", "DT", 3.7, 5600, "(800) 477-4747", "dteenergy.com", "SE Michigan", ["MI"]),
        ("v-el-consumers", "Consumers Energy", "CS", 3.7, 5200, "(800) 477-5050", "consumersenergy.com", "Lower Michigan", ["MI"]),
        ("v-el-bhec", "Berkshire Hathaway Energy utilities", "BH", 3.7, 4100, "(888) 467-2662", "berkshirehathawayenergyco.com", "IA/MN/UT/WY/OR/WA", ["IA", "MN", "UT", "WY", "OR", "WA"]),
        ("v-el-seattle", "Seattle City Light", "SL", 4.1, 3800, "(206) 684-3000", "seattle.gov/city-light", "Seattle public", ["WA"]),
        ("v-el-cps", "CPS Energy", "CP", 3.8, 4200, "(210) 353-2222", "cpsenergy.com", "San Antonio municipal", ["TX"]),
        ("v-el-lcec", "Lee County Electric Cooperative", "LC", 3.8, 1200, "(239) 656-2300", "lcec.net", "Southwest Florida cooperative", ["FL"]),
        ("v-el-avista", "Avista Utilities", "AV", 3.7, 3600, "(800) 227-9187", "myavista.com", "WA/ID", ["WA", "ID"]),
        ("v-el-pse", "Puget Sound Energy", "PS", 3.7, 4400, "(888) 225-5773", "pse.com", "Western WA", ["WA"]),
        ("v-el-booz", "Liberty Utilities / regulated brands", "LB", 3.6, 2800, "(855) 872-3242", "libertyutilities.com", "NH/MA/MO/IL/AR/KS/OK", ["NH", "MA", "MO", "IL", "AR", "KS", "OK"]),
        ("v-el-oppo", "Omaha Public Power District", "OP", 4.0, 2200, "(402) 536-4131", "oppd.com", "Eastern Nebraska public", ["NE"]),
        ("v-el-mu", "Municipal / rural: Mountain West", "MW", 3.7, 1500, "", "Local office", "MT/CO/WY/AK coverage placeholder", ["MT", "CO", "WY", "AK"]),
        ("v-el-me", "Versant Power / Emera Maine region", "ME", 3.6, 2100, "(207) 973-2000", "versantpower.com", "Northern/Eastern Maine", ["ME"]),
        ("v-el-ak", "Chugach Electric Association", "CH", 4.0, 1800, "(907) 762-4344", "chugachelectric.com", "Southcentral Alaska", ["AK"]),
        ("v-el-hi", "Hawaiian Electric (HECO/MECO/HELCO)", "HI", 3.6, 3400, "(808) 969-6666", "hawaiianelectric.com", "Hawaii investor-owned", ["HI"]),
        ("v-el-vt", "Green Mountain Power", "GM", 4.1, 2100, "(888) 835-4672", "greenmountainpower.com", "Vermont IOU", ["VT"]),
        ("v-el-de", "Delmarva Power (Exelon)", "DE", 3.6, 3100, "(800) 375-7117", "delmarva.com", "Delaware/Maryland", ["DE", "MD"]),
        ("v-el-ri", "Rhode Island Energy", "RI", 3.6, 1900, "(855) 743-1101", "rienergy.com", "Rhode Island delivery", ["RI"]),
        ("v-el-sdak", "Black Hills Energy electric", "BH", 3.6, 2600, "(888) 890-5554", "blackhillsenergy.com", "SD/WY/NE utilities", ["SD", "WY", "NE"]),
        ("v-el-constellation", "Constellation Energy (retail supply)", "CN", 3.5, 11000, "(877) 997-2941", "constellation.com", "Retail in deregulated markets", ["TX", "IL", "OH", "PA", "NY", "NJ", "MA", "MD", "DE", "DC"]),
        ("v-el-direct", "Direct Energy (retail supply)", "DX", 3.4, 9000, "(866) 684-0356", "directenergy.com", "Retail in deregulated markets", ["TX", "OH", "PA", "NY", "NJ", "MA", "MD", "IL"]),
    ]

    for key, name, ini, rat, rev, ph, web, area, sts in electric:
        add_vendor_plans(
            key,
            name,
            "electric",
            ini,
            rat,
            rev,
            ph,
            web,
            area,
            False,
            sts,
            plan_suffix="res",
            plan_name="Residential default / standard offer (varies)",
            price="Varies",
            unit="/kWh or /mo",
            feats=[
                "Rates and rider charges vary by tariff",
                "Verify delivery vs supply if market is deregulated",
                "Informational only — confirm with utility",
            ],
        )

    gas = [
        ("v-gas-coned", "Con Edison (gas)", "CG", 3.7, 6200, "(800) 752-6633", "coned.com", "NYC metro gas", ["NY", "NJ"]),
        ("v-gas-ngrid", "National Grid (US gas)", "GG", 3.6, 4800, "(800) 930-5003", "nationalgridus.com", "NY/MA/RI", ["NY", "MA", "RI"]),
        ("v-gas-socal", "SoCalGas", "SG", 3.7, 11000, "(800) 427-2200", "socalgas.com", "Southern CA gas", ["CA"]),
        ("v-gas-pge", "PG&E (gas)", "PG", 3.5, 9200, "(800) 743-5000", "pge.com", "Northern/Central CA gas", ["CA"]),
        ("v-gas-sdom", "Dominion Energy South (gas)", "DG", 3.6, 6600, "(877) 866-9660", "dominionenergy.com", "Mid-Atlantic/Southeast gas", ["VA", "NC", "SC", "OH", "WV", "GA"]),
        ("v-gas-southern", "Atlanta Gas Light / Southern Company Gas", "AG", 3.7, 5400, "(800) 427-5460", "southernco.com", "Southeast LDC", ["GA", "AL", "TN"]),
        ("v-gas-spire", "Spire", "SP", 3.6, 4100, "(800) 887-4173", "spireenergy.com", "MO/AL/Mississippi region", ["MO", "AL", "MS"]),
        ("v-gas-nicor", "Nicor Gas", "NI", 3.7, 5200, "(888) 642-6748", "nicorgas.com", "Northern Illinois gas", ["IL"]),
        ("v-gas-peoples", "Peoples Gas", "PG", 3.6, 3900, "(866) 556-6001", "peoplesgasdelivery.com", "Chicago gas", ["IL"]),
        ("v-gas-centerpointg", "CenterPoint Energy (gas)", "CN", 3.6, 5800, "(800) 227-1376", "centerpointenergy.com", "AR/LA/MN/MS/OK/TX", ["AR", "LA", "MN", "MS", "OK", "TX"]),
        ("v-gas-atmos", "Atmos Energy", "AT", 3.7, 7200, "(888) 286-6700", "atmosenergy.com", "Multi-state gas LDC", ["TX", "LA", "MS", "AL", "TN", "KY", "CO", "KS"]),
        ("v-gas-nwn", "NW Natural", "NW", 3.8, 3600, "(800) 422-4012", "nwnatural.com", "OR/WA", ["OR", "WA"]),
        ("v-gas-xcelg", "Xcel Energy (gas)", "XG", 3.6, 3400, "(800) 895-4999", "xcelenergy.com", "Gas in Xcel states", ["MN", "WI", "ND", "SD", "CO", "MI"]),
        ("v-gas-wgl", "Washington Gas / AltaGas", "WG", 3.6, 3300, "(844) 927-4327", "washingtongas.com", "DC/MD/VA", ["DC", "MD", "VA"]),
        ("v-gas-ugi", "UGI Utilities", "UG", 3.6, 3100, "(800) 844-9276", "ugi.com", "PA utility gas", ["PA"]),
        ("v-gas-sji", "South Jersey Gas", "SJ", 3.5, 2800, "(800) 582-7060", "southjerseygas.com", "Southern NJ", ["NJ"]),
        ("v-gas-elpaso", "El Paso Natural Gas / Xcel NM cluster", "EP", 3.6, 2400, "(800) 654-2765", "epelectric.com", "El Paso region / NM", ["TX", "NM"]),
        ("v-gas-cos", "Colorado Natural Gas / Black Hills CO", "CO", 3.6, 2200, "(844) 370-0998", "blackhillsenergy.com", "CO gas utilities", ["CO"]),
        ("v-gas-mt", "Northwestern Energy (gas)", "MT", 3.6, 1900, "(888) 467-2662", "northwesternenergy.com", "MT/SD", ["MT", "SD"]),
        ("v-gas-akhi", "Hawaii gas utilities (city gas)", "HG", 3.5, 900, "", "local office", "HI propane/LNG pockets", ["HI"]),
    ]

    for key, name, ini, rat, rev, ph, web, area, sts in gas:
        add_vendor_plans(
            key,
            name,
            "gas",
            ini,
            rat,
            rev,
            ph,
            web,
            area,
            False,
            sts,
            plan_suffix="res",
            plan_name="Residential gas service (rate varies)",
            price="Varies",
            unit="/therm or /mo",
            feats=[
                "Supply vs utility charges vary",
                "Winter balancing and riders apply in many states",
                "Informational only — confirm with LDC",
            ],
        )

    out.append("COMMIT;")
    root = Path(__file__).resolve().parents[1]
    dest = root / "scripts" / "sql" / "vendor_catalog_seed.sql"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote {dest}")


if __name__ == "__main__":
    main()
