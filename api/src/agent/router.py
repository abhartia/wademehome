"""SSE chat endpoint for the home agent."""
from __future__ import annotations

import asyncio
import json
import time
import traceback
import uuid
from typing import Any

from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from langfuse import get_client as get_langfuse_client
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    AgentSetup,
    AgentStream,
    ToolCall,
    ToolCallResult,
)
from llama_index.core.workflow import StopEvent
from llama_index.core.workflow.handler import WorkflowHandler
from llama_index.server.models.chat import ChatRequest
from llama_index.server.models.ui import UIEvent
from sqlalchemy import select
from sqlalchemy.orm import Session

from agent.workflow import build_home_agent_workflow
from auth.router import get_current_user, get_db
from core.config import Config
from core.llm_factory import get_llm_mini_reasoning, get_llm_nano
from core.logger import get_logger
from db.models import UserLeaseDocuments, Users
from movein.lease_premises_extract import extract_premises_address_from_lease_text
from movein.service import set_move_from_address_if_empty
from portal.lease_routes import (
    LEASE_TEXT_MAX_CHARS,
    MAX_LEASE_UPLOAD_BYTES,
    extract_text_from_pdf,
)

logger = get_logger(__name__)
router = APIRouter(prefix="/agent", tags=["agent"])

# Agents that have NO tools (orchestrator-only) get a synthetic agent_step so
# the UI's strip shows something during routing turns. Agents WITH tools emit
# their own _step()s — surfacing a synthetic one duplicates the strip.
_TOOLLESS_AGENTS = {"orchestrator"}


def _sse_text(delta: str) -> str:
    return f"0:{json.dumps(delta)}\n\n"


def _sse_annotation(payload: list[dict[str, Any]]) -> str:
    return f"8:{json.dumps(payload)}\n\n"


def _agent_step_payload(
    agent_name: str, label: str, state: str = "running"
) -> dict[str, Any]:
    return {
        "type": "agent_step",
        "data": {"agent": agent_name, "label": label, "state": state},
    }


def _tool_call_payload(tc: ToolCall) -> dict[str, Any]:
    return {
        "type": "agent_tool_call",
        "data": {
            "tool_id": tc.tool_id,
            "tool_name": tc.tool_name,
            "tool_kwargs": _safe_kwargs(tc.tool_kwargs),
        },
    }


def _tool_result_payload(tr: ToolCallResult) -> dict[str, Any]:
    output = tr.tool_output
    raw = getattr(output, "content", None) or getattr(output, "raw_output", None)
    if not isinstance(raw, str):
        try:
            raw = json.dumps(raw, default=str)
        except Exception:
            raw = str(raw)
    return {
        "type": "agent_tool_result",
        "data": {
            "tool_id": tr.tool_id,
            "tool_name": tr.tool_name,
            "ok": getattr(output, "is_error", False) is not True,
            "summary": (raw or "")[:400],
        },
    }


