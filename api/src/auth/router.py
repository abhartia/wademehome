from sqlalchemy import select
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from auth.emailer import send_magic_link_email, send_verification_email
from auth.schemas import (
    AuthResponse,
    LoginRequest,
    MagicLinkRequest,
    MagicLinkVerifyRequest,
    ResendVerificationRequest,
    SignupRequest,
    SignupResponse,
    UserResponse,
    VerifyEmailRequest,
)
from auth.security import (
    build_cookie_settings,
    hash_password,
    hash_token,
    magic_link_ttl,
    random_token,
    session_ttl,
    utc_now,
    verify_email_ttl,
    verify_password,
)
from core.config import Config
from db.models import MagicLinkTokens, UserProfiles, UserSessions, Users
from db.session import get_session_local

router = APIRouter(prefix="/auth", tags=["auth"])
SessionLocal = get_session_local()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _set_auth_cookie(response: Response, session_token: str) -> None:
    cookie_settings = build_cookie_settings()
    response.set_cookie(
        key=str(cookie_settings["key"]),
        value=session_token,
        httponly=bool(cookie_settings["httponly"]),
        secure=bool(cookie_settings["secure"]),
        samesite=str(cookie_settings["samesite"]),
        path=str(cookie_settings["path"]),
        max_age=int(session_ttl().total_seconds()),
    )


def _delete_auth_cookie(response: Response) -> None:
    cookie_settings = build_cookie_settings()
    response.delete_cookie(
        key=str(cookie_settings["key"]),
        httponly=bool(cookie_settings["httponly"]),
        secure=bool(cookie_settings["secure"]),
        samesite=str(cookie_settings["samesite"]),
        path=str(cookie_settings["path"]),
    )


def _issue_session(db: Session, user: Users, response: Response) -> None:
    raw = random_token()
    session = UserSessions(
        user_id=user.id,
        token_hash=hash_token(raw),
        expires_at=utc_now() + session_ttl(),
    )
    db.add(session)
    db.commit()
    _set_auth_cookie(response, raw)


def _user_response(db: Session, user: Users) -> UserResponse:
    profile = db.execute(
        select(UserProfiles).where(UserProfiles.user_id == user.id)
    ).scalar_one_or_none()
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified_at is not None,
        onboarding_completed=bool(profile and profile.onboarding_completed),
    )


def get_current_user(request: Request, db: Session = Depends(get_db)) -> Users:
    cookie_name = str(build_cookie_settings()["key"])
    session_token = request.cookies.get(cookie_name)
    if not session_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    token_hash = hash_token(session_token)
    session = db.execute(
        select(UserSessions).where(UserSessions.token_hash == token_hash)
    ).scalar_one_or_none()
    if not session or session.revoked_at is not None or session.expires_at <= utc_now():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    user = db.execute(select(Users).where(Users.id == session.user_id)).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    if user.email_verified_at is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified",
        )
    return user


@router.post("/signup", response_model=SignupResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    existing = db.execute(select(Users).where(Users.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email is already registered")

    raw = random_token()
    user = Users(
        email=email,
        password_hash=hash_password(payload.password),
        email_verification_token_hash=hash_token(raw),
        email_verification_expires_at=utc_now() + verify_email_ttl(),
    )
    db.add(user)
    db.flush()
    db.add(UserProfiles(user_id=user.id))
    db.commit()

    ui_base = Config.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
    verify_link = f"{ui_base}/auth/verify-email?token={raw}"
    send_verification_email(email=email, verify_link=verify_link)
    return SignupResponse(email=email)


@router.post("/verify-email", response_model=AuthResponse)
def verify_email_route(
    payload: VerifyEmailRequest, response: Response, db: Session = Depends(get_db)
):
    token_hash = hash_token(payload.token)
    user = db.execute(
        select(Users).where(Users.email_verification_token_hash == token_hash)
    ).scalar_one_or_none()
    if (
        not user
        or user.email_verification_expires_at is None
        or user.email_verification_expires_at <= utc_now()
    ):
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    user.email_verified_at = utc_now()
    user.email_verification_token_hash = None
    user.email_verification_expires_at = None
    db.commit()
    db.refresh(user)

    _issue_session(db, user, response)
    return AuthResponse(user=_user_response(db, user))


@router.post("/verify-email/resend")
def resend_verification_email(payload: ResendVerificationRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    user = db.execute(select(Users).where(Users.email == email)).scalar_one_or_none()
    if user and user.password_hash and user.email_verified_at is None:
        raw = random_token()
        user.email_verification_token_hash = hash_token(raw)
        user.email_verification_expires_at = utc_now() + verify_email_ttl()
        db.commit()
        ui_base = Config.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
        verify_link = f"{ui_base}/auth/verify-email?token={raw}"
        send_verification_email(email=email, verify_link=verify_link)
    return {"ok": True}


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    user = db.execute(select(Users).where(Users.email == email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    if user.email_verified_at is None:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before signing in.",
        )

    _issue_session(db, user, response)
    return AuthResponse(user=_user_response(db, user))


@router.post("/magic-link/request")
def request_magic_link(payload: MagicLinkRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    user = db.execute(select(Users).where(Users.email == email)).scalar_one_or_none()

    raw_token = random_token()
    db.add(
        MagicLinkTokens(
            user_id=user.id if user else None,
            email=email,
            token_hash=hash_token(raw_token),
            expires_at=utc_now() + magic_link_ttl(),
        )
    )
    db.commit()

    ui_base = Config.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
    magic_link = f"{ui_base}/auth/callback?token={raw_token}"
    send_magic_link_email(email=email, magic_link=magic_link)
    return {"ok": True}


@router.post("/magic-link/verify", response_model=AuthResponse)
def verify_magic_link(
    payload: MagicLinkVerifyRequest, response: Response, db: Session = Depends(get_db)
):
    token_hash = hash_token(payload.token)
    token_row = db.execute(
        select(MagicLinkTokens).where(MagicLinkTokens.token_hash == token_hash)
    ).scalar_one_or_none()
    if not token_row or token_row.used_at is not None or token_row.expires_at <= utc_now():
        raise HTTPException(status_code=400, detail="Invalid or expired magic link")

    user = None
    if token_row.user_id:
        user = db.execute(select(Users).where(Users.id == token_row.user_id)).scalar_one_or_none()
    if not user:
        user = db.execute(select(Users).where(Users.email == token_row.email)).scalar_one_or_none()
    if not user:
        user = Users(email=token_row.email, password_hash=None)
        db.add(user)
        db.flush()
        db.add(UserProfiles(user_id=user.id))

    if user.email_verified_at is None:
        user.email_verified_at = utc_now()

    token_row.used_at = utc_now()
    db.commit()
    db.refresh(user)

    _issue_session(db, user, response)
    return AuthResponse(user=_user_response(db, user))


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    cookie_name = str(build_cookie_settings()["key"])
    session_token = request.cookies.get(cookie_name)
    if session_token:
        token_hash = hash_token(session_token)
        session = db.execute(
            select(UserSessions).where(UserSessions.token_hash == token_hash)
        ).scalar_one_or_none()
        if session and session.revoked_at is None:
            session.revoked_at = utc_now()
            db.commit()
    _delete_auth_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=AuthResponse)
def me(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthResponse(user=_user_response(db, user))
