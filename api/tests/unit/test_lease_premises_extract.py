import json
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from movein.lease_premises_extract import (
    MOVE_FROM_ADDRESS_MAX_LEN,
    extract_premises_address_from_lease_text,
)
from movein.service import set_move_from_address_if_empty


class _FakeMsg:
    def __init__(self, content: str) -> None:
        self.content = content


class _FakeResp:
    def __init__(self, content: str) -> None:
        self.message = _FakeMsg(content)


@pytest.mark.asyncio
async def test_extract_premises_normalizes_json_string() -> None:
    llm = MagicMock()
    llm.achat = AsyncMock(
        return_value=_FakeResp(json.dumps({"premises_address": "  10 Oak Ave,  Austin,  TX 78701  "}))
    )
    out = await extract_premises_address_from_lease_text("LEASE BODY", llm=llm)
    assert out == "10 Oak Ave, Austin, TX 78701"
    llm.achat.assert_awaited_once()


@pytest.mark.asyncio
async def test_extract_premises_null_returns_none() -> None:
    llm = MagicMock()
    llm.achat = AsyncMock(return_value=_FakeResp(json.dumps({"premises_address": None})))
    out = await extract_premises_address_from_lease_text("foo", llm=llm)
    assert out is None


@pytest.mark.asyncio
async def test_extract_premises_empty_lease_returns_none() -> None:
    llm = MagicMock()
    out = await extract_premises_address_from_lease_text("  ", llm=llm)
    assert out is None
    llm.achat.assert_not_called()


@pytest.mark.asyncio
async def test_extract_premises_truncates_to_column_len() -> None:
    long_addr = "A" * (MOVE_FROM_ADDRESS_MAX_LEN + 40)
    llm = MagicMock()
    llm.achat = AsyncMock(return_value=_FakeResp(json.dumps({"premises_address": long_addr})))
    out = await extract_premises_address_from_lease_text("lease", llm=llm)
    assert out is not None
    assert len(out) == MOVE_FROM_ADDRESS_MAX_LEN


@pytest.mark.asyncio
async def test_extract_premises_invalid_json_returns_none() -> None:
    llm = MagicMock()
    llm.achat = AsyncMock(return_value=_FakeResp("not-json"))
    out = await extract_premises_address_from_lease_text("lease", llm=llm)
    assert out is None


def test_set_move_from_fills_when_empty() -> None:
    plan = MagicMock()
    plan.move_from_address = None
    db = MagicMock()
    uid = uuid.uuid4()
    with patch("movein.service._ensure_plan", return_value=plan):
        assert set_move_from_address_if_empty(db, uid, " 123 Main St ") is True
    assert plan.move_from_address == "123 Main St"
    db.commit.assert_called_once()


def test_set_move_from_skips_when_already_set() -> None:
    plan = MagicMock()
    plan.move_from_address = "Existing"
    db = MagicMock()
    uid = uuid.uuid4()
    with patch("movein.service._ensure_plan", return_value=plan):
        assert set_move_from_address_if_empty(db, uid, "New Addr") is False
    assert plan.move_from_address == "Existing"
    db.commit.assert_not_called()
