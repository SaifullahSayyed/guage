import os
import json
import httpx
from typing import Any

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL", "")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")

_memory_cache: dict[str, tuple[Any, float]] = {}

import time


def _headers() -> dict:
    return {"Authorization": f"Bearer {UPSTASH_TOKEN}"}


async def cache_get(key: str) -> Any | None:
    if UPSTASH_URL and UPSTASH_TOKEN:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(
                    f"{UPSTASH_URL}/get/{key}",
                    headers=_headers()
                )
                data = resp.json()
                value = data.get("result")
                if value:
                    return json.loads(value)
        except Exception:
            pass
    
    if key in _memory_cache:
        val, expires_at = _memory_cache[key]
        if time.time() < expires_at:
            return val
        del _memory_cache[key]
    
    return None


async def cache_set(key: str, value: Any, ttl_seconds: int = 86400) -> None:
    serialized = json.dumps(value)
    
    if UPSTASH_URL and UPSTASH_TOKEN:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(
                    f"{UPSTASH_URL}/set/{key}",
                    headers=_headers(),
                    params={"ex": ttl_seconds},
                    content=json.dumps(serialized),
                )
        except Exception:
            pass
    
    _memory_cache[key] = (value, time.time() + ttl_seconds)
