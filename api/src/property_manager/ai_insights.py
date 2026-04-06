"""LLM-driven competitive intelligence narrative with persistent DB cache."""

from __future__ import annotations

import hashlib
import json
from typing import Any

import httpx
from sqlalchemy import text

from core.logger import get_logger
from property_manager.schemas import (
    AiInsightSection,
    AiSummary,
    AmenityAnalysis,
    BuildingFinancials,
    CompetitorPosition,
    DemographicsOut,
    FeeIntelligence,
    MarketSnapshotResponse,
    SupplyPressure,
)
from workflow.utils import engine

logger = get_logger(__name__)
_LLM_TIMEOUT_SECONDS = 90.0
_LLM_MAX_RETRIES = 2

_SYSTEM_PROMPT = """\
You are a senior real estate market analyst writing a competitive intelligence \
brief for a property manager. You receive structured market data for a radius \
around their property and produce sharp, actionable insights.

Rules:
- Be specific: cite numbers, building names, and percentages from the data.
- Be opinionated: say what the PM should *do*, not just what the numbers are.
- Keep each section 2-4 sentences. No filler.
- Use plain language a busy property manager would appreciate.
- Do NOT repeat raw data tables — the PM already sees those. Synthesize.
- Focus on what is surprising, what is an opportunity, and what is a risk.

Return valid JSON with this exact structure:
{
  "headline": "One punchy sentence summarizing the market position",
  "sections": [
    {"title": "section title", "body": "section content"}
  ]
}

Include these sections (skip any where data is insufficient):
1. "Market Position" — where does the area sit on the affordability spectrum? \
   Is rent running ahead of what locals can afford?
2. "Pricing Strategy" — based on competitor positioning and $/sqft, \
   what pricing moves make sense?
3. "Fee Opportunities" — where is money being left on the table or \
   where are fees out of line with the market?
4. "Supply & Demand" — is the market tight or loose? Which unit types \
   are oversaturated vs. scarce?
5. "Amenity Gaps" — what amenities could differentiate the property? \
   What do competitors mostly lack?
6. "Risk Factors" — anything in the data that signals trouble \
   (e.g. high vacancy in a segment, rents above affordability ceiling)?
7. "Building Economics" — if building_financials data is provided, \
   what does the asking-vs-in-place rent gap reveal? Are buildings \
   in the area likely under-rented or over-rented relative to their \
   assessed income? What does value-per-unit tell us about asset \
   quality vs. rent levels? Note: in-place rents are *estimated* from \
   NYC DOF assessed market values using income capitalization.
8. "Trend Analysis" — if trends data is provided, comment on the \
   direction of rents and vacancy over recent weeks. Is the market \
   tightening or loosening? Are rents accelerating or decelerating? \
   Which specific competitors are making notable pricing moves? \
   Only include this section when trends data is present in the input.
"""


