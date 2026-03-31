"""
Source-only amenity list extraction for listing vendors.

Each parser returns ``None`` when the expected on-page structure is missing
(so callers skip DB updates rather than writing empty arrays as "unknown").
"""

from __future__ import annotations

import json
import re
from urllib.parse import urlparse, urlunparse

from bs4 import BeautifulSoup


_RENTCAFE_COMMUNITY_LABELS = (
    "community amenities",
    "property amenities",
    "building amenities",
    "community features",
)
_RENTCAFE_APARTMENT_LABELS = (
    "apartment amenities",
    "unit amenities",
    "residence amenities",
    "in-home amenities",
    "suite amenities",
)


def parse_rentcafe_amenities(html: str) -> tuple[list[str], list[str]] | None:
    """
    RentCafe property pages (default.aspx).

    Apartment list prefers ``RCILSSettings.apartmentAmenities`` JSON, then DOM near
    apartment-style headings. Community list is taken from DOM near community-style
    headings. Headings and ``<ul>`` layouts vary by template; we try several labels and
    a relaxed walk from headings to nearby lists.

    Returns ``None`` only when **both** sides lack any recognizable signal. If only one
    side parses, the other is returned as ``[]`` (still structured, source-derived).
    """
    apartment = _rentcafe_apartment_amenities_from_rcils(html)
    if apartment is None:
        apartment = _rentcafe_amenities_dom_best(html, _RENTCAFE_APARTMENT_LABELS)
    community = _rentcafe_amenities_dom_best(html, _RENTCAFE_COMMUNITY_LABELS)
    if apartment is None and community is None:
        return None
    return (list(community or []), list(apartment or []))


def _rentcafe_apartment_amenities_from_rcils(html: str) -> list[str] | None:
    patterns = (
        r"RCILSSettings\.apartmentAmenities\s*=\s*(\[[\s\S]*?\])\s*;",
        r"RCILSSettings\[['\"]apartmentAmenities['\"]\]\s*=\s*(\[[\s\S]*?\])\s*;",
        r"\bapartmentAmenities\s*:\s*(\[[\s\S]*?\])\s*[,}\n]",
    )
    for pat in patterns:
        m = re.search(pat, html, re.I)
        if not m:
            continue
        try:
            raw = json.loads(m.group(1))
        except (json.JSONDecodeError, TypeError):
            continue
        if not isinstance(raw, list):
            continue
        out: list[str] = []
        for x in raw:
            if isinstance(x, str) and x.strip():
                out.append(x.strip())
        return out
    return None


def _rentcafe_amenities_dom_best(html: str, labels: tuple[str, ...]) -> list[str] | None:
    soup = BeautifulSoup(html, "html.parser")
    for label in labels:
        items = _rentcafe_amenities_from_dom_card(soup, label)
        if items is not None:
            return items
    for key in labels:
        items = _rentcafe_amenities_relaxed_near_heading(soup, key.strip().lower())
        if items is not None:
            return items
    return None


def _rentcafe_amenities_from_dom_section(html: str, heading: str) -> list[str] | None:
    """Backward-compatible name for tests / call sites using a single heading."""
    return _rentcafe_amenities_dom_best(html, (heading,))


def _rentcafe_amenities_from_dom_card(soup: BeautifulSoup, heading: str) -> list[str] | None:
    target = heading.strip().lower()
    p = soup.find(
        "p",
        class_=lambda c: c and "font-weight-bold" in str(c).split(),
        string=lambda t: t is not None and t.strip().lower() == target,
    )
    if p is None:
        p = soup.find(
            "p",
            string=lambda t: t is not None and t.strip().lower() == target,
        )
    if p is None:
        for hn in ("h2", "h3", "h4"):
            h = soup.find(
                hn,
                string=lambda t: t is not None and t.strip().lower() == target,
            )
            if h is not None:
                p = h
                break
    if p is None:
        return None

    def _ul_class_matches(attr) -> bool:
        if not attr:
            return False
        blob = " ".join(attr) if isinstance(attr, list) else str(attr)
        b = blob.lower()
        return any(tok in b for tok in ("list-bullet", "list-disc", "amenities", "pl-", "px-"))

    inner = p.parent
    # Prefer tight parent (e.g. ``<section>`` with ``h2`` + ``ul``); fall back to
    # grandparent (legacy RentCafe flex column + sibling ``ul``).
    containers: list = []
    if inner is not None:
        containers.append(inner)
        if inner.parent is not None:
            containers.append(inner.parent)

    for gp in containers:
        ul = gp.find("ul", class_=lambda c: _ul_class_matches(c))
        if ul is None:
            ul = gp.find("ul")
        if ul is None:
            continue
        items = _rentcafe_ul_li_texts(ul)
        if items:
            return items
    return None


