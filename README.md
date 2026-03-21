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

### Load `units.parquet` into Postgres (`listings` table)

From the repo root, with `DATABASE_URL` set to a **`postgresql+psycopg2://...`** URL in `api/.env`:

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py --fast-postgres
```

Dry run (no DB):

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py --dry-run
```

The script reads `data/stage=processed/units.parquet`, adds an `image_url` column for the text-to-SQL prompt, and creates/replaces the table named by `LISTINGS_TABLE_NAME` (default `listings`).

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

## Deploy to Azure App Service (GitHub Actions + Docker)

This repo includes CI/CD at `.github/workflows/azure-appservice-cicd.yml` for:

- API app service: `wademehome-backend`
- UI app service: `wademehome`
- Resource group: `wademehome-rg`
- ACR: `wademehomeacr.azurecr.io`
- Zero-downtime deploy strategy: deploy to `staging` slot, then swap to `production`

### 1) One-time Azure setup

Set your subscription and location:

```bash
az account set --subscription "<subscription-id-or-name>"
LOCATION="eastus"
RG="wademehome-rg"
ACR_NAME="wademehomeacr"
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
FRONTEND_APP="wademehome"
BACKEND_APP="wademehome-backend"
```

Create resource group and ACR:

```bash
az group create -n "$RG" -l "$LOCATION"
az acr create -g "$RG" -n "$ACR_NAME" --sku Basic
```

Create staging slots for both apps:

```bash
az webapp deployment slot create -g "$RG" -n "$FRONTEND_APP" --slot staging
az webapp deployment slot create -g "$RG" -n "$BACKEND_APP" --slot staging
```

Enable managed identities for production + staging slots:

```bash
az webapp identity assign -g "$RG" -n "$FRONTEND_APP"
az webapp identity assign -g "$RG" -n "$FRONTEND_APP" --slot staging
az webapp identity assign -g "$RG" -n "$BACKEND_APP"
az webapp identity assign -g "$RG" -n "$BACKEND_APP" --slot staging
```

Grant AcrPull for each identity:

```bash
ACR_ID="$(az acr show -g "$RG" -n "$ACR_NAME" --query id -o tsv)"
FRONTEND_PID="$(az webapp identity show -g "$RG" -n "$FRONTEND_APP" --query principalId -o tsv)"
FRONTEND_STAGING_PID="$(az webapp identity show -g "$RG" -n "$FRONTEND_APP" --slot staging --query principalId -o tsv)"
BACKEND_PID="$(az webapp identity show -g "$RG" -n "$BACKEND_APP" --query principalId -o tsv)"
BACKEND_STAGING_PID="$(az webapp identity show -g "$RG" -n "$BACKEND_APP" --slot staging --query principalId -o tsv)"

az role assignment create --assignee-object-id "$FRONTEND_PID" --assignee-principal-type ServicePrincipal --role AcrPull --scope "$ACR_ID"
az role assignment create --assignee-object-id "$FRONTEND_STAGING_PID" --assignee-principal-type ServicePrincipal --role AcrPull --scope "$ACR_ID"
az role assignment create --assignee-object-id "$BACKEND_PID" --assignee-principal-type ServicePrincipal --role AcrPull --scope "$ACR_ID"
az role assignment create --assignee-object-id "$BACKEND_STAGING_PID" --assignee-principal-type ServicePrincipal --role AcrPull --scope "$ACR_ID"
```

Configure backend app settings (prod + staging):

```bash
# Required example values (replace with real values)
DATABASE_URL="postgresql+psycopg2://user:pass@host:5432/db"
OPENAI_API_KEY="sk-..."
CORS_ALLOWED_ORIGINS="https://wademehome.azurewebsites.net"

az webapp config appsettings set -g "$RG" -n "$BACKEND_APP" --settings \
  DATABASE_URL="$DATABASE_URL" \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS" \
  WEBSITES_PORT=8000

az webapp config appsettings set -g "$RG" -n "$BACKEND_APP" --slot staging --settings \
  DATABASE_URL="$DATABASE_URL" \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS" \
  WEBSITES_PORT=8000
```

Configure frontend app settings (prod + staging):

```bash
az webapp config appsettings set -g "$RG" -n "$FRONTEND_APP" --settings WEBSITES_PORT=3000
az webapp config appsettings set -g "$RG" -n "$FRONTEND_APP" --slot staging --settings WEBSITES_PORT=3000
```

### 2) One-time GitHub setup

Create a service principal scoped to this resource group and save JSON output:

```bash
SUBSCRIPTION_ID="$(az account show --query id -o tsv)"
az ad sp create-for-rbac \
  --name "github-wademehome-deploy" \
  --role contributor \
  --scopes "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RG}" \
  --sdk-auth
```

Add GitHub repository secret:

- `AZURE_CREDENTIALS`: paste the full JSON from `az ad sp create-for-rbac --sdk-auth`

Add GitHub repository variable/secret used by workflow build args:

- Variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- Secret: `NEXT_PUBLIC_MAPBOX_TOKEN` (required if maps are used in production build)

### 3) First deployment

Run the workflow manually from GitHub Actions (`workflow_dispatch`) or push to `main`.

Expected outcome:

- API image is built/pushed and deployed to `wademehome-backend` staging, then swapped.
- UI image is built/pushed and deployed to `wademehome` staging, then swapped.

### 4) Verify

```bash
curl -sS https://wademehome-backend.azurewebsites.net/health
```

Then open `https://wademehome.azurewebsites.net` and confirm API-backed features load correctly.

### 5) Rollback (if needed)

Swap slots back:

```bash
az webapp deployment slot swap -g "$RG" -n "$BACKEND_APP" --slot production --target-slot staging
az webapp deployment slot swap -g "$RG" -n "$FRONTEND_APP" --slot production --target-slot staging
```
