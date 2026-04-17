"""Minimal NYC OpenData Socrata client.

This is an incremental puller: every dataset has a last `ingested_at` watermark
captured in `data_ingest_runs`, and we use `$where=:updated_at > '<iso>'` to
fetch only the newer rows. Socrata paginates via `$limit` + `$offset`.
"""

from __future__ import annotations

import os
from typing import Any, Iterable

import requests

from core.config import Config


SOCRATA_BASE = "https://data.cityofnewyork.us/resource"


def _app_token() -> str | None:
    return Config.get("SOCRATA_APP_TOKEN", os.environ.get("SOCRATA_APP_TOKEN"))


def iter_dataset_rows(
    dataset_id: str,
    *,
    where: str | None = None,
    order: str = ":updated_at ASC",
    page_size: int = 1000,
    max_pages: int | None = None,
) -> Iterable[dict[str, Any]]:
    """Yield all rows from a Socrata dataset, paginating until exhausted."""
    headers: dict[str, str] = {"Accept": "application/json"}
    token = _app_token()
    if token:
        headers["X-App-Token"] = token

    offset = 0
    page = 0
    while True:
        params: dict[str, str | int] = {
            "$limit": page_size,
            "$offset": offset,
            "$order": order,
        }
        if where:
            params["$where"] = where

        resp = requests.get(
            f"{SOCRATA_BASE}/{dataset_id}.json",
            params=params,
            headers=headers,
            timeout=60,
        )
        resp.raise_for_status()
        rows = resp.json()
        if not rows:
            return
        for row in rows:
            yield row
        if len(rows) < page_size:
            return
        offset += page_size
        page += 1
        if max_pages is not None and page >= max_pages:
            return
