from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
IPINFO_TOKEN: Optional[str] = None


class Settings(BaseSettings):
    # ...
    IPINFO_TOKEN: Optional[str] = None
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./krishisakhi.db"
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "ks_kb"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000"

    WHATSAPP_VERIFY_TOKEN: Optional[str] = None
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None

    # Pydantic v2 style config
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