def _rentcafe_ul_li_texts(ul) -> list[str]:
    items: list[str] = []
    for li in ul.find_all("li", recursive=False):
        t = li.get_text(" ", strip=True)
        if t and len(t) < 220 and not t.lower().startswith("http"):
            items.append(t)
    if items:
        return items
    for li in ul.find_all("li", recursive=True):
        t = li.get_text(" ", strip=True)
        if t and len(t) < 220 and not t.lower().startswith("http"):
            items.append(t)
    return items


def _rentcafe_amenities_relaxed_near_heading(soup: BeautifulSoup, label_lc: str) -> list[str] | None:
    """Follow heading-like nodes and walk ancestors / siblings for a sensible ``<ul>``."""
    for el in soup.find_all(["p", "h2", "h3", "h4", "span", "strong", "div"]):
        if el.find_parent(["nav", "header", "footer"]):
            continue
        txt = el.get_text(strip=True)
        if not txt or len(txt) > 140:
            continue
        tl = txt.lower()
        if label_lc not in tl:
            continue
        if "amenit" not in tl and "feature" not in tl and tl != label_lc:
            continue
        cur = el
        for _ in range(12):
            if cur is None:
                break
            for ul in cur.find_all("ul", recursive=False):
                if ul.find_parent(["nav", "header", "footer"]):
                    continue
                items = _rentcafe_ul_li_texts(ul)
                if _rentcafe_looks_amenity_list(items):
                    return items
            cur = cur.parent
        parent = el.parent
        if parent is not None:
            for sib in parent.find_next_siblings(limit=12):
                if getattr(sib, "name", None) == "ul":
                    items = _rentcafe_ul_li_texts(sib)
                    if _rentcafe_looks_amenity_list(items):
                        return items
                if hasattr(sib, "find"):
                    ul = sib.find("ul")
                    if ul is not None:
                        items = _rentcafe_ul_li_texts(ul)
                        if _rentcafe_looks_amenity_list(items):
                            return items
    return None


def _rentcafe_looks_amenity_list(items: list[str]) -> bool:
    if len(items) < 1:
        return False
    if len(items) >= 2:
        return True
    one = items[0]
    return 2 <= len(one) <= 120


def securecafe_amenities_url(floorplans_url: str) -> str:
    """
    Same host and ``/onlineleasing/{sitekey}/`` prefix as ``floorplans.aspx``;
    amenities live on ``amenities.aspx`` (GET with Referer from floorplans).
    """
    p = urlparse(floorplans_url)
    path = p.path or ""
    if path.lower().endswith("floorplans.aspx"):
        new_path = path[: -len("floorplans.aspx")] + "amenities.aspx"
    elif "/floorplans" in path.lower():
        new_path = re.sub(r"(?i)floorplans(?:\.aspx)?$", "amenities.aspx", path)
    else:
        new_path = path.rstrip("/") + "/amenities.aspx"
    return urlunparse((p.scheme, p.netloc, new_path, "", "", ""))


def parse_securecafe_amenities_html(html: str) -> tuple[list[str], list[str]] | None:
    """
    SecureCafe ``amenities.aspx``:

    - ``<h2>Community Amenities</h2>`` followed by ``<ul class="amenities-list">``
    - ``<h2>Apartment Amenities</h2>`` followed by ``<ul class="amenities-list">``
    """
    soup = BeautifulSoup(html, "html.parser")

    def section(title: str) -> list[str] | None:
        h = soup.find(
            lambda tag: tag.name in ("h1", "h2", "h3", "h4")
            and tag.get_text(strip=True).lower() == title.lower(),
        )
        if h is None:
            return None
        n = h.find_next_sibling()
        while n is not None and n.name != "ul":
            n = n.find_next_sibling()
        if n is None or n.name != "ul":
            return None
        cls = n.get("class") or []
        if not any("amenities-list" == str(x) or str(x).endswith("amenities-list") for x in cls):
            # still accept ul immediately after heading (some skins omit class)
            if not n.find("li"):
                return None
        items: list[str] = []
        for li in n.find_all("li", recursive=False):
            t = li.get_text(strip=True)
            if t:
                items.append(t)
        return items

    comm = section("Community Amenities")
    apt = section("Apartment Amenities")
    if comm is None or apt is None:
        return None
    return (comm, apt)


