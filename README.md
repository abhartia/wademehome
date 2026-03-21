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

From the repo root, with `DATABASE_URL` set to a **`postgresql+psycopg2://...`** URL in `api/.env`. The loader needs **pandas**, **pyarrow**, and **python-dotenv** in that venv (e.g. `api/.venv/bin/pip install pandas pyarrow python-dotenv` if imports fail).

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py --fast-postgres
```

**Greystar scrape output** lives under `greystar_scraper/env=local/source=greystar/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet`. Load it without duplicating rows:

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py \
  --parquet greystar_scraper/env=local/source=greystar/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet \
  --fast-postgres --if-exists upsert
```

(`upsert` uses `listing_id` and a unique index; requires `--fast-postgres`.)

Dry run (no DB):

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py --dry-run
```

By default the script reads `data/stage=processed/units.parquet`, adds an `image_url` column for the text-to-SQL prompt, and creates/replaces the table named by `LISTINGS_TABLE_NAME` (default `listings`). Use `--parquet` for other paths.

**Listings column reference** (Greystar / `units.parquet` → Postgres): see [`api/src/listings/listings_inventory_schema.json`](api/src/listings/listings_inventory_schema.json). The API resolves common aliases (`zip` / `zipcode` / `postal_code`, etc.) against your actual table via `information_schema`.

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

**Shell variables must be set.** If you only paste the block below, it includes `RG`, `ACR_NAME`, and app names. If you split the doc into multiple copy-pastes, run the **“Set your subscription and location”** block first **in the same terminal session**, or you will see errors like `resourceGroups/providers/Microsoft.Web/sites/` (empty names) and `--scope can't be an empty string`.

```bash
RG="wademehome-rg"
ACR_NAME="wademehomeacr"
FRONTEND_APP="wademehome"
BACKEND_APP="wademehome-backend"

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

**Important:** production and **each deployment slot** get **different** system-assigned identities. If you only granted `AcrPull` to production, **staging will fail** with `ImagePullUnauthorizedFailure` when pulling `*.azurecr.io/...`.

**Portal (required for managed identity pull):** for **production** and **staging**, open the web app → **Deployment Center** (or **Settings → Container**) and set **Registry authentication** to **Managed identity** (system-assigned) targeting your ACR. If the app is still configured to use **admin username/password** but ACR admin is disabled or secrets are wrong, pulls will also fail with unauthorized.

Configure backend app settings (prod + staging):

```bash
# Required example values (replace with real values)
DATABASE_URL="postgresql+psycopg2://user:pass@host:5432/db"
# Azure OpenAI (used by the API when these are set)
AZURE_OPENAI_ENDPOINT="https://YOUR_RESOURCE.openai.azure.com/"
AZURE_OPENAI_API_KEY="<your-api-key>"
# Your Azure OpenAI deployment name
AZURE_OPENAI_DEPLOYMENT="GPT4OMini"
# Optional (falls back to defaults if omitted)
AZURE_OPENAI_MODEL="gpt-4o-mini"
AZURE_OPENAI_API_VERSION="2024-12-01-preview"
CORS_ALLOWED_ORIGINS="https://wademehome.azurewebsites.net"

az webapp config appsettings set -g "$RG" -n "$BACKEND_APP" --settings \
  DATABASE_URL="$DATABASE_URL" \
  AZURE_OPENAI_ENDPOINT="$AZURE_OPENAI_ENDPOINT" \
  AZURE_OPENAI_API_KEY="$AZURE_OPENAI_API_KEY" \
  AZURE_OPENAI_DEPLOYMENT="$AZURE_OPENAI_DEPLOYMENT" \
  AZURE_OPENAI_MODEL="$AZURE_OPENAI_MODEL" \
  AZURE_OPENAI_API_VERSION="$AZURE_OPENAI_API_VERSION" \
  CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS" \
  WEBSITES_PORT=8000

