from unittest.mock import MagicMock

from core.rate_limit import request_identity


def test_identity_prefers_user_id(monkeypatch):
    from core import request_context

    monkeypatch.setattr(request_context, "get_user_id", lambda: "user-42")
    import core.rate_limit as rl

    monkeypatch.setattr(rl, "get_user_id", lambda: "user-42")
    req = MagicMock()
    req.client.host = "10.0.0.1"
    assert request_identity(req) == "user:user-42"


def test_identity_falls_back_to_ip(monkeypatch):
    import core.rate_limit as rl

    monkeypatch.setattr(rl, "get_user_id", lambda: None)
    req = MagicMock()
    req.client.host = "10.0.0.9"
    assert request_identity(req).startswith("ip:")