def entrata_amenities_url(listing_url: str) -> str:
    """Same origin, path ``/amenities/`` (Jonah Digital / Entrata marketing sites)."""
    p = urlparse(listing_url)
    return urlunparse((p.scheme, p.netloc, "/amenities/", "", "", ""))


def parse_entrata_jonah_amenities_html(html: str) -> tuple[list[str], list[str]] | None:
    """
    Jonah Digital ``/amenities/`` page:

    - ``div.amenity-c__group`` contains ``h2.amenity-c__title`` "Community Amenities"
      or "Apartment Features" (apartment column uses "Features", not "Amenities").
    - Each group has one or more ``ul``; non-empty ``li`` text are amenity lines.
    """
    soup = BeautifulSoup(html, "html.parser")
    comm: list[str] | None = None
    apt: list[str] | None = None
    for group in soup.select("div.amenity-c__group"):
        h2 = group.select_one("h2.amenity-c__title")
        if not h2:
            continue
        title = h2.get_text(strip=True).lower()
        items: list[str] = []
        for ul in group.find_all("ul"):
            for li in ul.find_all("li", recursive=False):
                t = li.get_text(strip=True)
                if t:
                    items.append(t)
        if title == "community amenities":
            comm = items
        elif title == "apartment features":
            apt = items
    if comm is None or apt is None:
        return None
    return (comm, apt)


_GREYSTAR_HIGHLIGHT_META: dict[str, tuple[str, str]] = {
    # API boolean key -> (display label, "community" | "apartment")
    "airCon": ("Air Conditioning", "apartment"),
    "dishwasher": ("Dishwasher", "apartment"),
    "patioBalcony": ("Patio/Balcony", "apartment"),
    "walkInClosets": ("Spacious Closets", "apartment"),
    "washerDryer": ("Washer/Dryer", "apartment"),
    "pools": ("Pool", "community"),
    "fitness": ("Fitness Center", "community"),
    "pets": ("Pet Friendly", "community"),
    "playground": ("Playground", "community"),
    "garages": ("Garages", "community"),
    "limitedAccess": ("Gated Access", "community"),
    "smokeFree": ("Smoke Free", "community"),
    "eco": ("Eco-friendly", "community"),
}

# DOM labels (Building amenities) split when JSON lists are empty.
_GREYSTAR_DOM_APARTMENT_MARKERS = (
    "air conditioning",
    "dishwasher",
    "spacious closet",
    "walk-in",
    "washer",
    "dryer",
    "w/d",
    "patio",
    "balcony",
)

_GREYSTAR_DOM_SKIP_LABELS = frozenset(
    ("highlights", "building amenities", "community amenities", "amenities")
)


def _greystar_is_placeholder_amenity(s: str) -> bool:
    t = s.strip().lower()
    if not t:
        return True
    if "coming soon" in t:
        return True
    if t in {"n/a", "tbd", "—", "-", "none", "tba"}:
        return True
    return False


def _greystar_norm_str_list(xs: object) -> list[str]:
    if not isinstance(xs, list):
        return []
    out: list[str] = []
    for x in xs:
        if isinstance(x, str) and x.strip() and not _greystar_is_placeholder_amenity(x):
            out.append(x.strip())
    return out


def _greystar_amenities_from_highlights(data: dict) -> tuple[list[str], list[str]] | None:
    hl = data.get("highlights")
    if not isinstance(hl, dict):
        return None
    comm: list[str] = []
    apt: list[str] = []
    for key, (label, bucket) in _GREYSTAR_HIGHLIGHT_META.items():
        if hl.get(key) is not True:
            continue
        if bucket == "community":
            comm.append(label)
        else:
            apt.append(label)
    if not comm and not apt:
        return None
    return (comm, apt)


def _greystar_bucket_for_dom_line(text: str) -> str:
    tl = text.strip().lower()
    if any(m in tl for m in _GREYSTAR_DOM_APARTMENT_MARKERS):
        return "apartment"
    return "community"


def _greystar_find_amenities_heading(soup: BeautifulSoup):
    for hn in ("h2", "h3", "h4"):
        for h in soup.find_all(hn):
            if h.find_parent(["nav", "header", "footer"]):
                continue
            t = h.get_text(strip=True).lower()
            if t in ("building amenities", "community amenities"):
                return h
            if "amenit" in t and "building" in t:
                return h
            if t == "amenities and features":
                return h
    return None


