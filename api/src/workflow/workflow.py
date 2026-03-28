import asyncio
import hashlib
import json
import time
from threading import Lock

from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.workflow import Workflow, Context, StopEvent, step
from llama_index.core.llms import LLM
from llama_index.server.models.chat import ChatRequest
from llama_index.server.models.ui import UIEvent

from core.logger import get_logger
from listings.ai_search import embed_query_text, extract_query_plan, run_fast_search
from workflow.events import (
    PropertyDataList,
    SearchFilterBreakdownData,
    SearchFilterBreakdownItem,
    SearchHintData,
    SearchPlanData,
    SearchSummaryData,
    SearchStatsData,
    UserInputEvent,
)

logger = get_logger(__name__)

_VALIDATION_CACHE_TTL_S = 1800.0
_VALIDATION_CACHE_MAX = 4096
_validation_cache_lock = Lock()
_validation_cache: dict[str, tuple[float, dict[str, object]]] = {}


def _validation_cache_key(user_msg: str, listing_id: str, content_hash: str) -> str:
    raw = f"{user_msg.strip().casefold()}\n{listing_id}\n{content_hash}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _validation_cache_get(key: str) -> dict[str, object] | None:
    now = time.monotonic()
    with _validation_cache_lock:
        hit = _validation_cache.get(key)
        if not hit:
            return None
        exp, payload = hit
        if exp <= now:
            _validation_cache.pop(key, None)
            return None
        return dict(payload)


def _validation_cache_put(key: str, payload: dict[str, object]) -> None:
    now = time.monotonic()
    with _validation_cache_lock:
        if len(_validation_cache) >= _VALIDATION_CACHE_MAX:
            oldest = min(_validation_cache.items(), key=lambda kv: kv[1][0])[0]
            _validation_cache.pop(oldest, None)
        _validation_cache[key] = (now + _VALIDATION_CACHE_TTL_S, dict(payload))


def _listing_identity_and_hash(item) -> tuple[str, str]:
    listing_id = (item.listing_url or item.address or item.name or "").strip() or item.name
    material = json.dumps(
        {
            "name": item.name,
            "address": item.address,
            "city": item.city,
            "state": item.state,
            "zip_code": item.zip_code,
            "bedroom_range": item.bedroom_range,
            "rent_range": item.rent_range,
            "amenities": item.amenities[:40],
            "main_amenities": item.main_amenities[:10],
            "match_reason": item.match_reason,
        },
        sort_keys=True,
        ensure_ascii=True,
    )
    content_hash = hashlib.sha256(material.encode("utf-8")).hexdigest()
    return listing_id, content_hash


def _validation_prompt(user_msg: str, item) -> str:
    return (
        "User query:\n"
        f"{user_msg.strip()}\n\n"
        "Listing:\n"
        f"Name: {item.name}\n"
        f"Address: {item.address}\n"
        f"City/State/ZIP: {item.city or ''}, {item.state or ''} {item.zip_code or ''}\n"
        f"Bedrooms: {item.bedroom_range}\n"
        f"Rent: {item.rent_range}\n"
        f"Amenities: {', '.join(item.amenities[:40])}\n"
        f"Main amenities: {', '.join(item.main_amenities[:10])}\n\n"
        "Return JSON only with keys:\n"
        '{"relevant": boolean, "explanation": string, "confidence": number}\n'
        "Use confidence in [0,1]. Keep explanation under 140 chars."
    )


