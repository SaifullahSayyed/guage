import os
import httpx
import json
from typing import Any

SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

FALLBACK_DESCRIPTIONS: dict[str, list[str]] = {
    "machine learning engineer": [
        "We need a Machine Learning Engineer with Python, TensorFlow, PyTorch, MLOps, Docker, Kubernetes, SQL, Spark, Scikit-learn, AWS, GCP, distributed training, data pipelines, feature engineering, model deployment, LLM fine-tuning, RAG systems, MLflow, Airflow, Git",
        "ML Engineer role requiring Python, deep learning, neural networks, NLP, computer vision, TensorFlow, PyTorch, model optimization, A/B testing, cloud platforms AWS GCP Azure, data engineering, Kafka, Redis, CI/CD, MLflow",
        "Seeking ML Engineer: Python 3, machine learning algorithms, statistical modeling, data preprocessing, feature selection, hyperparameter tuning, model evaluation, production deployment, Docker, Kubernetes, FastAPI, REST APIs",
        "Machine Learning Engineer - must know Python, R, SQL, TensorFlow, Keras, PyTorch, Scikit-learn, Natural Language Processing, Computer Vision, transformers, BERT, GPT, cloud ML services, AWS SageMaker, GCP Vertex AI",
        "ML role: Python, deep learning, reinforcement learning, generative AI, LLMs, prompt engineering, vector databases, Pinecone, Weaviate, Langchain, RAG, MLOps, Kubeflow, Airflow, Spark, Hadoop",
    ] * 4,
    "software engineer": [
        "Software Engineer with React, TypeScript, Node.js, Python, Java, Go, Docker, Kubernetes, AWS, CI/CD, Git, REST APIs, GraphQL, SQL, PostgreSQL, Redis, microservices, system design",
        "Full Stack Developer: React, Next.js, Vue.js, Angular, TypeScript, JavaScript, Python, Django, FastAPI, Spring Boot, PostgreSQL, MySQL, MongoDB, Redis, Docker, AWS, GCP, Azure",
        "Backend Engineer: Python, Go, Java, Node.js, REST APIs, GraphQL, PostgreSQL, MySQL, Redis, Kafka, RabbitMQ, Docker, Kubernetes, AWS, microservices, distributed systems, system design",
        "Software Engineer: TypeScript, React, Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, GitHub Actions, CI/CD, unit testing, integration testing, code review, agile methodology",
    ] * 5,
    "data scientist": [
        "Data Scientist: Python, R, SQL, machine learning, statistical analysis, pandas, NumPy, scikit-learn, TensorFlow, PyTorch, data visualization, Tableau, Power BI, Jupyter, Spark, Hadoop, A/B testing, experimental design",
        "Data Scientist role: Python, SQL, machine learning, deep learning, NLP, computer vision, feature engineering, model evaluation, statistical inference, hypothesis testing, Bayesian methods, time series analysis",
        "Seeking Data Scientist: Python, R, SQL, machine learning algorithms, neural networks, data preprocessing, EDA, statistical modeling, business intelligence, Tableau, PowerBI, Excel, cloud platforms AWS GCP",
    ] * 6,
    "product manager": [
        "Product Manager: product roadmap, user stories, agile methodology, scrum, stakeholder management, A/B testing, analytics, SQL, product metrics, user research, competitive analysis, go-to-market strategy",
        "PM role: product strategy, OKRs, KPIs, Jira, confluence, user interviews, market research, prioritization frameworks, cross-functional collaboration, product analytics, Mixpanel, Amplitude",
    ] * 10,
    "ux designer": [
        "UX Designer: Figma, Sketch, Adobe XD, user research, wireframing, prototyping, usability testing, interaction design, visual design, design systems, accessibility, responsive design, user flows",
        "UI/UX Designer: Figma, user experience design, user interface design, design thinking, information architecture, prototyping, A/B testing, design systems, typography, color theory, motion design",
    ] * 10,
    "devops engineer": [
        "DevOps Engineer: Docker, Kubernetes, AWS, GCP, Azure, Terraform, Ansible, CI/CD, Jenkins, GitHub Actions, monitoring, Prometheus, Grafana, ELK stack, Linux, Python, Bash scripting, infrastructure as code",
        "Platform Engineer: Kubernetes, Docker, Terraform, Helm, AWS EKS, GCP GKE, CI/CD pipelines, GitOps, ArgoCD, Flux, security scanning, SAST, DAST, service mesh, Istio, observability",
    ] * 10,
}


async def fetch_job_descriptions(job_title: str) -> list[str]:
    if not SERPAPI_KEY:
        return _get_fallback(job_title)
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://serpapi.com/search",
                params={
                    "engine": "google_jobs",
                    "q": f"{job_title} jobs",
                    "location": "United States",
                    "api_key": SERPAPI_KEY,
                    "num": "20",
                }
            )
            response.raise_for_status()
            data = response.json()
            
            jobs = data.get("jobs_results", [])
            if not jobs:
                return _get_fallback(job_title)
            
            descriptions = []
            for job in jobs[:20]:
                desc = job.get("description", "")
                title = job.get("title", "")
                highlights = job.get("job_highlights", [])
                
                text_parts = [title, desc]
                for h in highlights:
                    items = h.get("items", [])
                    text_parts.extend(items)
                
                descriptions.append(" ".join(text_parts))
            
            return descriptions if descriptions else _get_fallback(job_title)
    
    except Exception:
        return _get_fallback(job_title)


def _get_fallback(job_title: str) -> list[str]:
    key = job_title.lower().strip()
    
    if key in FALLBACK_DESCRIPTIONS:
        return FALLBACK_DESCRIPTIONS[key]
    
    for k, v in FALLBACK_DESCRIPTIONS.items():
        if k in key or key in k:
            return v
    
    return FALLBACK_DESCRIPTIONS["software engineer"]
