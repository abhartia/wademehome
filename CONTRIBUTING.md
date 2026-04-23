# Contributing

Thanks for taking a look — this is a portfolio project, but drive-by PRs that improve the code are welcome.

## Dev setup

```bash
# Backend
cd api
python3 -m venv .venv
.venv/bin/pip install -e ".[dev,observability]"
.venv/bin/python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd ui
npm ci
npm run dev

# Pre-commit hooks (one-time)
pip install pre-commit
pre-commit install
```

Environment variables live in `api/.env` and `ui/.env.local`. Copy the `.env.example` in each directory and fill in what you need. Every observability / security variable is optional — the app runs fully offline with none of them set.

## Running the test suite

```bash
# Backend unit + fast integration
cd api
.venv/bin/pytest -m "not live and not integration"

# Backend with coverage
.venv/bin/pytest --cov=src --cov-report=term

# Frontend unit
cd ui
npm test -- --run

# Frontend e2e (requires a built app)
npm run build
npm run test:e2e
```

## Style

- Python: `ruff check` + `black` — both run in pre-commit and in CI.
- TypeScript: `eslint` + `prettier` — both run in pre-commit and in CI.
- Types: `mypy` on the backend (non-strict as a starting point, tightening per module). `tsc --noEmit` on the frontend.
- No comments that explain *what* the code does — the code already does that. Comments should explain *why*: a non-obvious invariant, a workaround for a specific bug, a subtle constraint.

## Commit messages

Conventional-style is nice but not mandatory. A one-line summary that a reader can grep for is fine. Reference issues with `#123` where it helps.

## PR expectations

Every PR should:

1. Pass CI (lint, typecheck, tests, CodeQL).
2. Include a test for any behavior change — even a tiny one.
3. Touch only one concern. If you wanted to fix two bugs, open two PRs.
4. Update docs if you changed a contract. `ARCHITECTURE.md`, `RUNBOOK.md`, or an ADR, depending on scope.

## Filing an ADR

If you're making a decision that future you (or future me) will want to understand, add a one-page ADR under [docs/adr/](docs/adr/). Copy an existing one as a template and number it sequentially.
