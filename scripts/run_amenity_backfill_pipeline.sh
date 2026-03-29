#!/usr/bin/env bash
# Source-only amenity fetch -> listings columns -> listing_amenities -> per-amenity embeddings.
# Run from repo root: ./scripts/run_amenity_backfill_pipeline.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PY="${ROOT}/api/.venv/bin/python"
export PYTHONUNBUFFERED=1

echo "=== 1/3 backfill_listing_amenities (RentCafe, RealPage, Entrata) ===" | tee /dev/stderr
"$PY" scripts/backfill_listing_amenities.py --workers 8 --timeout-s 45

echo "=== 2/3 sync_listing_amenities ===" | tee /dev/stderr
"$PY" scripts/sync_listing_amenities.py

echo "=== 3/3 backfill_listing_amenity_embeddings ===" | tee /dev/stderr
"$PY" scripts/backfill_listing_amenity_embeddings.py --batch-size 128 --max-rows 2000000

echo "=== done ===" | tee /dev/stderr
