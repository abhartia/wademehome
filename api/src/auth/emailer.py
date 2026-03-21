import json
from urllib import request

from core.config import Config


def send_magic_link_email(email: str, magic_link: str) -> None:
    api_key = Config.get("RESEND_API_KEY", "")
    from_email = Config.get("RESEND_FROM_EMAIL", "")
    if not api_key or not from_email:
        raise ValueError("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.")

    payload = {
        "from": from_email,
        "to": [email],
        "subject": "Your Wademehome login link",
        "html": (
            "<p>Use this secure link to sign in:</p>"
            f'<p><a href="{magic_link}">{magic_link}</a></p>'
            "<p>This link expires shortly and can only be used once.</p>"
        ),
    }
    req = request.Request(
        url="https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    with request.urlopen(req) as response:
        if response.status >= 300:
            raise ValueError("Failed to send email via Resend")
