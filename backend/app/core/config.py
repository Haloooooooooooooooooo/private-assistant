from dataclasses import dataclass
from functools import lru_cache
import os


def _split_csv(value: str | None, default: list[str]) -> list[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_env: str
    api_cors_origins: list[str]
    supabase_url: str | None
    supabase_anon_key: str | None
    supabase_service_role_key: str | None
    supabase_schema: str
    supabase_attachments_bucket: str
    supabase_health_timeout_seconds: float

    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and (self.supabase_anon_key or self.supabase_service_role_key))

    @property
    def supabase_api_key(self) -> str | None:
        return self.supabase_service_role_key or self.supabase_anon_key


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "Private Assistant API"),
        app_env=os.getenv("APP_ENV", "development"),
        api_cors_origins=_split_csv(os.getenv("API_CORS_ORIGINS"), ["http://localhost:3000"]),
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_anon_key=os.getenv("SUPABASE_ANON_KEY"),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
        supabase_schema=os.getenv("SUPABASE_SCHEMA", "public"),
        supabase_attachments_bucket=os.getenv("SUPABASE_ATTACHMENTS_BUCKET", "record-attachments"),
        supabase_health_timeout_seconds=float(os.getenv("SUPABASE_HEALTH_TIMEOUT_SECONDS", "2.5")),
    )
