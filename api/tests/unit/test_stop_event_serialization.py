from typing import Any

from core.sse import stop_event_result_to_sse_chunk


def test_stop_event_result_to_sse_chunk_none() -> None:
    assert stop_event_result_to_sse_chunk(None) == '0:""\n\n'


def test_stop_event_result_to_sse_chunk_string() -> None:
    assert stop_event_result_to_sse_chunk("hello") == '0:"hello"\n\n'


def test_stop_event_result_to_sse_chunk_number() -> None:
    assert stop_event_result_to_sse_chunk(123) == '0:"123"\n\n'


def test_stop_event_result_to_sse_chunk_object_best_effort() -> None:
    class Obj:
        def __str__(self) -> str:
            return "obj-str"

    obj: Any = Obj()
    assert stop_event_result_to_sse_chunk(obj) == '0:"obj-str"\n\n'

