import threading

import resend
from resend.exceptions import ResendError

from core.config import Config
from core.logger import get_logger

logger = get_logger(__name__)

# resend.api_key is global; guard concurrent sends (sync FastAPI runs handlers in a thread pool).
_resend_lock = threading.Lock()


def _resend_credentials() -> tuple[str, str]:
    raw_key = Config.get("RESEND_API_KEY", "") or ""
    raw_from = Config.get("RESEND_FROM_EMAIL", "") or ""
    return raw_key.strip(), raw_from.strip()


def _post_resend(*, to: list[str], subject: str, html: str) -> None:
    api_key, from_email = _resend_credentials()
    if not api_key or not from_email:
        raise ValueError("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.")

    params: resend.Emails.SendParams = {
        "from": from_email,
        "to": to,
        "subject": subject,
        "html": html,
    }
    try:
        with _resend_lock:
            resend.api_key = api_key
            resend.Emails.send(params)
    except ResendError as e:
        logger.error(
            "Resend API error code=%s type=%s message=%s",
            e.code,
            e.error_type,
            e.message,
        )
        raise ValueError(
            "Resend rejected the send (HTTP %s). Check API key, verified domain, and sender. %s"
            % (e.code, e.message)
        ) from e


def send_magic_link_email(email: str, magic_link: str) -> None:
    _post_resend(
        to=[email],
        subject="Your Wademehome login link",
        html=(
            "<p>Use this secure link to sign in:</p>"
            f'<p><a href="{magic_link}">{magic_link}</a></p>'
            "<p>This link expires shortly and can only be used once.</p>"
        ),
    )


def send_verification_email(email: str, verify_link: str) -> None:
    _post_resend(
        to=[email],
        subject="Verify your Wademehome email",
        html=(
            "<p>Thanks for signing up. Confirm your email to activate your account:</p>"
            f'<p><a href="{verify_link}">{verify_link}</a></p>'
            "<p>If you did not create an account, you can ignore this message.</p>"
        ),
    )


def send_guarantor_request_email(
    *,
    guarantor_email: str,
    guarantor_name: str,
    renter_email: str,
    property_name: str,
    property_address: str,
    monthly_rent: str,
    lease_start: str,
    lease_term: str,
    invite_url: str,
) -> None:
    greeting = guarantor_name.strip() or "there"
    lease_start_line = lease_start.strip() or "Not provided"
    lease_term_line = lease_term.strip() or "Not provided"
    _post_resend(
        to=[guarantor_email],
        subject="Guarantor request from Wademehome",
        html=(
            f"<p>Hi {greeting},</p>"
            "<p>You have been requested as a guarantor for a rental application.</p>"
            f"<p><strong>Renter:</strong> {renter_email}<br/>"
            f"<strong>Property:</strong> {property_name}<br/>"
            f"<strong>Address:</strong> {property_address}<br/>"
            f"<strong>Monthly rent:</strong> {monthly_rent}<br/>"
            f"<strong>Lease start:</strong> {lease_start_line}<br/>"
            f"<strong>Lease term:</strong> {lease_term_line}</p>"
            f'<p>Please review and sign the guarantor request here: <a href="{invite_url}">{invite_url}</a></p>'
        ),
    )


def send_tour_request_email(
    *,
    to_email: str,
    renter_email: str,
    property_name: str,
    property_address: str,
    requested_date: str | None,
    requested_time: str | None,
    request_message: str | None,
) -> None:
    date_line = (requested_date or "").strip() or "Not specified"
    time_line = (requested_time or "").strip() or "Not specified"
    message_line = (request_message or "").strip() or "No additional message provided."
    _post_resend(
        to=[to_email],
        subject="New tour request from Wademehome",
        html=(
            "<p>A renter submitted a tour request.</p>"
            f"<p><strong>Renter email:</strong> {renter_email}<br/>"
            f"<strong>Property:</strong> {property_name}<br/>"
            f"<strong>Address:</strong> {property_address}<br/>"
            f"<strong>Preferred date:</strong> {date_line}<br/>"
            f"<strong>Preferred time:</strong> {time_line}</p>"
            f"<p><strong>Message:</strong><br/>{message_line}</p>"
        ),
    )


def send_group_invite_email(
    *,
    to_email: str,
    inviter_email: str,
    group_name: str,
    accept_url: str,
) -> None:
    name = group_name.strip() or "their apartment search"
    _post_resend(
        to=[to_email],
        subject=f"{inviter_email} invited you to their Wademehome apartment search",
        html=(
            f"<p>{inviter_email} is using Wademehome to search for an apartment and "
            f"invited you to collaborate on <strong>{name}</strong>.</p>"
            "<p>Click below to join. Any favorites, notes, reactions, and tours saved "
            "inside this group are shared between members.</p>"
            f'<p><a href="{accept_url}">Join {name}</a></p>'
            f'<p>Or open this link: <a href="{accept_url}">{accept_url}</a></p>'
            "<p>This invite expires in 14 days.</p>"
        ),
    )


def send_group_member_joined_email(
    *,
    to_email: str,
    joiner_email: str,
    group_name: str,
    group_url: str,
) -> None:
    name = group_name.strip() or "your apartment search"
    _post_resend(
        to=[to_email],
        subject=f"{joiner_email} joined {name} on Wademehome",
        html=(
            f"<p><strong>{joiner_email}</strong> accepted your invite and joined "
            f"<strong>{name}</strong>.</p>"
            "<p>Favorites, notes, reactions, and tours saved inside this group are now "
            "shared between you.</p>"
            f'<p><a href="{group_url}">Open {name}</a></p>'
        ),
    )


def send_property_manager_weekly_report_email(
    *,
    to_email: str,
    subject: str,
    html_body: str,
) -> None:
    _post_resend(to=[to_email], subject=subject, html=html_body)