async def _validate_listing_with_llm(
    llm: LLM,
    *,
    user_msg: str,
    item,
) -> tuple[bool, str, float | None, bool]:
    listing_id, content_hash = _listing_identity_and_hash(item)
    key = _validation_cache_key(user_msg, listing_id, content_hash)
    cached = _validation_cache_get(key)
    if cached is not None:
        rel = bool(cached.get("relevant", True))
        expl = str(cached.get("explanation") or "").strip()[:200]
        conf_v = cached.get("confidence")
        conf = float(conf_v) if isinstance(conf_v, (int, float)) else None
        return rel, expl, conf, True

    try:
        resp = await llm.achat(
            messages=[
                ChatMessage(
                    role="system",
                    content=(
                        "You are a strict rental-listing relevance checker. "
                        "Return valid JSON only."
                    ),
                ),
                ChatMessage(role="user", content=_validation_prompt(user_msg, item)),
            ],
            response_format={"type": "json_object"},
            max_tokens=220,
            reasoning_effort="none",
        )
        raw = (resp.message.content if resp and resp.message else "") or ""
        payload = json.loads(raw) if isinstance(raw, str) else (raw if isinstance(raw, dict) else {})
        relevant = bool(payload.get("relevant", True))
        explanation = str(payload.get("explanation") or "").strip()
        confidence_val = payload.get("confidence")
        confidence = float(confidence_val) if isinstance(confidence_val, (int, float)) else None
    except Exception:
        logger.exception("listing validator failed; defaulting to relevant=true")
        relevant = True
        explanation = ""
        confidence = None

    result_payload = {
        "relevant": relevant,
        "explanation": explanation[:200],
        "confidence": confidence,
    }
    _validation_cache_put(key, result_payload)
    return relevant, result_payload["explanation"], confidence, False


