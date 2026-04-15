import re
from fastapi import APIRouter, HTTPException

from app.models.schemas import RoadmapRequest, RoadmapResponse
from app.services.gemini_client import generate_roadmap
from app.services.cache_service import cache_get, cache_set

router = APIRouter()


def _slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


@router.post("/api/roadmap")
async def get_roadmap(request: RoadmapRequest):
    skill = request.skill.strip()
    job_title = request.job_title.strip()
    user_level = request.user_level or "intermediate"

    if not skill:
        raise HTTPException(status_code=400, detail="skill is required")

    cache_key = f"roadmap:{_slugify(skill)}:{_slugify(job_title)}"

    cached = await cache_get(cache_key)
    if cached:
        return cached

    roadmap = await generate_roadmap(skill, job_title, user_level)

    await cache_set(cache_key, roadmap, ttl_seconds=604800)

    return roadmap
