from __future__ import annotations

import json
import uuid
from io import BytesIO

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from llama_index.core.base.llms.types import ChatMessage
from llama_index.server.models.chat import ChatRequest
from pypdf import PdfReader
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from core.llm_factory import get_llm
from core.logger import get_logger
from db.models import UserLeaseDocuments, UserProfiles, Users
from movein.lease_premises_extract import extract_premises_address_from_lease_text
from movein.service import set_move_from_address_if_empty
from portal.schemas import LeaseDocumentOut

logger = get_logger(__name__)

router = APIRouter(prefix="/lease", tags=["portal-lease"])

MAX_LEASE_UPLOAD_BYTES = 15 * 1024 * 1024
LEASE_TEXT_MAX_CHARS = 120_000

LEASE_SYSTEM_PREFIX = """You are a helpful assistant. The user uploaded their residential lease (plain text extracted from a PDF). Answer only using that lease text. If something is not stated in the lease, say you cannot find it in the document. Quote or paraphrase specific clauses when helpful. This is not legal advice.

--- BEGIN LEASE TEXT ---
"""

LEASE_SYSTEM_SUFFIX = """
--- END LEASE TEXT ---
"""


def _profile_has_current_lease(db: Session, user_id: uuid.UUID) -> bool:
    row = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    return bool(row and row.has_current_lease)


def _require_current_lease(db: Session, user: Users) -> None:
    if not _profile_has_current_lease(db, user.id):
        raise HTTPException(
            status_code=403,
            detail="Lease assistant is only available when your profile indicates you currently have a lease.",
        )


def extract_text_from_pdf(data: bytes) -> str:
    reader = PdfReader(BytesIO(data))
    parts: list[str] = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            parts.append(t)
    return "\n\n".join(parts).strip()


@router.get("", response_model=LeaseDocumentOut)
def read_lease_document(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_current_lease(db, user)
    row = db.execute(
        select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
    ).scalar_one_or_none()
    if not row:
        return LeaseDocumentOut(has_document=False)
    return LeaseDocumentOut(
        has_document=True,
        original_filename=row.original_filename,
        updated_at=row.updated_at,
    )


@router.post("/upload", response_model=LeaseDocumentOut)
async def upload_lease_document(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
):
    _require_current_lease(db, user)
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    content_type = (file.content_type or "").lower()
    if "pdf" not in content_type and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF uploads are supported")

    data = await file.read()
    if len(data) > MAX_LEASE_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large (max {MAX_LEASE_UPLOAD_BYTES // (1024 * 1024)} MB)",
        )
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        extracted = extract_text_from_pdf(data)
    except Exception as e:
        logger.exception("lease PDF parse failed")
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {e!s}") from e

    if not extracted:
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from this PDF (it may be scanned images only).",
        )

    row = db.execute(
        select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
    ).scalar_one_or_none()
    if row:
        row.original_filename = file.filename[:512]
        row.content_type = file.content_type or "application/pdf"
        row.byte_size = len(data)
        row.extracted_text = extracted
    else:
        row = UserLeaseDocuments(
            user_id=user.id,
            original_filename=file.filename[:512],
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

    return LeaseDocumentOut(
        has_document=True,
        original_filename=row.original_filename,
        updated_at=row.updated_at,
    )


@router.delete("", response_model=LeaseDocumentOut)
def delete_lease_document(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_current_lease(db, user)
    db.execute(delete(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id))
    db.commit()
    return LeaseDocumentOut(has_document=False)


@router.post("/chat")
async def lease_chat(
    chat_request: ChatRequest,
    request: Request,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_current_lease(db, user)
    row = db.execute(
        select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
    ).scalar_one_or_none()
    if not row or not (row.extracted_text or "").strip():
        raise HTTPException(
            status_code=400,
            detail="Upload your lease PDF before asking questions.",
        )

    lease_body = row.extracted_text
    if len(lease_body) > LEASE_TEXT_MAX_CHARS:
        lease_body = lease_body[:LEASE_TEXT_MAX_CHARS]

    system_content = LEASE_SYSTEM_PREFIX + lease_body + LEASE_SYSTEM_SUFFIX

    prior = [
        msg.to_llamaindex_message()
        for msg in chat_request.messages[:-1]
        if getattr(msg, "role", None) in ("user", "assistant")
    ]
    history: list[ChatMessage] = [
        ChatMessage(role="system", content=system_content),
        *prior,
        chat_request.messages[-1].to_llamaindex_message(),
    ]

    llm = get_llm()

    async def event_generator():
        try:
            stream = await llm.astream_chat(history)
            async for chunk in stream:
                if await request.is_disconnected():
                    break
                delta = getattr(chunk, "delta", None)
                if delta:
                    yield f"0:{json.dumps(delta)}\n\n"
        except Exception:
            logger.exception("lease/chat stream error")
            raise

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"X-Experimental-Stream-Data": "true"},
    )
