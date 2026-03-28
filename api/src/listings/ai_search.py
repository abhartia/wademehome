from __future__ import annotations

import asyncio
import hashlib
import re
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from threading import Lock
from typing import Any

from openai import AzureOpenAI as AzureOpenAIClient
from openai import OpenAI as OpenAIClient
from pydantic import BaseModel, Field
from sqlalchemy import text
from llama_index.core.base.llms.types import ChatMessage, ChatResponse
from llama_index.core.llms import LLM

from core.config import Config
from core.logger import get_logger
from prompts.loader import load_app_prompt
from workflow.utils import get_engine
from listings.listings_table_cache import cached_execute_all, cached_execute_scalar
from listings.nearby_mapper import property_list_from_sql_rows
from workflow.events import PropertyDataItem, PropertyDataList


SEARCH_QUERY_PLAN_SYSTEM = load_app_prompt("search_query_plan")
logger = get_logger(__name__)

_PLAN_CACHE_TTL_S = 300.0
_PLAN_CACHE_MAX = 256
_plan_cache_lock = Lock()
_plan_cache: dict[str, tuple[float, "SearchQueryPlan"]] = {}

# Terms matched with LIKE against listing blobs rarely contain these; keep them in semantic ranker.
# Multi-word phrases ending like a neighborhood; listing blobs rarely repeat them verbatim.
_GEO_NEIGHBORHOOD_TAIL = re.compile(
    r"\b(heights|village|gardens|hills|plaza|slope|terrace|point|bay|beach|square|center|centre|borough|downtown)\b$",
    re.I,
)

_SOFT_MUST_HAVE_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"\bsubway\b", re.I),
    re.compile(r"\bmetro\b", re.I),
    re.compile(r"\btransit\b", re.I),
    re.compile(r"\btrain\b", re.I),
    re.compile(r"\bmta\b", re.I),
    re.compile(r"\bl\s*train\b", re.I),
    re.compile(r"\bbus\b", re.I),
    re.compile(r"\bwalkable\b", re.I),
    re.compile(r"\bwalking\s+distance\b", re.I),
    re.compile(r"\bclose\s+to\b", re.I),
    re.compile(r"\bnear\b", re.I),
    re.compile(r"\bproximity\b", re.I),
    re.compile(r"\bcommute\b", re.I),
)

_STATE_EQUIV: dict[str, tuple[str, ...]] = {
    "al": ("al", "alabama"),
    "ak": ("ak", "alaska"),
    "az": ("az", "arizona"),
    "ar": ("ar", "arkansas"),
    "ca": ("ca", "california"),
    "co": ("co", "colorado"),
    "ct": ("ct", "connecticut"),
    "de": ("de", "delaware"),
    "fl": ("fl", "florida"),
    "ga": ("ga", "georgia"),
    "hi": ("hi", "hawaii"),
    "id": ("id", "idaho"),
    "il": ("il", "illinois"),
    "in": ("in", "indiana"),
    "ia": ("ia", "iowa"),
    "ks": ("ks", "kansas"),
    "ky": ("ky", "kentucky"),
    "la": ("la", "louisiana"),
    "me": ("me", "maine"),
    "md": ("md", "maryland"),
    "ma": ("ma", "massachusetts"),
    "mi": ("mi", "michigan"),
    "mn": ("mn", "minnesota"),
    "ms": ("ms", "mississippi"),
    "mo": ("mo", "missouri"),
    "mt": ("mt", "montana"),
    "ne": ("ne", "nebraska"),
    "nv": ("nv", "nevada"),
    "nh": ("nh", "new hampshire"),
    "nj": ("nj", "new jersey"),
    "nm": ("nm", "new mexico"),
    "ny": ("ny", "new york"),
    "nc": ("nc", "north carolina"),
    "nd": ("nd", "north dakota"),
    "oh": ("oh", "ohio"),
    "ok": ("ok", "oklahoma"),
    "or": ("or", "oregon"),
    "pa": ("pa", "pennsylvania"),
    "ri": ("ri", "rhode island"),
    "sc": ("sc", "south carolina"),
    "sd": ("sd", "south dakota"),
    "tn": ("tn", "tennessee"),
    "tx": ("tx", "texas"),
    "ut": ("ut", "utah"),
    "vt": ("vt", "vermont"),
    "va": ("va", "virginia"),
    "wa": ("wa", "washington"),
    "wv": ("wv", "west virginia"),
    "wi": ("wi", "wisconsin"),
    "wy": ("wy", "wyoming"),
    "dc": ("dc", "district of columbia", "d.c."),
}


