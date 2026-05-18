from dataclasses import dataclass
import json
from urllib.parse import urljoin

import httpx

from app.core.config import Settings


@dataclass(frozen=True)
class SupabaseHealth:
    configured: bool
    reachable: bool
    status_code: int | None = None
    detail: str | None = None


class SupabaseRequestError(RuntimeError):
    pass


def _build_headers(settings: Settings, *, prefer_representation: bool = False) -> dict[str, str]:
    assert settings.supabase_api_key is not None

    headers = {
        "apikey": settings.supabase_api_key,
        "Authorization": f"Bearer {settings.supabase_api_key}",
        "Accept-Profile": settings.supabase_schema,
        "Content-Profile": settings.supabase_schema,
    }

    if prefer_representation:
        headers["Prefer"] = "return=representation"

    return headers


async def check_supabase(settings: Settings) -> SupabaseHealth:
    if not settings.supabase_configured:
        return SupabaseHealth(
            configured=False,
            reachable=False,
            detail="Supabase environment variables are not fully configured.",
        )

    assert settings.supabase_url is not None
    assert settings.supabase_api_key is not None

    endpoint = urljoin(settings.supabase_url.rstrip("/") + "/", "rest/v1/")
    headers = {
        "apikey": settings.supabase_api_key,
        "Authorization": f"Bearer {settings.supabase_api_key}",
    }

    try:
        async with httpx.AsyncClient(timeout=settings.supabase_health_timeout_seconds) as client:
            response = await client.get(endpoint, headers=headers)
    except httpx.HTTPError as exc:
        return SupabaseHealth(
            configured=True,
            reachable=False,
            detail=f"Supabase health request failed: {exc.__class__.__name__}",
        )

    return SupabaseHealth(
        configured=True,
        reachable=response.status_code < 500,
        status_code=response.status_code,
        detail="Supabase REST endpoint responded.",
    )


async def supabase_select(
    settings: Settings,
    table: str,
    *,
    query: dict[str, str] | None = None,
) -> list[dict]:
    if not settings.supabase_configured:
        raise SupabaseRequestError("Supabase environment variables are not fully configured.")

    assert settings.supabase_url is not None

    endpoint = urljoin(settings.supabase_url.rstrip("/") + "/", f"rest/v1/{table}")

    try:
        async with httpx.AsyncClient(timeout=settings.supabase_health_timeout_seconds) as client:
            response = await client.get(
                endpoint,
                headers=_build_headers(settings),
                params=query or {},
            )
    except httpx.HTTPError as exc:
        raise SupabaseRequestError(f"Supabase select failed: {exc.__class__.__name__}") from exc

    if response.status_code >= 400:
        raise SupabaseRequestError(
            f"Supabase select failed with {response.status_code}: {response.text[:200]}"
        )

    return response.json()


async def supabase_insert(
    settings: Settings,
    table: str,
    payload: dict | list[dict],
) -> list[dict]:
    if not settings.supabase_configured:
        raise SupabaseRequestError("Supabase environment variables are not fully configured.")

    assert settings.supabase_url is not None

    endpoint = urljoin(settings.supabase_url.rstrip("/") + "/", f"rest/v1/{table}")

    try:
        async with httpx.AsyncClient(timeout=settings.supabase_health_timeout_seconds) as client:
            response = await client.post(
                endpoint,
                headers=_build_headers(settings, prefer_representation=True),
                content=json.dumps(payload),
            )
    except httpx.HTTPError as exc:
        raise SupabaseRequestError(f"Supabase insert failed: {exc.__class__.__name__}") from exc

    if response.status_code >= 400:
        raise SupabaseRequestError(
            f"Supabase insert failed with {response.status_code}: {response.text[:200]}"
        )

    return response.json()


async def supabase_storage_sign_upload(
    settings: Settings,
    *,
    bucket: str,
    object_path: str,
) -> dict:
    if not settings.supabase_configured:
        raise SupabaseRequestError("Supabase environment variables are not fully configured.")

    assert settings.supabase_url is not None

    endpoint = urljoin(
        settings.supabase_url.rstrip("/") + "/",
        f"storage/v1/object/upload/sign/{bucket}/{object_path}",
    )

    payload = {"upsert": False}

    try:
        async with httpx.AsyncClient(timeout=settings.supabase_health_timeout_seconds) as client:
            response = await client.post(
                endpoint,
                headers={
                    "apikey": settings.supabase_api_key,
                    "Authorization": f"Bearer {settings.supabase_api_key}",
                    "Content-Type": "application/json",
                },
                content=json.dumps(payload),
            )
    except httpx.HTTPError as exc:
        raise SupabaseRequestError(
            f"Supabase storage sign upload failed: {exc.__class__.__name__}"
        ) from exc

    if response.status_code >= 400:
        raise SupabaseRequestError(
            f"Supabase storage sign upload failed with {response.status_code}: {response.text[:200]}"
        )

    body = response.json()
    body["signed_upload_url"] = (
        f"{settings.supabase_url.rstrip('/')}/storage/v1/object/upload/sign/"
        f"{bucket}/{object_path}?token={body['token']}"
    )
    return body
