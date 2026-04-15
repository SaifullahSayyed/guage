export interface Skill {
  name: string;
  category: string;
  frequency: number;
  trend_velocity: number;
  trend_label: 'rising' | 'stable' | 'declining';
  owned: boolean;
}

export interface MarketPulseItem {
  skill: string;
  growth: string;
}

export interface SkillResponse {
  job_title: string;
  total_postings_analyzed: number;
  skills: Skill[];
  readiness_score: number;
  top_gaps: string[];
  market_pulse: MarketPulseItem[];
  cached: boolean;
  analyzed_at: string;
}

export interface ResourceItem {
  title: string;
  platform: string;
  url: string;
  duration_hours: number;
  type: 'Video' | 'Course' | 'Project' | 'Documentation' | 'Tutorial';
  why: string;
}

export interface RoadmapWeek {
  week: number;
  focus: string;
  resource: ResourceItem;
}

export interface RoadmapResponse {
  skill: string;
  weeks: RoadmapWeek[];
  project_idea: string;
  time_to_hireable: string;
}

export interface SkillNode3D {
  skill: Skill;
  position: [number, number, number];
  radius: number;
}
