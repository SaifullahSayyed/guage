import type { Skill } from '../types';

export function calculateReadiness(skills: Skill[], userSkills: string[]): number {
  const top10 = [...skills]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const totalWeight = top10.reduce((sum, s) => sum + s.frequency, 0);
  if (totalWeight === 0) return 0;

  const userLower = new Set(userSkills.map((s) => s.toLowerCase()));
  const coveredWeight = top10
    .filter((s) => userLower.has(s.name.toLowerCase()))
    .reduce((sum, s) => sum + s.frequency, 0);

  const base = Math.round((coveredWeight / totalWeight) * 100);
  const rising = top10.filter(
    (s) => s.trend_label === 'rising' && s.owned
  ).length * 3;

  return Math.min(100, base + rising);
}

// Fibonacci sphere point distribution for even 3D node placement
export function fibonacciSpherePoint(index: number, total: number, radius: number): [number, number, number] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const theta = goldenAngle * index;
  return [
    radius * r * Math.cos(theta),
    radius * y,
    radius * r * Math.sin(theta),
  ];
}

// Fallback data for when backend is unavailable
export const FALLBACK_DATA: Record<string, import('../types').SkillResponse> = {
  'Machine Learning Engineer': {
    job_title: 'Machine Learning Engineer',
    total_postings_analyzed: 20,
    skills: [
      { name: 'Python', category: 'Languages', frequency: 95, trend_velocity: 0.05, trend_label: 'rising', owned: false },
      { name: 'Machine Learning', category: 'AI/ML', frequency: 88, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'TensorFlow', category: 'AI/ML', frequency: 72, trend_velocity: -0.05, trend_label: 'stable', owned: false },
      { name: 'PyTorch', category: 'AI/ML', frequency: 78, trend_velocity: 0.12, trend_label: 'rising', owned: false },
      { name: 'MLOps', category: 'AI/ML', frequency: 67, trend_velocity: 0.34, trend_label: 'rising', owned: false },
      { name: 'Docker', category: 'DevOps', frequency: 62, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'SQL', category: 'Databases', frequency: 58, trend_velocity: 0.02, trend_label: 'stable', owned: false },
      { name: 'Kubernetes', category: 'DevOps', frequency: 52, trend_velocity: 0.18, trend_label: 'rising', owned: false },
      { name: 'AWS', category: 'Cloud', frequency: 65, trend_velocity: 0.10, trend_label: 'rising', owned: false },
      { name: 'Scikit-learn', category: 'AI/ML', frequency: 60, trend_velocity: 0.03, trend_label: 'stable', owned: false },
      { name: 'Spark', category: 'Data Engineering', frequency: 45, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'LLMs', category: 'AI/ML', frequency: 48, trend_velocity: 0.45, trend_label: 'rising', owned: false },
      { name: 'RAG', category: 'AI/ML', frequency: 38, trend_velocity: 0.38, trend_label: 'rising', owned: false },
      { name: 'Feature Engineering', category: 'AI/ML', frequency: 42, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'Distributed Training', category: 'AI/ML', frequency: 35, trend_velocity: 0.20, trend_label: 'rising', owned: false },
      { name: 'MLflow', category: 'AI/ML', frequency: 32, trend_velocity: 0.22, trend_label: 'rising', owned: false },
      { name: 'Git', category: 'Tools', frequency: 75, trend_velocity: 0.01, trend_label: 'stable', owned: false },
      { name: 'Deep Learning', category: 'AI/ML', frequency: 70, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'Transformers', category: 'AI/ML', frequency: 55, trend_velocity: 0.28, trend_label: 'rising', owned: false },
      { name: 'Data Pipelines', category: 'Data Engineering', frequency: 40, trend_velocity: 0.08, trend_label: 'rising', owned: false },
    ],
    readiness_score: 0,
    top_gaps: ['MLOps', 'Distributed Training', 'RAG'],
    market_pulse: [
      { skill: 'LLM Fine-tuning', growth: '+41%' },
      { skill: 'RAG Systems', growth: '+38%' },
      { skill: 'MLflow', growth: '+22%' },
      { skill: 'Kubernetes', growth: '+18%' },
      { skill: 'LangChain', growth: '+35%' },
    ],
    cached: true,
    analyzed_at: new Date().toISOString(),
  },
  'Software Engineer': {
    job_title: 'Software Engineer',
    total_postings_analyzed: 20,
    skills: [
      { name: 'JavaScript', category: 'Languages', frequency: 82, trend_velocity: 0.05, trend_label: 'rising', owned: false },
      { name: 'Python', category: 'Languages', frequency: 78, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'React', category: 'Frontend', frequency: 72, trend_velocity: 0.12, trend_label: 'rising', owned: false },
      { name: 'TypeScript', category: 'Languages', frequency: 68, trend_velocity: 0.25, trend_label: 'rising', owned: false },
      { name: 'Node.js', category: 'Backend', frequency: 62, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'SQL', category: 'Databases', frequency: 65, trend_velocity: 0.02, trend_label: 'stable', owned: false },
      { name: 'Docker', category: 'DevOps', frequency: 58, trend_velocity: 0.10, trend_label: 'rising', owned: false },
      { name: 'Git', category: 'Tools', frequency: 85, trend_velocity: 0.01, trend_label: 'stable', owned: false },
      { name: 'REST APIs', category: 'Backend', frequency: 75, trend_velocity: 0.03, trend_label: 'stable', owned: false },
      { name: 'AWS', category: 'Cloud', frequency: 55, trend_velocity: 0.10, trend_label: 'rising', owned: false },
      { name: 'PostgreSQL', category: 'Databases', frequency: 48, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'System Design', category: 'Architecture', frequency: 52, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'Microservices', category: 'Architecture', frequency: 45, trend_velocity: 0.12, trend_label: 'rising', owned: false },
      { name: 'Kubernetes', category: 'DevOps', frequency: 40, trend_velocity: 0.18, trend_label: 'rising', owned: false },
      { name: 'Testing', category: 'Quality', frequency: 55, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'Agile', category: 'Methodology', frequency: 60, trend_velocity: 0.02, trend_label: 'stable', owned: false },
      { name: 'Next.js', category: 'Frontend', frequency: 38, trend_velocity: 0.28, trend_label: 'rising', owned: false },
      { name: 'GraphQL', category: 'Backend', frequency: 32, trend_velocity: 0.15, trend_label: 'rising', owned: false },
      { name: 'Redis', category: 'Databases', frequency: 35, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'CI/CD', category: 'DevOps', frequency: 50, trend_velocity: 0.10, trend_label: 'rising', owned: false },
    ],
    readiness_score: 0,
    top_gaps: ['Kubernetes', 'System Design', 'TypeScript'],
    market_pulse: [
      { skill: 'TypeScript', growth: '+28%' },
      { skill: 'Next.js', growth: '+25%' },
      { skill: 'Kubernetes', growth: '+18%' },
      { skill: 'GraphQL', growth: '+15%' },
      { skill: 'AI Integration', growth: '+41%' },
    ],
    cached: true,
    analyzed_at: new Date().toISOString(),
  },
  'Product Manager': {
    job_title: 'Product Manager',
    total_postings_analyzed: 20,
    skills: [
      { name: 'Agile', category: 'Methodology', frequency: 92, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'Product Strategy', category: 'Strategy', frequency: 88, trend_velocity: 0.12, trend_label: 'rising', owned: false },
      { name: 'User Research', category: 'Research', frequency: 85, trend_velocity: 0.08, trend_label: 'rising', owned: false },
      { name: 'Data Analysis', category: 'Analytics', frequency: 80, trend_velocity: 0.15, trend_label: 'rising', owned: false },
      { name: 'SQL', category: 'Databases', frequency: 75, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'A/B Testing', category: 'Analytics', frequency: 70, trend_velocity: 0.10, trend_label: 'rising', owned: false },
      { name: 'Jira', category: 'Tools', frequency: 85, trend_velocity: 0.02, trend_label: 'stable', owned: false },
      { name: 'Roadmap Planning', category: 'Strategy', frequency: 90, trend_velocity: 0.04, trend_label: 'stable', owned: false },
      { name: 'UX Design', category: 'Design', frequency: 60, trend_velocity: 0.05, trend_label: 'stable', owned: false },
      { name: 'Go-to-Market', category: 'Strategy', frequency: 65, trend_velocity: 0.08, trend_label: 'rising', owned: false },
    ],
    readiness_score: 0,
    top_gaps: ['Data Analysis', 'A/B Testing', 'Product Strategy'],
    market_pulse: [
      { skill: 'Data Analysis', growth: '+25%' },
      { skill: 'AI/ML Products', growth: '+45%' },
      { skill: 'Product Strategy', growth: '+18%' },
      { skill: 'A/B Testing', growth: '+15%' },
    ],
    cached: true,
    analyzed_at: new Date().toISOString(),
  },
};