class SearchQueryPlan(BaseModel):
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    search_radius_miles: float | None = None
    min_rent: float | None = None
    max_rent: float | None = None
    min_bedrooms: float | None = None
    max_bedrooms: float | None = None
    must_have_terms: list[str] = Field(default_factory=list)
    must_not_have_terms: list[str] = Field(default_factory=list)
    soft_preferences: list[str] = Field(default_factory=list)
    semantic_query: str = ""
    summary_headline: str = "Property search"
    summary_bullets: list[str] = Field(default_factory=list)


class SearchCriterionBreakdownItem(BaseModel):
    key: str
    label: str
    excluded_count: int = Field(ge=0)
    matched_count: int = Field(ge=0)
    eligible_without_this_rule: int = Field(ge=0)


@dataclass
class SearchRunResult:
    properties: PropertyDataList
    breakdown: list[SearchCriterionBreakdownItem]
    matched_count: int
    limit_cap: int
    timings_ms: dict[str, int]


def _qualified_table() -> str:
    table = (Config.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (Config.get("LISTINGS_TABLE_SCHEMA") or "").strip()
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _table_schema() -> str:
    return (Config.get("LISTINGS_TABLE_SCHEMA") or "").strip() or "public"


def _table_name() -> str:
    return (Config.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"


def _table_columns() -> set[str]:
    with get_engine().connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = :schema
                  AND table_name = :table
                """
            ),
            {"schema": _table_schema(), "table": _table_name()},
        )
        return {str(r[0]).lower() for r in rows}


def _pick_column(cols: set[str], *aliases: str) -> str | None:
    for alias in aliases:
        if alias.lower() in cols:
            return alias.lower()
    return None


def _demote_must_have_to_soft(plan: SearchQueryPlan) -> list[str]:
    """Move proximity/transit wording out of hard LIKE filters into soft/semantic ranking."""
    kept: list[str] = []
    demoted: list[str] = []
    for t in plan.must_have_terms:
        parts = t.strip().split()
        looks_geo = len(parts) >= 2 and bool(_GEO_NEIGHBORHOOD_TAIL.search(parts[-1]))
        if looks_geo or any(p.search(t) for p in _SOFT_MUST_HAVE_PATTERNS):
            demoted.append(t)
            if t not in plan.soft_preferences:
                plan.soft_preferences.append(t)
        else:
            kept.append(t)
    plan.must_have_terms = kept
    return demoted


def _normalize_terms(items: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for item in items:
        t = (item or "").strip()
        if not t:
            continue
        key = t.casefold()
        if key in seen:
            continue
        seen.add(key)
        out.append(t)
    return out


def _normalize_plan(raw: SearchQueryPlan, user_msg: str) -> SearchQueryPlan:
    plan = raw.model_copy(deep=True)
    plan.must_have_terms = _normalize_terms(plan.must_have_terms)
    plan.must_not_have_terms = _normalize_terms(plan.must_not_have_terms)
    plan.soft_preferences = _normalize_terms(plan.soft_preferences)
    demoted = _demote_must_have_to_soft(plan)
    if not plan.semantic_query.strip():
        plan.semantic_query = user_msg.strip()
    if demoted:
        plan.semantic_query = f"{plan.semantic_query.strip()} {' '.join(demoted)}".strip()
    if not plan.summary_headline.strip():
        plan.summary_headline = "Property search"
    plan.summary_bullets = [b.strip() for b in plan.summary_bullets if isinstance(b, str) and b.strip()][:5]
    return plan


async def extract_query_plan(
    llm: LLM,
    *,
    user_msg: str,
    chat_history: list[ChatMessage] | None,
) -> SearchQueryPlan:
    cache_key = _plan_cache_key(user_msg, chat_history)
    if cache_key:
        cached = _plan_cache_get(cache_key)
        if cached is not None:
            logger.info("search planner llm timing: cache_hit=true total_ms=0 ttft_ms=0")
            return cached

    t0 = time.perf_counter()
    history = chat_history or []
    messages = [
        ChatMessage(role="system", content=SEARCH_QUERY_PLAN_SYSTEM),
        *history[-10:],
        ChatMessage(role="user", content=user_msg),
    ]
    parsed = SearchQueryPlan()
    # LlamaIndex-only planner path: request JSON object + high output budget.
    # reasoning_effort is best-effort (model may ignore).
    variants: list[dict[str, Any]] = [
        {"response_format": {"type": "json_object"}, "max_tokens": 2000, "reasoning_effort": "none"},
        {"response_format": {"type": "json_object"}, "max_tokens": 2000, "reasoning_effort": "minimal"},
        {"response_format": {"type": "json_object"}, "max_tokens": 2000},
    ]
    for idx, kwargs in enumerate(variants):
        try:
            raw_resp = await llm.achat(messages=messages, **kwargs)
            parsed = _parse_plan_response(raw_resp)
            logger.info(
                "search planner llm variant=%s succeeded (reasoning_effort=%s)",
                idx,
                kwargs.get("reasoning_effort", "default"),
            )
            break
        except Exception:
            logger.exception(
                "search planner llamaindex json call failed variant=%s (reasoning_effort=%s)",
                idx,
                kwargs.get("reasoning_effort", "default"),
            )
    normalized = _normalize_plan(parsed, user_msg)
    logger.info(
        "search planner llm timing: cache_hit=false path=llamaindex_json total_ms=%s ttft_ms=n/a",
        int((time.perf_counter() - t0) * 1000),
    )
    if cache_key:
        _plan_cache_put(cache_key, normalized)
    return normalized


def _plan_cache_key(user_msg: str, chat_history: list[ChatMessage] | None) -> str:
    msg = (user_msg or "").strip()
    if not msg:
        return ""
    # Keep cache key compact: latest user intent + final assistant/user turns.
    history = chat_history or []
    tail: list[str] = []
    for m in history[-4:]:
        role = getattr(m, "role", "") or ""
        content = str(getattr(m, "content", "") or "")
        tail.append(f"{role}:{content}")
    raw = "\n".join([*tail, f"user:{msg}"])
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _plan_cache_get(key: str) -> SearchQueryPlan | None:
    now = time.monotonic()
    with _plan_cache_lock:
        hit = _plan_cache.get(key)
        if not hit:
            return None
        exp, plan = hit
        if exp <= now:
            _plan_cache.pop(key, None)
            return None
        return plan.model_copy(deep=True)


def _plan_cache_put(key: str, plan: SearchQueryPlan) -> None:
    now = time.monotonic()
    with _plan_cache_lock:
        if len(_plan_cache) >= _PLAN_CACHE_MAX:
            # Drop one soonest-to-expire item to keep this O(n) infrequent.
            oldest = min(_plan_cache.items(), key=lambda kv: kv[1][0])[0]
            _plan_cache.pop(oldest, None)
        _plan_cache[key] = (now + _PLAN_CACHE_TTL_S, plan.model_copy(deep=True))


def _parse_plan_response(resp: ChatResponse | None) -> SearchQueryPlan:
    if not resp or not resp.message:
        return SearchQueryPlan()
    content = resp.message.content
    if isinstance(content, dict):
        try:
            return SearchQueryPlan.model_validate(content)
        except Exception:
            return SearchQueryPlan()
    if isinstance(content, str):
        raw = content.strip()
        if raw.casefold() in {"none", "null", ""}:
            return SearchQueryPlan()
        try:
            return SearchQueryPlan.model_validate_json(raw)
        except Exception:
            return SearchQueryPlan()
    return SearchQueryPlan()


def _embed_query_text(query: str) -> list[float]:
    query = query.strip()
    if not query:
        return []

    endpoint = (Config.get("AZURE_OPENAI_ENDPOINT") or "").strip()
    azure_key = (Config.get("AZURE_OPENAI_API_KEY") or "").strip()
    azure_emb = (Config.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT") or "").strip()
    if endpoint and azure_key and azure_emb:
        client = AzureOpenAIClient(
            api_key=azure_key,
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            azure_endpoint=endpoint.rstrip("/"),
        )
        res = client.embeddings.create(model=azure_emb, input=query)
        return list(res.data[0].embedding)

    model = (Config.get("OPENAI_EMBEDDING_MODEL") or "text-embedding-3-small").strip()
    key = (Config.get("OPENAI_API_KEY") or "").strip()
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required for AI search embeddings")
    dims_raw = (Config.get("OPENAI_EMBEDDING_DIMENSIONS") or "1536").strip()
    dimensions = int(dims_raw)
    client = OpenAIClient(api_key=key)
    res = client.embeddings.create(model=model, input=query, dimensions=dimensions)
    return list(res.data[0].embedding)


def _vector_literal(vec: list[float]) -> str:
    return "[" + ",".join(f"{x:.8f}" for x in vec) + "]"


def _text_blob_expr(cols: set[str]) -> str:
    parts: list[str] = []
    for c in (
        _pick_column(cols, "search_doc"),
        _pick_column(cols, "description", "summary", "about", "long_description"),
        _pick_column(cols, "neighborhood", "area", "submarket", "district"),
        _pick_column(cols, "borough"),
        _pick_column(cols, "amenities", "community_amenities", "apartment_amenities", "building_amenities"),
        _pick_column(cols, "property_name", "building_name", "name", "title"),
        _pick_column(cols, "address", "street_address", "full_address", "formatted_address"),
    ):
        if c:
            parts.append(f'COALESCE("{c}"::text, \'\')')
    if not parts:
        return "''"
    return f"concat_ws(' ', {', '.join(parts)})"


def _property_projection(cols: set[str]) -> str:
    """Select only fields needed for PropertyDataItem mapping to reduce I/O."""
    wanted = (
        "property_id",
        "listing_id",
        "building_name",
        "property_name",
        "name",
        "title",
        "address",
        "street_address",
        "full_address",
        "formatted_address",
        "location",
        "city",
        "locality",
        "state",
        "state_code",
        "region",
        "zipcode",
        "zip",
        "postal_code",
        "latitude",
        "longitude",
        "lat",
        "lng",
        "lon",
        "rent_range",
        "rental_range",
        "price_range",
        "list_price_range",
        "min_rent",
        "max_rent",
        "monthly_rent",
        "rent_price",
        "rent",
        "price",
        "list_price",
        "bedroom_range",
        "bedrooms_display",
        "beds_range",
        "bedrooms",
        "bedroom_count",
        "beds",
        "num_bedrooms",
        "n_bedrooms",
        "amenities",
        "amenity_list",
        "features",
        "apartment_amenities",
        "community_amenities",
        "building_amenities",
        # Prefer pre-normalized image columns; avoid raw heavy JSON blobs.
        "images_urls",
        "image_urls",
        "image_url",
        "primary_image_url",
        "photo_url",
        "thumbnail_url",
        "listing_url",
        "listingurl",
        "source_url",
        "sourceurl",
        "url",
    )
    chosen = [c for c in wanted if c in cols]
    if not chosen:
        return "*"
    return ", ".join(f'"{c}"' for c in chosen)


def _number_expr(cols: set[str], aliases: tuple[str, ...]) -> str | None:
    col = _pick_column(cols, *aliases)
    if not col:
        return None
    return f'NULLIF(regexp_replace(COALESCE("{col}"::text, \'\'), \'[^0-9.]\', \'\', \'g\'), \'\')::double precision'


def _build_criteria(
    plan: SearchQueryPlan,
    cols: set[str],
    params: dict[str, Any],
) -> list[tuple[str, str, str]]:
    criteria: list[tuple[str, str, str]] = []

    city_col = _pick_column(cols, "city", "locality")
    if city_col and plan.city:
        params["city"] = plan.city.strip().lower()
        criteria.append(("city", f"City: {plan.city.strip()}", f'LOWER(TRIM("{city_col}"::text)) = :city'))

    state_col = _pick_column(cols, "state", "state_code", "region")
    if state_col and plan.state:
        raw = re.sub(r"\s+", " ", plan.state.strip().lower()).replace(".", "")
        variants = _STATE_EQUIV.get(raw, (raw,))
        label_st = plan.state.strip()
        if len(variants) == 1:
            params["state"] = variants[0]
            criteria.append(
                ("state", f"State: {label_st}", f'LOWER(TRIM("{state_col}"::text)) = :state')
            )
        else:
            parts = []
            for i, v in enumerate(variants):
                key = f"state_{i}"
                params[key] = v
                parts.append(f'LOWER(TRIM("{state_col}"::text)) = :{key}')
            criteria.append(("state", f"State: {label_st}", "(" + " OR ".join(parts) + ")"))

    zip_col = _pick_column(cols, "zipcode", "zip", "postal_code")
    if zip_col and plan.zip_code:
        zip5 = "".join(ch for ch in plan.zip_code if ch.isdigit())[:5]
        if zip5:
            params["zip5"] = zip5
            criteria.append(
                (
                    "zip_code",
                    f"ZIP: {zip5}",
                    f"LEFT(REGEXP_REPLACE(TRIM(\"{zip_col}\"::text), '[^0-9]', '', 'g'), 5) = :zip5",
                )
            )

    lat_col = _pick_column(cols, "latitude", "lat")
    lon_col = _pick_column(cols, "longitude", "lng", "lon")
    if plan.latitude is not None and plan.longitude is not None and plan.search_radius_miles:
        params["radius_m"] = float(plan.search_radius_miles) * 1609.344
        params["q_lat"] = float(plan.latitude)
        params["q_lon"] = float(plan.longitude)
        if lat_col and lon_col:
            geo_expr = (
                f'ST_DWithin(ST_SetSRID(ST_MakePoint("{lon_col}"::double precision, "{lat_col}"::double precision), 4326)::geography, '
                f"ST_SetSRID(ST_MakePoint(:q_lon, :q_lat), 4326)::geography, :radius_m)"
            )
        else:
            geo_expr = "TRUE"
        criteria.append(
            (
                "distance",
                f"Distance <= {plan.search_radius_miles:g} miles",
                geo_expr,
            )
        )

    rent_expr = _number_expr(cols, ("monthly_rent", "rent_price", "rent", "price", "list_price", "min_rent", "max_rent"))
    if rent_expr and plan.min_rent is not None:
        params["min_rent"] = float(plan.min_rent)
        criteria.append(("min_rent", f"Rent >= ${int(plan.min_rent)}", f"({rent_expr}) >= :min_rent"))
    if rent_expr and plan.max_rent is not None:
        params["max_rent"] = float(plan.max_rent)
        criteria.append(("max_rent", f"Rent <= ${int(plan.max_rent)}", f"({rent_expr}) <= :max_rent"))

    beds_expr = _number_expr(cols, ("bedrooms", "bedroom_count", "beds", "num_bedrooms", "n_bedrooms"))
    if beds_expr and plan.min_bedrooms is not None:
        params["min_bedrooms"] = float(plan.min_bedrooms)
        criteria.append(
            ("min_bedrooms", f"Beds >= {plan.min_bedrooms:g}", f"({beds_expr}) >= :min_bedrooms")
        )
    if beds_expr and plan.max_bedrooms is not None:
        params["max_bedrooms"] = float(plan.max_bedrooms)
        criteria.append(
            ("max_bedrooms", f"Beds <= {plan.max_bedrooms:g}", f"({beds_expr}) <= :max_bedrooms")
        )

    blob = _text_blob_expr(cols)
    if plan.must_have_terms:
        pieces: list[str] = []
        for i, term in enumerate(plan.must_have_terms):
            key = f"must_have_{i}"
            params[key] = f"%{term.lower()}%"
            pieces.append(f"LOWER({blob}) LIKE :{key}")
        criteria.append(("must_have_terms", "Must include requested terms", "(" + " AND ".join(pieces) + ")"))
    if plan.must_not_have_terms:
        pieces = []
        for i, term in enumerate(plan.must_not_have_terms):
            key = f"must_not_{i}"
            params[key] = f"%{term.lower()}%"
            pieces.append(f"LOWER({blob}) NOT LIKE :{key}")
        criteria.append(("must_not_have_terms", "Exclude unwanted terms", "(" + " AND ".join(pieces) + ")"))

    return criteria


def _fetch_listing_rows(
    qtable: str,
    all_expr: str,
    order_sql: str,
    params: dict[str, Any],
    select_cols: str,
) -> tuple[list[Any], int]:
    t_sel = time.perf_counter()
    with get_engine().connect() as conn:
        rows = list(
            cached_execute_all(
                conn,
                text(
                    f"""
                    SELECT {select_cols}
                    FROM {qtable}
                    WHERE {all_expr}
                    ORDER BY {order_sql}
                    LIMIT :limit_rows
                    """
                ),
                params,
            )
        )
    return rows, int((time.perf_counter() - t_sel) * 1000)


def run_fast_search(
    plan: SearchQueryPlan,
    *,
    query_embedding: list[float],
    limit: int = 60,
) -> SearchRunResult:
    cols = _table_columns()
    select_cols = _property_projection(cols)
    params: dict[str, Any] = {}
    criteria = _build_criteria(plan, cols, params)
    all_expr = " AND ".join(expr for _, _, expr in criteria) if criteria else "TRUE"
    qtable = _qualified_table()
    limit = max(1, min(200, int(limit)))
    params["limit_rows"] = limit

    ranking_bits: list[str] = []
    if query_embedding and "embedding" in cols:
        vec = _vector_literal(query_embedding)
        # Keep rows with NULL embeddings at the end during partial backfills.
        ranking_bits.append('"embedding" IS NULL ASC')
        ranking_bits.append(f'("embedding" <=> \'{vec}\'::vector) ASC')

    lat_col = _pick_column(cols, "latitude", "lat")
    lon_col = _pick_column(cols, "longitude", "lng", "lon")
    if plan.latitude is not None and plan.longitude is not None:
        params["rank_lat"] = float(plan.latitude)
        params["rank_lon"] = float(plan.longitude)
        if lat_col and lon_col:
            ranking_bits.append(
                f'ST_Distance(ST_SetSRID(ST_MakePoint("{lon_col}"::double precision, "{lat_col}"::double precision), 4326)::geography, '
                f"ST_SetSRID(ST_MakePoint(:rank_lon, :rank_lat), 4326)::geography) ASC"
            )
    if not ranking_bits:
        fallback_sort = _pick_column(cols, "listing_id", "property_id", "address")
        if fallback_sort:
            ranking_bits.append(f'"{fallback_sort}" ASC')
        else:
            ranking_bits.append("1")
    order_sql = ", ".join(ranking_bits)

    def breakdown_job() -> tuple[list[SearchCriterionBreakdownItem], int, int]:
        t_b = time.perf_counter()
        items, m = _compute_breakdown(criteria, params, qtable)
        return items, m, int((time.perf_counter() - t_b) * 1000)

    def select_job() -> tuple[list[Any], int]:
        return _fetch_listing_rows(qtable, all_expr, order_sql, params, select_cols)

    with ThreadPoolExecutor(max_workers=2) as pool:
        fut_b = pool.submit(breakdown_job)
        fut_s = pool.submit(select_job)
        breakdown_items, matched_count, t_break = fut_b.result()
        rows, t_sel = fut_s.result()

    ckeys = list(rows[0].keys()) if rows else []
    raw_rows = [tuple(r[c] for c in ckeys) for r in rows]
    properties = property_list_from_sql_rows(raw_rows, ckeys)
    _attach_match_reasons(properties, criteria)

    timings_ms = {
        "db_ms": t_sel,
        "breakdown_ms": t_break,
    }
    return SearchRunResult(
        properties=properties,
        breakdown=breakdown_items,
        matched_count=matched_count,
        limit_cap=limit,
        timings_ms=timings_ms,
    )


def _compute_breakdown(
    criteria: list[tuple[str, str, str]],
    params: dict[str, Any],
    qtable: str,
) -> tuple[list[SearchCriterionBreakdownItem], int]:
    if not criteria:
        with get_engine().connect() as conn:
            matched = int(
                cached_execute_scalar(
                    conn,
                    text(f"SELECT COUNT(*) AS n FROM {qtable}"),
                    params,
                )
                or 0
            )
        return [], matched

    # Evaluate each predicate once per row in a CTE, then aggregate booleans.
    criterion_select = [
        f"({expr}) AS c_{idx}" for idx, (_, _, expr) in enumerate(criteria)
    ]
    matched_expr = " AND ".join(f"c_{idx}" for idx in range(len(criteria)))
    select_parts = [f"COUNT(*) FILTER (WHERE {matched_expr}) AS matched_count"]
    for idx in range(len(criteria)):
        others = [f"c_{j}" for j in range(len(criteria)) if j != idx]
        without_expr = " AND ".join(others) if others else "TRUE"
        select_parts.append(f"COUNT(*) FILTER (WHERE {without_expr}) AS without_{idx}")

    sql = (
        "WITH criteria_eval AS ("
        f" SELECT {', '.join(criterion_select)}"
        f" FROM {qtable}"
        ") "
        f"SELECT {', '.join(select_parts)} FROM criteria_eval"
    )
    with get_engine().connect() as conn:
        br = cached_execute_all(conn, text(sql), params)
    row = br[0]

    matched = int(row["matched_count"] or 0)
    items: list[SearchCriterionBreakdownItem] = []
    for idx, (key, label, _) in enumerate(criteria):
        without = int(row[f"without_{idx}"] or 0)
        excluded = max(0, without - matched)
        items.append(
            SearchCriterionBreakdownItem(
                key=key,
                label=label,
                excluded_count=excluded,
                matched_count=matched,
                eligible_without_this_rule=without,
            )
        )
    return items, matched


def _attach_match_reasons(
    properties: PropertyDataList,
    criteria: list[tuple[str, str, str]],
) -> None:
    labels = [label for _, label, _ in criteria][:2]
    if labels:
        reason = "Matched: " + "; ".join(labels)
    else:
        reason = "Matched your search intent."
    for p in properties.properties:
        if isinstance(p, PropertyDataItem):
            p.match_reason = reason


async def embed_query_text(query: str) -> tuple[list[float], int]:
    t0 = time.perf_counter()
    vec = await asyncio.to_thread(_embed_query_text, query)
    return vec, int((time.perf_counter() - t0) * 1000)
