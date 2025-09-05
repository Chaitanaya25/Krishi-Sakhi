from fastapi import APIRouter, Request
from ..config import settings


router = APIRouter(prefix="/webhook", tags=["whatsapp"])


@router.get("/whatsapp")
async def verify(
    mode: str | None = None, challenge: str | None = None, token: str | None = None
):
    # Meta webhook verification
    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(challenge or 0)
    return {"status": "ok"}


@router.post("/whatsapp")
async def inbound(req: Request):
    data = await req.json()
    # For demo: just log payload; production would parse & reply via Graph API
    return {"received": True, "keys": list(data.keys())}
