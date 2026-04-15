from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
