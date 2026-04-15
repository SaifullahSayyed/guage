// Color mapping for skill categories
export const CATEGORY_COLORS: Record<string, string> = {
  'Languages': '#7c3aed',
  'Frontend': '#3b82f6',
  'Backend': '#06b6d4',
  'AI/ML': '#f59e0b',
  'Cloud': '#8b5cf6',
  'DevOps': '#10b981',
  'Databases': '#ef4444',
  'Data Engineering': '#f97316',
  'Data Science': '#ec4899',
  'Security': '#6366f1',
  'Mobile': '#14b8a6',
  'Architecture': '#a855f7',
  'Observability': '#84cc16',
  'Quality': '#22d3ee',
  'Tools': '#94a3b8',
  'Methodology': '#64748b',
  'Soft Skills': '#78716c',
  'Product': '#fb923c',
  'Design': '#e879f9',
  'Testing': '#4ade80',
  'Infrastructure': '#60a5fa',
  'General': '#6b7280',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#6b7280';
}

// Skill status colors (design system)
export const SKILL_COLORS = {
  owned: '#10b981',
  ownedGlow: 'rgba(16, 185, 129, 0.3)',
  gap: '#f43f5e',
  gapGlow: 'rgba(244, 63, 94, 0.3)',
  rising: '#f59e0b',
  neutral: '#374151',
  fading: '#1f2937',
} as const;

export function getScoreColor(score: number): string {
  if (score >= 71) return '#10b981';
  if (score >= 41) return '#f59e0b';
  return '#f43f5e';
}
