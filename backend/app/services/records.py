from datetime import datetime, timezone
from uuid import uuid4
from urllib.parse import urlparse

from app.core.config import Settings
from app.services.supabase import (
    supabase_insert,
    supabase_select,
    supabase_storage_sign_upload,
)


def _normalize_domain(source_url: str | None) -> str | None:
    if not source_url:
        return None

    parsed = urlparse(source_url)
    return parsed.netloc or None


def _user_status_from_intent(intent: str) -> str:
    return "later" if intent == "later" else "pending"


def _safe_name(name: str) -> str:
    return "".join(char for char in name if char.isalnum() or char in ("-", "_", ".")).strip("._") or "attachment"


async def append_processing_log(
    settings: Settings,
    *,
    record_id: str,
    stage: str,
    level: str,
    message: str,
    details: dict | None = None,
    job_id: str | None = None,
) -> None:
    await supabase_insert(
        settings,
        "processing_logs",
        {
            "record_id": record_id,
            "job_id": job_id,
            "stage": stage,
            "level": level,
            "message": message,
            "details": details or {},
        },
    )


async def create_parse_job(settings: Settings, *, record_id: str) -> dict:
    jobs = await supabase_insert(
        settings,
        "jobs",
        {
            "record_id": record_id,
            "job_type": "parse",
            "status": "pending",
            "attempt_count": 0,
            "payload": {},
        },
    )
    return jobs[0]


async def issue_attachment_upload_ticket(
    settings: Settings,
    *,
    filename: str,
    content_type: str | None,
) -> dict:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
    object_path = f"records/{timestamp}-{uuid4().hex[:12]}-{_safe_name(filename)}"

    signed = await supabase_storage_sign_upload(
        settings,
        bucket=settings.supabase_attachments_bucket,
        object_path=object_path,
    )

    return {
        "bucket": settings.supabase_attachments_bucket,
        "object_path": object_path,
        "token": signed["token"],
        "signed_upload_url": signed["signed_upload_url"],
        "content_type": content_type,
    }


async def list_records(settings: Settings) -> list[dict]:
    records = await supabase_select(
        settings,
        "records",
        query={"select": "*,attachments(*)", "order": "created_at.desc"},
    )

    for record in records:
        record["tags"] = record.get("tags") or []
        record["attachments"] = record.get("attachments") or []

    return records


async def create_record_bundle(settings: Settings, payload: dict) -> dict:
    attachments = payload.pop("attachments", [])
    record_payload = {
        "raw_content": payload["raw_content"],
        "content_type": payload["content_type"],
        "intent": payload["intent"],
        "user_status": _user_status_from_intent(payload["intent"]),
        "parse_status": "pending",
        "internalization_status": "pending",
        "user_understanding": payload.get("user_understanding"),
        "source_url": payload.get("source_url"),
        "source_domain": _normalize_domain(payload.get("source_url")),
        "source_title": payload.get("source_title"),
        "tags": [],
    }

    created_records = await supabase_insert(settings, "records", record_payload)
    created_record = created_records[0]

    created_attachments: list[dict] = []
    if attachments:
        attachment_payloads = [
            {
                "record_id": created_record["id"],
                "kind": attachment["kind"],
                "name": attachment["name"],
                "storage_path": attachment.get("storage_path"),
                "original_url": attachment.get("original_url"),
                "mime_type": attachment.get("mime_type"),
                "size_bytes": attachment.get("size_bytes"),
            }
            for attachment in attachments
        ]
        created_attachments = await supabase_insert(settings, "attachments", attachment_payloads)

    created_record["attachments"] = created_attachments
    created_record["tags"] = created_record.get("tags") or []
    job = await create_parse_job(settings, record_id=created_record["id"])
    await append_processing_log(
        settings,
        record_id=created_record["id"],
        job_id=job["id"],
        stage="capture",
        level="info",
        message="Record created and parse job queued.",
        details={
            "content_type": created_record["content_type"],
            "intent": created_record["intent"],
            "attachments_count": len(created_attachments),
        },
    )
    return created_record
