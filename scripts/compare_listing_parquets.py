#!/usr/bin/env python3
"""Compare row counts and distinct listing_id between two units.parquet files (coverage QA)."""
from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("baseline", type=Path, help="Earlier parquet (e.g. prior load_date)")
    p.add_argument("current", type=Path, help="New parquet")
    args = p.parse_args()
    for path in (args.baseline, args.current):
        if not path.exists():
            print(f"Missing: {path}")
            return 1
    a = pd.read_parquet(args.baseline)
    b = pd.read_parquet(args.current)
    print(f"baseline: {args.baseline}")
    print(f"  rows={len(a):,}  unique_listing_id={a['listing_id'].nunique(dropna=True):,}")
    print(f"current:  {args.current}")
    print(f"  rows={len(b):,}  unique_listing_id={b['listing_id'].nunique(dropna=True):,}")
    if "listing_id" in a.columns and "listing_id" in b.columns:
        sa = set(a["listing_id"].dropna().astype(str))
        sb = set(b["listing_id"].dropna().astype(str))
        only_b = len(sb - sa)
        only_a = len(sa - sb)
        print(f"listing_id only in current: {only_b:,}")
        print(f"listing_id only in baseline: {only_a:,}")
    for col in ("zipcode", "latitude", "longitude"):
        if col in b.columns:
            null_pct = 100.0 * float(b[col].isna().mean())
            print(f"current null {col}: {null_pct:.2f}%")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
