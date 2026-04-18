"""CLI entry: `python -m evals --combo nano+mini` (run from `api/`).

Examples:
  python -m evals --combo nano+mini
  python -m evals --combo nano+nano --domains search,multi_turn
  python -m evals --combo mini+mini --case search.basic_williamsburg --no-judge
  python -m evals --matrix nano+nano,nano+mini,mini+mini
"""

import argparse
import asyncio
import sys

from db.session import get_session_local

from .cases import get_cases
from .models import COMBOS, get_combo
from .report import push_to_langfuse, write_report
from .runner import run_suite


def _parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(prog="python -m evals")
    p.add_argument("--combo", help=f"Single combo to run. One of: {sorted(COMBOS.keys())}")
    p.add_argument("--matrix", help="Comma-separated combos to run sequentially.")
    p.add_argument(
        "--case",
        action="append",
        help="Case id (repeatable). Default: all cases.",
    )
    p.add_argument(
        "--domains",
        help="Comma-separated domain filter (search,tours,saved,profile,navigator,multi_turn,edge).",
    )
    p.add_argument("--no-judge", action="store_true", help="Skip LLM-as-judge.")
    p.add_argument("--no-langfuse", action="store_true", help="Skip Langfuse push.")
    p.add_argument("--out", default="eval-results", help="Output dir for markdown reports.")
    return p.parse_args(argv)


async def _run_one_combo(
    combo_name: str,
    case_ids: list[str] | None,
    domains: list[str] | None,
    judge: bool,
    out_dir: str,
    skip_langfuse: bool,
) -> None:
    combo = get_combo(combo_name)
    cases = get_cases(ids=case_ids, domains=domains)
    if not cases:
        print(f"[evals] No cases matched filters; nothing to do.")
        return

    print(f"[evals] {combo_name}: running {len(cases)} case(s)…")
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        def _on_done(r) -> None:
            sym = "PASS" if r.passed else "FAIL"
            n_a = sum(a.passed for a in r.assertions)
            n_j = sum(j.passed for j in r.judge_results)
            print(
                f"  [{sym}] {r.case_id} ({r.total_duration_s:.1f}s) "
                f"assertions={n_a}/{len(r.assertions)} "
                f"judge={n_j}/{len(r.judge_results)}"
            )

        results = await run_suite(
            db=db, combo=combo, cases=cases, judge=judge, on_case_done=_on_done,
        )
    finally:
        db.close()

    path = write_report(results, combo.name, out_dir=out_dir)
    print(f"[evals] {combo_name}: wrote report → {path}")

    if not skip_langfuse:
        run_name = push_to_langfuse(results, combo.name)
        if run_name:
            print(f"[evals] {combo_name}: pushed to Langfuse run={run_name}")
        else:
            print(f"[evals] {combo_name}: Langfuse skipped (no creds).")

    passed = sum(1 for r in results if r.passed)
    total = len(results)
    print(f"[evals] {combo_name}: {passed}/{total} passing.")


async def _main_async(args: argparse.Namespace) -> int:
    if not args.combo and not args.matrix:
        print("Error: pass --combo or --matrix.", file=sys.stderr)
        return 2
    combos = (
        [args.combo] if args.combo
        else [c.strip() for c in args.matrix.split(",") if c.strip()]
    )
    domains = (
        [d.strip() for d in args.domains.split(",") if d.strip()]
        if args.domains else None
    )
    for combo_name in combos:
        await _run_one_combo(
            combo_name=combo_name,
            case_ids=args.case,
            domains=domains,
            judge=not args.no_judge,
            out_dir=args.out,
            skip_langfuse=args.no_langfuse,
        )
    return 0


def main() -> None:
    args = _parse_args(sys.argv[1:])
    sys.exit(asyncio.run(_main_async(args)))


if __name__ == "__main__":
    main()
