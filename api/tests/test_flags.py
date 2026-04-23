import pytest

from core import flags


def test_env_override_true(monkeypatch):
    monkeypatch.setenv("FLAG_NEW_SEARCH", "true")
    assert flags.is_enabled("new_search") is True


def test_env_override_false(monkeypatch):
    monkeypatch.setenv("FLAG_NEW_SEARCH", "false")
    assert flags.is_enabled("new_search", default=True) is False


def test_default_when_no_row_and_no_env(monkeypatch):
    monkeypatch.delenv("FLAG_UNSEEN_KEY", raising=False)
    monkeypatch.setattr(flags, "_get_cached", lambda _k: None)
    assert flags.is_enabled("unseen_key", default=False) is False
    assert flags.is_enabled("unseen_key", default=True) is True


def test_rollout_percent_bucket(monkeypatch):
    monkeypatch.setattr(
        flags,
        "_get_cached",
        lambda _k: {"enabled": True, "rollout_percent": 100, "user_allowlist": []},
    )
    assert flags.is_enabled("k", user_id="anyone") is True


def test_rollout_zero_percent(monkeypatch):
    monkeypatch.setattr(
        flags,
        "_get_cached",
        lambda _k: {"enabled": True, "rollout_percent": 0, "user_allowlist": []},
    )
    assert flags.is_enabled("k", user_id="anyone") is False


def test_allowlist_hit(monkeypatch):
    monkeypatch.setattr(
        flags,
        "_get_cached",
        lambda _k: {"enabled": True, "rollout_percent": 0, "user_allowlist": ["vip"]},
    )
    assert flags.is_enabled("k", user_id="vip") is True
    assert flags.is_enabled("k", user_id="other") is False


def test_disabled_blocks_all(monkeypatch):
    monkeypatch.setattr(
        flags,
        "_get_cached",
        lambda _k: {"enabled": False, "rollout_percent": 100, "user_allowlist": ["vip"]},
    )
    assert flags.is_enabled("k", user_id="vip") is False
