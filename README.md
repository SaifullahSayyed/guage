<div align="center">
  <img src="https://img.shields.io/badge/Orion_Build_Challenge-2026-7c3aed?style=for-the-badge" alt="Hackathon Badge" />
  <br/>
  <h1>🔮 GAUGE</h1>
  <p><strong>The First AI-Powered Career Skill Intelligence Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

---

## 🚀 The Elevator Pitch
**Stop guessing what employers want.** GAUGE is a highly interactive, AI-driven career radar that scrapes live job boards to map your current skills against real-world market demand. Using stunning 3D WebGL visualizations and Google's Gemini AI, GAUGE instantly highlights your critical skill gaps, calculates a dynamic **Readiness Score**, and generates personalized, week-by-week learning roadmaps to accelerate your tech career.

## ⚠️ The Problem
The tech industry moves at lightning speed. Developers and engineers are constantly bombarded with "new" frameworks, languages, and methodologies. The reality? **Most developers waste hundreds of hours learning skills that employers aren't actually hiring for.** Job descriptions are dense and finding out what exact skills overlap between your resume and market demand is a manual, anxiety-inducing process.

## 💡 Our Solution
GAUGE acts as your personal career satellite. By typing in a target job role (e.g., *Machine Learning Engineer*), the platform:
1. **Scrapes** live job postings to aggregate real-world skill frequencies.
2. **Visualizes** the data into an immersive 3D space, showing you what skills are hot, rising, or fading.
3. **Cross-references** your existing skills to calculate an accurate **Readiness Score**.
4. **Generates** a custom, AI-authored learning roadmap to bridge your specific technical gaps.

---

## ✨ Key Features

- 🌌 **3D Radar Visualization:** A fully interactive, WebGL-powered 3D globe built with React Three Fiber. Watch as the market demand orbits around you in real-time.
- 📊 **Dynamic Readiness Score:** As you add the skills you currently own, your score instantly updates, visually restructuring the 3D model to highlight your next learning targets.
- ⚡ **Live Job Scraping Engine:** Powered by SerpAPI to fetch fresh, geographically-relevant tech job postings so the data is never stale.
- 🤖 **Generative AI Roadmaps:** Hit a gap? Click *"See resources"* and Google's **Gemini AI** builds a bespoke, multi-week learning plan with exact technologies, methodologies, and outcomes tailored to that exact skill.
- 🏎️ **Microsecond Caching:** Built with Upstash Serverless Redis to cache job analysis and API responses, ensuring incredibly fast load times and bypassing AI generation rate limits.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client-Side)
- **Framework:** React 18 & Vite
- **State Management:** Zustand (for lightweight, zero-boilerplate global state)
- **3D Engine:** Three.js & React Three Fiber + Drei
- **Animations:** Framer Motion
- **Styling:** Custom CSS with Glassmorphism adhering to exact brand tokens

### Backend (Server-Side)
- **Framework:** FastAPI (Python)
- **Data Scraping:** SerpAPI (Google Jobs integration)
- **Generative AI:** Google Gemini (Generative Language API)
- **Caching Layer:** Upstash Serverless Redis (REST API integration)

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- API Keys for: Google Gemini, SerpAPI, and Upstash Redis.

### 1. Clone & Setup Repository
```bash
git clone https://github.com/SaifullahSayyed/guage.git
cd guage
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```
Create a `.env` file in the `/backend` directory:
```env
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_key_here
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Run the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:8000
```

Run the frontend development server:
```bash
npm run dev
```

---

## 🌐 Deployment
- **Frontend** is configured for seamless deployment on **Vercel** (`/frontend` root).
- **Backend** is configured with a `render.yaml` blueprint for direct deployment via **Render**.

---

<div align="center">
  <p>Built with ❤️ for the Orion Build Challenge 2026.</p>
</div>
