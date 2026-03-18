# Listing AI

Full-stack app: **API** (FastAPI + LlamaIndex) and **UI** (Next.js).

## Quick start

### 1. API (Python)

Uses a virtualenv in `api/.venv`. **Use Python 3.11–3.12** (3.14 has known issues with Langfuse/Pydantic).

```bash
cd api
# If .venv doesn't exist: python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Or with [uv](https://docs.astral.sh/uv/):

```bash
cd api && uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Set `api/.env` (see `api/.env.example`). Required for chat: `OPENAI_API_KEY`, `DATABASE_URL`, and optionally `LISTINGS_TABLE_NAME` / `LISTINGS_TABLE_SCHEMA`.

### 2. UI (Next.js)

```bash
cd ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `ui/.env.local` with `NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000` (see `ui/.env.local.example`).

## Debug (VS Code / Cursor)

Use **Run and Debug** and choose:

- **API (FastAPI)** – starts API with debugger
- **UI (Next.js)** – starts UI with debugger
- **API + UI** – starts both

Config: `.vscode/launch.json`. The API config uses `api/.venv/bin/python` if present.

## Env files

| App | File | Purpose |
|-----|------|--------|
| API | `api/.env` | `DATABASE_URL`, `OPENAI_API_KEY`, `CORS_ALLOWED_ORIGINS`, etc. |
| UI  | `ui/.env.local` | `NEXT_PUBLIC_CHAT_API_URL` (e.g. `http://localhost:8000`) |

Examples: `api/.env.example`, `ui/.env.local.example`.
