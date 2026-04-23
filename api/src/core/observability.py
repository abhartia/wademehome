"""Optional observability integrations — all no-ops unless env-configured.

Features are toggled by environment variables so the project runs fully offline
with zero third-party accounts:

- ``SENTRY_DSN``                      -> enables Sentry error + tracing.
- ``SENTRY_TRACES_SAMPLE_RATE``       -> float, default 0.1.
- ``OTEL_EXPORTER_OTLP_ENDPOINT``     -> enables OTLP export to a collector.
- ``OTEL_CONSOLE_EXPORTER``           -> ``1`` to dump spans to stdout locally.
- ``OTEL_SERVICE_NAME``               -> defaults to ``wademehome-api``.

All init functions are idempotent and safe to call even when the optional
packages aren't installed (the ``observability`` extra is optional).
"""

from __future__ import annotations

import logging
import os
from typing import Any

log = logging.getLogger(__name__)


def init_sentry() -> bool:
    """Wire Sentry if ``SENTRY_DSN`` is set. Returns True if initialized."""
    dsn = os.getenv("SENTRY_DSN", "").strip()
    if not dsn:
        return False

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.starlette import StarletteIntegration
    except ImportError:
        log.warning("SENTRY_DSN set but sentry-sdk is not installed; pip install '.[observability]'")
        return False

    def _before_send(event: dict[str, Any], _hint: dict[str, Any]) -> dict[str, Any]:
        # Attach request context tags when available.
        try:
            from core.request_context import get_request_id, get_user_id

            rid = get_request_id()
            uid = get_user_id()
            if rid:
                event.setdefault("tags", {})["request_id"] = rid
            if uid:
                event.setdefault("user", {})["id"] = uid
        except Exception:
            pass
        return event

    sentry_sdk.init(
        dsn=dsn,
        traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
        profiles_sample_rate=float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.0")),
        environment=os.getenv("APP_ENV", "dev"),
        release=os.getenv("GIT_SHA") or os.getenv("APP_VERSION"),
        integrations=[StarletteIntegration(), FastApiIntegration()],
        before_send=_before_send,
        send_default_pii=False,
    )
    log.info("sentry initialized env=%s", os.getenv("APP_ENV", "dev"))
    return True


def init_otel(app: Any = None) -> bool:
    """Wire OpenTelemetry tracing. Returns True if any exporter was installed.

    Supports two exporters, chosen independently:

    - OTLP HTTP, when ``OTEL_EXPORTER_OTLP_ENDPOINT`` is set (e.g. Grafana Cloud free tier).
    - Console, when ``OTEL_CONSOLE_EXPORTER=1`` (great for local dev).
    """
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "").strip()
    console = os.getenv("OTEL_CONSOLE_EXPORTER", "").strip() in {"1", "true", "yes"}
    if not otlp_endpoint and not console:
        return False

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
    except ImportError:
        log.warning("OTEL env set but opentelemetry-sdk is not installed; pip install '.[observability]'")
        return False

    resource = Resource.create(
        {
            "service.name": os.getenv("OTEL_SERVICE_NAME", "wademehome-api"),
            "service.version": os.getenv("APP_VERSION", "0.0.0"),
            "deployment.environment": os.getenv("APP_ENV", "dev"),
        }
    )
    provider = TracerProvider(resource=resource)

    if otlp_endpoint:
        try:
            from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

            provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
            log.info("otel: OTLP exporter enabled -> %s", otlp_endpoint)
        except ImportError:
            log.warning("OTLP endpoint set but OTLP exporter package missing")

    if console:
        provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
        log.info("otel: console exporter enabled")

    trace.set_tracer_provider(provider)

    # Instrument the web framework + DB client if the hooks are available.
    if app is not None:
        try:
            from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

            FastAPIInstrumentor.instrument_app(app)
        except Exception as e:
            log.debug("fastapi instrumentation skipped: %s", e)

    try:
        from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

        SQLAlchemyInstrumentor().instrument()
    except Exception as e:
        log.debug("sqlalchemy instrumentation skipped: %s", e)

    return True


def init_all(app: Any = None) -> None:
    """Entrypoint called from app bootstrap — never raises."""
    try:
        init_sentry()
    except Exception as e:
        log.warning("sentry init failed: %s", e)
    try:
        init_otel(app)
    except Exception as e:
        log.warning("otel init failed: %s", e)
