from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import get_settings
from app.services.supabase import check_supabase


router = APIRouter(tags=["system"])


class SupabaseHealthResponse(BaseModel):
    configured: bool
    reachable: bool
    status_code: int | None = None
    detail: str | None = None


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    supabase: SupabaseHealthResponse


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    settings = get_settings()
    supabase = await check_supabase(settings)

    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.app_env,
        supabase=SupabaseHealthResponse(
            configured=supabase.configured,
            reachable=supabase.reachable,
            status_code=supabase.status_code,
            detail=supabase.detail,
        ),
    )