def _safe_kwargs(kwargs: dict[str, Any]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for k, v in (kwargs or {}).items():
        try:
            json.dumps(v, default=str)
            out[k] = v
        except Exception:
            out[k] = str(v)
    return out


def _agent_event_generator(handler: WorkflowHandler, request: Request):
    async def gen():
        t0 = time.perf_counter()
        first = False
        had_tool_activity = False
        current_agent: str | None = None
        # Emit an immediate progress hint so the UI surfaces real status while
        # the orchestrator LLM is still routing. Without this, the user stares
        # at the placeholder until the first AgentInput event lands (1–3s for
        # nano routing, 5–15s if a tool then runs before the first text token).
        #
        # The empty `0:""` text frame is what forces useChat (Vercel AI SDK v4)
        # to create the assistant Message object — annotation-only `8:` frames
        # are queued internally and don't promote a message on their own. Once
        # the assistant message exists, AgentStepStrip renders inline with
        # live agent_step / tool_call annotations as they stream in.
        yield _sse_text("")
        yield _sse_annotation([
            _agent_step_payload("orchestrator", "Routing your request", "running")
        ])
        try:
            async for event in handler.stream_events():
                if isinstance(event, (ToolCall, ToolCallResult)):
                    had_tool_activity = True
                if await request.is_disconnected():
                    logger.info("agent/chat SSE: client disconnected")
                    break

                # Track agent transitions and surface them as steps — only for
                # toolless agents (orchestrator). Tool-using agents emit their
                # own _step() in the tool body; the synthetic step would race
                # and duplicate the UI strip.
                if isinstance(event, (AgentInput, AgentSetup)):
                    name = event.current_agent_name
                    if name != current_agent and name in _TOOLLESS_AGENTS:
                        current_agent = name
                        yield _sse_annotation([
                            _agent_step_payload(name, f"{name} thinking", "running")
                        ])
                    else:
                        current_agent = name
                    continue

                if isinstance(event, AgentStream):
                    if event.delta:
                        if not first:
                            first = True
                            logger.info(
                                "agent/chat ttft_ms=%s",
                                int((time.perf_counter() - t0) * 1000),
                            )
                        yield _sse_text(event.delta)
                    continue

                if isinstance(event, ToolCall):
                    yield _sse_annotation([_tool_call_payload(event)])
                    continue

                if isinstance(event, ToolCallResult):
                    yield _sse_annotation([_tool_result_payload(event)])
                    continue

                # Tools emit rich UIEvents through ctx.write_event_to_stream.
                if isinstance(event, UIEvent):
                    yield _sse_annotation([event.to_response()])
                    continue

                if isinstance(event, AgentOutput):
                    # If the agent produced no streamed content but has a final
                    # response (e.g. non-streaming model), flush it.
                    text = (event.response.content or "").strip()
                    if text and not first:
                        first = True
                        yield _sse_text(text)
                    continue

                if isinstance(event, StopEvent):
                    result = getattr(event, "result", None)
                    if result and not first:
                        text = (
                            getattr(result, "response", None)
                            or getattr(result, "content", None)
                            or str(result)
                        )
                        if isinstance(text, str) and text.strip():
                            yield _sse_text(text)
                    continue

        except asyncio.CancelledError:
            logger.info("agent/chat SSE: cancelled")
            raise
        except Exception:
            logger.exception("agent/chat SSE: error in stream")
            yield _sse_annotation([{
                "type": "agent_error",
                "data": {"message": "Something went wrong while thinking."},
            }])
            raise
        else:
            # Fail-loud guard. If the stream closed without any text from an
            # agent AND without any tool activity, something upstream aborted
            # silently — most commonly the orchestrator LLM finishing with
            # length=limit before it could emit the handoff function call
            # (see llm_factory.get_llm_nano max_tokens note). Without this,
            # the UI is left with only the "Routing your request" step and
            # the user sees a ghost message. Surface an explicit error so
            # the failure is visible and the toast fires.
            if not first and not had_tool_activity:
                logger.warning(
                    "agent/chat SSE: stream closed with no output "
                    "(likely orchestrator budget exhausted or no handoff)"
                )
                yield _sse_annotation([{
                    "type": "agent_error",
                    "data": {
                        "message": (
                            "The concierge didn't produce a reply — please "
                            "try rephrasing, or try again."
                        )
                    },
                }])

    return gen


@router.post("/chat")
async def agent_chat(
    chat_request: ChatRequest,
    request: Request,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        orchestrator_llm = get_llm_nano()
        specialist_llm = get_llm_mini_reasoning()
        # `X-Active-Group-Id` carries the group selected in the UI sidebar so
        # "save it" routes to the group's shared favorites instead of personal.
        # Parse defensively — a bogus/stale header falls back to personal (the
        # tool layer also re-validates membership).
        active_group_id: uuid.UUID | None = None
        raw_group = request.headers.get("x-active-group-id", "").strip()
        if raw_group:
            try:
                active_group_id = uuid.UUID(raw_group)
            except ValueError:
                logger.warning(
                    "agent/chat: ignoring malformed X-Active-Group-Id header"
                )
        workflow = build_home_agent_workflow(
            user=user,
            db=db,
            orchestrator_llm=orchestrator_llm,
            specialist_llm=specialist_llm,
            timeout=120.0,
            active_group_id=active_group_id,
        )
        last_msg = chat_request.messages[-1]
        history = [m.to_llamaindex_message() for m in chat_request.messages[:-1]]

        # Langfuse trace per user message. session_id groups the whole
        # conversation under one trace tree; LlamaIndexInstrumentor handles
        # child spans for agent calls and tool executions automatically.
        session_id = (
            getattr(chat_request, "id", None)
            or request.headers.get("x-chat-session-id")
            or str(uuid.uuid4())
        )
        langfuse = get_langfuse_client()
        span_cm = langfuse.start_as_current_span(name="agent_chat")
        span = span_cm.__enter__()
        try:
            langfuse.update_current_trace(
                user_id=str(user.id),
                session_id=session_id,
                tags=["agent_chat"],
                input={"user_msg": last_msg.content},
                metadata={"history_len": len(history)},
            )
        except Exception:
            logger.exception("langfuse: failed to set trace metadata")

        handler = workflow.run(
            user_msg=last_msg.content,
            chat_history=history,
        )
        gen = _agent_event_generator(handler, request)

        async def traced_gen():
            try:
                async for chunk in gen():
                    yield chunk
            finally:
                try:
                    span_cm.__exit__(None, None, None)
                except Exception:
                    logger.exception("langfuse: failed to close span")

        return StreamingResponse(
            traced_gen(),
            media_type="text/event-stream",
            headers={"X-Experimental-Stream-Data": "true"},
        )
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc))


