import pytest

from core.pagination import Page, decode_cursor, encode_cursor


def test_encode_decode_roundtrip():
    payload = {"last_id": 42, "ts": "2026-04-23T00:00:00Z"}
    cursor = encode_cursor(payload)
    assert isinstance(cursor, str)
    assert "=" not in cursor  # padding stripped
    assert decode_cursor(cursor) == payload


def test_decode_none_returns_none():
    assert decode_cursor(None) is None
    assert decode_cursor("") is None


def test_decode_invalid_raises():
    with pytest.raises(ValueError, match="invalid_cursor"):
        decode_cursor("!!!not-base64!!!")


def test_decode_non_object_raises():
    import base64
    import json

    non_object = base64.urlsafe_b64encode(json.dumps([1, 2, 3]).encode()).rstrip(b"=").decode()
    with pytest.raises(ValueError):
        decode_cursor(non_object)


def test_page_shape():
    page = Page[int](items=[1, 2, 3], next_cursor="abc", has_more=True)
    assert page.items == [1, 2, 3]
    assert page.next_cursor == "abc"
    assert page.has_more is True
    assert page.total is None
