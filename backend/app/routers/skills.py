import re
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException

from app.models.schemas import SkillRequest, SkillResponse
from app.services.job_scraper import fetch_job_descriptions
from app.services.skill_extractor import (
    extract_skills_from_text,
    mark_owned_skills,
    calculate_readiness,
    get_top_gaps,
    get_market_pulse,
)
from app.services.cache_service import cache_get, cache_set

router = APIRouter()


def _slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


@router.post("/api/skills", response_model=SkillResponse)
async def analyze_skills(request: SkillRequest):
    job_title = request.job_title.strip()
    user_skills = request.user_skills

    if not job_title:
        raise HTTPException(status_code=400, detail="job_title is required")

    cache_key = f"skills:{_slugify(job_title)}"

    cached = await cache_get(cache_key)
    if cached:
        skills = cached["skills"]
        skills = mark_owned_skills(skills, user_skills)
        readiness = calculate_readiness(skills, user_skills)
        top_gaps = get_top_gaps(skills)
        cached["skills"] = skills
        cached["readiness_score"] = readiness
        cached["top_gaps"] = top_gaps
        cached["cached"] = True
        return cached

    descriptions = await fetch_job_descriptions(job_title)
    skills = extract_skills_from_text(descriptions)
    skills = mark_owned_skills(skills, user_skills)

    readiness = calculate_readiness(skills, user_skills)
    top_gaps = get_top_gaps(skills)
    market_pulse = get_market_pulse(skills)

    result = {
        "job_title": job_title,
        "total_postings_analyzed": len(descriptions),
        "skills": skills,
        "readiness_score": readiness,
        "top_gaps": top_gaps,
        "market_pulse": market_pulse,
        "cached": False,
        "analyzed_at": datetime.now(timezone.utc).isoformat(),
    }

    cache_result = dict(result)
    cache_result["skills"] = [dict(s) for s in skills]
    await cache_set(cache_key, cache_result, ttl_seconds=86400)

    return result