az webapp config appsettings set -g "$RG" -n "$BACKEND_APP" --slot staging --settings \
  DATABASE_URL="$DATABASE_URL" \
  AZURE_OPENAI_ENDPOINT="$AZURE_OPENAI_ENDPOINT" \
  AZURE_OPENAI_API_KEY="$AZURE_OPENAI_API_KEY" \
  AZURE_OPENAI_DEPLOYMENT="$AZURE_OPENAI_DEPLOYMENT" \
  AZURE_OPENAI_MODEL="$AZURE_OPENAI_MODEL" \
  AZURE_OPENAI_API_VERSION="$AZURE_OPENAI_API_VERSION" \
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

### Troubleshooting: `ImagePullUnauthorizedFailure` (platform logs)

If **Diagnose and solve problems** or **Log stream** (platform) shows:

`Failed to pull image: ...azurecr.io/... Image pull failed with forbidden or unauthorized. Check registry credentials.`

then the site **never started your app container** — the failure is **ACR authentication**, not Next.js/Python.

1. **Grant `AcrPull` on the ACR** to the **staging slot’s** managed identity (and production’s), as in the `az role assignment create` block above — use `az webapp identity show --slot staging` to get the right `principalId`.
2. In the **Portal**, for **each** slot (production + **staging**): **Deployment Center** / **Container** → **Registry authentication** = **Managed identity** (not invalid admin credentials).
3. Confirm the image tag exists: `az acr repository show-tags -n wademehomeacr --repository wademehome-frontend -o table` (or set `ACR_NAME` and use `-n "$ACR_NAME"`).
4. If the registry uses **private endpoints / network rules**, the App Service plan may need **VNet integration** or ACR must allow the app’s outbound path.

Verify role assignments on the registry (look for all four app principals):

```bash
RG="wademehome-rg"
ACR_NAME="wademehomeacr"
ACR_ID="$(az acr show -g "$RG" -n "$ACR_NAME" --query id -o tsv)"
az role assignment list --scope "$ACR_ID" --query "[?roleDefinitionName=='AcrPull'].principalId" -o tsv
```

### Troubleshooting: `staging` slot did not respond to http ping (swap fails)

Azure runs an HTTP check against the **staging** slot before it will swap. If the new container is still pulling from ACR or Node/Python is still starting, swap can fail with:

`Cannot swap site slots ... because the 'staging' slot did not respond to http ping`

**If pulls are unauthorized (above), staging will never answer HTTP** until ACR access is fixed.

The GitHub workflow waits for staging to return HTTP 200 (backend: `/health`, frontend: `/`) before calling `az webapp deployment slot swap`. If it still fails after that wait, check in Azure Portal (or CLI):

1. **Staging slot URL responds** (replace names if yours differ):
   - API: `curl -fsS https://wademehome-backend-staging.azurewebsites.net/health`
   - UI: `curl -fsSL https://wademehome-staging.azurewebsites.net/`
2. **“Application Error” with an empty Log stream** often means the **app container never ran** (e.g. image pull failed) or it exited immediately. Check **platform / container logs** for `ImagePullUnauthorizedFailure` first; then enable **App Service logs** → **Application Logging (Filesystem)** and **Docker Container logging**, and **Log stream** on the **staging** slot.
3. **Port**: staging must use the same `WEBSITES_PORT` as production (**`8000`** API, **`3000`** UI). The UI container runs **Next.js standalone** (`node server.js`), which listens on Azure’s **`PORT`** env var; `WEBSITES_PORT` must match that (typically **`3000`** unless you override `PORT` in app settings).
4. **ACR pull**: the **staging** slot’s **system-assigned identity** needs **`AcrPull`** on the registry **and** the slot must be configured to use **managed identity** for registry auth in the portal.
5. **Linux + container**: staging should be the same stack as production (Linux container from ACR), not an empty/default slot.

### 5) Rollback (if needed)

Swap slots back:

```bash
az webapp deployment slot swap -g "$RG" -n "$BACKEND_APP" --slot production --target-slot staging
az webapp deployment slot swap -g "$RG" -n "$FRONTEND_APP" --slot production --target-slot staging
```
