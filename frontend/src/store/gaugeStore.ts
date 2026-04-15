import { create } from 'zustand';
import axios from 'axios';
import type { SkillResponse, RoadmapResponse } from '../types';
import { FALLBACK_DATA } from '../utils/scoreCalc';

const API_URL = import.meta.env.VITE_API_URL || '';

interface GaugeState {
  jobTitle: string;
  setJobTitle: (title: string) => void;

  userSkills: string[];
  addUserSkill: (skill: string) => void;
  removeUserSkill: (skill: string) => void;

  skillData: SkillResponse | null;
  isLoading: boolean;
  error: string | null;

  selectedGapSkill: string | null;
  setSelectedGapSkill: (skill: string | null) => void;
  isRoadmapOpen: boolean;
  setRoadmapOpen: (open: boolean) => void;
  roadmapData: RoadmapResponse | null;
  isRoadmapLoading: boolean;

  usingFallback: boolean;

  fetchSkillData: () => Promise<void>;
  fetchRoadmap: (skill: string) => Promise<void>;
  resetAll: () => void;
}

export const useGaugeStore = create<GaugeState>((set, get) => ({
  jobTitle: '',
  setJobTitle: (title) => set({ jobTitle: title }),

  userSkills: [],
  addUserSkill: (skill) => {
    const current = get().userSkills;
    const normalized = skill.trim();
    if (!normalized || current.some((s) => s.toLowerCase() === normalized.toLowerCase())) return;
    if (current.length >= 20) return;
    set({ userSkills: [...current, normalized] });
    const { skillData, fetchSkillData } = get();
    if (skillData) fetchSkillData();
  },
  removeUserSkill: (skill) => {
    set({ userSkills: get().userSkills.filter((s) => s !== skill) });
    const { skillData, fetchSkillData } = get();
    if (skillData) fetchSkillData();
  },

  skillData: null,
  isLoading: false,
  error: null,
  usingFallback: false,

  fetchSkillData: async () => {
    const { jobTitle, userSkills, skillData } = get();
    if (!jobTitle.trim()) return;

    const isInitialLoad = !skillData || skillData.job_title !== jobTitle;
    if (isInitialLoad) {
      set({ isLoading: true, error: null });
    }

    const fallbackKey = Object.keys(FALLBACK_DATA).find(
      (k) => k.toLowerCase().includes(jobTitle.toLowerCase()) ||
             jobTitle.toLowerCase().includes(k.toLowerCase().split(' ')[0])
    );

    if (fallbackKey) {
      if (isInitialLoad) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      const fallback = { ...FALLBACK_DATA[fallbackKey] };
      const userLower = new Set(userSkills.map((s) => s.toLowerCase()));
      fallback.skills = fallback.skills.map((skill) => ({
        ...skill,
        owned: userLower.has(skill.name.toLowerCase()),
      }));
      const ownedFreqs = fallback.skills
        .filter((s) => s.owned)
        .reduce((sum, s) => sum + s.frequency, 0);
      const totalFreqs = fallback.skills
        .slice(0, 10)
        .reduce((sum, s) => sum + s.frequency, 0);
      fallback.readiness_score = totalFreqs > 0
        ? Math.min(100, Math.round((ownedFreqs / totalFreqs) * 100))
        : 0;

      // Recalculate top gaps (unowned high freq)
      fallback.top_gaps = fallback.skills
        .filter((s) => !s.owned)
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 3)
        .map((s) => s.name);

      set({ skillData: fallback, isLoading: false, usingFallback: true, error: null });
      return;
    }

    try {
      const endpoint = `${API_URL}/api/skills`;
      const response = await axios.post<SkillResponse>(
        endpoint,
        { job_title: jobTitle, user_skills: userSkills },
        { timeout: 12000 }
      );
      set({ skillData: response.data, isLoading: false, usingFallback: false });
    } catch {
      set({
        isLoading: false,
        error: "We couldn't find job postings for this title. Try 'Machine Learning Engineer' or 'Software Engineer'.",
        usingFallback: false,
      });
    }
  },

  selectedGapSkill: null,
  setSelectedGapSkill: (skill) => set({ selectedGapSkill: skill }),
  isRoadmapOpen: false,
  setRoadmapOpen: (open) => set({ isRoadmapOpen: open }),
  roadmapData: null,
  isRoadmapLoading: false,

  fetchRoadmap: async (skill) => {
    const { jobTitle, usingFallback } = get();
    set({ isRoadmapLoading: true, roadmapData: null, selectedGapSkill: skill, isRoadmapOpen: true });

    if (usingFallback) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fallback: RoadmapResponse = {
        skill,
        weeks: [
          {
            week: 1,
            focus: `${skill} fundamentals`,
            resource: {
              title: `${skill} Full Course`,
              platform: 'YouTube',
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course')}`,
              duration_hours: 4,
              type: 'Video',
              why: `Best starting point to learn ${skill} from scratch`,
            },
          },
        ],
        project_idea: `Build a small project demonstrating ${skill}`,
        time_to_hireable: '4-6 weeks',
      };
      set({ roadmapData: fallback, isRoadmapLoading: false });
      return;
    }

    try {
      const response = await axios.post<RoadmapResponse>(
        `${API_URL}/api/roadmap`,
        { skill, job_title: jobTitle, user_level: 'intermediate' },
        { timeout: 20000 }
      );
      set({ roadmapData: response.data, isRoadmapLoading: false });
    } catch {
      const fallback: RoadmapResponse = {
        skill,
        weeks: [
          {
            week: 1,
            focus: `${skill} fundamentals`,
            resource: {
              title: `${skill} Full Course`,
              platform: 'YouTube',
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course')}`,
              duration_hours: 4,
              type: 'Video',
              why: `Best starting point to learn ${skill} from scratch`,
            },
          },
        ],
        project_idea: `Build a small project demonstrating ${skill}`,
        time_to_hireable: '4-6 weeks',
      };
      set({ roadmapData: fallback, isRoadmapLoading: false });
    }
  },

  resetAll: () => set({
    jobTitle: '', userSkills: [], skillData: null,
    isLoading: false, error: null, selectedGapSkill: null,
    isRoadmapOpen: false, roadmapData: null, usingFallback: false,
  }),
}));
