import { useMemo } from 'react';
import type { Skill, SkillNode3D } from '../types';
import { fibonacciSpherePoint } from '../utils/scoreCalc';

export function useSkillGraph(skills: Skill[]): SkillNode3D[] {
  return useMemo(() => {
    if (!skills.length) return [];

    const maxFreq = Math.max(...skills.map((s) => s.frequency));
    const SPHERE_RADIUS = 2.2;

    return skills.slice(0, 20).map((skill, index) => {
      const position = fibonacciSpherePoint(index, Math.max(skills.length, 20), SPHERE_RADIUS);
      const freqNorm = skill.frequency / (maxFreq || 1);
      const radius = 0.04 + freqNorm * 0.12;

      return { skill, position, radius };
    });
  }, [skills]);
}
