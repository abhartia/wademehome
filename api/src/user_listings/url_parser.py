"""Parse an external listing URL (or a free-form paste) into prefillable fields.

Two entry points:
  * `parse_listing_url(url)` — fetches HTML, extracts JSON-LD + OpenGraph meta,
     falls back to an LLM on visible text for any missing fields.
  * `parse_listing_paste(text)` — accepts a full share blob like
     ``"269 Terrace Ave #B, Jersey City, NJ 07307 | Zillow https://share.google/…"``.
     An LLM pulls out the URL + address/name hints, the URL is fetched (with
     redirects followed by urllib so share.google shorteners resolve to the real
     listing), and everything is merged.

Both paths run server-side Mapbox geocoding when an address is recovered, so the
UI can one-click save without a separate geocode round trip.
"""

from __future__ import annotations

import asyncio
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from typing import Any

from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.llms import LLM

from core.config import Config
from core.llm_factory import get_llm
from core.logger import get_logger
from listings.mapbox_client import forward_geocode_detailed
from user_listings.schemas import PrefillFields

logger = get_logger(__name__)

_FETCH_TIMEOUT = 8.0
_MAX_HTML_BYTES = 2_000_000
_MAX_LLM_CHARS = 8_000
_PASTE_SNIPPET_CHARS = 1_500

# Reasoning-effort variants tried in order; first one that returns parseable
# JSON wins. Empirical: on our Azure gpt-5-nano deployment, omitting the param
# entirely is ~2x faster than passing "none" explicitly (the "none" code path
# routes through a slower pipeline). "minimal" is kept as a second-choice fallback
# in case a future model rejects the bare default.
_REASONING_VARIANTS: tuple[dict[str, Any], ...] = (
    {},
    {"reasoning_effort": "minimal"},
)

_URL_RE = re.compile(r"https?://[^\s<>()\[\]{}\"']+", flags=re.IGNORECASE)

# Zillow whitelists this honest-bot pattern; browser UAs get 403'd there. Apartments.com's
# Akamai WAF blocks both — for that case we fall back to the address the user pasted in the
# share blurb (always present in apartments.com shares) and geocode it server-side.
_USER_AGENT = (
    "Mozilla/5.0 (compatible; WademeHome-ListingImporter/1.0; +https://wademe.home)"
)


