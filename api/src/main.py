import json
import traceback

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
from llama_index.server import UIEvent
from llama_index.server.models.chat import ChatRequest

from core.config import Config
from workflow.workflow import ListingFetcherWorkflow
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

from core.asgi_auth import ASGIAuthMiddleware
from core.cors_middleware import CORSMiddleware
from workflow.events import ResponseStreamEvent

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

def get_event_generator(
    handler: WorkflowHandler,
    request: Request
):
    async def event_generator():
        async for event in handler.stream_events():
            if await request.is_disconnected():
                break

            if isinstance(event, UIEvent):
                # Handle UIEvent
                yield f"8:{json.dumps([event.to_response()])}\n\n"

            if isinstance(event, ResponseStreamEvent):
                async for item in event.response_stream:
                    yield f"0:{json.dumps(item.delta)}\n\n"
            elif isinstance(event, StopEvent):
                # Handle StopEvent
                if hasattr(event.result, '__aiter__'):
                    async for item in event.result:
                        yield f"0:{json.dumps(item.delta)}\n\n"
                elif isinstance(event.result, str):
                    yield f"0:{json.dumps(event.result)}\n\n"
                else:
                    raise ValueError("Unsupported result type in StopEvent")

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
        )

        handler = workflow.run(
            user_msg=chat_request.messages[-1].content,
            chat_history=[
                msg.to_llamaindex_message() for msg in chat_request.messages[:-1]
            ]
        )

        await handler

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

# Wrap the app at the ASGI level - order matters: CORS first, then Auth
app = ASGIAuthMiddleware(app)
app = CORSMiddleware(app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)