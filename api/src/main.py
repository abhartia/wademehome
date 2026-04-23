import asyncio
import json
import os
import time
import traceback
from contextlib import asynccontextmanager

from core.llama_cloud_compat import apply_llama_cloud_server_compat

# Must run before any `llama_index.server` import (package __init__ pulls routers).
apply_llama_cloud_server_compat()

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from langfuse import Langfuse
from llama_index.core.workflow import StopEvent
from llama_index.core.workflow.handler import WorkflowHandler
from llama_index.server.models.chat import ChatRequest
from llama_index.server.models.ui import UIEvent
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from slowapi.errors import RateLimitExceeded

from admin.router import router as admin_router
from agent.router import router as agent_router
from applicants.router import router as applicants_router
from auth.router import router as auth_router
from buildings.router import router as buildings_router
from core.asgi_auth import ASGIAuthMiddleware
from core.body_size import MaxBodySizeMiddleware
from core.cors_middleware import CORSMiddleware
from core.errors import install_error_handlers
from core.llm_factory import get_llm
from core.logger import get_logger
from core.observability import init_all as init_observability
from core.rate_limit import limiter, rate_limit_exceeded_handler
from core.request_context import RequestContextMiddleware
from core.security_headers import SecurityHeadersMiddleware
from core.sse import stop_event_result_to_sse_chunk
from flags.router import router as flags_router
from groups.router import router as groups_router
from guarantors.public_router import router as guarantors_public_router
from guarantors.router import router as guarantors_router
from landlord.router import router as landlord_router
from landlord_entities.router import router as landlord_entities_router
from listings.router import router as listings_router
from movein.photo_router import router as movein_photo_router
from movein.router import router as movein_router
from portal.router import router as portal_router
from properties.router import router as properties_router
from property_manager.router import internal_router as pm_internal_router
from property_manager.router import router as pm_router
from property_manager.scheduler import shutdown_scheduler, start_scheduler
from reviews.router import router as reviews_router
from reviews_admin.router import router as reviews_admin_router
from roommates.router import router as roommates_router
from tours.router import router as tours_router
from user_listings.router import router as user_listings_router
from workflow.events import ResponseStreamEvent
from workflow.workflow import ListingFetcherWorkflow

logger = get_logger(__name__)

# Wire Sentry + OpenTelemetry (no-op unless env vars set — see core/observability.py).
init_observability()

langfuse = Langfuse()

# Verify connection (optional – app runs even if Langfuse is misconfigured)
try:
    if langfuse.auth_check():
        print("Langfuse client is authenticated and ready!")
    else:
        print("Langfuse: authentication failed. Check LANGFUSE_* in .env or leave unset to disable.")
except Exception as e:
    print(f"Langfuse: skipping (check credentials/host if you use it): {e}")

# Initialize LlamaIndex instrumentation
LlamaIndexInstrumentor().instrument()


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    shutdown_scheduler()


app = FastAPI(title="Multi-Agent API", description="API with listing and markets agents", lifespan=lifespan)

# Rate limiter: module-level singleton; routers use @limiter.limit(...).
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Uniform error envelope — HTTPException / validation / unhandled exceptions.
install_error_handlers(app)

app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(properties_router)
app.include_router(groups_router)
app.include_router(applicants_router)
app.include_router(portal_router)
app.include_router(tours_router)
app.include_router(user_listings_router)
app.include_router(guarantors_router)
app.include_router(guarantors_public_router)
app.include_router(movein_router)
app.include_router(movein_photo_router)
app.include_router(roommates_router)
app.include_router(landlord_router)
app.include_router(buildings_router)
app.include_router(reviews_router)
app.include_router(landlord_entities_router)
app.include_router(reviews_admin_router)
app.include_router(admin_router)
app.include_router(pm_router)
app.include_router(pm_internal_router)
app.include_router(agent_router)
app.include_router(flags_router)

# /v1 mirror — identical surface, versioned path. Legacy unprefixed routes stay
# mounted behind LEGACY_API_ROUTES (default on) for one release while clients migrate.
_ALL_ROUTERS = (
    auth_router,
    listings_router,
    properties_router,
    groups_router,
    applicants_router,
    portal_router,
    tours_router,
    user_listings_router,
    guarantors_router,
    guarantors_public_router,
    movein_router,
    movein_photo_router,
    roommates_router,
    landlord_router,
    buildings_router,
    reviews_router,
    landlord_entities_router,
    reviews_admin_router,
    admin_router,
    pm_router,
    pm_internal_router,
    agent_router,
    flags_router,
)
from fastapi import APIRouter as _APIRouter

_v1 = _APIRouter(prefix="/v1")
for _r in _ALL_ROUTERS:
    _v1.include_router(_r)
app.include_router(_v1)


_TIMED_PATH_PREFIXES: tuple[str, ...] = (
    "/listings",
    "/properties",
)