class ListingFetcherWorkflow(Workflow):
    def __init__(
        self,
        llm: LLM,
        chat_request: ChatRequest,
        *args,
        **kwargs,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.llm = llm
        self.chat_request = chat_request

    @step
    async def run_fast_search_step(
        self, ctx: Context, ev: UserInputEvent
    ) -> StopEvent:
        t0 = time.perf_counter()
        chat_history = ev.chat_history or []
        user_msg = (ev.user_msg or "").strip()

        # Keep annotation contract stable for guests while removing heuristic logic.
        ctx.write_event_to_stream(
            UIEvent(
                type="search_hint",
                data=SearchHintData(suggest_account=False, reason=None),
            )
        )

        try:
            parse_t0 = time.perf_counter()
            plan_task = asyncio.create_task(
                extract_query_plan(
                    self.llm,
                    user_msg=user_msg,
                    chat_history=chat_history,
                )
            )
            embed_task = asyncio.create_task(embed_query_text(user_msg))
            plan = await plan_task
            parse_ms = int((time.perf_counter() - parse_t0) * 1000)
            vec_user_msg, embed_ms_user_msg = await embed_task

            sq = (plan.semantic_query or "").strip()
            if sq.casefold() != user_msg.strip().casefold():
                query_embedding, embed_ms_extra = await embed_query_text(
                    sq or user_msg
                )
                embed_ms = embed_ms_user_msg + embed_ms_extra
            else:
                query_embedding, embed_ms = vec_user_msg, embed_ms_user_msg

            ctx.write_event_to_stream(
                UIEvent(
                    type="search_plan",
                    data=SearchPlanData(
                        summary_headline=plan.summary_headline,
                        summary_bullets=plan.summary_bullets,
                    ),
                )
            )
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_summary",
                    data=SearchSummaryData(
                        headline=plan.summary_headline,
                        bullets=plan.summary_bullets,
                    ),
                )
            )

            search_result = run_fast_search(plan, query_embedding=query_embedding)

            items = list(search_result.properties.properties)
            for item in items:
                item.validation_status = "validating"
                item.validation_explanation = None
                item.validation_confidence = None
            ctx.write_event_to_stream(UIEvent(type="property_listings", data=PropertyDataList(properties=items)))

            validation_t0 = time.perf_counter()
            cache_hits = 0
            cache_misses = 0
            kept_count = 0
            dropped_count = 0
            sem = asyncio.Semaphore(12)

            async def _run_one(idx: int):
                async with sem:
                    return idx, await _validate_listing_with_llm(
                        self.llm,
                        user_msg=user_msg,
                        item=items[idx],
                    )

            tasks = [asyncio.create_task(_run_one(i)) for i in range(len(items))]
            for task in asyncio.as_completed(tasks):
                idx, (relevant, explanation, confidence, cache_hit) = await task
                item = items[idx]
                if cache_hit:
                    cache_hits += 1
                else:
                    cache_misses += 1
                item.validation_confidence = confidence
                if relevant:
                    item.validation_status = "confirmed"
                    item.validation_explanation = explanation or item.match_reason
                    kept_count += 1
                    ctx.write_event_to_stream(
                        UIEvent(type="property_listings", data=PropertyDataList(properties=list(items)))
                    )
                else:
                    item.validation_status = "rejected"
                    item.validation_explanation = explanation or "Not relevant to current query."
                    dropped_count += 1
                    # Briefly surface rejected rows so UI can animate a graceful removal.
                    ctx.write_event_to_stream(
                        UIEvent(type="property_listings", data=PropertyDataList(properties=list(items)))
                    )
                    await asyncio.sleep(0.12)

                # Progressive stream: keep validating + confirmed, drop rejected.
                visible_items = [
                    it for it in items if it.validation_status in {"validating", "confirmed"}
                ]
                ctx.write_event_to_stream(
                    UIEvent(type="property_listings", data=PropertyDataList(properties=visible_items))
                )

            validated_items = [it for it in items if it.validation_status != "rejected"]
            validation_ms = int((time.perf_counter() - validation_t0) * 1000)
            search_result.properties = PropertyDataList(properties=validated_items)
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_filter_breakdown",
                    data=SearchFilterBreakdownData(
                        criteria=[
                            SearchFilterBreakdownItem.model_validate(item.model_dump())
                            for item in search_result.breakdown
                        ]
                    ),
                )
            )

            returned_count = len(search_result.properties.properties)
            total_ms = int((time.perf_counter() - t0) * 1000)
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_stats",
                    data=SearchStatsData(
                        returned_count=returned_count,
                        matched_count=search_result.matched_count,
                        limit_cap=search_result.limit_cap,
                        sort_note="Strict filters first, then semantic relevance.",
                        parse_ms=parse_ms,
                        embed_ms=embed_ms,
                        db_ms=search_result.timings_ms.get("db_ms"),
                        breakdown_ms=search_result.timings_ms.get("breakdown_ms"),
                        amenity_ms=search_result.timings_ms.get("amenity_ms"),
                        validation_ms=validation_ms,
                        total_ms=total_ms,
                        semantic_candidates=search_result.stage_stats.get("semantic_candidates"),
                        amenity_scored_count=search_result.stage_stats.get("amenity_scored_count"),
                        validated_kept_count=kept_count,
                        validated_dropped_count=dropped_count,
                        validation_cache_hits=cache_hits,
                        validation_cache_misses=cache_misses,
                    ),
                )
            )
            logger.info(
                "listings/chat timing: parse_ms=%s embed_ms=%s db_ms=%s breakdown_ms=%s amenity_ms=%s validation_ms=%s total_ms=%s matched=%s candidates=%s kept=%s dropped=%s cache_hits=%s cache_misses=%s",
                parse_ms,
                embed_ms,
                search_result.timings_ms.get("db_ms"),
                search_result.timings_ms.get("breakdown_ms"),
                search_result.timings_ms.get("amenity_ms"),
                validation_ms,
                total_ms,
                search_result.matched_count,
                search_result.stage_stats.get("semantic_candidates"),
                kept_count,
                dropped_count,
                cache_hits,
                cache_misses,
            )

            if returned_count == 0:
                return StopEvent(
                    result="No properties found for your search. Try broadening your location or constraints."
                )
            return StopEvent(
                result=f"Found {returned_count} listings matching your search."
            )
        except Exception as exc:
            logger.exception("fast search workflow failed")
            ctx.write_event_to_stream(
                UIEvent(
                    type="property_listings",
                    data=PropertyDataList(properties=[]),
                )
            )
            return StopEvent(
                result=f"Search failed: {exc}"
            )


