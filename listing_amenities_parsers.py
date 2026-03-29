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


def parse_rentcafe_amenities(html: str) -> tuple[list[str], list[str]] | None:
    """
    RentCafe property pages (default.aspx):

    - Apartment amenities: ``RCILSSettings.apartmentAmenities = [...]`` (JSON array).
    - Community amenities: under a ``<p>`` with text "Community amenities", the
      grandparent column contains a ``<ul class="... list-bullet ...">`` with
      ``<li>`` items (verified structure; headings are title case on live pages).
    """
    apartment = _rentcafe_apartment_amenities_from_rcils(html)
    if apartment is None:
        apartment = _rentcafe_amenities_from_dom_section(html, "Apartment amenities")
    community = _rentcafe_amenities_from_dom_section(html, "Community amenities")
    if apartment is None or community is None:
        return None
    return (community, apartment)


def _rentcafe_apartment_amenities_from_rcils(html: str) -> list[str] | None:
    m = re.search(
        r"RCILSSettings\.apartmentAmenities\s*=\s*(\[[\s\S]*?\])\s*;",
        html,
        re.I,
    )
    if not m:
        return None
    try:
        raw = json.loads(m.group(1))
    except (json.JSONDecodeError, TypeError):
        return None
    if not isinstance(raw, list):
        return None
    out: list[str] = []
    for x in raw:
        if isinstance(x, str) and x.strip():
            out.append(x.strip())
    return out


def _rentcafe_amenities_from_dom_section(html: str, heading: str) -> list[str] | None:
    soup = BeautifulSoup(html, "html.parser")
    target = heading.strip().lower()
    p = soup.find(
        "p",
        class_=lambda c: c and "font-weight-bold" in c.split(),
        string=lambda t: t is not None and t.strip().lower() == target,
    )
    if p is None:
        p = soup.find(
            "p",
            string=lambda t: t is not None and t.strip().lower() == target,
        )
    if p is None:
        return None
    gp = p.parent.parent if p.parent else None
    if gp is None:
        return None
    ul = gp.find(
        "ul",
        class_=lambda c: c and any("list-bullet" in str(x) for x in (c if isinstance(c, list) else [c])),
    )
    if ul is None:
        return None
    items = []
    for li in ul.find_all("li", recursive=False):
        t = li.get_text(strip=True)
        if t:
            items.append(t)
    return items


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


def parse_greystar_amenities_from_html(html: str) -> tuple[list[str], list[str]] | None:
    """
    Greystar consumer sites expose ``PropertyDetailsAmenities`` inside ``__NEXT_DATA__``:
    ``data.amenities`` (community) and ``data.features`` (apartment), same as
    ``greystar_scraper.scrape_property_page``.
    """
    soup = BeautifulSoup(html, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__", attrs={"type": "application/json"})
    if not script_tag or not script_tag.string:
        return None
    try:
        full_data = json.loads(script_tag.string)
    except (json.JSONDecodeError, TypeError):
        return None
    component_props = full_data.get("props", {}).get("pageProps", {}).get("componentProps", {})
    comm_raw = None
    apt_raw = None
    for comp in component_props.values():
        if not isinstance(comp, dict):
            continue
        if comp.get("componentName") == "PropertyDetailsAmenities":
            data = comp.get("data") or {}
            comm_raw = data.get("amenities")
            apt_raw = data.get("features")
            break
    if comm_raw is None or apt_raw is None:
        return None
    if not isinstance(comm_raw, list) or not isinstance(apt_raw, list):
        return None

    def _norm(xs: list) -> list[str]:
        out: list[str] = []
        for x in xs:
            if isinstance(x, str) and x.strip():
                out.append(x.strip())
        return out

    return (_norm(comm_raw), _norm(apt_raw))
