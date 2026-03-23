from __future__ import annotations

import uuid
from datetime import datetime, timezone

from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import HTTPException

from core.config import Config


def upload_guarantor_document_to_blob(
    *,
    request_id: uuid.UUID,
    filename: str,
    content_type: str,
    data: bytes,
) -> str:
    connection_string = (Config.get("AZURE_BLOB_CONNECTION_STRING", "") or "").strip()
    container_name = (Config.get("AZURE_BLOB_GUARANTOR_CONTAINER", "") or "").strip()
    if not connection_string or not container_name:
        raise HTTPException(
            status_code=500,
            detail="Azure Blob storage is not configured for guarantor documents",
        )

    safe_name = (filename or "document").strip().replace(" ", "_")
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    blob_name = f"guarantor/{request_id}/{timestamp}-{uuid.uuid4().hex}-{safe_name}"

    try:
        client = BlobServiceClient.from_connection_string(connection_string)
        blob_client = client.get_blob_client(container=container_name, blob=blob_name)
        blob_client.upload_blob(
            data,
            overwrite=False,
            content_settings=ContentSettings(content_type=content_type),
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to upload document: {exc!s}") from exc

    return blob_name