# ─────────────────────────────────────────────────────────────────────────────
# Universal upload affordance (paperclip in chat)
# ─────────────────────────────────────────────────────────────────────────────

MAX_PHOTO_UPLOAD_BYTES = 15 * 1024 * 1024
_PDF_EXTS = (".pdf",)
_IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp")


def _is_pdf(filename: str, content_type: str) -> bool:
    return "pdf" in content_type or filename.lower().endswith(_PDF_EXTS)


def _is_image(filename: str, content_type: str) -> bool:
    return content_type.startswith("image/") or filename.lower().endswith(_IMAGE_EXTS)


async def _ingest_lease_pdf(
    db: Session, user: Users, file: UploadFile, data: bytes
) -> dict[str, Any]:
    if len(data) > MAX_LEASE_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"PDF too large (max {MAX_LEASE_UPLOAD_BYTES // (1024 * 1024)} MB)",
        )
    try:
        extracted = extract_text_from_pdf(data)
    except Exception as exc:
        logger.exception("agent/upload: PDF parse failed")
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {exc!s}") from exc
    if not extracted:
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted (the PDF may be scanned images only).",
        )

    row = db.execute(
        select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
    ).scalar_one_or_none()
    filename = (file.filename or "lease.pdf")[:512]
    if row:
        row.original_filename = filename
        row.content_type = file.content_type or "application/pdf"
        row.byte_size = len(data)
        row.extracted_text = extracted
    else:
        row = UserLeaseDocuments(
            user_id=user.id,
            original_filename=filename,
            content_type=file.content_type or "application/pdf",
            byte_size=len(data),
            extracted_text=extracted,
        )
        db.add(row)
    db.commit()
    db.refresh(row)

    extracted_addr = await extract_premises_address_from_lease_text(extracted)
    if extracted_addr:
        set_move_from_address_if_empty(db, user.id, extracted_addr)

    summary = (
        f"Lease '{filename}' uploaded "
        f"({len(extracted):,} chars extracted)"
        + (f"; premises: {extracted_addr}" if extracted_addr else "")
    )
    return {
        "kind": "lease",
        "id": str(row.id),
        "summary": summary,
        "filename": filename,
        "premises_address": extracted_addr,
    }


def _ingest_chat_photo(user: Users, file: UploadFile, data: bytes) -> dict[str, Any]:
    if len(data) > MAX_PHOTO_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large (max {MAX_PHOTO_UPLOAD_BYTES // (1024 * 1024)} MB)",
        )
    conn = (Config.get("AZURE_BLOB_CONNECTION_STRING", "") or "").strip()
    container = (Config.get("AZURE_BLOB_MOVEIN_CONTAINER", "") or "").strip()
    if not conn or not container:
        raise HTTPException(
            status_code=500,
            detail="Azure Blob storage is not configured for chat uploads",
        )

    original_name = file.filename or "photo.jpg"
    ext = original_name.rsplit(".", 1)[-1].lower() if "." in original_name else "jpg"
    photo_id = uuid.uuid4()
    blob_name = f"agent-chat/{user.id}/{photo_id}.{ext}"
    content_type = file.content_type or "image/jpeg"

    try:
        service_client = BlobServiceClient.from_connection_string(conn)
        blob = service_client.get_blob_client(container=container, blob=blob_name)
        blob.upload_blob(
            data,
            overwrite=False,
            content_settings=ContentSettings(content_type=content_type),
        )
        photo_url = blob.url
    except Exception as exc:
        logger.exception("agent/upload: blob upload failed")
        raise HTTPException(
            status_code=502, detail=f"Failed to upload photo: {exc!s}"
        ) from exc

    return {
        "kind": "photo",
        "id": str(photo_id),
        "summary": f"Photo '{original_name}' uploaded ({len(data):,} bytes)",
        "filename": original_name[:512],
        "signed_url": photo_url,
        "blob_name": blob_name,
    }


@router.post("/upload")
async def agent_upload(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
):
    """Universal upload endpoint for the chat paperclip.

    Sniffs content-type / extension and routes to the appropriate ingestion path.
    The chat UI stitches the returned `{kind, id, summary, ...}` into the next
    user message annotation so the orchestrator can route to the right specialist.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    data = await file.read()
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    filename = file.filename
    content_type = (file.content_type or "").lower()

    if _is_pdf(filename, content_type):
        return await _ingest_lease_pdf(db, user, file, data)
    if _is_image(filename, content_type):
        return _ingest_chat_photo(user, file, data)

    raise HTTPException(
        status_code=400,
        detail=(
            "Unsupported file type. The chat accepts PDF leases and image uploads "
            "(jpg, png, heic, webp)."
        ),
    )