def _build_data_payload(
    market: MarketSnapshotResponse,
    demographics: DemographicsOut | None,
    competitors: list[CompetitorPosition],
    fee_intelligence: FeeIntelligence,
    supply_pressure: SupplyPressure,
    amenities: AmenityAnalysis,
    building_financials: BuildingFinancials | None = None,
    trend_data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Assemble the structured data dict sent to the LLM."""
    d: dict[str, Any] = {}

    d["market"] = {
        "scope": market.scope,
        "sample_size": market.sample_size,
        "median_rent": market.median_rent,
        "p25_rent": market.p25_rent,
        "p75_rent": market.p75_rent,
        "bedroom_mix": market.bedroom_mix,
    }

    if demographics:
        d["demographics"] = {
            "zip_code": demographics.zip_code,
            "median_household_income": demographics.median_household_income,
            "population": demographics.population,
            "renter_pct": demographics.renter_pct,
            "census_median_rent": demographics.census_median_rent,
            "affordability_ceiling": demographics.affordability_ceiling,
            "affordable_pct": demographics.affordable_pct,
            "renter_pool_size": demographics.renter_pool_size,
        }

    if competitors:
        d["competitors"] = [
            {
                "name": c.name,
                "unit_count": c.unit_count,
                "median_rent": c.median_rent,
                "rent_per_sqft": c.rent_per_sqft,
                "vs_median_pct": c.vs_median_pct,
                "position_label": c.position_label,
            }
            for c in competitors[:20]  # cap to keep prompt manageable
        ]

    d["fee_intelligence"] = {
        "total_buildings_with_fees": fee_intelligence.total_buildings_with_fees,
        "categories": [
            {
                "label": f.label,
                "pct_buildings": f.pct_buildings,
                "median_amount": f.median_amount,
                "min_amount": f.min_amount,
                "max_amount": f.max_amount,
            }
            for f in (fee_intelligence.fee_categories or [])[:15]
        ],
    }

    d["supply_pressure"] = {
        "total_units": supply_pressure.total_units,
        "available_units": supply_pressure.available_units,
        "vacancy_rate_pct": supply_pressure.vacancy_rate_pct,
        "listing_sample_vacancy_rate_pct": supply_pressure.listing_sample_vacancy_rate_pct,
        "estimated_market_units": supply_pressure.estimated_market_units,
        "estimated_unlisted_units": supply_pressure.estimated_unlisted_units,
        "unlisted_market_share_pct": supply_pressure.unlisted_market_share_pct,
        "assumed_unlisted_vacancy_pct": supply_pressure.assumed_unlisted_vacancy_pct,
        "by_bedroom": [
            {"beds": b.beds, "total": b.total, "available": b.available, "vacancy_pct": b.vacancy_pct}
            for b in (supply_pressure.by_bedroom or [])
        ],
    }

    if amenities and amenities.total_buildings > 0:
        d["amenities"] = {
            "total_buildings": amenities.total_buildings,
            "standard": [a.amenity for a in (amenities.standard or [])],
            "differentiators": [a.amenity for a in (amenities.differentiators or [])],
            "rare": [a.amenity for a in (amenities.rare or [])],
        }

    if building_financials and building_financials.building_count > 0:
        d["building_financials"] = {
            "building_count": building_financials.building_count,
            "total_units": building_financials.total_units,
            "median_value_per_unit": building_financials.median_value_per_unit,
            "median_value_per_sqft": building_financials.median_value_per_sqft,
            "median_estimated_in_place_rent": building_financials.median_estimated_in_place_rent,
            "median_asking_rent": building_financials.median_asking_rent,
            "asking_vs_in_place_gap_pct": building_financials.median_asking_vs_in_place_gap_pct,
            "cap_rate_used": building_financials.cap_rate_used,
            "expense_ratio_used": building_financials.expense_ratio_used,
            "top_buildings_by_value": [
                {
                    "address": b.address,
                    "units": b.units_res,
                    "market_value": b.market_value,
                    "value_per_unit": b.value_per_unit,
                    "est_in_place_rent": b.estimated_avg_in_place_rent,
                    "asking_gap_pct": b.asking_vs_in_place_gap_pct,
                    "year_built": b.year_built,
                }
                for b in (building_financials.buildings or [])[:10]
            ],
        }

    if trend_data:
        d["trends"] = trend_data

    return d


def _cache_key(data: dict[str, Any]) -> str:
    raw = json.dumps(data, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()


def _cache_get(key: str) -> AiSummary | None:
    try:
        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT response_json FROM insight_llm_cache WHERE cache_key = :k"),
                {"k": key},
            ).fetchone()
            if row:
                return AiSummary(**json.loads(row[0]))
    except Exception:
        logger.debug("insight cache miss or table not ready", exc_info=True)
    return None


def _cache_set(key: str, summary: AiSummary) -> None:
    try:
        with engine.connect() as conn:
            conn.execute(
                text("""
                    INSERT INTO insight_llm_cache (cache_key, response_json)
                    VALUES (:k, :v)
                    ON CONFLICT (cache_key) DO UPDATE SET response_json = :v, created_at = now()
                """),
                {"k": key, "v": summary.model_dump_json()},
            )
            conn.commit()
    except Exception:
        logger.debug("insight cache write failed", exc_info=True)


def _call_llm(data: dict[str, Any]) -> AiSummary:
    """Call the LLM via LlamaIndex and parse structured JSON response."""
    from core.config import Config
    from llama_index.core.base.llms.types import ChatMessage, MessageRole
    from llama_index.llms.azure_openai import AzureOpenAI
    from llama_index.llms.openai import OpenAI

    endpoint = (Config.get("AZURE_OPENAI_ENDPOINT", "") or "").strip()
    if endpoint and Config.get("AZURE_OPENAI_API_KEY") and Config.get("AZURE_OPENAI_DEPLOYMENT"):
        llm = AzureOpenAI(
            azure_endpoint=endpoint.rstrip("/"),
            api_key=Config.get("AZURE_OPENAI_API_KEY"),
            engine=Config.get("AZURE_OPENAI_DEPLOYMENT"),
            model=Config.get("AZURE_OPENAI_MODEL", "gpt-5-nano"),
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            timeout=_LLM_TIMEOUT_SECONDS,
            max_retries=_LLM_MAX_RETRIES,
            max_tokens=None,
            # Keep this high: PM output is a structured multi-section JSON brief.
            # Do not reduce max_completion_tokens unless product scope explicitly changes.
            additional_kwargs={"max_completion_tokens": 16000},
        )
    else:
        llm = OpenAI(
            api_key=Config.get("OPENAI_API_KEY"),
            model=Config.get("OPENAI_MODEL", "gpt-4.1"),
            timeout=_LLM_TIMEOUT_SECONDS,
            max_retries=_LLM_MAX_RETRIES,
            max_tokens=None,
            # Keep this high: PM output is a structured multi-section JSON brief.
            # Do not reduce max_completion_tokens unless product scope explicitly changes.
            additional_kwargs={"max_completion_tokens": 16000},
        )

    user_msg = (
        "Here is the market data for the area. Produce your analysis as JSON.\n\n"
        + json.dumps(data, indent=2, default=str)
    )

    response = llm.chat([
        ChatMessage(role=MessageRole.SYSTEM, content=_SYSTEM_PROMPT),
        ChatMessage(role=MessageRole.USER, content=user_msg),
    ])
    content = response.message.content
    if not content:
        raise ValueError("LLM returned empty content")
    raw = content.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        lines = raw.split("\n")
        lines = lines[1:]  # drop opening fence
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        raw = "\n".join(lines)

    parsed = json.loads(raw)
    return AiSummary(
        headline=parsed.get("headline", ""),
        sections=[
            AiInsightSection(title=s["title"], body=s["body"])
            for s in parsed.get("sections", [])
            if s.get("title") and s.get("body")
        ],
    )


def _is_timeout_error(exc: Exception) -> bool:
    if isinstance(exc, httpx.TimeoutException):
        return True
    # Keep this resilient even if OpenAI import path changes.
    return exc.__class__.__name__ == "APITimeoutError"


def generate_ai_summary(
    market: MarketSnapshotResponse,
    demographics: DemographicsOut | None,
    competitors: list[CompetitorPosition],
    fee_intelligence: FeeIntelligence,
    supply_pressure: SupplyPressure,
    amenities: AmenityAnalysis,
    building_financials: BuildingFinancials | None = None,
    trend_data: dict[str, Any] | None = None,
) -> AiSummary | None:
    """Generate (or return cached) AI narrative summary. Returns None on failure."""
    data = _build_data_payload(
        market, demographics, competitors, fee_intelligence, supply_pressure, amenities,
        building_financials=building_financials,
        trend_data=trend_data,
    )

    key = _cache_key(data)
    cached = _cache_get(key)
    if cached is not None:
        logger.info("AI insight cache HIT (%s)", key[:12])
        return cached

    logger.info("AI insight cache MISS — calling LLM (%s)", key[:12])
    try:
        summary = _call_llm(data)
        _cache_set(key, summary)
        return summary
    except Exception as exc:
        if _is_timeout_error(exc):
            logger.warning("AI insight generation timed out (%s)", key[:12])
            return None
        logger.exception("AI insight generation failed")
        return None
