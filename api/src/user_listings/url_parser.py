"""Parse an external listing URL into prefillable fields.

Two-stage pipeline:
  1. Fetch HTML, extract JSON-LD + OpenGraph meta — standardized, deterministic.
  2. If key fields are missing, send trimmed page text to an LLM via LlamaIndex
     for structured extraction. No per-site heuristic HTML scraping.

Never invents data: fields the extractor can't confidently pull stay None,
so the frontend asks the user to fill them.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser

from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.llms import LLM

from core.llm_factory import get_llm
from core.logger import get_logger
from user_listings.schemas import PrefillFields

logger = get_logger(__name__)

_FETCH_TIMEOUT = 8.0
_MAX_HTML_BYTES = 2_000_000
_MAX_LLM_CHARS = 15_000

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


async def _extract_with_llm(visible_text: str, llm: LLM | None = None) -> PrefillFields:
    snippet = (visible_text or "").strip()[:_MAX_LLM_CHARS]
    if not snippet:
        return PrefillFields()
    active = llm or get_llm()
    try:
        resp = await active.achat(
            messages=[
                ChatMessage(role="system", content=_LLM_SYSTEM),
                ChatMessage(role="user", content=_LLM_USER_TEMPLATE.format(snippet=snippet)),
            ],
            response_format={"type": "json_object"},
            max_tokens=400,
        )
    except Exception:
        logger.exception("user_listings url_parser: LLM extraction failed")
        return PrefillFields()
    raw = (resp.message.content if resp and resp.message else None) or ""
    try:
        payload = raw if isinstance(raw, dict) else json.loads(str(raw))
    except (json.JSONDecodeError, TypeError):
        logger.warning("user_listings url_parser: invalid JSON from LLM")
        return PrefillFields()
    if not isinstance(payload, dict):
        return PrefillFields()

    def _str_or_none(v: object) -> str | None:
        if v is None:
            return None
        s = str(v).strip()
        return s or None

    return PrefillFields(
        name=_str_or_none(payload.get("name")),
        address=_str_or_none(payload.get("address")),
        unit=_str_or_none(payload.get("unit")),
        price=_str_or_none(payload.get("price")),
        beds=_str_or_none(payload.get("beds")),
        baths=_str_or_none(payload.get("baths")),
        image_url=_str_or_none(payload.get("image_url")),
    )


async def parse_listing_url(url: str) -> tuple[PrefillFields, bool]:
    """
    Returns (prefill, parsed). parsed=True if we extracted at least an address
    from any source (so the UI knows the prefill is useful).
    """
    html = _fetch_html(url)
    if html is None:
        return PrefillFields(source_host=_host_of(url)), False

    parser = _MetaParser()
    try:
        parser.feed(html)
    except Exception:  # noqa: BLE001 — best-effort tolerance of malformed HTML
        logger.exception("user_listings url_parser: HTML parsing crashed for %s", url)

    from_jsonld = _extract_from_jsonld(parser.jsonld_buffers)
    from_og = _extract_from_og(parser.metas)
    merged = _merge(from_jsonld, from_og)
    merged.source_host = _host_of(url)

    if not merged.address or not merged.price:
        from_llm = await _extract_with_llm(parser.visible_text())
        merged = _merge(merged, from_llm)

    parsed_ok = bool(merged.address)
    return merged, parsed_ok


def _host_of(url: str) -> str | None:
    try:
        host = urllib.parse.urlparse(url).hostname
    except ValueError:
        return None
    return (host or "").lower() or None