def _greystar_bucket_lines(lines: list[str]) -> tuple[list[str], list[str]] | None:
    comm: list[str] = []
    apt: list[str] = []
    for line in lines:
        if _greystar_bucket_for_dom_line(line) == "apartment":
            apt.append(line)
        else:
            comm.append(line)
    if not comm and not apt:
        return None
    return (comm, apt)


def _greystar_lines_from_icon_row_dom(root) -> list[str]:
    texts: list[str] = []
    for div in root.select("div[class*='icon-text']"):
        sp = div.select_one("span, p")
        if not sp:
            continue
        line = sp.get_text(" ", strip=True)
        if not line or len(line) > 200 or line.lower().startswith("http"):
            continue
        tl = line.lower()
        if tl in _GREYSTAR_DOM_SKIP_LABELS:
            continue
        texts.append(line)
    return texts


def _greystar_amenities_from_dom(soup: BeautifulSoup) -> tuple[list[str], list[str]] | None:
    """
    "Building amenities" plus ``ul`` items and/or ``div.icon-text`` rows (some templates
    ship empty ``ul`` and rely on icon rows in SSR).
    """
    heading = _greystar_find_amenities_heading(soup)
    if heading is None:
        return None
    section = heading.find_parent("section")
    root = section if section is not None else heading.parent
    if root is None:
        return None
    texts: list[str] = []
    ul = root.find("ul")
    if ul is not None:
        for li in ul.find_all("li", recursive=False):
            line = li.get_text(" ", strip=True)
            if line and len(line) < 200 and not line.lower().startswith("http"):
                texts.append(line)
    if not texts:
        texts = _greystar_lines_from_icon_row_dom(root)
    if not texts:
        return None
    return _greystar_bucket_lines(texts)


def _greystar_parse_amenities_component_data(data: dict) -> tuple[list[str], list[str]] | None:
    comm = _greystar_norm_str_list(data.get("amenities"))
    apt = _greystar_norm_str_list(data.get("features"))
    if comm or apt:
        return (comm, apt)
    return _greystar_amenities_from_highlights(data)


def _greystar_property_highlights_from_props(component_props: dict) -> dict | None:
    """``PropertyDetails.property.highlights`` when PD-amenities has no usable lists/highlights."""
    best: dict | None = None
    n_true = 0
    for comp in component_props.values():
        if not isinstance(comp, dict) or comp.get("componentName") != "PropertyDetails":
            continue
        prop = (comp.get("data") or {}).get("property") or {}
        hl = prop.get("highlights")
        if not isinstance(hl, dict):
            continue
        c = sum(1 for v in hl.values() if v is True)
        if c > n_true:
            n_true = c
            best = hl
    return best


def _greystar_gather_from_next_props(component_props: dict) -> tuple[list[str], list[str]] | None:
    for comp in component_props.values():
        if not isinstance(comp, dict) or comp.get("componentName") != "PropertyDetailsAmenities":
            continue
        out = _greystar_parse_amenities_component_data(comp.get("data") or {})
        if out is not None:
            return out
    phl = _greystar_property_highlights_from_props(component_props)
    if phl is not None:
        return _greystar_amenities_from_highlights({"highlights": phl})
    return None


def parse_greystar_amenities_from_html(html: str) -> tuple[list[str], list[str]] | None:
    """
    Greystar consumer sites expose ``PropertyDetailsAmenities`` inside ``__NEXT_DATA__``:
    ``data.amenities`` (community) and ``data.features`` (apartment), same as
    ``greystar_scraper.scrape_property_page``.

    Newer pages often leave those lists empty and only set ``data.highlights`` booleans,
    or render rows under "Building amenities". Falls back to ``PropertyDetails.property.highlights``,
    then DOM (``ul`` or ``icon-text`` rows).
    """
    soup = BeautifulSoup(html, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__", attrs={"type": "application/json"})
    if script_tag and script_tag.string:
        try:
            full_data = json.loads(script_tag.string)
        except (json.JSONDecodeError, TypeError):
            full_data = {}
        else:
            component_props = full_data.get("props", {}).get("pageProps", {}).get("componentProps", {})
            out = _greystar_gather_from_next_props(component_props)
            if out is not None:
                return out

    dom = _greystar_amenities_from_dom(soup)
    if dom is not None:
        return dom
    return None
