import os
import json
import re
from typing import Any

try:
    from google import genai as genai_client
    _USE_NEW_SDK = True
except ImportError:
    import google.generativeai as genai  # type: ignore
    _USE_NEW_SDK = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

FALLBACK_ROADMAPS: dict[str, dict] = {
    "python": {
        "skill": "Python",
        "weeks": [
            {
                "week": 1,
                "focus": "Core Python fundamentals and syntax",
                "resource": {
                    "title": "Python for Everybody – Full University Course",
                    "platform": "freeCodeCamp / YouTube",
                    "url": "https://www.youtube.com/watch?v=8DvywoWv6fI",
                    "duration_hours": 14,
                    "type": "Course",
                    "why": "Comprehensive beginner-to-intermediate coverage with real exercises"
                }
            },
            {
                "week": 2,
                "focus": "Data structures, OOP, and standard libraries",
                "resource": {
                    "title": "Python Official Tutorial",
                    "platform": "Official Docs",
                    "url": "https://docs.python.org/3/tutorial/",
                    "duration_hours": 6,
                    "type": "Documentation",
                    "why": "Canonical reference covering all language features in depth"
                }
            },
            {
                "week": 3,
                "focus": "Build a real project — REST API or data analysis script",
                "resource": {
                    "title": "Build 5 Python Projects for Beginners",
                    "platform": "YouTube",
                    "url": "https://www.youtube.com/watch?v=DLn3jOsNRVE",
                    "duration_hours": 3,
                    "type": "Project",
                    "why": "Hands-on projects solidify knowledge and produce portfolio work"
                }
            }
        ],
        "project_idea": "Build a CLI tool that fetches job postings from a public API and displays the most common required skills as a ranked list",
        "time_to_hireable": "4 weeks"
    },
    "mlops": {
        "skill": "MLOps",
        "weeks": [
            {
                "week": 1,
                "focus": "MLOps fundamentals: model versioning and experiment tracking",
                "resource": {
                    "title": "MLflow Quickstart Guide",
                    "platform": "Official Docs",
                    "url": "https://mlflow.org/docs/latest/quickstart.html",
                    "duration_hours": 4,
                    "type": "Documentation",
                    "why": "MLflow is the industry-standard tool for ML experiment tracking"
                }
            },
            {
                "week": 2,
                "focus": "Containerization and model serving with Docker",
                "resource": {
                    "title": "Docker for Data Scientists",
                    "platform": "YouTube",
                    "url": "https://www.youtube.com/watch?v=0H2miBK_gAk",
                    "duration_hours": 3,
                    "type": "Video",
                    "why": "Docker is a prerequisite for deploying ML models in production"
                }
            },
            {
                "week": 3,
                "focus": "CI/CD for ML pipelines using GitHub Actions",
                "resource": {
                    "title": "CI/CD for Machine Learning",
                    "platform": "GitHub",
                    "url": "https://github.com/iterative/cml",
                    "duration_hours": 5,
                    "type": "Tutorial",
                    "why": "CML (Continuous Machine Learning) is the leading open-source tool for ML CI/CD"
                }
            }
        ],
        "project_idea": "Set up a complete ML pipeline: train a model, track experiments with MLflow, containerize with Docker, and deploy with a GitHub Actions workflow",
        "time_to_hireable": "6 weeks"
    }
}

ROADMAP_PROMPT = """You are a career development expert. A user is learning {skill} to become a {job_title}.
Their level is {user_level}.

Generate a 3-week learning roadmap using ONLY free resources.
For each week, provide exactly ONE resource with:
- A real, specific resource name (not generic)
- The platform (YouTube / Coursera audit / GitHub / Official Docs / freeCodeCamp / Kaggle)
- Estimated time commitment in hours
- Resource type: Video / Course / Project / Documentation / Tutorial
- A real URL that actually exists
- One sentence explaining why this resource specifically for this week

Return ONLY valid JSON in this exact format, no other text:
{{
  "skill": "{skill}",
  "weeks": [
    {{
      "week": 1,
      "focus": "one-line focus description",
      "resource": {{
        "title": "exact resource name",
        "platform": "platform name",
        "url": "https://...",
        "duration_hours": 3,
        "type": "Video",
        "why": "one sentence reason"
      }}
    }},
    {{
      "week": 2,
      "focus": "one-line focus description",
      "resource": {{
        "title": "exact resource name",
        "platform": "platform name",
        "url": "https://...",
        "duration_hours": 4,
        "type": "Course",
        "why": "one sentence reason"
      }}
    }},
    {{
      "week": 3,
      "focus": "one-line focus description",
      "resource": {{
        "title": "exact resource name",
        "platform": "platform name",
        "url": "https://...",
        "duration_hours": 5,
        "type": "Project",
        "why": "one sentence reason"
      }}
    }}
  ],
  "project_idea": "A specific small project to build with this skill that is impressive for a portfolio",
  "time_to_hireable": "X weeks"
}}"""


async def generate_roadmap(skill: str, job_title: str, user_level: str = "intermediate") -> dict[str, Any]:
    if not GEMINI_API_KEY:
        return _get_fallback_roadmap(skill, job_title)
    
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = ROADMAP_PROMPT.format(
            skill=skill,
            job_title=job_title,
            user_level=user_level,
        )
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        
        return json.loads(text)
    
    except Exception:
        return _get_fallback_roadmap(skill, job_title)


def _get_fallback_roadmap(skill: str, job_title: str) -> dict[str, Any]:
    key = skill.lower()
    if key in FALLBACK_ROADMAPS:
        return FALLBACK_ROADMAPS[key]
    
    return {
        "skill": skill,
        "weeks": [
            {
                "week": 1,
                "focus": f"Introduction to {skill} fundamentals",
                "resource": {
                    "title": f"{skill} Full Course for Beginners",
                    "platform": "YouTube",
                    "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+full+course",
                    "duration_hours": 4,
                    "type": "Video",
                    "why": f"Best starting point to understand {skill} concepts from scratch"
                }
            },
            {
                "week": 2,
                "focus": f"Hands-on practice with {skill}",
                "resource": {
                    "title": f"{skill} Official Documentation",
                    "platform": "Official Docs",
                    "url": f"https://www.google.com/search?q={skill.replace(' ', '+')}+official+documentation",
                    "duration_hours": 5,
                    "type": "Documentation",
                    "why": "Primary source of truth for all features and best practices"
                }
            },
            {
                "week": 3,
                "focus": f"Build a portfolio project using {skill}",
                "resource": {
                    "title": f"Build Projects with {skill}",
                    "platform": "GitHub",
                    "url": f"https://github.com/topics/{skill.lower().replace(' ', '-')}",
                    "duration_hours": 6,
                    "type": "Project",
                    "why": "Real projects demonstrate your skills to employers better than any certificate"
                }
            }
        ],
        "project_idea": f"Build a small web app or CLI tool that showcases your {skill} skills end-to-end",
        "time_to_hireable": "4-6 weeks"
    }
