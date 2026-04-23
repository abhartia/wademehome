import base64
import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta

from core.config import Config
from core.logger import get_logger

logger = get_logger(__name__)


def utc_now() -> datetime:
    return datetime.now(UTC)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
    return f"pbkdf2_sha256${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(derived).decode()}"


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    try:
        algorithm, salt_b64, digest_b64 = password_hash.split("$", 2)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_b64.encode())
        expected = base64.urlsafe_b64decode(digest_b64.encode())
    except Exception:
        return False

    actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
    return hmac.compare_digest(actual, expected)


def random_token() -> str:
    return secrets.token_urlsafe(48)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def build_cookie_settings() -> dict[str, object]:
    secure = (Config.get("AUTH_COOKIE_SECURE", "false") or "false").lower() == "true"
    raw = (Config.get("AUTH_COOKIE_SAMESITE", "lax") or "lax").strip().lower()
    same_site = raw if raw in ("lax", "strict", "none") else "lax"
    domain = (Config.get("AUTH_COOKIE_DOMAIN", "") or "").strip()
    # Browser rule: SameSite=None requires Secure. Cross-origin UI (e.g. wademehome.com → api.azurewebsites.net)
    # needs none + secure or credentialed fetches will not send the session cookie.
    if same_site == "none" and not secure:
        secure = True
        logger.warning("AUTH_COOKIE_SAMESITE=none requires Secure cookies; treating session cookie as secure=True")
    return {
        "key": Config.get("AUTH_COOKIE_NAME", "wmh_session") or "wmh_session",
        "httponly": True,
        "secure": secure,
        "samesite": same_site,
        "domain": domain,
        "path": "/",
    }


def session_ttl() -> timedelta:
    days = int(Config.get("AUTH_SESSION_DAYS", "14") or "14")
    return timedelta(days=days)


def magic_link_ttl() -> timedelta:
    minutes = int(Config.get("AUTH_MAGIC_LINK_MINUTES", "15") or "15")
    return timedelta(minutes=minutes)


def verify_email_ttl() -> timedelta:
    hours = int(Config.get("AUTH_VERIFY_EMAIL_HOURS", "48") or "48")
    return timedelta(hours=hours)
