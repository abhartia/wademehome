"""Write FastAPI OpenAPI JSON to ../ui/openapi.json (run from api/ with uv)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

API_ROOT = Path(__file__).resolve().parents[1]
UI_OPENAPI = API_ROOT.parent / "ui" / "openapi.json"

sys.path.insert(0, str(API_ROOT / "src"))

from main import fastapi_app

UI_OPENAPI.write_text(json.dumps(fastapi_app.openapi(), indent=2), encoding="utf-8")
print(f"Wrote {UI_OPENAPI}")