class _MetaParser(HTMLParser):
    """Pulls JSON-LD script contents and meta[name|property] tags from HTML."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.metas: list[dict[str, str]] = []
        self.jsonld_buffers: list[str] = []
        self._in_jsonld = False
        self._capture: list[str] = []
        self._visible: list[str] = []
        self._in_visible_skip = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        lower = tag.lower()
        attr_map = {k.lower(): (v or "") for k, v in attrs}
        if lower == "meta":
            self.metas.append(attr_map)
            return
        if lower == "script":
            if attr_map.get("type", "").lower() == "application/ld+json":
                self._in_jsonld = True
                self._capture = []
            else:
                self._in_visible_skip += 1
            return
        if lower in {"style", "noscript"}:
            self._in_visible_skip += 1

    def handle_endtag(self, tag: str) -> None:
        lower = tag.lower()
        if lower == "script":
            if self._in_jsonld:
                self.jsonld_buffers.append("".join(self._capture))
                self._in_jsonld = False
                self._capture = []
            else:
                self._in_visible_skip = max(0, self._in_visible_skip - 1)
            return
        if lower in {"style", "noscript"}:
            self._in_visible_skip = max(0, self._in_visible_skip - 1)

    def handle_data(self, data: str) -> None:
        if self._in_jsonld:
            self._capture.append(data)
        elif self._in_visible_skip == 0:
            if data and data.strip():
                self._visible.append(data)

    def visible_text(self) -> str:
        return re.sub(r"\s+", " ", " ".join(self._visible)).strip()


def _fetch_html(url: str) -> str | None:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": _USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=_FETCH_TIMEOUT) as resp:
            raw = resp.read(_MAX_HTML_BYTES)
            charset = resp.headers.get_content_charset() or "utf-8"
    except (urllib.error.URLError, OSError, TimeoutError) as exc:
        logger.warning("user_listings url_parser: fetch failed for %s: %s", url, exc)
        return None
    try:
        return raw.decode(charset, errors="replace")
    except LookupError:
        return raw.decode("utf-8", errors="replace")


def _first_nonempty(*values: object) -> str | None:
    for v in values:
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    return None


def _flatten_jsonld(payload: object) -> list[dict]:
    out: list[dict] = []
    if isinstance(payload, list):
        for entry in payload:
            out.extend(_flatten_jsonld(entry))
    elif isinstance(payload, dict):
        graph = payload.get("@graph")
        if isinstance(graph, list):
            out.extend(_flatten_jsonld(graph))
        out.append(payload)
    return out


def _address_from_jsonld(node: dict) -> str | None:
    addr = node.get("address")
    if isinstance(addr, dict):
        parts = [
            _first_nonempty(addr.get("streetAddress")),
            _first_nonempty(addr.get("addressLocality")),
            _first_nonempty(addr.get("addressRegion")),
            _first_nonempty(addr.get("postalCode")),
        ]
        joined = ", ".join(p for p in parts if p)
        return joined or None
    if isinstance(addr, str):
        return addr.strip() or None
    return None


def _price_from_jsonld(node: dict) -> str | None:
    for key in ("price", "lowPrice", "highPrice"):
        v = node.get(key)
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    offers = node.get("offers")
    if isinstance(offers, dict):
        return _price_from_jsonld(offers)
    if isinstance(offers, list) and offers:
        first = offers[0]
        if isinstance(first, dict):
            return _price_from_jsonld(first)
    return None


def _image_from_jsonld(node: dict) -> str | None:
    img = node.get("image")
    if isinstance(img, str):
        return img.strip() or None
    if isinstance(img, list) and img:
        first = img[0]
        if isinstance(first, str):
            return first.strip() or None
        if isinstance(first, dict):
            return _first_nonempty(first.get("url"), first.get("contentUrl"))
    if isinstance(img, dict):
        return _first_nonempty(img.get("url"), img.get("contentUrl"))
    return None


def _extract_from_jsonld(blocks: list[str]) -> PrefillFields:
    found = PrefillFields()
    for raw in blocks:
        raw = raw.strip()
        if not raw:
            continue
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            continue
        for node in _flatten_jsonld(parsed):
            if not isinstance(node, dict):
                continue
            t = node.get("@type")
            ts = t if isinstance(t, list) else [t]
            if not any(
                isinstance(s, str)
                and s in {
                    "Apartment",
                    "Accommodation",
                    "House",
                    "SingleFamilyResidence",
                    "Residence",
                    "RealEstateListing",
                    "Product",
                }
                for s in ts
            ):
                # Still try — many sites use "Place" or omit @type.
                pass
            if found.name is None:
                found.name = _first_nonempty(node.get("name"), node.get("headline"))
            if found.address is None:
                found.address = _address_from_jsonld(node)
            if found.price is None:
                found.price = _price_from_jsonld(node)
            if found.beds is None:
                beds = node.get("numberOfBedrooms") or node.get("numberOfRooms")
                if beds is not None:
                    found.beds = str(beds)
            if found.baths is None:
                baths = node.get("numberOfBathroomsTotal") or node.get(
                    "numberOfFullBathrooms"
                )
                if baths is not None:
                    found.baths = str(baths)
            if found.image_url is None:
                found.image_url = _image_from_jsonld(node)
    return found


def _extract_from_og(metas: list[dict[str, str]]) -> PrefillFields:
    found = PrefillFields()
    for m in metas:
        key = (m.get("property") or m.get("name") or "").lower()
        content = m.get("content", "").strip()
        if not content:
            continue
        if key == "og:title" and found.name is None:
            found.name = content
        elif key == "og:street-address" and found.address is None:
            found.address = content
        elif key == "og:image" and found.image_url is None:
            found.image_url = content
    return found


def _merge(primary: PrefillFields, *fallbacks: PrefillFields) -> PrefillFields:
    data = primary.model_dump()
    for fb in fallbacks:
        for k, v in fb.model_dump().items():
            if data.get(k) in (None, "") and v not in (None, ""):
                data[k] = v
    return PrefillFields(**data)


_LLM_SYSTEM = (
    "You extract rental-listing fields from HTML page text. Respond with JSON only, "
    "no markdown. Keys (all nullable strings): name, address, unit, price, beds, baths, image_url. "
    "Set a field to null if the page does not clearly state it. Do NOT invent values. "
    "address should be a single-line mailing address including city/state/zip when present."
)

_LLM_USER_TEMPLATE = """Extract rental-listing fields from this page text. Unknown fields must be null.

