from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.services.records import (
    create_record_bundle,
    issue_attachment_upload_ticket,
    list_records,
)
from app.services.supabase import SupabaseRequestError, supabase_select


router = APIRouter(prefix="/api/records", tags=["records"])


class AttachmentCreateRequest(BaseModel):
    kind: str = Field(pattern="^(link|file|image)$")
    name: str = Field(min_length=1, max_length=255)
    storage_path: str | None = Field(default=None, max_length=1024)
    original_url: str | None = Field(default=None, max_length=2048)
    mime_type: str | None = Field(default=None, max_length=255)
    size_bytes: int | None = Field(default=None, ge=0)


class AttachmentUploadTicketRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str | None = Field(default=None, max_length=255)


class AttachmentUploadTicketResponse(BaseModel):
    bucket: str
    object_path: str
    token: str
    signed_upload_url: str
    content_type: str | None = None


class RecordCreateRequest(BaseModel):
    raw_content: str = Field(min_length=1)
    content_type: str = Field(pattern="^(text|link|image|document)$")
    intent: str = Field(pattern="^(later|favorite)$")
    user_understanding: str | None = None
    source_url: str | None = Field(default=None, max_length=2048)
    source_title: str | None = Field(default=None, max_length=255)
    attachments: list[AttachmentCreateRequest] = Field(default_factory=list)


class AttachmentResponse(BaseModel):
    id: UUID
    record_id: UUID
    kind: str
    name: str
    storage_path: str | None = None
    original_url: str | None = None
    mime_type: str | None = None
    size_bytes: int | None = None
    created_at: datetime


class RecordResponse(BaseModel):
    id: UUID
    raw_content: str
    content_type: str
    intent: str
    user_status: str
    parse_status: str
    internalization_status: str
    title: str | None = None
    summary: str | None = None
    tags: list[str]
    user_understanding: str | None = None
    source_url: str | None = None
    source_domain: str | None = None
    source_title: str | None = None
    created_at: datetime
    updated_at: datetime
    attachments: list[AttachmentResponse] = Field(default_factory=list)


class ProcessingLogResponse(BaseModel):
    id: UUID
    record_id: UUID | None = None
    job_id: UUID | None = None
    stage: str
    level: str
    message: str
    details: dict
    created_at: datetime


@router.get("", response_model=list[RecordResponse])
async def get_records() -> list[RecordResponse]:
    settings = get_settings()

    try:
        return await list_records(settings)
    except SupabaseRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("", response_model=RecordResponse, status_code=status.HTTP_201_CREATED)
async def post_record(payload: RecordCreateRequest) -> RecordResponse:
    settings = get_settings()

    try:
        return await create_record_bundle(settings, payload.model_dump())
    except SupabaseRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("/attachments/upload-ticket", response_model=AttachmentUploadTicketResponse)
async def post_attachment_upload_ticket(
    payload: AttachmentUploadTicketRequest,
) -> AttachmentUploadTicketResponse:
    settings = get_settings()

    try:
        ticket = await issue_attachment_upload_ticket(
            settings,
            filename=payload.filename,
            content_type=payload.content_type,
        )
        return AttachmentUploadTicketResponse(**ticket)
    except SupabaseRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.get("/{record_id}/logs", response_model=list[ProcessingLogResponse])
async def get_record_logs(record_id: UUID) -> list[ProcessingLogResponse]:
    settings = get_settings()

    try:
        logs = await supabase_select(
            settings,
            "processing_logs",
            query={
                "select": "*",
                "record_id": f"eq.{record_id}",
                "order": "created_at.desc",
            },
        )
        return [ProcessingLogResponse(**log) for log in logs]
    except SupabaseRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
