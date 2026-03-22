import asyncio
import json
import traceback

from core.llama_cloud_compat import apply_llama_cloud_server_compat

# Must run before any `llama_index.server` import (package __init__ pulls routers).
apply_llama_cloud_server_compat()

from langfuse import Langfuse
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from llama_index.core.workflow import StopEvent
from llama_index.core.workflow.handler import WorkflowHandler
from llama_index.llms.openai import OpenAI
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.core.llms import LLM
from llama_index.server.models.chat import ChatRequest
from llama_index.server.models.ui import UIEvent

from core.config import Config
from workflow.workflow import ListingFetcherWorkflow
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

from core.asgi_auth import ASGIAuthMiddleware
from core.cors_middleware import CORSMiddleware
from workflow.events import ResponseStreamEvent

from core.logger import get_logger
from core.sse import stop_event_result_to_sse_chunk
from auth.router import router as auth_router
from listings.router import router as listings_router
from properties.router import router as properties_router
from portal.router import router as portal_router

logger = get_logger(__name__)
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

app = FastAPI(title="Multi-Agent API", description="API with listing and markets agents")
app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(properties_router)
app.include_router(portal_router)

def get_event_generator(
    handler: WorkflowHandler,
    request: Request
):
    async def event_generator():
        try:
            async for event in handler.stream_events():
                if await request.is_disconnected():
                    logger.info(
                        "listings/chat SSE: client disconnected; stopping event stream"
                    )
                    break

                if isinstance(event, UIEvent):
                    # Handle UIEvent
                    yield f"8:{json.dumps([event.to_response()])}\n\n"

                if isinstance(event, ResponseStreamEvent):
                    async for item in event.response_stream:
                        yield f"0:{json.dumps(item.delta)}\n\n"
                elif isinstance(event, StopEvent):
                    # Handle StopEvent
                    result = getattr(event, "result", None)
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


def get_llm() -> LLM:
    """Return Azure OpenAI LLM if configured, otherwise OpenAI."""
    endpoint = Config.get("AZURE_OPENAI_ENDPOINT", "")
    if endpoint and Config.get("AZURE_OPENAI_API_KEY") and Config.get("AZURE_OPENAI_DEPLOYMENT"):
        return AzureOpenAI(
            azure_endpoint=endpoint.strip().rstrip("/"),
            api_key=Config.get("AZURE_OPENAI_API_KEY"),
            engine=Config.get("AZURE_OPENAI_DEPLOYMENT"),
            model=Config.get("AZURE_OPENAI_MODEL", "gpt-4o-mini"),
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
        )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model=Config.get("OPENAI_MODEL", "gpt-4.1"),
    )

# Listing endpoints
@app.post("/listings/chat")
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
            chat_history=[
                msg.to_llamaindex_message() for msg in chat_request.messages[:-1]
            ]
        )

        event_generator = get_event_generator(handler, request)

        return StreamingResponse(
            event_generator(), media_type="text/event-stream",
            headers={"X-Experimental-Stream-Data": "true"}
        )
    except Exception as e:
        # Log the exception details for debugging
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Multi-Agent API is running", "agents": ["listing", "markets"]}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Preserve FastAPI instance for OpenAPI export / tooling (ASGI stack has no .openapi()).
fastapi_app = app

# Wrap the app at the ASGI level - order matters: CORS first, then Auth
app = ASGIAuthMiddleware(app)
app = CORSMiddleware(app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)