---
{snippet}
---
"""


async def _achat_json(
    llm: LLM,
    messages: list[ChatMessage],
    *,
    max_tokens: int,
) -> dict | None:
    """Wrap achat with reasoning-effort variants. Tries no-reasoning first, falls
    back to minimal, then default — mirrors ai_search.py's planner. This is pure
    extraction; reasoning spend is wasted latency here."""
    base = {"response_format": {"type": "json_object"}, "max_tokens": max_tokens}
    last_exc: Exception | None = None
    for variant in _REASONING_VARIANTS:
        try:
            resp = await llm.achat(messages=messages, **base, **variant)
        except Exception as exc:  # noqa: BLE001 — try next variant
            last_exc = exc
            continue
        raw = (resp.message.content if resp and resp.message else None) or ""
        if isinstance(raw, dict):
            return raw
        try:
            payload = json.loads(str(raw))
        except (json.JSONDecodeError, TypeError):
            continue
        if isinstance(payload, dict):
            return payload
    if last_exc is not None:
        logger.warning("user_listings url_parser: all LLM variants failed: %s", last_exc)
    return None


def _payload_to_prefill(payload: dict) -> PrefillFields:
    def _s(v: object) -> str | None:
        if v is None:
            return None
        s = str(v).strip()
        return s or None

    return PrefillFields(
        name=_s(payload.get("name")),
        address=_s(payload.get("address")),
        unit=_s(payload.get("unit")),
        price=_s(payload.get("price")),
        beds=_s(payload.get("beds")),
        baths=_s(payload.get("baths")),
        image_url=_s(payload.get("image_url")),
    )


async def _extract_with_llm(visible_text: str, llm: LLM | None = None) -> PrefillFields:
    snippet = (visible_text or "").strip()[:_MAX_LLM_CHARS]
    if not snippet:
        return PrefillFields()
    active = llm or get_llm()
    payload = await _achat_json(
        active,
        [
            ChatMessage(role="system", content=_LLM_SYSTEM),
            ChatMessage(role="user", content=_LLM_USER_TEMPLATE.format(snippet=snippet)),
        ],
        max_tokens=400,
    )
    if payload is None:
        return PrefillFields()
    return _payload_to_prefill(payload)


async def _fetch_structured(url: str) -> tuple[PrefillFields, _MetaParser | None]:
    """Fetch URL + pull JSON-LD/OG. Returns (structured_prefill, parser_or_None).

    The parser handle is returned so callers can decide whether to burn a second
    LLM round trip on visible_text — in the paste flow we already got the
    address from the paste LLM, so we skip the fallback.
    """
    html = await asyncio.to_thread(_fetch_html, url)
    if html is None:
        return PrefillFields(source_host=_host_of(url), source_url=url), None

    parser = _MetaParser()
    try:
        parser.feed(html)
    except Exception:  # noqa: BLE001 — tolerant of malformed HTML
        logger.exception("user_listings url_parser: HTML parsing crashed for %s", url)

    from_jsonld = _extract_from_jsonld(parser.jsonld_buffers)
    from_og = _extract_from_og(parser.metas)
    merged = _merge(from_jsonld, from_og)
    merged.source_host = _host_of(url)
    merged.source_url = url
    return merged, parser


async def _fetch_and_extract(url: str) -> PrefillFields:
    """URL-only entry point: fetch + structured parse + LLM fallback if missing.

    Used by parse_listing_url (no paste context). The paste flow uses
    _fetch_structured directly and pairs it with the paste LLM extraction.
    """
    merged, parser = await _fetch_structured(url)
    if parser is not None and (not merged.address or not merged.price):
        from_llm = await _extract_with_llm(parser.visible_text())
        merged = _merge(merged, from_llm)
    return merged


_PASTE_LLM_SYSTEM = (
    "You extract listing fields from a free-form share message. The user pasted "
    "something like a Zillow/StreetEasy share blurb that may contain a full address, "
    "a URL, and maybe a price or building name. Respond with JSON only (no markdown), "
    "keys (all nullable strings): url, address, name, price, beds, baths. "
    "Set null if the text does not clearly state it. Do NOT invent values. "
    "URL must be a http(s) URL copied verbatim from the text. "
    "address should be a single-line mailing address with city/state/zip when present."
)

_PASTE_LLM_USER = (
    "Pull the listing fields out of this pasted message. Unknown fields must be null.\n"
    "---\n{snippet}\n---\n"
)


async def _extract_from_paste(
    text: str, llm: LLM | None = None
) -> tuple[str | None, PrefillFields]:
    """Returns (extracted_url, hint_fields). Never invents values."""
    snippet = (text or "").strip()[:_PASTE_SNIPPET_CHARS]
    if not snippet:
        return None, PrefillFields()
    active = llm or get_llm()
    payload = await _achat_json(
        active,
        [
            ChatMessage(role="system", content=_PASTE_LLM_SYSTEM),
            ChatMessage(role="user", content=_PASTE_LLM_USER.format(snippet=snippet)),
        ],
        max_tokens=200,
    )
    if payload is None:
        return None, PrefillFields()

    def _s(key: str) -> str | None:
        v = payload.get(key)
        if v is None:
            return None
        s = str(v).strip()
        return s or None

    url = _s("url")
    if url and not re.match(r"^https?://", url, flags=re.IGNORECASE):
        url = None
    if url and url not in snippet:
        url = None

    return url, PrefillFields(
        name=_s("name"),
        address=_s("address"),
        price=_s("price"),
        beds=_s("beds"),
        baths=_s("baths"),
    )


def _first_url_in(text: str) -> str | None:
    """Cheap regex URL extractor — used to kick off the HTML fetch concurrently
    with the LLM extraction when a URL is obviously present in the paste."""
    m = _URL_RE.search(text or "")
    if not m:
        return None
    url = m.group(0).rstrip(".,);]")
    return url if url.lower().startswith(("http://", "https://")) else None


async def parse_listing_paste(text: str) -> tuple[PrefillFields, bool]:
    """Parse a free-form share blob. Returns (prefill, parsed).

    Fast-path optimizations over the naive sequential version:
      1. Regex-detect the URL up-front (cheap) so the HTTP fetch can start
         concurrently with the LLM paste-hint extraction.
      2. Use _fetch_structured (no internal LLM fallback). The paste LLM
         already recovers the address — the URL-page visible-text fallback is
         only needed when BOTH the paste LLM and JSON-LD/OG miss the address.
    """
    regex_url = _first_url_in(text)

    paste_coro = _extract_from_paste(text)
    if regex_url:
        # Run LLM and HTTP fetch concurrently. Each is 2-4s on its own; this
        # dominates the total wall-clock.
        (llm_url, paste_hints), (fetched, parser) = await asyncio.gather(
            paste_coro, _fetch_structured(regex_url)
        )
        # If the LLM flagged a different URL than regex and regex fetch came
        # back empty, try the LLM's URL as a last resort.
        if (
            llm_url
            and llm_url != regex_url
            and not fetched.address
            and not fetched.price
        ):
            fetched, parser = await _fetch_structured(llm_url)
    else:
        llm_url, paste_hints = await paste_coro
        if llm_url:
            fetched, parser = await _fetch_structured(llm_url)
        else:
            fetched, parser = PrefillFields(), None

    merged = _merge(fetched, paste_hints)

    # Only burn a second LLM call on visible_text when BOTH the paste LLM and
    # the structured fetch failed to recover an address. In the common case
    # (paste contains the address, like every Zillow/apartments.com share) we
    # skip this round trip entirely.
    if parser is not None and not merged.address:
        from_llm = await _extract_with_llm(parser.visible_text())
        merged = _merge(merged, from_llm)

    merged = await asyncio.to_thread(_geocode_prefill, merged)
    return merged, bool(merged.address)


async def parse_listing_url(url: str) -> tuple[PrefillFields, bool]:
    """Returns (prefill, parsed). parsed=True if at least an address was recovered."""
    prefill = await _fetch_and_extract(url)
    prefill = await asyncio.to_thread(_geocode_prefill, prefill)
    return prefill, bool(prefill.address)


def _geocode_prefill(prefill: PrefillFields) -> PrefillFields:
    """Server-side Mapbox geocode so the client can save in one click."""
    if not prefill.address:
        return prefill
    token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not token:
        return prefill
    try:
        geo = forward_geocode_detailed(prefill.address, token)
    except Exception:
        logger.exception("user_listings url_parser: geocode crashed")
        return prefill
    if geo is None:
        return prefill
    prefill.latitude = geo["lat"]
    prefill.longitude = geo["lng"]
    prefill.city = geo.get("city") or prefill.city
    prefill.state = geo.get("state") or prefill.state
    prefill.zipcode = geo.get("zipcode") or prefill.zipcode
    # Upgrade to Mapbox's canonical place_name so the saved address is normalized.
    canonical = geo.get("place_name")
    if isinstance(canonical, str) and canonical.strip():
        prefill.address = canonical.strip()
    return prefill


def _host_of(url: str) -> str | None:
    try:
        host = urllib.parse.urlparse(url).hostname
    except ValueError:
        return None
    return (host or "").lower() or None
