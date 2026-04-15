import json
import re
from pathlib import Path
from typing import Any

TAXONOMY_PATH = Path(__file__).parent.parent / "data" / "skill_taxonomy.json"
_taxonomy_data: list[dict] = []
_alias_map: dict[str, dict] = {}

def _load_taxonomy() -> None:
    global _taxonomy_data, _alias_map
    if _taxonomy_data:
        return
    with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    _taxonomy_data = data["skills"]
    for skill in _taxonomy_data:
        canonical = skill["name"].lower()
        _alias_map[canonical] = skill
        for alias in skill.get("aliases", []):
            _alias_map[alias.lower()] = skill

def get_taxonomy() -> list[dict]:
    _load_taxonomy()
    return _taxonomy_data

def extract_skills_from_text(texts: list[str]) -> list[dict[str, Any]]:
    _load_taxonomy()
    
    total_docs = len(texts)
    if total_docs == 0:
        return _get_baseline_skills()
    
    skill_counts: dict[str, int] = {}
    
    for text in texts:
        text_lower = text.lower()
        seen_in_doc: set[str] = set()
        
        for alias, skill in _alias_map.items():
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, text_lower):
                canonical = skill["name"]
                if canonical not in seen_in_doc:
                    skill_counts[canonical] = skill_counts.get(canonical, 0) + 1
                    seen_in_doc.add(canonical)
    
    results: list[dict[str, Any]] = []
    for skill in _taxonomy_data:
        name = skill["name"]
        count = skill_counts.get(name, 0)
        frequency = round((count / total_docs) * 100)
        
        baseline = skill.get("baseline_frequency", 0.5)
        baseline_pct = baseline * 100
        
        if baseline_pct > 0:
            velocity = (frequency - baseline_pct) / baseline_pct
        else:
            velocity = 0.0
        
        if velocity > 0.1:
            trend_label = "rising"
        elif velocity < -0.1:
            trend_label = "declining"
        else:
            trend_label = "stable"
        
        results.append({
            "name": name,
            "category": skill.get("category", "General"),
            "frequency": frequency,
            "trend_velocity": round(velocity, 3),
            "trend_label": trend_label,
            "related": skill.get("related", []),
            "owned": False,
        })
    
    found = [r for r in results if r["frequency"] > 0]
    found.sort(key=lambda x: x["frequency"], reverse=True)
    
    if len(found) < 10:
        found = _get_baseline_skills()
    
    return found[:20]


def mark_owned_skills(skills: list[dict], user_skills: list[str]) -> list[dict]:
    user_lower = {s.lower() for s in user_skills}
    for skill in skills:
        is_owned = (
            skill["name"].lower() in user_lower
            or any(
                alias.lower() in user_lower
                for alias in _alias_map
                if _alias_map[alias]["name"] == skill["name"]
            )
        )
        skill["owned"] = is_owned
    return skills


def calculate_readiness(skills: list[dict], user_skills: list[str]) -> int:
    top_10 = sorted(skills, key=lambda x: x["frequency"], reverse=True)[:10]
    total_weight = sum(s["frequency"] for s in top_10)
    if total_weight == 0:
        return 0
    
    user_lower = {s.lower() for s in user_skills}
    covered_weight = sum(
        s["frequency"] for s in top_10
        if s["name"].lower() in user_lower
    )
    base_score = int((covered_weight / total_weight) * 100)
    
    rising_bonus = sum(
        3 for s in top_10
        if s["trend_label"] == "rising" and s["owned"]
    )
    return min(100, base_score + rising_bonus)


def get_top_gaps(skills: list[dict]) -> list[str]:
    gaps = [s for s in skills if not s["owned"]]
    gaps.sort(key=lambda x: x["frequency"], reverse=True)
    return [g["name"] for g in gaps[:3]]


def get_market_pulse(skills: list[dict]) -> list[dict]:
    rising = [s for s in skills if s["trend_label"] == "rising"]
    rising.sort(key=lambda x: x["trend_velocity"], reverse=True)
    result = []
    for s in rising[:5]:
        pct = int(s["trend_velocity"] * 100)
        result.append({"skill": s["name"], "growth": f"+{pct}%"})
    
    defaults = [
        {"skill": "AI/ML Integration", "growth": "+41%"},
        {"skill": "Cloud Native", "growth": "+35%"},
        {"skill": "TypeScript", "growth": "+28%"},
        {"skill": "Kubernetes", "growth": "+22%"},
        {"skill": "Rust", "growth": "+18%"},
    ]
    while len(result) < 5:
        result.append(defaults[len(result)])
    return result[:5]


def _get_baseline_skills() -> list[dict]:
    _load_taxonomy()
    results = []
    for skill in _taxonomy_data:
        baseline = skill.get("baseline_frequency", 0)
        frequency = int(baseline * 100)
        if frequency < 10:
            continue
        results.append({
            "name": skill["name"],
            "category": skill.get("category", "General"),
            "frequency": frequency,
            "trend_velocity": 0.0,
            "trend_label": "stable",
            "related": skill.get("related", []),
            "owned": False,
        })
    results.sort(key=lambda x: x["frequency"], reverse=True)
    return results[:20]
