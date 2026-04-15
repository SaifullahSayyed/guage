from pydantic import BaseModel
from typing import Optional


class SkillRequest(BaseModel):
    job_title: str
    user_skills: list[str] = []


class SkillItem(BaseModel):
    name: str
    category: str
    frequency: int
    trend_velocity: float
    trend_label: str
    owned: bool


class MarketPulseItem(BaseModel):
    skill: str
    growth: str


class SkillResponse(BaseModel):
    job_title: str
    total_postings_analyzed: int
    skills: list[SkillItem]
    readiness_score: int
    top_gaps: list[str]
    market_pulse: list[MarketPulseItem]
    cached: bool
    analyzed_at: str


class RoadmapRequest(BaseModel):
    skill: str
    job_title: str
    user_level: Optional[str] = "intermediate"


class ResourceItem(BaseModel):
    title: str
    platform: str
    url: str
    duration_hours: int
    type: str
    why: str


class RoadmapWeek(BaseModel):
    week: int
    focus: str
    resource: ResourceItem


class RoadmapResponse(BaseModel):
    skill: str
    weeks: list[RoadmapWeek]
    project_idea: str
    time_to_hireable: str
