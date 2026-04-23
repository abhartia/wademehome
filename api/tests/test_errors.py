from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from core.errors import install_error_handlers


def _app_with_handlers() -> FastAPI:
    app = FastAPI()
    install_error_handlers(app)

    @app.get("/boom")
    async def boom():
        raise RuntimeError("kaboom")

    @app.get("/nope")
    async def nope():
        raise HTTPException(status_code=404, detail="missing")

    @app.get("/items/{item_id}")
    async def items(item_id: int):
        return {"id": item_id}

    return app


def test_envelope_for_http_exception():
    client = TestClient(_app_with_handlers(), raise_server_exceptions=False)
    r = client.get("/nope")
    assert r.status_code == 404
    body = r.json()
    assert body["error"]["code"] == "not_found"
    assert body["error"]["message"] == "missing"
    assert "request_id" in body["error"]


def test_envelope_for_validation_error():
    client = TestClient(_app_with_handlers(), raise_server_exceptions=False)
    r = client.get("/items/not-an-int")
    assert r.status_code == 422
    body = r.json()
    assert body["error"]["code"] == "validation_error"
    assert "details" in body["error"]


def test_envelope_for_unhandled():
    client = TestClient(_app_with_handlers(), raise_server_exceptions=False)
    r = client.get("/boom")
    assert r.status_code == 500
    body = r.json()
    assert body["error"]["code"] == "internal_error"
    # Stack traces must never leak into the response body.
    assert "kaboom" not in body["error"]["message"]
