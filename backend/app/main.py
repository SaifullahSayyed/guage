import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers import health, skills, roadmap

app = FastAPI(
    title="GAUGE API",
    description="Career Skill Intelligence Platform — Know exactly where you stand before you apply.",
    version="1.0.0",
)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(skills.router)
app.include_router(roadmap.router)


@app.on_event("startup")
async def startup_event():
    sep = os.getenv("SERPAPI_KEY")
    gem = os.getenv("GEMINI_API_KEY")
    red = os.getenv("UPSTASH_REDIS_REST_URL")
    print("GAUGE API starting up...")
    print(f"  CORS origins: {allowed_origins}")
    print(f"  SerpAPI: {'configured' if sep else 'using fallback data'}")
    print(f"  Gemini:  {'configured' if gem else 'using fallback roadmaps'}")
    print(f"  Redis:   {'configured' if red else 'using memory cache'}")
