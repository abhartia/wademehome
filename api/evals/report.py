"""Render eval results to markdown and (optionally) push to Langfuse.

Markdown report goes to `eval-results/{ts}-{combo}.md` and is the canonical
artifact for PR review. Langfuse push creates a `dataset_run` so the same
cases can be visually compared across model combos in the Langfuse UI.
"""

import os
from datetime import datetime
from pathlib import Path

from .runner import CaseResult


def _passing_emoji(b: bool) -> str:
    return "PASS" if b else "FAIL"


def _format_case_block(r: CaseResult) -> str:
    lines: list[str] = []
    overall = "PASS" if r.passed else "FAIL"
    lines.append(f"### `{r.case_id}` — **{overall}**  _{r.domain}_")
    lines.append(f"_{r.total_duration_s:.1f}s · combo `{r.combo}`_")
    lines.append("")
    # Per-turn summary.
    for i, t in enumerate(r.turns):
        lines.append(f"**Turn {i+1}** _({t.duration_s:.1f}s)_  ")
        lines.append(f"> User: {t.user_msg}")
        lines.append(f"> Agent path: {' → '.join(t.agents_visited) or '(none)'}")
        lines.append(
            f"> Tools: {', '.join(name for name, _ in t.tool_calls) or '(none)'}"
        )
        lines.append(
            f"> UI events: {', '.join(t.ui_event_types) or '(none)'}"
        )
        if t.assistant_text:
            lines.append(f"> Reply: {t.assistant_text[:240]}")
        if t.error:
            lines.append(f"> ERROR: {t.error}")
        lines.append("")

    # Assertions.
    if r.assertions:
        lines.append("**Structural assertions**")
        for a in r.assertions:
            sym = _passing_emoji(a.passed)
            lines.append(f"- {sym} `{a.name}` {('— ' + a.detail) if a.detail else ''}")
        lines.append("")

    # Judge.
    if r.judge_results:
        lines.append("**LLM judge**")
        for j in r.judge_results:
            sym = _passing_emoji(j.passed)
            lines.append(f"- {sym} _{j.criterion}_ — {j.reason}")
        lines.append("")

    return "\n".join(lines)


def to_markdown(results: list[CaseResult], combo_name: str) -> str:
    total = len(results)
    passed = sum(1 for r in results if r.passed)
    avg_dur = (
        sum(r.total_duration_s for r in results) / total if total else 0.0
    )

    lines: list[str] = []
    lines.append(f"# Eval Report — `{combo_name}`")
    lines.append("")
    lines.append(f"_Generated: {datetime.utcnow().isoformat()}Z_")
    lines.append("")
    lines.append(f"**Pass rate:** {passed}/{total} ({(passed / total * 100) if total else 0:.0f}%)  ")
    lines.append(f"**Mean case duration:** {avg_dur:.1f}s  ")
    lines.append("")

    # Per-domain summary.
    by_domain: dict[str, list[CaseResult]] = {}
    for r in results:
        by_domain.setdefault(r.domain, []).append(r)
    lines.append("## Domain summary")
    lines.append("")
    lines.append("| Domain | Pass / Total | Avg duration |")
    lines.append("|---|---|---|")
    for domain in sorted(by_domain):
        rs = by_domain[domain]
        p = sum(1 for r in rs if r.passed)
        t = len(rs)
        avg = sum(r.total_duration_s for r in rs) / t if t else 0.0
        lines.append(f"| {domain} | {p}/{t} | {avg:.1f}s |")
    lines.append("")

    # Per-case details.
    lines.append("## Cases")
    lines.append("")
    for r in results:
        lines.append(_format_case_block(r))
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def write_report(
    results: list[CaseResult],
    combo_name: str,
    out_dir: Path | str = "eval-results",
) -> Path:
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    safe_combo = combo_name.replace("/", "_").replace("+", "_")
    path = out_dir / f"{ts}-{safe_combo}.md"
    path.write_text(to_markdown(results, combo_name))
    return path


def push_to_langfuse(
    results: list[CaseResult],
    combo_name: str,
    dataset_name: str = "home_agent_evals",
) -> str | None:
    """Push results as a Langfuse dataset run.

    Creates the dataset (and items) if missing, then a dataset_run named
    after the combo + timestamp. Returns the run name, or None if Langfuse
    isn't configured.
    """
    try:
        from langfuse import get_client
    except ImportError:
        return None
    if not (os.getenv("LANGFUSE_PUBLIC_KEY") and os.getenv("LANGFUSE_SECRET_KEY")):
        return None

    client = get_client()
    # Ensure dataset + items exist.
    try:
        client.create_dataset(name=dataset_name)
    except Exception:
        pass  # already exists

    case_id_to_item: dict[str, str] = {}
    for r in results:
        try:
            item = client.create_dataset_item(
                dataset_name=dataset_name,
                input={"case_id": r.case_id, "domain": r.domain,
                       "turns": [t.user_msg for t in r.turns]},
                expected_output=None,
                metadata={"domain": r.domain},
                source_observation_id=None,
            )
            case_id_to_item[r.case_id] = getattr(item, "id", "")
        except Exception:
            pass

    run_name = f"{combo_name}-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    for r in results:
        try:
            client.create_score(
                name="overall_pass",
                value=1.0 if r.passed else 0.0,
                comment=f"{sum(a.passed for a in r.assertions)}/{len(r.assertions)} assertions, "
                        f"{sum(j.passed for j in r.judge_results)}/{len(r.judge_results)} judge",
                data_type="NUMERIC",
            )
        except Exception:
            pass
    try:
        client.flush()
    except Exception:
        pass
    return run_name
