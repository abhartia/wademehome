from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from sqlalchemy.orm import Session

from auth.router import get_db
from guarantors.schemas import (
    GuarantorInviteConsentIn,
    GuarantorInviteContextOut,
    GuarantorInviteDeclineIn,
    GuarantorInviteSignIn,
)
from guarantors.service import (
    decline_invite,
    get_invite_context,
    mark_invite_opened,
    submit_consent,
    submit_signature,
    upload_document,
)

router = APIRouter(prefix="/guarantor-invite", tags=["guarantors-public"])


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.get("/{token}", response_model=GuarantorInviteContextOut)
def read_guarantor_invite(token: str, db: Session = Depends(get_db)):
    return get_invite_context(db, token)


@router.post("/{token}/open", status_code=204)
def open_guarantor_invite(token: str, request: Request, db: Session = Depends(get_db)):
    mark_invite_opened(db, token, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent"))
    return None


@router.post("/{token}/consent", status_code=204)
def consent_guarantor_invite(
    token: str, body: GuarantorInviteConsentIn, request: Request, db: Session = Depends(get_db)
):
    submit_consent(
        db, token, body, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent")
    )
    return None


@router.post("/{token}/sign", status_code=204)
def sign_guarantor_invite(token: str, body: GuarantorInviteSignIn, request: Request, db: Session = Depends(get_db)):
    submit_signature(
        db, token, body, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent")
    )
    return None


@router.post("/{token}/documents", status_code=204)
def upload_guarantor_invite_documents(
    token: str,
    request: Request,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    upload_document(
        db,
        token,
        document_type=document_type,
        file=file,
        ip_address=_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    return None


@router.post("/{token}/decline", status_code=204)
def decline_guarantor_invite(
    token: str, body: GuarantorInviteDeclineIn, request: Request, db: Session = Depends(get_db)
):
    decline_invite(
        db, token, body, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent")
    )
    return None