@app.middleware("http")
async def log_timed_routes(request: Request, call_next):
    path = request.url.path
    should_time = any(path.startswith(prefix) for prefix in _TIMED_PATH_PREFIXES)
    if not should_time:
        return await call_next(request)

    t0 = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        elapsed_ms = int((time.perf_counter() - t0) * 1000)
        logger.exception(
            "route_timing_failed",
            method=request.method,
            path=path,
            duration_ms=elapsed_ms,
        )
        raise

    elapsed_ms = int((time.perf_counter() - t0) * 1000)
    logger.info(
        "route_timing",
        method=request.method,
        path=path,
        status=response.status_code,
        duration_ms=elapsed_ms,
    )
    return response


def get_event_generator(handler: WorkflowHandler, request: Request):
    async def event_generator():
        stream_t0 = time.perf_counter()
        first_chunk_logged = False
        try:
            async for event in handler.stream_events():
                if await request.is_disconnected():
                    logger.info("listings/chat SSE: client disconnected; stopping event stream")
                    break

                if isinstance(event, UIEvent):
                    # Handle UIEvent
                    if not first_chunk_logged:
                        first_chunk_logged = True
                        logger.info(
                            "listings/chat stream ttft_ms=%s",
                            int((time.perf_counter() - stream_t0) * 1000),
                        )
                    yield f"8:{json.dumps([event.to_response()])}\n\n"

                if isinstance(event, ResponseStreamEvent):
                    async for item in event.response_stream:
                        if not first_chunk_logged:
                            first_chunk_logged = True
                            logger.info(
                                "listings/chat stream ttft_ms=%s",
                                int((time.perf_counter() - stream_t0) * 1000),
                            )
                        yield f"0:{json.dumps(item.delta)}\n\n"
                elif isinstance(event, StopEvent):
                    # Handle StopEvent
                    result = getattr(event, "result", None)
                    if not first_chunk_logged:
                        first_chunk_logged = True
                        logger.info(
                            "listings/chat stream ttft_ms=%s",
                            int((time.perf_counter() - stream_t0) * 1000),
                        )
                    if result is None:
                        # Keep protocol stable: always yield a string payload.
                        yield stop_event_result_to_sse_chunk(result)
                    elif hasattr(result, "__aiter__"):
                        async for item in result:
                            delta = getattr(item, "delta", item)
                            yield f"0:{json.dumps(str(delta))}\n\n"
                    else:
                        # Best-effort serialization. Some workflow paths can return non-string
                        # results (e.g. booleans/objects), and we don't want to kill the stream.
                        yield stop_event_result_to_sse_chunk(result)
        except asyncio.CancelledError:
            logger.info("listings/chat SSE: event generator cancelled")
            raise
        except Exception:
            logger.exception("listings/chat SSE: error while streaming workflow events")
            raise
        finally:
            logger.debug("listings/chat SSE: event stream ended")

    return event_generator


# Listing endpoints
@app.post("/listings/chat")
@limiter.limit(os.getenv("RATE_LIMIT_LISTINGS_CHAT", "10/minute"))
async def listing_chat(chat_request: ChatRequest, request: Request):
    try:
        llm = get_llm()

        workflow = ListingFetcherWorkflow(
            chat_request=chat_request,
            llm=llm,
            verbose=True,
            # Default workflow timeout is 45s; slow structured extraction can
            # exceed that and abort the whole request.
            timeout=120.0,
        )

        handler = workflow.run(
            user_msg=chat_request.messages[-1].content,
            chat_history=[msg.to_llamaindex_message() for msg in chat_request.messages[:-1]],
        )

        event_generator = get_event_generator(handler, request)

        return StreamingResponse(
            event_generator(), media_type="text/event-stream", headers={"X-Experimental-Stream-Data": "true"}
        )
    except Exception as e:
        # Log the exception details for debugging
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) from e


# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Multi-Agent API is running", "agents": ["listing", "markets"]}


@app.get("/health")
async def health():
    import os as _os

    return {
        "status": "healthy",
        "version": _os.getenv("APP_VERSION", "0.0.0"),
        "git_sha": _os.getenv("GIT_SHA", "unknown"),
        "env": _os.getenv("APP_ENV", "dev"),
    }


# Preserve FastAPI instance for OpenAPI export / tooling (ASGI stack has no .openapi()).
fastapi_app = app

# ASGI stack (outermost last). Each wrapper receives the request before the previous.
# Order (outermost -> innermost):
#   RequestContext -> SecurityHeaders -> CORS -> MaxBodySize -> Auth -> FastAPI.
# RequestContext is outermost so request_id is available to every layer.
app = ASGIAuthMiddleware(app)
app = MaxBodySizeMiddleware(app)
app = CORSMiddleware(app)
app = SecurityHeadersMiddleware(app)
app = RequestContextMiddleware(app)

if __name__ == "__main__":
    # nosec B104 # container bind; perimeter controlled by Azure App Service
    uvicorn.run(app, host="0.0.0.0", port=8000)  # nosec B104
